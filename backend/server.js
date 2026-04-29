require('dotenv').config()

const cors = require('cors')
const express = require('express')
const commodityRoutes = require('./routes/commodityRoutes')
const predictionRoutes = require('./routes/predictionRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// --- Middleware ---
app.use(cors())
app.use(express.json())

// Security headers (manual, zero extra dependencies)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// --- Routes ---
app.get('/', (_req, res) => {
  res.json({
    message: 'DapurDana Backend API — Siap!',
    version: '0.2.0',
    endpoints: [
      'GET  /api/health',
      'GET  /api/commodities',
      'GET  /api/commodities/status',
      'GET  /api/commodities/forecast-path/:commodity',
      'GET  /api/predict/demo-profile',
      'POST /api/predict',
    ],
  })
})

app.get('/api/health', (_req, res) => {
  const { getForecastMetadata } = require('./data/forecastRepository')
  res.json({
    status: 'ok',
    service: 'dapur-dana-api',
    version: '0.2.0',
    timestamp: new Date().toISOString(),
    forecast: getForecastMetadata(),
  })
})

app.use('/api/commodities', commodityRoutes)
app.use('/api/predict', predictionRoutes)

// Backward-compat: /api/demo-profile dan /api/predict (POST) di root
app.get('/api/demo-profile', (_req, res) => {
  const { DEFAULT_INGREDIENTS, DEFAULT_PROFILE } = require('./services/predictionService')
  res.json({ businessProfile: DEFAULT_PROFILE, ingredients: DEFAULT_INGREDIENTS })
})

app.post('/api/predict', (req, res, next) => {
  // Delegasikan ke prediction route handler
  const { calculatePrediction } = require('./services/predictionService')
  try {
    const prediction = calculatePrediction(req.body)
    res.json(prediction)
  } catch (err) {
    next(err)
  }
})

// --- Error Handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[DapurDana Error]', err.message)
  res.status(err.status || 400).json({
    error: err.code || 'REQUEST_FAILED',
    message: err.message || 'Terjadi kesalahan pada server.',
  })
})

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint tidak ditemukan.' })
})

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🍳 DapurDana API berjalan di http://localhost:${PORT}`)
    console.log(`   Docs: http://localhost:${PORT}/api/health\n`)
  })
}

module.exports = app
