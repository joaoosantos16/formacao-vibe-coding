'use client';

import { useState } from 'react';

const WIDTH = 340;
const HEIGHT = 200;
const PAD = { top: 16, right: 16, bottom: 26, left: 34 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

// Generic single-series weekly trend line — used for both the global
// occupation average and the green days evolution charts.
export default function SimpleTrendChart({ title, data, unit, color }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const maxRaw = Math.max(...data.map((d) => d.value));
  const step = Math.ceil(maxRaw / 4 / 5) * 5 || 5;
  const maxY = step * 4;

  const xFor = (i) => PAD.left + (i / (data.length - 1)) * PLOT_W;
  const yFor = (v) => PAD.top + PLOT_H - (v / maxY) * PLOT_H;
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.value)}`).join(' ');
  const ticks = [0, step, step * 2, step * 3, step * 4];

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
      <p className="text-xs font-medium text-slate-500 mb-2">{title}</p>
      <div className="max-w-md">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(tick)} y2={yFor(tick)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={PAD.left - 6} y={yFor(tick) + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 9 }}>
              {tick}{unit}
            </text>
          </g>
        ))}

        {hovered && (
          <line x1={xFor(hoverIndex)} x2={xFor(hoverIndex)} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="#cbd5e1" strokeWidth={1} />
        )}

        <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

        {hovered && (
          <circle cx={xFor(hoverIndex)} cy={yFor(hovered.value)} r={4} fill={color} stroke="#fff" strokeWidth={2} />
        )}

        {data.map((d, i) =>
          i % 2 === 0 ? (
            <text key={d.week} x={xFor(i)} y={HEIGHT - PAD.bottom + 14} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9 }}>
              {d.week}
            </text>
          ) : null
        )}

        {hovered && (
          <text x={xFor(hoverIndex)} y={PAD.top - 4} textAnchor="middle" className="fill-slate-700" style={{ fontSize: 10, fontWeight: 600 }}>
            {hovered.week}: {hovered.value}{unit}
          </text>
        )}
      </svg>
      </div>
    </div>
  );
}
