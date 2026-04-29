# DapurDana
Aplikasi Deteksi Dini Kerentanan Finansial untuk UMKM F&amp;B (Sistem Analisis &amp; Radar Risiko Bisnis Kuliner).

DapurDana adalah solusi digital bagi UMKM kuliner untuk mendeteksi kerentanan finansial secara dini. Dengan mengintegrasikan model prediksi harga pangan berbasis AI dan manajemen HPP, aplikasi ini memberikan sinyal "Merah, Kuning, Hijau" sebagai panduan pengambilan keputusan bisnis.

---

## 🚀 Status Proyek: FASE 1 (WAR ROOM)
Fokus utama saat ini adalah pengiriman Minimum Viable Product (MVP) dengan cakupan prediksi pada 2 komoditas utama: **Cabai Merah** dan **Daging Ayam**.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS (Mobile-First Design)
- **Backend:** Node.js, Express.js
- **Machine Learning:** Python (ARIMA/LSTM), Scikit-learn/TensorFlow
- **Cloud/Infra:** Microsoft Azure (Azure ML, App Service, Static Web Apps)
- **Data Source:** PIHPS / Bapanas (Data Historis 1-2 Tahun)

---

## 👥 Tim & Pipeline Eksekusi

### 👨‍💻 Muhammad Dicky Kurniawan (Data & Cloud Architecture)
**Hulu & Muara Pipeline:**
1. **Data Acquisition:** Kurasi dan pembersihan dataset harian Cabai & Ayam (YYYY-MM-DD format).
2. **Azure Infrastructure:** Setup Resource Group, Azure Machine Learning Workspace, dan Azure App Service.
3. **Deployment:** Mengubah model ML menjadi REST API Endpoint yang siap dikonsumsi.

### 🧠 R. Haikal Rizki Tri Hartanto (ML Engineer & Business Narrative)
**Otak Logika:**
1. **Preprocessing:** Interpolasi data harian yang hilang (hari libur) dan *feature engineering* volatilitas harga.
2. **Model Training:** Pengembangan model *Time-Series* untuk prediksi harga 7 hari ke depan dengan target metrik RMSE/MAPE yang rendah.
3. **Documentation:** Penulisan narasi ekonomi makro pada proposal bisnis dan pengolahan angka metrik ke dalam Pitch Deck.

### 🎨 Fadhlan Athhariansyah (App Dev & Pitch Deck)
**Ujung Tombak Visual:**
1. **Frontend Development:** Membangun UI React berbasis Mobile-First (Halaman Onboarding & Dashboard).
2. **Integration:** Membangun server Node.js untuk menghubungkan UI dengan API Prediksi Azure dan menerapkan logika bisnis (IF/ELSE) rekomendasi stok.
3. **Finalization:** Sinkronisasi deployment ke Azure App Service dan persiapan visual Pitch Deck.

---

## 📂 Struktur Data & Model (MVP Scope)
Model AI saat ini dilatih untuk:
- **Komoditas:** Cabai Merah Keriting & Daging Ayam Ras.
- **Input:** Harga historis harian.
- **Output:** Prediksi harga 7 hari ke depan & Status Kerentanan (Aman/Kritis).

---

## ⚙️ Cara Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js (v16+)
- Python 3.9+
- Akun Microsoft Azure

### 2. Setup Backend
```bash
cd backend
npm install
npm start
