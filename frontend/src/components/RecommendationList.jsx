import { formatCurrency } from '../utils/formatters.js'

const PRIORITY_ICONS = {
  RESTOCK_NOW:   '🚨',
  ADJUST_RECIPE: '🍽️',
  MONITOR:       '👁️',
}

function RecommendationList({ recommendations }) {
  return (
    <div className="recommendation-list">
      {recommendations.map((rec) => (
        <article
          className={`recommendation-card ${rec.priority}`}
          key={`${rec.actionCode}-${rec.title}`}
        >
          <div className="rec-header">
            <span aria-hidden="true">{PRIORITY_ICONS[rec.actionCode] ?? '💡'}</span>
            <span className={`rec-badge ${rec.priority}`}>
              {rec.priority === 'high' ? 'Segera' : rec.priority === 'medium' ? 'Perhatian' : 'Info'}
            </span>
            <span className="rec-code">{rec.actionCode}</span>
          </div>
          <h3 className="rec-title">{rec.title}</h3>
          <p className="rec-message">{rec.message}</p>
          {rec.estimatedSaving > 0 && (
            <p className="rec-saving">
              💰 Potensi hemat {formatCurrency(rec.estimatedSaving)} / minggu
            </p>
          )}
        </article>
      ))}
    </div>
  )
}

export default RecommendationList
