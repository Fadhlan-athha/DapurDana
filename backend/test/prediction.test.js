const assert = require('node:assert/strict')
const test = require('node:test')
const { calculatePrediction } = require('../services/predictionService')

test('calculates prediction with legacy status and komoditas fields', () => {
  const result = calculatePrediction({
    businessProfile: {
      businessType: 'Ayam Geprek',
      dailyRevenue: 1500000,
      hppPercentage: 48,
      cashBalance: 3500000,
      operationalExpensePerDay: 250000,
    },
    ingredients: [
      {
        commodity: 'cabai-merah',
        dailyUsage: 2.5,
        stockDays: 2,
      },
    ],
  })

  assert.equal(typeof result.status, 'string')
  assert.equal(result.komoditas, 'Cabai Merah')
  assert.equal(result.horizonDays, 7)
  assert.ok(result.margin.weeklyMarginRisk > 0)
  assert.ok(result.runway.projectedRunwayDays > 0)
})

test('falls back to demo payload when request body is empty', () => {
  const result = calculatePrediction()

  assert.ok(result.forecasts.length > 0)
  assert.ok(result.recommendations.length > 0)
  assert.equal(result.businessProfile.businessType, 'Ayam Geprek')
})
