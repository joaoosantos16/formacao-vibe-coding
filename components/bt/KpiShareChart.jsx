'use client';

import { formatEur, kpiColor } from '@/lib/benefitCalc';

// Reparto do benefício anualizado por KPI — donut SVG puro.
export default function KpiShareChart({ kpisWithCalc }) {
  const items = kpisWithCalc
    .map(({ kpi, calc }, i) => ({
      name: kpi.name,
      value: calc.annualized && calc.annualized > 0 ? calc.annualized : 0,
      color: kpiColor(i),
    }))
    .filter((it) => it.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = items.reduce((s, it) => s + it.value, 0);
  if (!total) {
    return (
      <p className="p-8 text-center text-sm text-slate-400">
        No annualized benefit yet — enter actual data in the capture tab for it to appear here.
      </p>
    );
  }

  const W = 520;
  const H = 260;
  const cx = 130;
  const cy = 128;
  const r = 96;
  const ri = 56;
  let a0 = -Math.PI / 2;
  const arcs = items.map((it) => {
    const a1 = a0 + 2 * Math.PI * (it.value / total);
    const big = a1 - a0 > Math.PI ? 1 : 0;
    const p1 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
    const p2 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    const q1 = [cx + ri * Math.cos(a1), cy + ri * Math.sin(a1)];
    const q2 = [cx + ri * Math.cos(a0), cy + ri * Math.sin(a0)];
    const d = `M${p1} A${r},${r} 0 ${big} 1 ${p2} L${q1} A${ri},${ri} 0 ${big} 0 ${q2} Z`;
    const el = <path key={it.name} d={d} fill={it.color} stroke="#FFFFFF" strokeWidth="1.5" />;
    a0 = a1;
    return el;
  });

  const legendX = cx + r + 30;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {arcs}
      <text x={cx} y={cy - 3} fontSize="19" fontWeight="700" fill="#16221F" textAnchor="middle">{formatEur(total)}</text>
      <text x={cx} y={cy + 16} fontSize="11" fill="#6B6B7A" textAnchor="middle">annualized</text>
      {items.slice(0, 8).map((it, i) => {
        const y = 30 + i * 27;
        return (
          <g key={it.name}>
            <rect x={legendX} y={y - 9} width={12} height={12} rx={3} fill={it.color} />
            <text x={legendX + 18} y={y} fontSize="12" fill="#333">
              {it.name.length > 26 ? `${it.name.slice(0, 25)}…` : it.name}
            </text>
            <text x={W - 10} y={y} fontSize="12" fill="#0E7A68" fontWeight="700" textAnchor="end">
              {Math.round((it.value / total) * 100)}%
            </text>
          </g>
        );
      })}
      {items.length > 8 && (
        <text x={legendX} y={30 + 8 * 27} fontSize="11" fill="#6B6B7A">+{items.length - 8} KPIs</text>
      )}
    </svg>
  );
}
