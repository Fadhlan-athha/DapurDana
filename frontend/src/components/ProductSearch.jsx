import { useMemo, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import { products } from '../data/products.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { filterProductsByName } from '../services/productSearch.js'

const ALL_CATEGORIES = ['Semua', ...Array.from(new Set(products.map((p) => p.category)))]

function ProductSearch() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('Semua')
  const debouncedSearch         = useDebouncedValue(search, 300)

  const filteredProducts = useMemo(() => {
    const byName = filterProductsByName(products, debouncedSearch)
    if (category === 'Semua') return byName
    return byName.filter((p) => p.category === category)
  }, [debouncedSearch, category])

  return (
    <section className="products-section">
      <div className="products-page-header">
        <div>
          <p className="eyebrow">Komoditas</p>
          <h1 className="page-title">Produk yang Dipantau</h1>
          <p className="page-subtitle">
            Cari bahan baku berdasarkan nama untuk melihat harga dan status risikonya.
          </p>
        </div>

        <div className="search-wrap">
          <label htmlFor="product-search">Cari produk</label>
          <div className="search-input-row">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              id="product-search"
              className="search-input"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Contoh: Cabai Merah"
              aria-label="Cari produk berdasarkan nama"
            />
          </div>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="filter-chips" role="group" aria-label="Filter kategori">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="products-toolbar" aria-live="polite">
        Menampilkan <strong>{filteredProducts.length}</strong> dari {products.length} produk
      </p>

      {filteredProducts.length > 0 ? (
        <div className="products-grid" aria-label="Daftar produk">
          {filteredProducts.map((product, i) => (
            <div key={product.id} style={{ animationDelay: `${i * 60}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>🔍 Produk tidak ditemukan</h2>
          <p>Coba cari dengan nama komoditas lain atau ubah filter kategori.</p>
        </div>
      )}
    </section>
  )
}

export default ProductSearch
