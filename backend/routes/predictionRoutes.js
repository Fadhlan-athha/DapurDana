const express = require('express')
const {
  DEFAULT_INGREDIENTS,
  DEFAULT_PROFILE,
  calculatePrediction,
} = require('../services/predictionService')

const router = express.Router()

// GET /api/predict/demo-profile — profil usaha default untuk demo
router.get('/demo-profile', (req, res) => {
  res.json({
    businessProfile: DEFAULT_PROFILE,
    ingredients: DEFAULT_INGREDIENTS,
  })
})

// POST /api/predict — hitung prediksi margin dan runway
router.post('/', (req, res) => {
  const prediction = calculatePrediction(req.body)
  res.json(prediction)
})

module.exports = router
