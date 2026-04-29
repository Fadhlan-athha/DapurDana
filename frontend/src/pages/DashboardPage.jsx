import { useEffect, useMemo, useState } from 'react'
import ForecastCard from '../components/ForecastCard.jsx'
import MetricCard from '../components/MetricCard.jsx'
import RecommendationList from '../components/RecommendationList.jsx'
import { demoPrediction, demoPredictionPayload } from '../data/demoBusiness.js'
import { fetchPrediction } from '../services/predictionApi.js'
import {
  formatCurrency,
  formatIntegerInput,
  formatNumber,
  parseIntegerInput,
} from '../utils/formatters.js'

const CURRENCY_FIELDS = new Set(['dailyRevenue', 'cashBalance', 'operationalExpensePerDay'])

function DashboardPage() {
  const [profile, setProfile]     = useState(demoPredictionPayload.businessProfile)
  const [prediction, setPrediction] = useState(demoPrediction)
  const [isLoading, setIsLoading] = useState(true)

  function getScaledPayload(currentProfile) {
    const baseRevenue = demoPredictionPayload.businessProfile.dailyRevenue
    const currentRevenue = currentProfile.dailyRevenue || 0
    // Hindari skala negatif atau nol mutlak, minimal 0.01x
    const scalingFactor = Math.max(currentRevenue / baseRevenue, 0.01)

    const scaledIngredients = demoPredictionPayload.ingredients.map((item) => ({
      ...item,
      dailyUsage: Number((item.dailyUsage * scalingFactor).toFixed(2)),
    }))

    return {
      businessProfile: currentProfile,
      ingredients: scaledIngredients,
    }
  }

  const payload = useMemo(
    () => getScaledPayload(profile),
    [profile],
  )

  useEffect(() => {
    let active = true
    fetchPrediction(getScaledPayload(demoPredictionPayload.businessProfile))
      .then((result) => { if (active) setPrediction(result) })
      .catch(() => { if (active) setPrediction(demoPrediction) })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])

  function handleProfileChange(e) {
    const { name, value } = e.target
    if (CURRENCY_FIELDS.has(name)) {
      setProfile((p) => ({ ...p, [name]: parseIntegerInput(value) }))
    } else {
      setProfile((p) => ({ ...p, [name]: name === 'businessType' ? value : (value === '' ? '' : Number(value)) }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await fetchPrediction(payload)
      setPrediction(result)
    } catch {
      setPrediction(demoPrediction)
    } finally {
      setIsLoading(false)
    }
  }

  const statusCls = prediction.status?.toLowerCase() ?? 'aman'
  
  const isMarginGain = prediction.margin.weeklyMarginRisk < 0
  const marginRiskLabel = isMarginGain ? 'Potensi Ekstra Margin' : 'Risiko Margin Mingguan'
  const marginRiskTone = isMarginGain ? 'safe' : 'warning'
  const marginRiskValue = Math.abs(prediction.margin.weeklyMarginRisk)
  const marginLossValue = Math.abs(prediction.margin.dailyMarginLoss)

  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className={`dashboard-hero ${statusCls}`} aria-label="Status margin usaha">
        <div className="hero-content">
          <p className="eyebrow">DapurDana Early Warning</p>
          <h1 className="hero-title">
            Margin Kas:{' '}
            <span className={`hero-status-word ${statusCls}`}>{prediction.status}</span>
          </h1>
          <p className="hero-desc">{prediction.summary}</p>
        </div>
        <div className="hero-signal" aria-label="Komoditas prioritas">
          <span className="hero-signal-label">Komoditas Prioritas</span>
          <strong className="hero-signal-value">{prediction.komoditas}</strong>
          <span className="hero-signal-mode">
            Horizon {prediction.horizonDays} hari
          </span>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section className="metric-grid" aria-label="Ringkasan keuangan" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
        <MetricCard
          icon={isMarginGain ? '✨' : '⚡'}
          label={marginRiskLabel}
          value={formatCurrency(marginRiskValue)}
          detail={`${formatCurrency(marginLossValue)} per hari`}
          tone={marginRiskTone}
        />
        <MetricCard
          icon="📊"
          label="Margin Proyeksi"
          value={`${formatNumber(prediction.margin.projectedMarginPercentage)}%`}
          detail={`HPP proyeksi ${formatNumber(prediction.margin.projectedHppPercentage)}%`}
          tone="neutral"
        />
        <MetricCard
          icon="💰"
          label="Napas Kas"
          value={`${formatNumber(prediction.runway.projectedRunwayDays)} hari`}
          detail={`Turun ${formatNumber(prediction.runway.runwayDeltaDays)} hari`}
          tone="critical"
        />
      </section>

      {/* ── Calculator + Rekomendasi ── */}
      <div className="dashboard-grid">
        <form className="calculator-panel" onSubmit={handleSubmit} noValidate>
          <div className="panel-header">
            <p className="eyebrow">Kalkulator</p>
            <h2 className="panel-title">Simulasi Profil Usaha</h2>
          </div>

          <div className="form-fields">
            {[
              { name: 'businessType',           label: 'Tipe usaha',         type: 'text',   currency: false },
              { name: 'dailyRevenue',            label: 'Omset harian (Rp)',  type: 'text',   currency: true  },
              { name: 'hppPercentage',           label: 'HPP baseline (%)',   type: 'number', currency: false },
              { name: 'cashBalance',             label: 'Saldo kas (Rp)',     type: 'text',   currency: true  },
              { name: 'operationalExpensePerDay',label: 'Operasional harian (Rp)', type: 'text', currency: true },
            ].map(({ name, label, type, currency }) => (
              <label key={name} className="field-label">
                <span>{label}</span>
                <input
                  id={`field-${name}`}
                  className="field-input"
                  name={name}
                  type={type}
                  inputMode={currency ? 'numeric' : undefined}
                  min={type === 'number' ? 0 : undefined}
                  max={name === 'hppPercentage' ? 100 : undefined}
                  value={
                    currency
                      ? formatIntegerInput(profile[name])
                      : profile[name]
                  }
                  onChange={handleProfileChange}
                />
              </label>
            ))}
          </div>

          <button id="btn-hitung" className="btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <><div className="spinner" /><span>Menghitung...</span></>
            ) : (
              <><span>⚡</span><span>Hitung Ulang</span></>
            )}
          </button>
        </form>

        <section className="recommendation-panel" aria-label="Rekomendasi strategi" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          <div className="panel-header">
            <p className="eyebrow">Saran AI</p>
            <h2 className="panel-title">Strategi 7 Hari</h2>
          </div>
          <RecommendationList recommendations={prediction.recommendations} />
        </section>
      </div>

      {/* ── Forecast ── */}
      <section className="forecast-section" aria-label="Prediksi harga komoditas">
        <div className="section-header">
          <p className="eyebrow">Predictive Pricing AI</p>
          <h2 className="section-title">Prediksi Komoditas</h2>
        </div>
        <div className="forecast-grid" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          {prediction.forecasts.map((forecast, i) => (
            <div key={forecast.commodity} style={{ animationDelay: `${i * 80}ms` }}>
              <ForecastCard forecast={forecast} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
