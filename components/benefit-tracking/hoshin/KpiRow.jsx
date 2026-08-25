import { getHoshinKpis } from '@/lib/benefitTracking';

const TILES = [
  { key: 'deltaHoshinYTDPct', label: 'Δ Hoshin YTD', format: formatPct },
  { key: 'gapHoshinM', label: 'Gap Hoshin', format: formatGap },
  { key: 'deltaSamePeriodLYPct', label: 'Δ vs. Período Homólogo', format: formatPct },
];

export default function KpiRow() {
  const kpis = getHoshinKpis();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {TILES.map(({ key, label, format }) => {
        const value = kpis[key];
        const negative = value < 0;
        return (
          <div key={key} className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`mt-1 text-xl font-semibold flex items-center gap-1 ${negative ? 'text-red-600' : 'text-green-700'}`}>
              <span aria-hidden="true">{negative ? '▼' : '▲'}</span>
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
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}M €`;
}
