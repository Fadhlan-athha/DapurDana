require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint Test Dasar
app.get('/', (req, res) => {
    res.json({ message: "DapurDana Backend API Running Berhasil!" });
});

// Endpoint untuk dipanggil Frontend nanti (Integrasi Azure ML)
app.post('/api/predict', (req, res) => {
    // Nanti logika IF/ELSE rekomendasi ditaruh di sini
    res.json({ status: "Aman", komoditas: "Cabai Merah" });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});