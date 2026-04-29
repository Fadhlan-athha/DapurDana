function MetricCard({ label, value, detail, tone = 'neutral', icon }) {
  const icons = {
    neutral: icon || '📈',
    warning: icon || '⚠️',
    critical: icon || '🔴',
    safe: icon || '✅',
  }
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon" aria-hidden="true">
        {icons[tone]}
      </div>
      <p className="metric-label">{label}</p>
      <strong className="metric-value">{value}</strong>
      <span className="metric-detail">{detail}</span>
    </article>
  )
}

export default MetricCard
