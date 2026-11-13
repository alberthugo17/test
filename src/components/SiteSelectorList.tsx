import { Search } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/analogSites';
import type { AnalogSite, GeologyCategory, TargetBody } from '../types/analog';
import { computeSimilarityScore } from '../utils/geology';

interface SiteSelectorListProps {
  sites: AnalogSite[];
  selectedSiteId: string;
  targetBody: TargetBody;
  activeCategory: GeologyCategory | 'all';
  searchQuery: string;
  availableCategories: (GeologyCategory | 'all')[];
  onSelectCategory: (cat: GeologyCategory | 'all') => void;
  onSearchChange: (q: string) => void;
  onSelectSite: (site: AnalogSite) => void;
}

export function SiteSelectorList({
  sites,
  selectedSiteId,
  targetBody,
  activeCategory,
  searchQuery,
  availableCategories,
  onSelectCategory,
  onSearchChange,
  onSelectSite,
}: SiteSelectorListProps) {
  const isMoon = targetBody === 'moon';

  return (
    <aside className="flex flex-col lg:h-[580px] rounded-xl border border-slate-800/90 bg-[#0D1320]/80 backdrop-blur-md">
      <div className="border-b border-slate-800/80 p-4 shrink-0">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-display text-base font-semibold text-slate-100">
            {isMoon ? 'Lokasi Analog Basis Bulan' : 'Lokasi Analog Eksplorasi Mars'}
          </h2>
          <span className="font-mono text-xs tabular-nums text-slate-400">
            {sites.length} lokasi
          </span>
        </div>

        {/* Search input */}
        <div className="relative mt-3">
          <label htmlFor="analog-search" className="sr-only">
            Cari lokasi analog geologi atau mineral
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="analog-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari lokasi, mineral, atau kawah..."
            className="w-full min-h-[42px] rounded-lg border border-slate-700/80 bg-[#070A12] py-2 pr-3 pl-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
          />
        </div>

        {/* Category filter buttons */}
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter kategori geologi">
          {availableCategories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`min-h-[34px] rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  active
                    ? isMoon
                      ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40'
                      : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Site List */}
      <div className="max-h-[360px] lg:max-h-none lg:flex-1 overflow-y-auto p-3 space-y-2">
        {sites.length === 0 ? (
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-6 text-center">
            <p className="text-sm font-medium text-slate-300">
              Tidak ada lokasi yang sesuai filter.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
              }}
              className="mt-3 inline-flex min-h-[38px] items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          sites.map((site) => {
            const selected = site.id === selectedSiteId;
            const score = computeSimilarityScore(site.similarityAxes);
            return (
              <button
                key={site.id}
                type="button"
                onClick={() => onSelectSite(site)}
                aria-pressed={selected}
                className={`w-full min-h-[44px] rounded-lg border p-3 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  selected
                    ? isMoon
                      ? 'border-sky-400/60 bg-sky-500/10'
                      : 'border-amber-400/60 bg-amber-500/10'
                    : 'border-slate-800/90 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-100 leading-snug">
                    {site.earthName}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold tabular-nums shrink-0 ${
                      isMoon ? 'text-sky-300' : 'text-amber-300'
                    }`}
                  >
                    {score.toFixed(1)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {site.country} <span aria-hidden="true">·</span> {site.categoryLabel}
                </p>
                <p className="mt-1.5 text-xs text-slate-300">
                  <span className="text-slate-400">Target:</span> {site.targetSiteName}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
