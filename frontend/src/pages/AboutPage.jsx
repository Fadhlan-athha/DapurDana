const TEAM = [
  {
    name: 'R. Haikal Rizki Tri Hartanto',
    role: 'Machine Learning Engineer',
    desc: 'Merancang algoritma, melatih (training), mengevaluasi model XGBoost Regressor dan narasi bisnis berbasis data.',
    emoji: '🤖',
  },
  {
    name: 'Muhammad Dicky Kurniawan',
    role: 'Data & Cloud Architect',
    desc: 'Data acquisition, API sourcing, dan desain arsitektur Azure.',
    emoji: '☁️',
  },
  {
    name: 'Fadhlan Athhariansyah',
    role: 'Frontend & Backend Lead',
    desc: 'Dashboard React, integrasi API, backend Express, dan pitch deck.',
    emoji: '💻',
  },
]

const STACK = [
  { icon: '⚛️',  name: 'React + Vite',     desc: 'Frontend SPA cepat dengan hot-module reload.' },
  { icon: '🟢',  name: 'Node.js + Express', desc: 'REST API backend dengan prediksi margin.' },
  { icon: '🧠',  name: 'XGBoost',           desc: 'Model ML lokal untuk prediksi 7 harga komoditas.' },
  { icon: '☁️',  name: 'Azure Cloud',        desc: 'Target deployment App Service & Azure ML.' },
]

function AboutPage() {
  return (
    <div className="page-wrapper about-page">
      {/* Hero */}
      <section className="about-hero" aria-label="Tentang DapurDana">
        <div className="about-hero-content">
          <p className="eyebrow">Tentang Kami</p>
          <h1 className="about-title">
            Early Warning System untuk UMKM F&B Indonesia 🍳
          </h1>
          <p className="about-desc">
            DapurDana adalah dashboard berbasis AI yang membantu pemilik warung dan UMKM F&B
            membaca risiko fluktuasi harga bahan baku — sebelum margin kas mereka tertekan.
            MVP ini menggabungkan prediksi harga komoditas, kalkulator margin/runway, dan
            rekomendasi taktis seperti restock lebih awal atau penyesuaian porsi.
          </p>
        </div>
      </section>

      {/* Komoditas yang dipantau */}
      <section aria-label="Komoditas yang dipantau">
        <div className="section-header">
          <p className="eyebrow">Fokus MVP</p>
          <h2 className="section-title">7 Komoditas Strategis yang Dipantau</h2>
        </div>
        <div className="metric-grid" style={{ marginTop: 16 }}>
          {[
            { icon: '🌶️', name: 'Cabai Merah',    desc: 'Volatile — prioritas pemantauan harian' },
            { icon: '🍗', name: 'Daging Ayam',    desc: 'Komponen terbesar HPP UMKM F&B' },
            { icon: '🍚', name: 'Beras Premium',  desc: 'Bahan pokok dengan elastisitas harga rendah' },
            { icon: '🌾', name: 'Beras Medium',   desc: 'Pilihan hemat untuk warung makan' },
            { icon: '🛢️', name: 'Minyak Kemasan', desc: 'Penting untuk gorengan & masakan' },
            { icon: '💧', name: 'Minyak Curah',   desc: 'Sangat sensitif terhadap kebijakan CPO' },
            { icon: '🍞', name: 'Tepung Kemasan', desc: 'Komponen dasar aneka jajanan' },
          ].map((item) => (
            <article key={item.name} className="metric-card">
              <div className="metric-icon" aria-hidden="true">{item.icon}</div>
              <p className="metric-label">{item.name}</p>
              <span className="metric-detail">{item.desc}</span>
            </article>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section aria-label="Tech stack" style={{ marginTop: 32 }}>
        <div className="section-header">
          <p className="eyebrow">Teknologi</p>
          <h2 className="section-title">Tech Stack</h2>
        </div>
        <div className="stack-grid">
          {STACK.map((s) => (
            <div key={s.name} className="stack-card">
              <div className="stack-icon" aria-hidden="true">{s.icon}</div>
              <div>
                <p className="stack-name">{s.name}</p>
                <p className="stack-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tim */}
      <section aria-label="Tim DapurDana" style={{ marginTop: 32 }}>
        <div className="section-header">
          <p className="eyebrow">Tim</p>
          <h2 className="section-title">Di Balik DapurDana</h2>
        </div>
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <article
              key={member.name}
              className="team-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="team-avatar" aria-hidden="true">{member.emoji}</div>
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
              <p className="team-desc">{member.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage
