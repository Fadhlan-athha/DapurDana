const express = require('express')
const {
  getCommodityForecasts,
  getForecastMetadata,
  getForecastPath,
  getCommoditySummary,
} = require('../data/forecastRepository')

const router = express.Router()

// GET /api/commodities — semua data komoditas
router.get('/', (req, res) => {
  const commodityForecasts = getCommodityForecasts()
  res.json({
    meta: getForecastMetadata(),
    data: Object.values(commodityForecasts),
  })
})

// GET /api/commodities/status — ringkasan status semua komoditas
router.get('/status', (req, res) => {
  const summary = getCommoditySummary()
  res.json(summary)
})

// GET /api/commodities/forecast-path/:commodity — data sparkline 7 hari
router.get('/forecast-path/:commodity', (req, res) => {
  const { commodity } = req.params
  const path = getForecastPath(commodity)

  if (!path) {
    return res.status(404).json({
      error: 'COMMODITY_NOT_FOUND',
      message: `Komoditas '${commodity}' tidak ditemukan.`,
    })
  }

  res.json({ commodity, forecastPath: path })
})

module.exports = router
