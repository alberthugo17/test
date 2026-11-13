export function MethodologySection() {
  const weights = [
    {
      name: '01. Kesesuaian Mineralogi & Oksida',
      weight: '24%',
      detail:
        'Membandingkan fraksi berat oksida utama (SiO₂, Al₂O₃, FeO, MgO, CaO, TiO₂, SO₃) serta mineral penanda seperti anortosit, ilmenit, jarosit, dan hidromagnesit.',
    },
    {
      name: '02. Kesamaan Geomorfologi & Struktur',
      weight: '22%',
      detail:
        'Evaluasi rasio kedalaman-diameter kawah, struktur tabung lava, tepian delta kipas aluvial, dan morfologi poligon permafrost.',
    },
    {
      name: '03. Mekanika Regolit & Medan Uji',
      weight: '16%',
      detail:
        'Sifat kohesi, ukuran butir debu abrasif, dan kemiringan lereng untuk pengujian traksi rover berawak serta pengeboran inti.',
    },
    {
      name: '04. Profil Termal & Ketersediaan Es',
      weight: '16%',
      detail:
        'Keberadaan permafrost air dangkal atau terowongan stabil suhu sebagai model langsung bagi sistem pendukung kehidupan di Kutub Selatan Bulan dan Mars.',
    },
    {
      name: '05. Potensi Pemanfaatan Sumber Daya (ISRU)',
      weight: '14%',
      detail:
        'Kapasitas formasi batuan lokal untuk menghasilkan oksigen, air, propelan, maupun material konstruksi habitat (beton regolit/sintering).',
    },
    {
      name: '06. Aksesibilitas Kampanye Lapangan',
      weight: '8%',
      detail:
        'Kesiapan logistik untuk pelatihan astronot (seperti NASA Desert RATS, HMP, dan ESA PANGAEA) serta kalibrasi spektrometer jarak jauh.',
    },
  ];

  return (
    <section
      id="metodologi"
      aria-labelledby="methodology-heading"
      className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="border-t border-slate-800/80 pt-8">
        <div className="max-w-3xl">
          <p className="text-xs font-medium text-slate-400">
            Kerangka Kalibrasi Geologi Planet
          </p>
          <h2
            id="methodology-heading"
            className="mt-1.5 font-display text-xl font-bold text-slate-50 sm:text-2xl text-balance"
          >
            Metodologi Penilaian Lokasi Analog Bumi–Bulan–Mars
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Indeks kemiripan pada platform ini dihitung secara deterministik dari enam parameter
            geologi dan rekayasa misi yang dipadukan dengan selisih akar rata-rata kuadrat (RMSE)
            komposisi oksida batuan.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weights.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-slate-800/90 bg-[#0D1320]/70 p-5 backdrop-blur-sm"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-sm font-semibold text-slate-100">
                  {item.name}
                </h3>
                <span className="font-mono text-sm font-semibold tabular-nums text-slate-300 shrink-0">
                  {item.weight}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
