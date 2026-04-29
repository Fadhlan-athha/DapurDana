export const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
})

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatNumber(value) {
  return numberFormatter.format(value)
}

export function formatIntegerInput(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return ''
  }

  return integerFormatter.format(Math.max(Math.trunc(number), 0))
}

export function parseIntegerInput(value) {
  const digits = String(value).replace(/\D/g, '')

  return digits ? Number(digits) : 0
}
