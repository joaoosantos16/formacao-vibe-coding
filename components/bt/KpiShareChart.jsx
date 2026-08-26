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
        Sem benefício anualizado ainda — introduz dados reais no separador de captura para aparecer aqui.
      </p>
    );
  }

  const W = 360;
  const H = 220;
  const cx = 104;
  const cy = 108;
  const r = 78;
  const ri = 46;
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

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {arcs}
      <text x={cx} y={cy - 2} fontSize="15" fontWeight="700" fill="#16221F" textAnchor="middle">{formatEur(total)}</text>
      <text x={cx} y={cy + 13} fontSize="9" fill="#6B6B7A" textAnchor="middle">anualizado</text>
      {items.slice(0, 8).map((it, i) => {
        const y = 26 + i * 22;
        return (
          <g key={it.name}>
            <rect x={204} y={y - 8} width={10} height={10} rx={2} fill={it.color} />
            <text x={220} y={y} fontSize="9.5" fill="#333">
              {it.name.length > 20 ? `${it.name.slice(0, 19)}…` : it.name}
            </text>
            <text x={W - 8} y={y} fontSize="9.5" fill="#0E7A68" fontWeight="700" textAnchor="end">
              {Math.round((it.value / total) * 100)}%
            </text>
          </g>
        );
      })}
      {items.length > 8 && (
        <text x={220} y={26 + 8 * 22} fontSize="9" fill="#6B6B7A">+{items.length - 8} indicadores</text>
      )}
    </svg>
  );
}
