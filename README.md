# DapurDana

DapurDana adalah aplikasi mobile-web untuk membantu UMKM F&B membaca risiko fluktuasi harga bahan baku sebelum margin kas mereka tertekan. MVP ini menggabungkan prediksi harga komoditas, kalkulator margin/runway, dan rekomendasi taktis seperti restock lebih awal atau penyesuaian porsi.

# Link Deployed Project (Live App Azure): 
https://dapurdana-dmgre3dmcrfcfrcg.southeastasia-01.azurewebsites.net/

## Status MVP

Fokus MVP:

- Komoditas utama: Cabai Merah, Daging Ayam, Telur Ayam, dan Tepung Terigu.
- Dashboard status margin: Aman, Waspada, atau Kritis.
- Endpoint prediksi backend dengan response yang siap dihubungkan ke Azure ML.
- Dataset historis Jakarta, model XGBoost lokal, dan notebook baseline ARIMA/SARIMAX.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, ESLint.
- Backend: Node.js, Express, CORS, dotenv.
- Machine Learning: Python, pandas, scikit-learn, XGBoost, statsmodels, TensorFlow.
- Cloud target: Azure App Service, Azure Static Web Apps, Azure Machine Learning.

## Struktur Project

```text
DapurDana/
├── backend/               # Express API dan logic prediksi bisnis
├── frontend/              # React dashboard dan UI mobile-web
├── machine-learning/      # Dataset sample, notebook, requirements ML
├── docs/                  # API spec
├── infrastructure/        # Catatan Azure dan pipeline placeholder
└── README.md
```

## Menjalankan Lokal

### Opsi Cepat dari Root Project

Jalankan dari folder root `DapurDana`:

```bash
npm run dev
```

Script ini menjalankan backend dan frontend sekaligus.

Pastikan dependency kedua folder sudah ter-install:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ..
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

Backend berjalan di:

```text
http://localhost:5000
```

Endpoint utama:

- `GET /api/health`
- `GET /api/commodities`
- `GET /api/demo-profile`
- `POST /api/predict`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend Vite biasanya berjalan di:

```text
http://localhost:5173
```

Jika backend berjalan di URL lain, set environment variable:

```text
VITE_API_BASE_URL=http://localhost:5000
```

### Machine Learning

```bash
cd machine-learning
pip install -r requirements.txt
jupyter notebook
```

Buka notebook:

```text
machine-learning/notebooks/price_forecasting_mvp.ipynb
```

Dataset contoh:

```text
machine-learning/datasets/raw/sample_food_prices.csv
machine-learning/datasets/processed/sample_food_prices_clean.csv
```

Model XGBoost dari tim ML:

```text
machine-learning/models/model_ayam.pkl
machine-learning/models/model_cabai.pkl
```

Dataset historis Jakarta yang dipakai model:

```text
machine-learning/datasets/raw/Data_Gabungan_Ayam_Cabai_Jakarta.csv
```

Generate forecast untuk backend:

```bash
python machine-learning/scripts/generate_forecasts.py --horizon-days 7
```

Script training/export model dari paket ML:

```text
machine-learning/scripts/train_xgboost_models.py
```

Output script:

```text
backend/data/mlForecasts.json
```

Jika file `mlForecasts.json` ada, backend otomatis memakai hasil model XGBoost. Jika file itu belum ada, backend memakai forecast statis sebagai fallback.

## Test dan Validasi

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
npm run lint
npm run build
```

Catatan Windows PowerShell: jika `npm` diblokir execution policy, gunakan `npm.cmd`.

## API Contract

Dokumentasi endpoint ada di:

```text
docs/api-spec.md
```

Field kompatibilitas awal pada `/api/predict` tetap tersedia:

```json
{
  "status": "Waspada",
  "komoditas": "Cabai Merah"
}
```

Response lengkap juga memuat `margin`, `runway`, `forecasts`, dan `recommendations`.

## Deployment

Catatan deployment Azure ada di:

```text
infrastructure/resource-group.txt
infrastructure/azure-pipelines.yml
```

Ringkasan target:

- Backend Node.js deploy ke Azure App Service.
- Frontend React deploy ke Azure Static Web Apps atau App Service static hosting.
- Azure ML menjadi sumber prediksi harga produksi.
- Secret seperti API key Azure ML disimpan di App Service Configuration atau Key Vault, bukan di frontend.

## Peran Tim

- R. Haikal Rizki Tri Hartanto: Machine Learning, evaluasi model, narasi bisnis.
- Muhammad Dicky Kurniawan: Data acquisition, API sourcing, Azure architecture.
- Fadhlan Athhariansyah: Frontend, backend integration, dashboard, pitch deck.
