'use client';

import { useState } from 'react';
import { getDeliveredSeries } from '@/lib/benefitTracking';

const WIDTH = 900;
const HEIGHT = 400;
const PAD = { top: 32, right: 96, bottom: 44, left: 64 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const RED = '#dc2626';
const GREEN = '#059669';

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

  // Delivered is drawn as one segment per pair of points, colored by
  // whether it's below (red) or above (green) Hoshin at that point — not
  // a single fixed color for the whole line.
  const deliveredSegments = deliveredPoints.slice(1).map((point, idx) => {
    const prev = deliveredPoints[idx];
    return {
      key: point.month,
      d: `M ${xFor(data.indexOf(prev))} ${yFor(prev.delivered)} L ${xFor(data.indexOf(point))} ${yFor(point.delivered)}`,
      color: point.delivered < point.hoshin ? RED : GREEN,
    };
  });

  const lastHoshin = data[data.length - 1];
  const lastDelivered = deliveredPoints[deliveredPoints.length - 1];
  const lastDeliveredColor = lastDelivered && lastDelivered.delivered < lastDelivered.hoshin ? RED : GREEN;

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const idx = Math.round(((mouseX - PAD.left) / PLOT_W) * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, idx)));
  }

  const hovered = hoverIndex != null ? data[hoverIndex] : null;

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-6">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-1 rounded-full bg-slate-400" /> Hoshin Lisbon
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-1 rounded-full bg-emerald-600" /> Delivered (above Hoshin)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-1 rounded-full bg-red-600" /> Delivered (below Hoshin)
        </span>
      </div>
      {/* preserveAspectRatio="none" + altura fixa: sem isto, num cartão a
          toda a largura (sem margens laterais) a altura do gráfico crescia
          proporcionalmente e linhas/texto ficavam enormes. */}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: HEIGHT * 0.7, maxHeight: 340 }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(tick)} y2={yFor(tick)} stroke="#e1e0d9" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <text x={PAD.left - 12} y={yFor(tick) + 5} textAnchor="end" className="fill-slate-500" style={{ fontSize: 17 }}>
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
            vectorEffect="non-scaling-stroke"
          />
        )}

        <path d={hoshinPath} fill="none" stroke="#9ca3af" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {deliveredSegments.map((seg) => (
          <path key={seg.key} d={seg.d} fill="none" stroke={seg.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        ))}

        <circle cx={xFor(data.length - 1)} cy={yFor(lastHoshin.hoshin)} r={5} fill="#9ca3af" stroke="#fff" strokeWidth={2.5} />
        <text x={xFor(data.length - 1) + 10} y={yFor(lastHoshin.hoshin) + 6} className="fill-slate-600" style={{ fontSize: 19, fontWeight: 600 }}>
          {lastHoshin.hoshin.toFixed(2)}M
        </text>

        {lastDelivered && (
          <>
            <circle
              cx={xFor(data.indexOf(lastDelivered))}
              cy={yFor(lastDelivered.delivered)}
              r={5}
              fill={lastDeliveredColor}
              stroke="#fff"
              strokeWidth={2.5}
            />
            <text
              x={xFor(data.indexOf(lastDelivered)) + 10}
              y={yFor(lastDelivered.delivered) + 6}
              fill={lastDeliveredColor}
              style={{ fontSize: 19, fontWeight: 700 }}
            >
              {lastDelivered.delivered.toFixed(2)}M
            </text>
          </>
        )}

        {data.map((d, i) => (
          <text
            key={d.month}
            x={xFor(i)}
            y={HEIGHT - PAD.bottom + 26}
            textAnchor="middle"
            className="fill-slate-500"
            style={{ fontSize: 16 }}
          >
            {d.month}
          </text>
        ))}

        {hovered && (
          <g transform={`translate(${Math.min(xFor(hoverIndex) + 14, WIDTH - 190)}, ${PAD.top + 6})`}>
            <rect width={176} height={hovered.delivered != null ? 68 : 42} rx={8} fill="white" stroke="#e1e0d9" />
            <text x={12} y={20} className="fill-slate-500" style={{ fontSize: 15 }}>
              {hovered.month} 2026
            </text>
            <text x={12} y={hovered.delivered != null ? 40 : 34} className="fill-slate-600" style={{ fontSize: 16 }}>
              Hoshin: €{hovered.hoshin.toFixed(2)}M
            </text>
            {hovered.delivered != null && (
              <text x={12} y={60} fill={hovered.delivered < hovered.hoshin ? RED : GREEN} style={{ fontSize: 16, fontWeight: 600 }}>
                Delivered: €{hovered.delivered.toFixed(2)}M
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
