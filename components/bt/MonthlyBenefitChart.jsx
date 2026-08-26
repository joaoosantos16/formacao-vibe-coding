'use client';

// Beneficio mensal logrado (barras) vs plano (linha) — SVG puro, sem
// dependências, ao estilo do motor de referência (barPlanChart).
function niceMax(v) {
  if (!Number.isFinite(v) || v <= 0) return 1;
  const e = 10 ** Math.floor(Math.log10(v));
  const m = v / e;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e;
}
function axisEur(v, mx) {
  const a = Math.abs(mx);
  if (a >= 1e6) return `${(v / 1e6).toFixed(1)} M€`;
  if (a >= 1e4) return `${Math.round(v / 1e3)} k€`;
  return `${Math.round(v)} €`;
}

export default function MonthlyBenefitChart({ months, byMonth, byMonthPlan }) {
  const N = months.length;
  if (!N) return <p className="p-6 text-sm text-slate-400">No months to show.</p>;

  const W = Math.max(720, N * 40);
  const H = 240;
  const L = 52;
  const R = 12;
  const T = 16;
  const B = 32;
  const vals = months.map((m) => byMonth[m.key] || 0).concat(months.map((m) => byMonthPlan[m.key] || 0));
  const mx = niceMax(Math.max(1, ...vals.map(Math.abs)));
  const x = (i) => L + ((W - L - R) * (i + 0.5)) / N;
  const y = (v) => T + (H - T - B) * (1 - v / mx);
  const barW = Math.min(24, ((W - L - R) / N) * 0.55);

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const v = (mx * i) / 4;
    const yy = y(v);
    return (
      <g key={i}>
        <line x1={L} y1={yy} x2={W - R} y2={yy} stroke="#EEF1F0" />
        <text x={L - 8} y={yy + 3.5} fontSize="9.5" fill="#6B6B7A" textAnchor="end">{axisEur(v, mx)}</text>
      </g>
    );
  });

  const yearSeps = months.map((m, i) => (i > 0 && m.m === 1 ? (
    <g key={`sep-${m.key}`}>
      <line x1={x(i) - barW} y1={T} x2={x(i) - barW} y2={H - B} stroke="#D6E0DC" strokeDasharray="3 3" />
      <text x={x(i) - barW + 4} y={T + 10} fontSize="9.5" fill="#0E7A68" fontWeight="700">{m.y}</text>
    </g>
  ) : null));

  const bars = months.map((m, i) => {
    const v = byMonth[m.key] || 0;
    if (!v) return null;
    const yTop = y(Math.max(0, v));
    const h = Math.max(1, Math.abs(y(0) - y(v)));
    return (
      <rect
        key={m.key}
        x={x(i) - barW / 2}
        y={yTop}
        width={barW}
        height={h}
        rx={3}
        fill={v >= (byMonthPlan[m.key] || 0) ? '#10B981' : '#F59E0B'}
      />
    );
  });

  const planPoints = months.map((m, i) => `${x(i)},${y(byMonthPlan[m.key] || 0)}`).join(' ');

  const labels = months.map((m, i) => (
    (N <= 14 || i % 2 === 0) ? (
      <text key={m.key} x={x(i)} y={H - 16} fontSize="9" fill={byMonth[m.key] ? '#334155' : '#BDBDBD'} textAnchor="middle">
        {m.label}
      </text>
    ) : null
  ));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3.5 rounded-sm bg-emerald-500" /> Actual ≥ plan</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3.5 rounded-sm bg-amber-500" /> Actual &lt; plan</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#00A3C2]" style={{ borderTop: '2px dashed #00A3C2' }} /> Plan</span>
      </div>
      {/* preserveAspectRatio="none" + altura fixa: o gráfico enche a
          largura do cartão (agora sem margens laterais) sem esticar
          verticalmente — sem isto, num cartão muito largo a altura
          crescia proporcionalmente e as barras/texto ficavam enormes. */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: H, minWidth: Math.min(W, 480) }}>
        {gridLines}
        {yearSeps}
        {bars}
        <polyline points={planPoints} fill="none" stroke="#00A3C2" strokeWidth="2" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
        <line x1={L} y1={y(0)} x2={W - R} y2={y(0)} stroke="#94A3B8" vectorEffect="non-scaling-stroke" />
        {labels}
      </svg>
    </div>
  );
}
