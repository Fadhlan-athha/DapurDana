/**
 * SparklineChart — mini SVG inline line chart untuk 7-day forecast path.
 * Zero external dependencies.
 *
 * Props:
 *   data  : Array<{ price: number }> — 7 data points
 *   width : number (default 120)
 *   height: number (default 40)
 *   color : string CSS color (default uses CSS var via stroke)
 */
function SparklineChart({ data = [], width = 120, height = 40, color }) {
  if (!data || data.length < 2) return null

  const prices = data.map((d) => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const pad = 3
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  const points = prices.map((p, i) => {
    const x = pad + (i / (prices.length - 1)) * innerW
    const y = pad + (1 - (p - min) / range) * innerH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const polyline = points.join(' ')

  // Fill area under the line
  const lastX  = pad + innerW
  const bottomY = pad + innerH
  const fillPoints = `${pad},${bottomY} ${polyline} ${lastX},${bottomY}`

  const stroke = color || 'var(--brand)'
  const fill   = color
    ? `${color}22`
    : 'var(--brand-dim)'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <polygon points={fillPoints} fill={fill} opacity="0.6" />
      <polyline
        points={polyline}
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last price dot */}
      <circle
        cx={points[points.length - 1].split(',')[0]}
        cy={points[points.length - 1].split(',')[1]}
        r="3"
        fill={stroke}
      />
    </svg>
  )
}

export default SparklineChart
