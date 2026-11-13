import type { SimilarityAxes, TargetBody } from '../types/analog';

interface RadarChartProps {
  axes: SimilarityAxes;
  targetBody: TargetBody;
}

const AXIS_CONFIG: { key: keyof SimilarityAxes; label: string }[] = [
  { key: 'mineralogy', label: 'Mineralogi' },
  { key: 'geomorphology', label: 'Geomorfologi' },
  { key: 'regolithMechanics', label: 'Regolit' },
  { key: 'thermalAndIce', label: 'Termal & Es' },
  { key: 'isruPotential', label: 'Potensi ISRU' },
  { key: 'fieldAccessibility', label: 'Akses Uji' },
];

export function RadarChart({ axes, targetBody }: RadarChartProps) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 86;
  const levels = [25, 50, 75, 100];
  const isMoon = targetBody === 'moon';

  const angleForIndex = (index: number) =>
    (Math.PI * 2 * index) / AXIS_CONFIG.length - Math.PI / 2;

  const pointAt = (index: number, value: number) => {
    const angle = angleForIndex(index);
    const r = (value / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = AXIS_CONFIG.map((item, idx) => {
    const pt = pointAt(idx, axes[item.key]);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');

  const strokeColor = isMoon ? '#38BDF8' : '#F59E0B';
  const fillColor = isMoon ? 'rgba(56, 189, 248, 0.22)' : 'rgba(245, 158, 11, 0.22)';

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[280px] overflow-visible"
        role="img"
        aria-label="Grafik radar enam sumbu kemiripan geologi"
      >
        {/* Concentric reference rings */}
        {levels.map((level) => {
          const ringPoints = AXIS_CONFIG.map((_, idx) => {
            const pt = pointAt(idx, level);
            return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
          }).join(' ');
          return (
            <polygon
              key={level}
              points={ringPoints}
              fill="none"
              stroke="rgba(148, 163, 184, 0.18)"
              strokeWidth="1"
            />
          );
        })}

        {/* Radial axis spokes */}
        {AXIS_CONFIG.map((item, idx) => {
          const outer = pointAt(idx, 100);
          const labelPt = pointAt(idx, 126);
          const val = axes[item.key];
          return (
            <g key={item.key}>
              <line
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="1"
              />
              <text
                x={labelPt.x}
                y={labelPt.y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-300 text-[10.5px] font-medium"
              >
                {item.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 9}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-400 font-mono text-[10px] tabular-nums"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Vertex dots */}
        {AXIS_CONFIG.map((item, idx) => {
          const pt = pointAt(idx, axes[item.key]);
          return (
            <circle
              key={item.key}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill={strokeColor}
              stroke="#07090E"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
}
