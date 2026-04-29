export function filterProductsByName(products, query) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return products
  }

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery),
  )
}
