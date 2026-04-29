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
   - Jangan membuang waktu untuk animasi atau UI yang terlalu kompleks. Fokus pada fungsionalitas fungsional (Status Merah/Kuning/Hijau).
2. **Komunikasi Cepat & Transparan:**
   - Setiap *bottleneck* (error *training*, API gagal *fetch*, atau masalah *deployment*) harus dilaporkan maksimal dalam 30 menit agar bisa di-*debug* bersama.
3. **Git & Version Control Discipline:**
   - Gunakan `.gitignore` secara ketat. **Dilarang keras** melakukan *commit/push* untuk folder `node_modules/`, *virtual environment* Python, atau file dataset mentah/model berukuran raksasa.
   - Usahakan bekerja di *branch* masing-masing jika memungkinkan (misal: `feat/ml-model`, `feat/ui-dashboard`) untuk mencegah *merge conflict* yang menghabiskan waktu.
4. **Hard Deadline Harian:**
   - Sore: Data bersih (Dicky) & Mockup UI siap (Fadhlan).
   - Malam: Model ML selesai dilatih (Haikal) & Azure siap menampung (Dicky).
   - Besok Pagi: API Endpoint *live* & terhubung sempurna ke aplikasi Node/React (Fadhlan).

---

## ⚙️ Cara Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js (v16+) & Python 3.9+

### 2. Setup Backend & Frontend
-bash-
#Terminal 1: Backend Node.js
cd backend
npm install && npm start

#Terminal 2: Frontend React.js
cd frontend
npm install && npm start


## Struktur Direktori
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

---

## 🌿 Panduan Git & Kolaborasi (Branch & Commit Rules)

Untuk menjaga repositori tetap rapi dan mencegah konflik kode antar anggota tim, kita menggunakan standar penamaan *Branch* dan *Commit* berikut:

### 1. Format Penamaan Branch
Gunakan format: `tipe/scope-deskripsi-singkat` (Gunakan huruf kecil dan pisahkan kata dengan strip `-`).

**Tipe Branch:**
- `fitur/` : Untuk menambahkan fitur atau halaman baru.
- `fix/` : Untuk memperbaiki *bug* atau *error*.
- `docs/` : Untuk pembaruan dokumen (README, Proposal, dll).
- `chore/` : Untuk urusan konfigurasi, instalasi *library*, atau *setup infrastructure*.

**Scope (Ruang Lingkup):**
- `fe` (Frontend / Fadhlan)
- `be` (Backend / Fadhlan)
- `ml` (Machine Learning / Haikal)
- `cloud` atau `data` (Infrastruktur & Data / Dicky)

**Contoh Penamaan Branch:**
- `fitur/fe-menambahkan-header`
- `fitur/ml-training-model-ayam`
- `fix/be-endpoint-azure-error`
- `chore/cloud-setup-resource-group`

### 2. Format Penamaan Commit
Saat melakukan *commit*, berikan pesan yang jelas agar anggota lain tahu apa yang diubah tanpa harus membaca kodenya. Gunakan format *Conventional Commits*: 
`tipe(scope): deskripsi pekerjaan`

**Contoh Pesan Commit:**
- `feat(fe): membuat UI halaman dashboard dan integrasi status warna`
- `feat(ml): export model ARIMA untuk harga cabai merah ke .pkl`
- `fix(data): membersihkan missing values pada tanggal merah`
- `docs(readme): update struktur direktori dan cara instalasi`

### 3. Golden Rules Kolaborasi GitHub
1. **Jangan pernah *Push* langsung ke branch `main`!** Selalu buat *branch* baru dari tugas Anda, lalu buat *Pull Request* (PR).
2. **Pull sebelum Push:** Selalu jalankan `git pull origin main` di *branch* Anda sebelum melakukan *push* agar kode Anda selalu *up-to-date* dengan pekerjaan teman yang lain.
3. **Commit Berkala:** Jangan menumpuk pekerjaan seharian baru di-*commit*. Lakukan *commit* setiap kali satu fitur kecil selesai (misal: selesai bikin tombol, langsung commit).


