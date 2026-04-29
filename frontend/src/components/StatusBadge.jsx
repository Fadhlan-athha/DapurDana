function StatusBadge({ status }) {
  const cls = status?.toLowerCase() ?? 'stabil'
  const icons = {
    aman: '✅',
    stabil: '🔵',
    waspada: '⚠️',
    kritis: '🔴',
  }
  return (
    <span className={`status-badge ${cls}`} aria-label={`Status: ${status}`}>
      <span aria-hidden="true">{icons[cls] ?? '•'}</span>
      {status}
    </span>
  )
}

export default StatusBadge
