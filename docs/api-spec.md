# DapurDana API Spec

Base URL lokal:

```text
http://localhost:5000
```

Backend menggunakan Node.js + Express. Kontrak endpoint saat ini masih MVP, tetapi field `status` dan `komoditas` pada `/api/predict` dipertahankan agar kompatibel dengan integrasi awal.

## GET /

Health check sederhana.

### Response 200

```json
{
  "message": "DapurDana Backend API Running Berhasil!",
  "docs": "/api/health"
}
```

## GET /api/health

Status service backend.

### Response 200

```json
{
  "status": "ok",
  "service": "dapur-dana-api",
  "version": "0.1.0",
  "forecast": {
    "source": "xgboost-local-model",
    "generatedAt": "2026-04-29T09:39:10.111028+00:00",
    "horizonDays": 7,
    "dataset": "machine-learning/datasets/raw/Data_Gabungan_Ayam_Cabai_Jakarta.csv"
  }
}
```

## GET /api/commodities

Mengembalikan daftar komoditas dan forecast dummy yang digunakan backend MVP.

### Response 200

```json
{
  "meta": {
    "source": "xgboost-local-model",
    "generatedAt": "2026-04-29T09:39:10.111028+00:00",
    "horizonDays": 7,
    "dataset": "machine-learning/datasets/raw/Data_Gabungan_Ayam_Cabai_Jakarta.csv"
  },
  "data": [
    {
      "commodity": "cabai-merah",
      "name": "Cabai Merah",
      "category": "Bahan Pokok",
      "unit": "kg",
      "currentPrice": 68000,
      "predictedPrice": 81600,
      "confidence": 0.82,
      "rmse": 4200,
      "mape": 6.8,
      "volatilityIndex": 0.74,
      "source": "xgboost-local-model",
      "forecastPath": [
        {
          "date": "2026-04-30",
          "price": 53425,
          "day": 1
        }
      ]
    }
  ]
}
```

## GET /api/demo-profile

Payload contoh untuk dashboard dan kalkulator margin.

### Response 200

```json
{
  "businessProfile": {
    "businessType": "Ayam Geprek",
    "dailyRevenue": 1500000,
    "hppPercentage": 48,
    "cashBalance": 3500000,
    "operationalExpensePerDay": 250000
  },
  "ingredients": [
    {
      "commodity": "cabai-merah",
      "name": "Cabai Merah",
      "dailyUsage": 2.5,
      "stockDays": 2
    }
  ]
}
```

## POST /api/predict

Menghitung status kerentanan margin, runway kas, dampak kenaikan komoditas, dan rekomendasi taktis.

### Request Body

```json
{
  "businessProfile": {
    "businessType": "Ayam Geprek",
    "dailyRevenue": 1500000,
    "hppPercentage": 48,
    "cashBalance": 3500000,
    "operationalExpensePerDay": 250000
  },
  "ingredients": [
    {
      "commodity": "cabai-merah",
      "name": "Cabai Merah",
      "dailyUsage": 2.5,
      "stockDays": 2
    },
    {
      "commodity": "daging-ayam",
      "name": "Daging Ayam",
      "dailyUsage": 12,
      "stockDays": 1
    }
  ]
}
```

### Request Fields

| Field | Type | Required | Keterangan |
| --- | --- | --- | --- |
| `businessProfile.businessType` | string | no | Jenis usaha UMKM. Default: `Ayam Geprek`. |
| `businessProfile.dailyRevenue` | number | no | Omset harian dalam rupiah. |
| `businessProfile.hppPercentage` | number | no | Baseline HPP pengguna dalam persen. |
| `businessProfile.cashBalance` | number | no | Saldo kas operasional saat ini. |
| `businessProfile.operationalExpensePerDay` | number | no | Biaya operasional harian di luar bahan baku. |
| `ingredients[].commodity` | string | yes | ID komoditas, misalnya `cabai-merah`. |
| `ingredients[].dailyUsage` | number | yes | Konsumsi harian bahan baku. |
| `ingredients[].stockDays` | number | no | Sisa stok dalam hari. |

Jika body kosong, backend memakai demo payload agar dashboard tetap dapat berjalan.

### Response 200

```json
{
  "status": "Waspada",
  "komoditas": "Cabai Merah",
  "generatedAt": "2026-04-29T08:00:00.000Z",
  "horizonDays": 7,
  "summary": "Margin Ayam Geprek diproyeksikan waspada dalam 7 hari ke depan.",
  "margin": {
    "currentDailyGrossProfit": 780000,
    "projectedDailyGrossProfit": 719800,
    "dailyMarginLoss": 60200,
    "weeklyMarginRisk": 421400,
    "currentMarginPercentage": 52,
    "projectedMarginPercentage": 47.99,
    "projectedHppPercentage": 52.01
  },
  "runway": {
    "cashBalance": 3500000,
    "currentRunwayDays": 3.7,
    "projectedRunwayDays": 3.5,
    "runwayDeltaDays": 0.2,
    "projectedDailyCashBurn": 1000200
  },
  "forecasts": [
    {
      "commodity": "cabai-merah",
      "name": "Cabai Merah",
      "unit": "kg",
      "currentPrice": 68000,
      "predictedPrice": 81600,
      "changePercent": 20,
      "direction": "up",
      "confidence": 0.82,
      "rmse": 4200,
      "mape": 6.8,
      "volatilityIndex": 0.74,
      "riskLevel": "Kritis",
      "ingredientImpact": {
        "dailyCostNow": 170000,
        "dailyCostProjected": 204000,
        "dailyDelta": 34000,
        "weeklyDelta": 238000,
        "stockDays": 2
      }
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "actionCode": "RESTOCK_NOW",
      "title": "Amankan stok Cabai Merah",
      "message": "Cabai Merah diprediksi naik 20%. Beli stok tambahan hari ini bila ruang kas masih cukup.",
      "estimatedSaving": 238000
    }
  ]
}
```

### Response 400

```json
{
  "error": "PREDICTION_FAILED",
  "message": "Detail error"
}
```

## Integrasi Azure ML Berikutnya

Pada MVP lokal ini, prediksi harga dapat berasal dari file `mlForecasts.json` hasil model XGBoost. Saat Azure ML endpoint sudah tersedia, Node.js sebaiknya tetap mempertahankan response `/api/predict` di atas dan hanya mengganti sumber `currentPrice`, `predictedPrice`, `rmse`, `mape`, dan `confidence`.

## Integrasi Model Lokal XGBoost

Backend otomatis membaca file berikut jika tersedia:

```text
backend/data/mlForecasts.json
```

File tersebut dibuat dari model lokal:

```bash
python machine-learning/scripts/generate_forecasts.py --horizon-days 7
```

Input model:

```text
machine-learning/models/model_ayam.pkl
machine-learning/models/model_cabai.pkl
machine-learning/datasets/raw/Data_Gabungan_Ayam_Cabai_Jakarta.csv
```

Jika `mlForecasts.json` tidak ada atau gagal dibaca, backend fallback ke `backend/data/commodityForecasts.js`.
