import { getHoshinGauge, getHoshinKpis } from '@/lib/benefitTracking';

const CX = 120;
const CY = 120;
const R = 90;
const STROKE = 18;

export default function HoshinMeter() {
  const { targetM, deliveredM } = getHoshinGauge();
  const { deltaHoshinYTDPct } = getHoshinKpis();
  const ratio = Math.min(deliveredM / targetM, 1);

  const fillColor = deltaHoshinYTDPct >= 0 ? '#059669' : deltaHoshinYTDPct > -10 ? '#fab219' : '#d03b3b';

  return (
    <div className="flex flex-col items-center rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-4">
      <svg viewBox="0 0 240 140" className="w-full max-w-[240px]">
        <path d={describeArc(CX, CY, R, 0, 1)} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} strokeLinecap="round" />
        <path d={describeArc(CX, CY, R, 0, ratio)} fill="none" stroke={fillColor} strokeWidth={STROKE} strokeLinecap="round" />
        <text x={CX} y={CY - 18} textAnchor="middle" className="fill-slate-800" style={{ fontSize: 28, fontWeight: 600 }}>
          {deliveredM.toFixed(2)}M €
        </text>
        <text x={CX} y={CY + 4} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 12 }}>
          de {targetM.toFixed(2)}M € Hoshin
        </text>
      </svg>
    </div>
  );
}

function describeArc(cx, cy, r, tStart, tEnd) {
  const start = pointOnArc(cx, cy, r, tStart);
  const end = pointOnArc(cx, cy, r, tEnd);
  // t é a fração do semicírculo (0 a 1) — o arco nunca passa de 180°,
  // por isso a "large-arc-flag" do SVG é sempre 0 (senão desenha o arco maior).
  const largeArc = 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function pointOnArc(cx, cy, r, t) {
  const theta = Math.PI * (1 - t);
  return { x: cx + r * Math.cos(theta), y: cy - r * Math.sin(theta) };
}
