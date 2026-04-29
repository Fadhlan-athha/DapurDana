// Saat production di Azure (satu App Service), VITE_API_BASE_URL dikosongkan
// sehingga API call menggunakan URL relatif (/api/...) ke domain yang sama.
// Saat development lokal, fallback ke localhost:5000.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export async function fetchPrediction(payload) {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Gagal mengambil prediksi dari backend')
  }

  return response.json()
}
