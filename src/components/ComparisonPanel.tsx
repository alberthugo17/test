import { ArrowUpRight, Crosshair, ExternalLink } from 'lucide-react';
import type { AnalogSite } from '../types/analog';
import {
  computeOxideMatchPercentage,
  computeSimilarityScore,
  formatCoordinates,
} from '../utils/geology';
import { RadarChart } from './RadarChart';
import { OxideChart } from './OxideChart';

interface ComparisonPanelProps {
  site: AnalogSite;
  onFocusMap: () => void;
}

export function ComparisonPanel({ site, onFocusMap }: ComparisonPanelProps) {
  const isMoon = site.targetBody === 'moon';
  const similarityScore = computeSimilarityScore(site.similarityAxes);
  const oxideScore = computeOxideMatchPercentage(site.oxideComparison);

  return (
    <section
      id="perbandingan"
      aria-labelledby="comparison-heading"
      className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="rounded-2xl border border-slate-800/90 bg-[#0C121E]/85 backdrop-blur-md p-5 sm:p-7">
        {/* Header Row */}
        <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5 max-w-3xl">
            <p className="text-xs font-medium text-slate-400">
              Perbandingan Geologi Terperinci <span aria-hidden="true">·</span>{' '}
              {isMoon ? 'Bumi vs Basis Permanen Bulan' : 'Bumi vs Lokasi Eksplorasi Mars'}
            </p>
            <h2
              id="comparison-heading"
              className="font-display text-xl font-bold text-slate-50 sm:text-2xl text-balance"
            >
              {site.earthName} <span className="text-slate-400 font-normal">↔</span>{' '}
              <span className={isMoon ? 'text-sky-300' : 'text-amber-300'}>
                {site.targetSiteName}
              </span>
            </h2>
            <p className="text-sm text-slate-300">{site.missionContext}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0">
            <div>
              <p className="text-xs text-slate-400">Indeks Kemiripan</p>
              <p
                className={`font-mono text-2xl font-bold tabular-nums ${
                  isMoon ? 'text-sky-300' : 'text-amber-300'
                }`}
              >
                {similarityScore.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Kesesuaian Oksida</p>
              <p className="font-mono text-2xl font-bold tabular-nums text-emerald-300">
                {oxideScore.toFixed(1)}%
              </p>
            </div>
            <button
              type="button"
              onClick={onFocusMap}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/90 px-4 py-2 text-xs font-medium text-slate-100 whitespace-nowrap transition-colors hover:bg-slate-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Fokus di Peta</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Geological Comparison */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800/80 bg-[#080C15]/80 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-emerald-300">
                Formasi Geologi Bumi
              </h3>
              <span className="font-mono text-xs tabular-nums text-slate-400">
                {formatCoordinates(site.coordinates)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {site.country} <span aria-hidden="true">·</span> {site.regionLabel}{' '}
              <span aria-hidden="true">·</span> {site.categoryLabel}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {site.earthGeologySummary}
            </p>
            <div className="mt-4 border-t border-slate-800/80 pt-3">
              <p className="text-xs font-medium text-slate-400">Mineral &amp; Litologi Kunci</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                {site.keyMinerals.join(' · ')}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-[#080C15]/80 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3
                className={`font-display text-base font-semibold ${
                  isMoon ? 'text-sky-300' : 'text-amber-300'
                }`}
              >
                {isMoon ? 'Target Lokasi Basis Bulan' : 'Target Lokasi Mars'}
              </h3>
              <span className="font-mono text-xs tabular-nums text-slate-400">
                {site.targetCoordinates}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{site.targetRegion}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {site.targetGeologySummary}
            </p>
            <div className="mt-4 border-t border-slate-800/80 pt-3">
              <p className="text-xs font-medium text-slate-400">
                Potensi Pemanfaatan Sumber Daya Lokal (ISRU)
              </p>
              <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-slate-200">
                {site.isruApplications.map((app) => (
                  <li key={app} className="flex items-start gap-2">
                    <span className="text-slate-500" aria-hidden="true">
                      —
                    </span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quantitative Charts: Radar + Oxide Composition */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 rounded-xl border border-slate-800/80 bg-[#080C15]/80 p-5">
            <h3 className="font-display text-base font-semibold text-slate-100">
              Profil Kalibrasi Analog (6 Sumbu)
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Evaluasi kesesuaian geologi, mekanika regolit, dan uji misi lapangan.
            </p>
            <div className="mt-4 flex justify-center">
              <RadarChart axes={site.similarityAxes} targetBody={site.targetBody} />
            </div>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-slate-800/80 bg-[#080C15]/80 p-5">
            <h3 className="font-display text-base font-semibold text-slate-100">
              Perbandingan Komposisi Oksida Utama
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Data laboratorium geokimia Bumi dibandingkan pengukuran misi orbital/rover.
            </p>
            <div className="mt-4">
              <OxideChart
                oxides={site.oxideComparison}
                targetBody={site.targetBody}
                earthLabel={site.country.split(' ')[0]}
                targetLabel={site.targetSiteName.split(' ')[0]}
              />
            </div>
          </div>
        </div>

        {/* Environmental & Engineering Comparison Table */}
        <div className="mt-6 rounded-xl border border-slate-800/80 bg-[#080C15]/80 p-5">
          <h3 className="font-display text-base font-semibold text-slate-100">
            Matriks Parameter Lingkungan &amp; Rekayasa Basis
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 pr-4 font-medium">Parameter</th>
                  <th className="py-2.5 pr-4 font-medium">Kondisi di Bumi</th>
                  <th className="py-2.5 pr-4 font-medium">
                    Kondisi di {isMoon ? 'Bulan' : 'Mars'}
                  </th>
                  <th className="py-2.5 font-medium">Relevansi Uji Basis Permanen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {site.environmentalMetrics.map((metric) => (
                  <tr key={metric.parameter}>
                    <td className="py-3 pr-4 font-medium text-slate-100">{metric.parameter}</td>
                    <td className="py-3 pr-4 font-mono text-xs tabular-nums text-emerald-300">
                      {metric.earthValue}
                    </td>
                    <td
                      className={`py-3 pr-4 font-mono text-xs tabular-nums ${
                        isMoon ? 'text-sky-300' : 'text-amber-300'
                      }`}
                    >
                      {metric.targetValue}
                    </td>
                    <td className="py-3 text-slate-300">{metric.analogRelevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Immediate Clickable Evidence Links for Active Site */}
        <div className="mt-6 border-t border-slate-800/80 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-sm font-semibold text-slate-100">
              Bukti Data &amp; Rujukan Langsung Lokasi Ini
            </h3>
            <a
              href="#rujukan"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white hover:underline underline-offset-4"
            >
              <span>Lihat seluruh arsip rujukan</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {site.references.map((ref) => (
              <a
                key={ref.id}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-[#080C15]/90 p-4 transition-colors hover:border-slate-600 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="truncate">
                      {ref.institution} · {ref.year}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      {ref.documentCode}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-100 group-hover:text-white">
                    {ref.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    {ref.findingSummary}
                  </p>
                </div>
                <span
                  className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium ${
                    isMoon ? 'text-sky-300' : 'text-amber-300'
                  }`}
                >
                  <span>Buka Dokumen Rujukan Resmi</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
