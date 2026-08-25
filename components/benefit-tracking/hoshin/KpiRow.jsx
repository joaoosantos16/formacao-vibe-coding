import { getHoshinKpis } from '@/lib/benefitTracking';

const TILES = [
  { key: 'deltaHoshinYTDPct', label: 'Δ Hoshin YTD', format: formatPct },
  { key: 'gapHoshinM', label: 'Gap Hoshin', format: formatGap },
  { key: 'deltaSamePeriodLYPct', label: 'Δ vs. Same Period LY', format: formatPct },
];

export default function KpiRow() {
  const kpis = getHoshinKpis();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {TILES.map(({ key, label, format }) => {
        const value = kpis[key];
        const negative = value < 0;
        return (
          <div key={key} className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-1 text-xl font-semibold ${negative ? 'text-red-600' : 'text-emerald-700'}`}>
              {format(value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function formatPct(value) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatGap(value) {
  return `${value > 0 ? '+' : ''}€${value.toFixed(2)}M`;
}
