'use client';

import { useState } from 'react';
import { getDeliveredSeries } from '@/lib/benefitTracking';

const WIDTH = 640;
const HEIGHT = 260;
const PAD = { top: 20, right: 60, bottom: 28, left: 36 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

// Escala do eixo Y calculada a partir dos dados (nunca um número fixo) —
// assim o gráfico continua correto se o Hoshin anual mudar.
function computeYScale(data) {
  const values = data.flatMap((d) => [d.hoshin, d.delivered]).filter((v) => v != null);
  const rawMax = Math.max(...values);
  const step = rawMax <= 14 ? 2 : Math.ceil(rawMax / 7 / 2) * 2;
  const maxY = Math.ceil(rawMax / step) * step;
  const ticks = [];
  for (let t = 0; t <= maxY; t += step) ticks.push(t);
  return { maxY, ticks };
}

export default function DeliveredChart() {
  const data = getDeliveredSeries();
  const [hoverIndex, setHoverIndex] = useState(null);
  const { maxY, ticks: yTicks } = computeYScale(data);

  const xFor = (i) => PAD.left + (i / (data.length - 1)) * PLOT_W;
  const yFor = (v) => PAD.top + PLOT_H - (v / maxY) * PLOT_H;

  const hoshinPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.hoshin)}`).join(' ');
  const deliveredPoints = data.filter((d) => d.delivered != null);
  const deliveredPath = deliveredPoints
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(data.indexOf(d))} ${yFor(d.delivered)}`)
    .join(' ');

  const lastHoshin = data[data.length - 1];
  const lastDelivered = deliveredPoints[deliveredPoints.length - 1];

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const idx = Math.round(((mouseX - PAD.left) / PLOT_W) * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
  }

  const hovered = hoverIndex != null ? data[hoverIndex] : null;

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-5">
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-slate-400" /> Hoshin Lisboa
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-emerald-600" /> Delivered
        </span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(tick)} y2={yFor(tick)} stroke="#e1e0d9" strokeWidth={1} />
            <text x={PAD.left - 6} y={yFor(tick) + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10 }}>
              {tick}M
            </text>
          </g>
        ))}

        {hovered && (
          <line
            x1={xFor(hoverIndex)}
            x2={xFor(hoverIndex)}
            y1={PAD.top}
            y2={HEIGHT - PAD.bottom}
            stroke="#c3c2b7"
            strokeWidth={1}
          />
        )}

        <path d={hoshinPath} fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={deliveredPath} fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={xFor(data.length - 1)} cy={yFor(lastHoshin.hoshin)} r={4} fill="#9ca3af" stroke="#fff" strokeWidth={2} />
        <text x={xFor(data.length - 1) + 8} y={yFor(lastHoshin.hoshin) + 4} className="fill-slate-500" style={{ fontSize: 11 }}>
          {lastHoshin.hoshin.toFixed(2)}M
        </text>

        {lastDelivered && (
          <>
            <circle
              cx={xFor(data.indexOf(lastDelivered))}
              cy={yFor(lastDelivered.delivered)}
              r={4}
              fill="#059669"
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={xFor(data.indexOf(lastDelivered)) + 8}
              y={yFor(lastDelivered.delivered) + 4}
              className="fill-emerald-700"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {lastDelivered.delivered.toFixed(2)}M
            </text>
          </>
        )}

        {data.map((d, i) => (
          <text
            key={d.month}
            x={xFor(i)}
            y={HEIGHT - PAD.bottom + 16}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ fontSize: 10 }}
          >
            {d.month}
          </text>
        ))}

        {hovered && (
          <g transform={`translate(${Math.min(xFor(hoverIndex) + 10, WIDTH - 130)}, ${PAD.top + 4})`}>
            <rect width={120} height={hovered.delivered != null ? 48 : 30} rx={6} fill="white" stroke="#e1e0d9" />
            <text x={8} y={14} className="fill-slate-500" style={{ fontSize: 10 }}>
              {hovered.month} 2026
            </text>
            <text x={8} y={hovered.delivered != null ? 28 : 24} className="fill-slate-600" style={{ fontSize: 11 }}>
              Hoshin: {hovered.hoshin.toFixed(2)}M €
            </text>
            {hovered.delivered != null && (
              <text x={8} y={42} className="fill-emerald-700" style={{ fontSize: 11, fontWeight: 600 }}>
                Delivered: {hovered.delivered.toFixed(2)}M €
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
