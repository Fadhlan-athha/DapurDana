import { formatCurrency } from '../utils/formatters.js'
import SparklineChart from './SparklineChart.jsx'
import StatusBadge from './StatusBadge.jsx'

function ForecastCard({ forecast }) {
  const isUp = forecast.changePercent >= 0
  const trendColor = isUp ? 'var(--critical)' : 'var(--safe)'

  return (
    <article className="forecast-card">
      <div className="forecast-card-top">
        <div>
          <p className="forecast-category">{forecast.category}</p>
          <h3 className="forecast-name">{forecast.name}</h3>
        </div>
        <StatusBadge status={forecast.riskLevel} />
      </div>

      {/* Mini sparkline — gunakan forecastPath jika tersedia */}
      {Array.isArray(forecast.forecastPath) && forecast.forecastPath.length > 1 && (
        <SparklineChart
          data={forecast.forecastPath}
          width={200}
          height={44}
          color={trendColor}
        />
      )}

      <div className="forecast-prices">
        <div className="price-cell">
          <span className="price-cell-label">Hari ini</span>
          <strong className="price-cell-value">{formatCurrency(forecast.currentPrice)}</strong>
        </div>
        <div className="price-cell">
          <span className="price-cell-label">Prediksi 7 hari</span>
          <strong className="price-cell-value">{formatCurrency(forecast.predictedPrice)}</strong>
        </div>
      </div>

      <div className="forecast-meta-row">
        <span style={{ color: trendColor, fontWeight: 600 }}>
          {isUp ? '▲' : '▼'} {Math.abs(forecast.changePercent)}%
        </span>
        <span>MAPE {forecast.mape}%</span>
        <span>RMSE {formatCurrency(forecast.rmse)}</span>
      </div>
    </article>
  )
}

export default ForecastCard
