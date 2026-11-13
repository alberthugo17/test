import type { OxideReading, TargetBody } from '../types/analog';

interface OxideChartProps {
  oxides: OxideReading[];
  targetBody: TargetBody;
  earthLabel: string;
  targetLabel: string;
}

export function OxideChart({
  oxides,
  targetBody,
  earthLabel,
  targetLabel,
}: OxideChartProps) {
  const isMoon = targetBody === 'moon';
  const maxVal = Math.max(
    65,
    ...oxides.flatMap((o) => [o.earthWtPercent, o.targetWtPercent])
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 text-slate-200">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-400/90" aria-hidden="true" />
            <span>Bumi ({earthLabel})</span>
          </span>
          <span className="inline-flex items-center gap-2 text-slate-200">
            <span
              className={`h-2.5 w-2.5 rounded-xs ${
                isMoon ? 'bg-sky-400' : 'bg-amber-400'
              }`}
              aria-hidden="true"
            />
            <span>
              {isMoon ? 'Bulan' : 'Mars'} ({targetLabel})
            </span>
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">satuan: % berat (wt%)</span>
      </div>

      <div className="space-y-2.5">
        {oxides.map((row) => {
          const earthWidth = Math.min(100, (row.earthWtPercent / maxVal) * 100);
          const targetWidth = Math.min(100, (row.targetWtPercent / maxVal) * 100);
          return (
            <div key={row.formula} className="space-y-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium text-slate-200">
                  {row.oxide}{' '}
                  <span className="font-mono text-[11px] text-slate-400">({row.formula})</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-slate-300">
                  {row.earthWtPercent.toFixed(1)}% vs {row.targetWtPercent.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/90">
                  <div
                    className="h-full rounded-full bg-emerald-400/85 transition-all duration-300"
                    style={{ width: `${earthWidth}%` }}
                  />
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/90">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isMoon ? 'bg-sky-400/90' : 'bg-amber-400/90'
                    }`}
                    style={{ width: `${targetWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
