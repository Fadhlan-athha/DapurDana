import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: '📊 Dashboard' },
    { to: '/komoditas', label: '🌶️ Komoditas' },
    { to: '/tentang', label: 'ℹ️ Tentang' },
  ]

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-brand-icon" aria-hidden="true">🍳</div>
          <span>DapurDana</span>
        </div>

        <nav className="navbar-nav" aria-label="Navigasi utama">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-end">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Ganti ke tema ${theme === 'dark' ? 'terang' : 'gelap'}`}
            title={`Tema ${theme === 'dark' ? 'terang' : 'gelap'}`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            className="hamburger"
            aria-label="Buka menu navigasi"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Navigasi mobile">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
