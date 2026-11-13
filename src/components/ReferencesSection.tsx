import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { AnalogSite, TargetBody } from '../types/analog';

interface ReferencesSectionProps {
  sites: AnalogSite[];
  onJumpToSite: (site: AnalogSite) => void;
}

export function ReferencesSection({ sites, onJumpToSite }: ReferencesSectionProps) {
  const [filterBody, setFilterBody] = useState<'all' | TargetBody>('all');

  const flattenedRefs = sites.flatMap((site) =>
    site.references.map((ref) => ({
      ...ref,
      site,
    }))
  );

  const visibleRefs =
    filterBody === 'all'
      ? flattenedRefs
      : flattenedRefs.filter((item) => item.site.targetBody === filterBody);

  return (
    <section
      id="rujukan"
      aria-labelledby="references-heading"
      className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 pb-16"
    >
      <div className="border-t border-slate-800/80 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-400">
              Verifikasi Ilmiah &amp; Sumber Primer
            </p>
            <h2
              id="references-heading"
              className="mt-1.5 font-display text-xl font-bold text-slate-50 sm:text-2xl text-balance"
            >
              Arsip Data Rujukan yang Dapat Diklik Langsung
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Seluruh pasangan lokasi analog pada peta dilengkapi dokumen resmi NASA, USGS
              Astrogeology, ESA PANGAEA, dan Lunar and Planetary Institute (LPI) sebagai bukti.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter rujukan berdasarkan planet"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 p-1 shrink-0"
          >
            {(
              [
                { id: 'all', label: 'Semua' },
                { id: 'moon', label: 'Basis Bulan' },
                { id: 'mars', label: 'Lokasi Mars' },
              ] as { id: 'all' | TargetBody; label: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilterBody(opt.id)}
                className={`min-h-[36px] rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  filterBody === opt.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleRefs.map((entry) => {
            const isMoon = entry.site.targetBody === 'moon';
            return (
              <article
                key={entry.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0D1320]/75 p-5 backdrop-blur-sm transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span>
                      {isMoon ? 'Analog Bulan' : 'Analog Mars'} · {entry.year}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {entry.documentCode}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-slate-100">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-400">{entry.institution}</p>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                    {entry.findingSummary}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                  <button
                    type="button"
                    onClick={() => onJumpToSite(entry.site)}
                    className="text-xs font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline cursor-pointer text-left"
                  >
                    Tampilkan {entry.site.earthName.split('(')[0].trim()}
                  </button>

                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                      isMoon
                        ? 'border-sky-500/30 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20'
                    }`}
                  >
                    <span>Buka Bukti</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
