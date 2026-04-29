import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'
import AboutPage from './pages/AboutPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('dd-theme') || 'dark')

  // Sync theme ke <html data-theme>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dd-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"          element={<DashboardPage />} />
          <Route path="/komoditas" element={<ProductsPage />} />
          <Route path="/tentang"   element={<AboutPage />} />
          <Route path="*"          element={<DashboardPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
