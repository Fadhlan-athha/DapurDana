# 🍲 DapurDana: F&B Financial Early Warning System
**Target MVP Submission: 30 April**

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

## 👥 Tim & Peran

### 👨‍💻 Muhammad Dicky Kurniawan (Data & Cloud Architecture)
**Hulu & Muara Pipeline:**
- **Data Acquisition:** Kurasi dan pembersihan dataset harian Cabai & Ayam.
- **Azure Infrastructure:** Setup Resource Group, Azure ML Workspace, dan App Service.
- **Deployment:** Men-deploy model ML menjadi REST API Endpoint.

### 🧠 R. Haikal Rizki Tri Hartanto (ML Engineer & Business Narrative)
**Otak Logika:**
- **Preprocessing:** Interpolasi data kosong dan *feature engineering*.
- **Model Training:** Melatih model *Time-Series* (ARIMA/LSTM) untuk prediksi 7 hari ke depan.
- **Documentation:** Menyusun narasi proposal dan mencatat metrik evaluasi (RMSE/MAPE).

### 🎨 Fadhlan Athhariansyah (App Dev & Pitch Deck)
**Ujung Tombak Visual:**
- **Frontend Development:** Membangun UI (Onboarding & Dashboard) dengan React.js.
- **Integration:** Membuat server Node.js untuk memproses logika bisnis (IF/ELSE) dari *response* AI Azure.
- **Finalization:** Integrasi *end-to-end* dan persiapan *Pitch Deck*.

---

## 🔄 Alur Kerja Tim (Estafet Workflow)

Karena fase ini sangat singkat, tim beroperasi dengan sistem estafet (serah terima tugas) yang ketat:

1. **[Dicky] ➡️ [Haikal]: Ekstraksi Data**
   Dicky menarik data mentah dari portal pemerintah, menyeragamkan format kolom/tanggal, dan menyerahkan *dataset* bersih ke Haikal.
2. **[Haikal] ➡️ [Dicky]: Penyerahan Model**
   Haikal mengolah data, melatih model AI untuk 2 komoditas, dan menyerahkan model final (format `.pkl` / `.h5` / `.onnx`) kembali kepada Dicky.
3. **[Dicky] ➡️ [Fadhlan]: Distribusi API Endpoint**
   Dicky men-deploy model dari Haikal ke Azure, membuat *REST API Endpoint* beserta *API Key*, dan menyerahkan *link/keys* tersebut kepada Fadhlan.
4. **[Fadhlan] ➡️ [Production]: Final Integration**
   Fadhlan memasukkan API Endpoint ke dalam *backend* Node.js, merender hasil prediksinya ke antarmuka React.js, lalu berkoordinasi dengan Dicky untuk sinkronisasi *deployment* web secara *live* di Azure.

---

## 📜 Aturan Main (War Room Rules)

Untuk memastikan MVP selesai sebelum tenggat waktu 30 April, seluruh anggota tim wajib mematuhi aturan berikut:

1. **Strict MVP Scope (Jangan Serakah Fitur):**
   - Fokus **HANYA** pada 2 komoditas (Cabai Merah & Daging Ayam). Jangan menambah dataset lain sebelum MVP ini sukses ter-deploy.
   - Jangan gunakan arsitektur *Machine Learning* yang memakan waktu *training* berhari-hari. Gunakan arsitektur yang sudah teruji dan cepat.
   - Jangan membuang waktu untuk animasi atau UI yang terlalu kompleks. Fokus pada fungsionalitas utama (Status Merah/Kuning/Hijau).
2. **Komunikasi Cepat & Transparan:**
   - Setiap *bottleneck* (error *training*, API gagal *fetch*, atau masalah *deployment*) harus dilaporkan maksimal dalam 30 menit agar bisa di-*debug* bersama.
3. **Git & Version Control Discipline:**
   - Gunakan `.gitignore` secara ketat. **Dilarang keras** melakukan *commit/push* untuk folder `node_modules/`, *virtual environment* Python, atau file dataset mentah/model berukuran raksasa.
   - Usahakan bekerja di *branch* masing-masing jika memungkinkan untuk mencegah *merge conflict* yang menghabiskan waktu.
4. **Hard Deadline Harian:**
   - Sore: Data bersih (Dicky) & Mockup UI siap (Fadhlan).
   - Malam: Model ML selesai dilatih (Haikal) & Azure siap menampung (Dicky).
   - Besok Pagi: API Endpoint *live* & terhubung sempurna ke aplikasi Node/React (Fadhlan).

---

## 🔗 Panduan Setup Git Pertama Kali (Koneksi Lokal ke GitHub)

Bagi seluruh anggota tim, ikuti langkah wajib di bawah ini untuk menghubungkan repositori GitHub ini ke komputer/laptop lokal Anda sebelum mulai mengoding:

### Langkah 1: Clone Repositori
Buka terminal di folder tempat Anda biasa menyimpan project, lalu jalankan:

bash

git clone https://github.com/Fadhlan-athha/DapurDana.git

cd DapurDana

### Langkah 2: Buat Branch Kerja 
git checkout -b tipe/scope-deskripsi-singkat

Contoh untuk Fadhlan (Frontend):
git checkout -b fitur/fe-setup-awal-react

Contoh untuk Haikal (ML):
git checkout -b fitur/ml-eksplorasi-data

### langkah 3: Simpan dan Kirim Perubahan (Push)
git add .

git commit -m "feat(ml): penjelasan singkat apa yang dikerjakan"

git push -u origin nama-branch

---

## 🌿 Panduan Git & Kolaborasi (Branch & Commit Rules)

### 1. Format Penamaan Branch
Gunakan format: `tipe/scope-deskripsi-singkat`
- **Tipe:** `fitur/`, `fix/`, `docs/`, `chore/`
- **Scope:** `fe`, `be`, `ml`, `cloud`, `data`
- **Contoh:** `fitur/fe-menambahkan-header`, `fitur/ml-training-model-ayam`, `fix/be-endpoint-azure-error`

### 2. Format Penamaan Commit
Gunakan *Conventional Commits*: `tipe(scope): deskripsi pekerjaan`
- **Contoh:** `feat(fe): membuat UI halaman dashboard dan integrasi status warna`
- **Contoh:** `feat(ml): export model ARIMA untuk harga cabai merah ke .pkl`
- **Contoh:** `fix(data): membersihkan missing values pada tanggal merah`

### 3. Golden Rules
- **Dilarang keras *Push* langsung ke branch `main`!** Gunakan Pull Request (PR).
- Selalu jalankan `git pull origin main` sebelum melakukan *push*.
- Lakukan *commit* berkala untuk setiap fungsionalitas kecil yang selesai.

---

## ⚙️ Cara Menjalankan Secara Lokal
1. Prasyarat
Node.js (v16+) & npm/yarn

Python 3.9+ (untuk environment ML)

2. Menjalankan Backend & Frontend
# Terminal 1: Backend Node.js
cd backend
npm install
npm start

# Terminal 2: Frontend React.js
cd frontend
npm install
npm start

3. Menjalankan Environment ML
cd machine-learning
pip install -r requirements.txt
# Buka dan jalankan Jupyter Notebook di dalam folder notebooks/

---

## 📂 Struktur Direktori Utama

```text
DapurDana/
├── .github/                   # CI/CD Workflows (Azure Deployment)
├── backend/                   # Node.js + Express (API Gateway & Business Logic)
│   ├── config/                # Konfigurasi Database & Azure API Keys
│   ├── controllers/           # Logika pemrosesan (Logic IF/ELSE untuk rekomendasi)
│   ├── routes/                # Endpoint API
│   ├── .env.example           # Template environment variables
│   ├── package.json
│   └── server.js
├── frontend/                  # React.js + Tailwind CSS (UI/UX)
│   ├── public/
│   ├── src/
│   │   ├── components/        # UI Reusable (Card, Status Indicator)
│   │   ├── pages/             # Onboarding, Dashboard
│   │   ├── services/          # API Caller ke Backend
│   │   └── App.js
│   ├── tailwind.config.js
│   └── package.json
├── machine-learning/          # Pipeline ML (Haikal's Workspace)
│   ├── datasets/              # Data mentah (Chili & Chicken CSV)
│   │   ├── raw/
│   │   └── processed/
│   ├── notebooks/             # Jupyter Notebooks (EDA & Training)
│   ├── models/                # Exported models (.pkl, .h5, atau .onnx)
│   └── requirements.txt
├── infrastructure/            # Azure Setup Scripts (Dicky's Workspace)
│   ├── azure-pipelines.yml    # Konfigurasi deployment
│   └── resource-group.txt     # Dokumentasi setup resource
├── docs/                      # Dokumentasi Proyek
│   ├── proposal/              # File Word/PDF Proposal Bisnis
│   ├── pitch-deck/            # PowerPoint/PDF Presentasi
│   └── api-spec.md            # Dokumentasi Endpoint
└── README.md

