'use client';

import { useState } from 'react';
import { getDeliveredSeries } from '@/lib/benefitTracking';

const WIDTH = 640;
const HEIGHT = 260;
const PAD = { top: 20, right: 56, bottom: 28, left: 36 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const MAX_Y = 12;
const Y_TICKS = [0, 2, 4, 6, 8, 10, 12];

export default function DeliveredChart() {
  const data = getDeliveredSeries();
  const [hoverIndex, setHoverIndex] = useState(null);

  const xFor = (i) => PAD.left + (i / (data.length - 1)) * PLOT_W;
  const yFor = (v) => PAD.top + PLOT_H - (v / MAX_Y) * PLOT_H;

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
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-gray-400" /> Hoshin Lisboa
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-green-600" /> Delivered
        </span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {Y_TICKS.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yFor(tick)} y2={yFor(tick)} stroke="#e1e0d9" strokeWidth={1} />
            <text x={PAD.left - 6} y={yFor(tick) + 3} textAnchor="end" className="fill-gray-400" style={{ fontSize: 10 }}>
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
        <path d={deliveredPath} fill="none" stroke="#0ca30c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={xFor(data.length - 1)} cy={yFor(lastHoshin.hoshin)} r={4} fill="#9ca3af" stroke="#fff" strokeWidth={2} />
        <text x={xFor(data.length - 1) + 8} y={yFor(lastHoshin.hoshin) + 4} className="fill-gray-500" style={{ fontSize: 11 }}>
          {lastHoshin.hoshin.toFixed(2)}M
        </text>

        {lastDelivered && (
          <>
            <circle
              cx={xFor(data.indexOf(lastDelivered))}
              cy={yFor(lastDelivered.delivered)}
              r={4}
              fill="#0ca30c"
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={xFor(data.indexOf(lastDelivered)) + 8}
              y={yFor(lastDelivered.delivered) + 4}
              className="fill-green-700"
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
            className="fill-gray-400"
            style={{ fontSize: 10 }}
          >
            {d.month}
          </text>
        ))}

        {hovered && (
          <g transform={`translate(${Math.min(xFor(hoverIndex) + 10, WIDTH - 130)}, ${PAD.top + 4})`}>
            <rect width={120} height={hovered.delivered != null ? 48 : 30} rx={6} fill="white" stroke="#e1e0d9" />
            <text x={8} y={14} className="fill-gray-500" style={{ fontSize: 10 }}>
              {hovered.month} 2026
            </text>
            <text x={8} y={hovered.delivered != null ? 28 : 24} className="fill-gray-700" style={{ fontSize: 11 }}>
              Hoshin: {hovered.hoshin.toFixed(2)}M €
            </text>
            {hovered.delivered != null && (
              <text x={8} y={42} className="fill-green-700" style={{ fontSize: 11, fontWeight: 600 }}>
                Delivered: {hovered.delivered.toFixed(2)}M €
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
