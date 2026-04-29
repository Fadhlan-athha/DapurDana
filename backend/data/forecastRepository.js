const fs = require('fs')
const path = require('path')
const fallbackForecasts = require('./commodityForecasts')

const mlForecastPath = path.join(__dirname, 'mlForecasts.json')

function getCommodityForecasts() {
  if (!fs.existsSync(mlForecastPath)) {
    return fallbackForecasts
  }

  try {
    const fileContent = fs.readFileSync(mlForecastPath, 'utf8')
    const parsed = JSON.parse(fileContent)

    return {
      ...fallbackForecasts,
      ...(parsed.forecasts || {}),
    }
  } catch (error) {
    console.warn(`[ForecastRepository] Gagal load ML forecasts: ${error.message}`)
    return fallbackForecasts
  }
}

function getForecastMetadata() {
  if (!fs.existsSync(mlForecastPath)) {
    return { source: 'fallback-static-forecast' }
  }

  try {
    const fileContent = fs.readFileSync(mlForecastPath, 'utf8')
    const parsed = JSON.parse(fileContent)

    return {
      source: 'xgboost-local-model',
      generatedAt: parsed.generatedAt,
      horizonDays: parsed.horizonDays,
      dataset: parsed.dataset,
    }
  } catch (error) {
    return {
      source: 'fallback-static-forecast',
      warning: error.message,
    }
  }
}

/**
 * Ambil forecastPath (array 7 hari) untuk satu komoditas.
 * Digunakan untuk sparkline chart di frontend.
 * @param {string} commodity - ID komoditas, contoh: 'cabai-merah'
 * @returns {Array|null}
 */
function getForecastPath(commodity) {
  const forecasts = getCommodityForecasts()
  const entry = forecasts[commodity]
  if (!entry) return null
  return entry.forecastPath || null
}

/**
 * Ringkasan status semua komoditas: total, berapa yang waspada/kritis.
 * @returns {Object}
 */
function getCommoditySummary() {
  const forecasts = getCommodityForecasts()
  const entries = Object.values(forecasts)
  const meta = getForecastMetadata()

  const summary = entries.map((f) => {
    const changePercent =
      f.currentPrice && f.predictedPrice
        ? (((f.predictedPrice - f.currentPrice) / f.currentPrice) * 100).toFixed(2)
        : 0

    let riskLevel = 'Aman'
    const pct = parseFloat(changePercent)
    if (pct >= 18 || f.volatilityIndex >= 0.8) riskLevel = 'Kritis'
    else if (pct >= 7 || f.volatilityIndex >= 0.5) riskLevel = 'Waspada'

    return {
      commodity: f.commodity,
      name: f.name,
      category: f.category,
      currentPrice: f.currentPrice,
      predictedPrice: f.predictedPrice,
      changePercent: parseFloat(changePercent),
      volatilityIndex: f.volatilityIndex,
      riskLevel,
    }
  })

  return {
    meta,
    total: summary.length,
    kritis: summary.filter((s) => s.riskLevel === 'Kritis').length,
    waspada: summary.filter((s) => s.riskLevel === 'Waspada').length,
    aman: summary.filter((s) => s.riskLevel === 'Aman').length,
    commodities: summary,
  }
}

module.exports = {
  getCommodityForecasts,
  getForecastMetadata,
  getForecastPath,
  getCommoditySummary,
}
