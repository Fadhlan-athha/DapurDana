const { getCommodityForecasts } = require('../data/forecastRepository')

const DEFAULT_PROFILE = {
  businessType: 'Ayam Geprek',
  dailyRevenue: 1500000,
  hppPercentage: 48,
  cashBalance: 3500000,
  operationalExpensePerDay: 250000,
}

const DEFAULT_INGREDIENTS = [
  {
    commodity: 'cabai-merah',
    name: 'Cabai Merah',
    dailyUsage: 2.5,
    stockDays: 2,
  },
  {
    commodity: 'daging-ayam',
    name: 'Daging Ayam',
    dailyUsage: 12,
    stockDays: 1,
  },
  {
    commodity: 'minyak-kemasan',
    name: 'Minyak Kemasan',
    dailyUsage: 4,
    stockDays: 3,
  },
]

const STATUS = {
  SAFE: 'Aman',
  WARNING: 'Waspada',
  CRITICAL: 'Kritis',
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function round(value, decimals = 2) {
  const multiplier = 10 ** decimals
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier
}

function clampPercentage(value, fallback) {
  const parsed = toNumber(value, fallback)
  return Math.min(Math.max(parsed, 0), 100)
}

function normalizeProfile(profile = {}) {
  return {
    businessType: profile.businessType || DEFAULT_PROFILE.businessType,
    dailyRevenue: Math.max(toNumber(profile.dailyRevenue, DEFAULT_PROFILE.dailyRevenue), 1),
    hppPercentage: clampPercentage(profile.hppPercentage, DEFAULT_PROFILE.hppPercentage),
    cashBalance: Math.max(toNumber(profile.cashBalance, DEFAULT_PROFILE.cashBalance), 0),
    operationalExpensePerDay: Math.max(toNumber(profile.operationalExpensePerDay, DEFAULT_PROFILE.operationalExpensePerDay), 0),
  }
}

function getRiskLevel(changePercent, isIngredient) {
  if (isIngredient) {
    if (changePercent >= 10) return STATUS.CRITICAL
    if (changePercent >= 5) return STATUS.WARNING
  } else {
    // Threshold lebih longgar untuk komoditas pasar umum
    if (changePercent >= 20) return STATUS.CRITICAL
    if (changePercent >= 10) return STATUS.WARNING
  }
  return STATUS.SAFE
}

function createRecommendation(forecast, status, ingredientImpact) {
  const isIngredient = !!ingredientImpact

  if (isIngredient) {
    if (status === STATUS.CRITICAL) {
      return {
        priority: 'high',
        actionCode: 'RESTOCK_NOW',
        title: `Amankan stok ${forecast.name}`,
        message: `${forecast.name} diprediksi naik ${forecast.changePercent}%. Beli stok tambahan hari ini bila ruang kas masih cukup.`,
        estimatedSaving: round(ingredientImpact.weeklyDelta),
      }
    }
    if (status === STATUS.WARNING) {
      return {
        priority: 'medium',
        actionCode: 'ADJUST_RECIPE',
        title: `Pantau porsi ${forecast.name}`,
        message: `Kenaikan ${forecast.name} mulai menekan margin. Siapkan opsi penyesuaian untuk 7 hari ke depan.`,
        estimatedSaving: round(ingredientImpact.weeklyDelta * 0.45),
      }
    }
    if (forecast.changePercent < -2) {
      return {
        priority: 'low',
        actionCode: 'MONITOR',
        title: `${forecast.name} sedang turun`,
        message: `Harga ${forecast.name} turun ${forecast.changePercent}%. Tunda restock besar untuk mendapat harga lebih baik esok hari.`,
        estimatedSaving: Math.abs(round(ingredientImpact.weeklyDelta)),
      }
    }
    return {
      priority: 'low',
      actionCode: 'MONITOR',
      title: `${forecast.name} masih terkendali`,
      message: `Harga ${forecast.name} relatif stabil. Lanjutkan pembelian normal.`,
      estimatedSaving: 0,
    }
  }

  // Rekomendasi Market Insight (Untuk komoditas di luar ingredient utama)
  if (status === STATUS.CRITICAL || status === STATUS.WARNING) {
    return {
      priority: 'medium',
      actionCode: 'MONITOR',
      title: `Waspada Pasar: ${forecast.name}`,
      message: `Harga pasar ${forecast.name} diprediksi melonjak ${forecast.changePercent}%. Awasi jika Anda berencana menggunakannya.`,
      estimatedSaving: 0,
    }
  }
  if (forecast.changePercent < -5) {
    return {
      priority: 'low',
      actionCode: 'MONITOR',
      title: `Peluang Pasar: ${forecast.name}`,
      message: `Harga ${forecast.name} turun drastis ${forecast.changePercent}%. Peluang bagus untuk eksplorasi menu baru.`,
      estimatedSaving: 0,
    }
  }
  return null // Sembunyikan rekomendasi komoditas umum jika stabil
}

function calculatePrediction(payload = {}) {
  const commodityForecasts = getCommodityForecasts()
  const profile = normalizeProfile(payload.businessProfile)
  
  const rawIngredients = Array.isArray(payload.ingredients) && payload.ingredients.length > 0 
    ? payload.ingredients 
    : DEFAULT_INGREDIENTS

  const ingredientsMap = rawIngredients.reduce((acc, ing) => {
    acc[ing.commodity || ing.id] = {
      dailyUsage: Math.max(toNumber(ing.dailyUsage, 0), 0),
      stockDays: Math.max(toNumber(ing.stockDays, 0), 0),
    }
    return acc
  }, {})

  const baselineHppCost = profile.dailyRevenue * (profile.hppPercentage / 100)

  let dailyMaterialCostNow = 0
  let dailyMaterialCostProjected = 0

  // Proses SEMUA komoditas (7 komoditas)
  const allForecasts = Object.values(commodityForecasts).map((baseForecast) => {
    const changePercent = round(
      ((baseForecast.predictedPrice - baseForecast.currentPrice) / baseForecast.currentPrice) * 100,
      2,
    )
    
    let ingredientImpact = null
    const ingConfig = ingredientsMap[baseForecast.commodity]

    if (ingConfig) {
      const dailyCostNow = baseForecast.currentPrice * ingConfig.dailyUsage
      const dailyCostProjected = baseForecast.predictedPrice * ingConfig.dailyUsage
      const dailyDelta = dailyCostProjected - dailyCostNow
      
      ingredientImpact = {
        dailyCostNow: round(dailyCostNow),
        dailyCostProjected: round(dailyCostProjected),
        dailyDelta: round(dailyDelta),
        weeklyDelta: round(dailyDelta * 7),
        stockDays: ingConfig.stockDays,
      }

      dailyMaterialCostNow += dailyCostNow
      dailyMaterialCostProjected += dailyCostProjected
    }

    return {
      ...baseForecast,
      changePercent,
      direction: changePercent >= 0 ? 'up' : 'down',
      riskLevel: STATUS.SAFE,
      ingredientImpact,
    }
  })

  // Perhitungan Finance UMKM
  const otherHppCost = Math.max(baselineHppCost - dailyMaterialCostNow, 0)
  const currentTotalCost = dailyMaterialCostNow + otherHppCost
  const projectedTotalCost = dailyMaterialCostProjected + otherHppCost
  
  const currentDailyGrossProfit = profile.dailyRevenue - currentTotalCost
  const projectedDailyGrossProfit = profile.dailyRevenue - projectedTotalCost
  
  const currentMarginPercentage = (currentDailyGrossProfit / profile.dailyRevenue) * 100
  const projectedMarginPercentage = (projectedDailyGrossProfit / profile.dailyRevenue) * 100
  const dailyMarginLoss = currentDailyGrossProfit - projectedDailyGrossProfit
  
  const currentDailyCashBurn = profile.operationalExpensePerDay + dailyMaterialCostNow
  const projectedDailyCashBurn = profile.operationalExpensePerDay + dailyMaterialCostProjected
  
  const currentRunwayDays = currentDailyCashBurn > 0 ? profile.cashBalance / currentDailyCashBurn : 0
  const projectedRunwayDays = projectedDailyCashBurn > 0 ? profile.cashBalance / projectedDailyCashBurn : 0

  // Enrich riskLevel berdasarkan simulasi akhir
  const enrichedForecasts = allForecasts.map((forecast) => ({
    ...forecast,
    riskLevel: getRiskLevel(
      forecast.changePercent,
      !!forecast.ingredientImpact
    ),
  }))

  // Prioritas utama adalah ingredient dengan kerugian (delta) terbesar, atau komoditas umum dengan lonjakan tertinggi
  const priorityForecast = [...enrichedForecasts].sort((a, b) => {
    const aImpact = a.ingredientImpact?.weeklyDelta || 0
    const bImpact = b.ingredientImpact?.weeklyDelta || 0
    return b.changePercent + bImpact / 100000 - (a.changePercent + aImpact / 100000)
  })[0]

  // Overall business status checks margin and runway
  let status = STATUS.SAFE
  if (projectedMarginPercentage < 10 || projectedRunwayDays < 4) {
    status = STATUS.CRITICAL
  } else if (projectedMarginPercentage < 20 || projectedRunwayDays < 7) {
    status = STATUS.WARNING
  } else if (priorityForecast?.riskLevel === STATUS.CRITICAL) {
    status = STATUS.CRITICAL
  } else if (priorityForecast?.riskLevel === STATUS.WARNING) {
    status = STATUS.WARNING
  }

  // Buat rekomendasi untuk semua komoditas
  const recommendations = enrichedForecasts
    .map((forecast) => createRecommendation(forecast, forecast.riskLevel, forecast.ingredientImpact))
    .filter(Boolean) // Hapus rekomendasi null (komoditas umum yang stabil tidak perlu dispam)
    .sort((a, b) => {
      // Sort priority: high -> medium -> low
      const pMap = { high: 3, medium: 2, low: 1 }
      if (pMap[b.priority] !== pMap[a.priority]) {
        return pMap[b.priority] - pMap[a.priority]
      }
      return b.estimatedSaving - a.estimatedSaving
    })

  return {
    status,
    komoditas: priorityForecast?.name || 'Tidak tersedia',
    generatedAt: new Date().toISOString(),
    horizonDays: 7,
    businessProfile: profile,
    summary: `Margin ${profile.businessType} diproyeksikan ${status.toLowerCase()} dalam 7 hari ke depan.`,
    margin: {
      currentDailyGrossProfit: round(currentDailyGrossProfit),
      projectedDailyGrossProfit: round(projectedDailyGrossProfit),
      dailyMarginLoss: round(dailyMarginLoss),
      weeklyMarginRisk: round(dailyMarginLoss * 7),
      currentMarginPercentage: round(currentMarginPercentage),
      projectedMarginPercentage: round(projectedMarginPercentage),
      projectedHppPercentage: round((projectedTotalCost / profile.dailyRevenue) * 100),
    },
    runway: {
      cashBalance: profile.cashBalance,
      currentRunwayDays: round(currentRunwayDays, 1),
      projectedRunwayDays: round(projectedRunwayDays, 1),
      runwayDeltaDays: round(currentRunwayDays - projectedRunwayDays, 1),
      projectedDailyCashBurn: round(projectedDailyCashBurn),
    },
    forecasts: enrichedForecasts,
    recommendations,
  }
}

module.exports = {
  DEFAULT_INGREDIENTS,
  DEFAULT_PROFILE,
  STATUS,
  calculatePrediction,
}
