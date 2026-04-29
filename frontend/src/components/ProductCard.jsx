import { formatCurrency } from '../utils/formatters.js'
import StatusBadge from './StatusBadge.jsx'

function ProductCard({ product }) {
  const isUp   = product.trend?.startsWith('+') && product.trend !== '+0%'
  const isDown = product.trend?.startsWith('-')
  const trendCls = isUp ? 'trend-up' : isDown ? 'trend-down' : 'trend-flat'
  const trendIcon = isUp ? '▲' : isDown ? '▼' : '—'

  return (
    <article className="product-card">
      <div className="product-top">
        <p className="product-cat">{product.category}</p>
        <h2 className="product-name">{product.name}</h2>
      </div>

      <div className="product-price-row">
        <p className="product-price">
          {formatCurrency(product.price)}
          <span className="product-unit"> /{product.unit}</span>
        </p>
        <StatusBadge status={product.status} />
      </div>

      <div className="product-meta-row">
        <span className={trendCls}>
          {trendIcon} {product.trend}
        </span>
        <span>🕐 {product.updatedAt}</span>
      </div>
    </article>
  )
}

export default ProductCard
