import { Moon, Globe2, Orbit } from 'lucide-react';
import type { TargetBody } from '../types/analog';

interface HeroOverviewProps {
  targetBody: TargetBody;
  onSelectTargetBody: (body: TargetBody) => void;
  totalMoonSites: number;
  totalMarsSites: number;
  totalReferences: number;
}

export function HeroOverview({
  targetBody,
  onSelectTargetBody,
  totalMoonSites,
  totalMarsSites,
  totalReferences,
}: HeroOverviewProps) {
  const isMoon = targetBody === 'moon';

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-800/80 bg-[#07090E] pt-8 pb-8 sm:pt-10 sm:pb-10"
    >
      {/* Subtle atmospheric dark blur accent — low saturation, calibrated by target body */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-24 right-0 h-72 w-96 rounded-full blur-3xl transition-colors duration-300 ${
          isMoon ? 'bg-sky-500/10' : 'bg-amber-500/10'
        }`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-12 h-64 w-80 rounded-full bg-slate-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-wide text-slate-400">
              NASA Space Apps Challenge · Eksplorasi Geologi Planet &amp; Peta Analog Terbuka
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl lg:text-4xl text-balance leading-[1.18]">
              Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Analisis geologi interaktif membandingkan formasi batuan, mineralogi oksida, dan
              potensi sumber daya in-situ (ISRU) di Bumi terhadap lokasi kandidat basis permanen
              Bulan dan pendaratan Mars melalui peta Leaflet.js berbasis OpenStreetMap tanpa kunci API.
            </p>
          </div>

          {/* One-click Tab Switcher: Bumi vs Bulan <-> Bumi vs Mars */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-xs font-medium text-slate-400">
              Mode Perbandingan Geologi
            </span>
            <div
              role="tablist"
              aria-label="Pilih target perbandingan planet"
              className="inline-grid grid-cols-2 gap-1.5 rounded-xl border border-slate-800 bg-slate-900/85 p-1.5 backdrop-blur-md"
            >
              <button
                type="button"
                role="tab"
                id="tab-moon"
                aria-selected={isMoon}
                aria-controls="workspace-panel"
                onClick={() => onSelectTargetBody('moon')}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isMoon
                    ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 shadow-sm'
                    : 'text-slate-300 border border-transparent hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Bumi vs Bulan</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-mars"
                aria-selected={!isMoon}
                aria-controls="workspace-panel"
                onClick={() => onSelectTargetBody('mars')}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  !isMoon
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-sm'
                    : 'text-slate-300 border border-transparent hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Orbit className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Bumi vs Mars</span>
              </button>
            </div>
          </div>
        </div>

        {/* Clean unboxed quantitative strip (Zero-Pill discipline) */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-400">Analog Basis Bulan</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-slate-100">
              {totalMoonSites} <span className="text-xs font-normal text-slate-400">wilayah</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Analog Eksplorasi Mars</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-slate-100">
              {totalMarsSites} <span className="text-xs font-normal text-slate-400">wilayah</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Rujukan Terverifikasi</p>
            <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-slate-100">
              {totalReferences}{' '}
              <span className="text-xs font-normal text-slate-400">dokumen resmi</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Sumber Peta Dasar</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-200 whitespace-nowrap">
              <Globe2 className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>OpenStreetMap · Gratis</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
