'use client';

import { useState } from 'react';
import { getProductivityTopFree, getProjectWeeklySeries, PROJECT_OVERVIEW_NOW_WEEK_INDEX } from '@/lib/benefitTracking';

const WIDTH = 700;
const HEIGHT = 280;
const PAD = { top: 24, right: 56, bottom: 32, left: 40 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const OCC_MAX = 100;

export default function ProjectOverviewChart() {
  const projects = getProductivityTopFree();
  const [projectCode, setProjectCode] = useState(projects[0].project);
  const [hoverIndex, setHoverIndex] = useState(null);

  const data = getProjectWeeklySeries(projectCode);
  const daysMax = Math.max(...data.map((d) => d.theoreticalGreenDays)) || 1;
  const niceDaysMax = Math.ceil(daysMax / 10) * 10;

  const xFor = (i) => PAD.left + (i / (data.length - 1)) * PLOT_W;
  const yForOcc = (v) => PAD.top + PLOT_H - (v / OCC_MAX) * PLOT_H;
  const yForDays = (v) => PAD.top + PLOT_H - (v / niceDaysMax) * PLOT_H;

  const pathFor = (key, yFn) =>
    data
      .map((d, i) => (d[key] == null ? null : `${data[i - 1]?.[key] == null && i > 0 ? 'M' : i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFn(d[key])}`))
      .filter(Boolean)
      .join(' ');

  const realPath = pathFor('real', yForOcc);
  const theoreticalPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yForDays(d.theoreticalGreenDays)}`).join(' ');
  const realGreenPath = pathFor('realGreenDays', yForDays);
  const forecastGreenPath = pathFor('forecastGreenDays', yForDays);

  const occTicks = [0, 25, 50, 75, 100];
  const daysTicks = Array.from({ length: 5 }, (_, i) => Math.round((niceDaysMax / 4) * i));

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <p className="text-xs font-medium text-slate-500">Project Overview</p>
        <select
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
          className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
        >
          {projects.map((p) => (
            <option key={p.project} value={p.project}>
              {p.project}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-2 flex-wrap">
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-red-500" /> Real occupation (left axis)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 border-t-2 border-dashed border-indigo-400" /> Theoretical green days available (right axis)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-indigo-600" /> Real green days available (right axis)</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-0.5 bg-emerald-600" /> Forecast green days available (right axis)</span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" onMouseMove={handleMove} onMouseLeave={() => setHoverIndex(null)}>
        {occTicks.map((tick) => (
          <g key={`occ-${tick}`}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yForOcc(tick)} y2={yForOcc(tick)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={PAD.left - 6} y={yForOcc(tick) + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 10 }}>
              {tick}%
            </text>
          </g>
        ))}
        {daysTicks.map((tick) => (
          <text key={`days-${tick}`} x={WIDTH - PAD.right + 8} y={yForDays(tick) + 3} className="fill-indigo-400" style={{ fontSize: 10 }}>
            {tick}d
          </text>
        ))}

        <line
          x1={xFor(PROJECT_OVERVIEW_NOW_WEEK_INDEX)}
          x2={xFor(PROJECT_OVERVIEW_NOW_WEEK_INDEX)}
          y1={PAD.top}
          y2={HEIGHT - PAD.bottom}
          stroke="#94a3b8"
          strokeWidth={1}
        />
        <text x={xFor(PROJECT_OVERVIEW_NOW_WEEK_INDEX) + 4} y={PAD.top + 10} className="fill-slate-500" style={{ fontSize: 10 }}>
          Now
        </text>

        {hovered && (
          <line x1={xFor(hoverIndex)} x2={xFor(hoverIndex)} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="#cbd5e1" strokeWidth={1} />
        )}

        <path d={theoreticalPath} fill="none" stroke="#a5b4fc" strokeWidth={2} strokeDasharray="4 3" strokeLinecap="round" />
        <path d={realGreenPath} fill="none" stroke="#4f46e5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={forecastGreenPath} fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={realPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => (
          <text key={d.week} x={xFor(i)} y={HEIGHT - PAD.bottom + 16} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
            {d.week}
          </text>
        ))}

        {hovered && (
          <g transform={`translate(${Math.min(xFor(hoverIndex) + 10, WIDTH - 170)}, ${PAD.top + 4})`}>
            <rect width={160} height={100} rx={6} fill="white" stroke="#e2e8f0" />
            <text x={8} y={14} className="fill-slate-500" style={{ fontSize: 10 }}>{hovered.week}</text>
            {hovered.real != null && (
              <text x={8} y={30} className="fill-red-600" style={{ fontSize: 11 }}>Real occupation: {hovered.real}%</text>
            )}
            <text x={8} y={48} className="fill-indigo-400" style={{ fontSize: 11 }}>Theoretical available: {hovered.theoreticalGreenDays}d</text>
            {hovered.realGreenDays != null && (
              <text x={8} y={64} className="fill-indigo-700" style={{ fontSize: 11, fontWeight: 600 }}>Real available: {hovered.realGreenDays}d</text>
            )}
            {hovered.forecastGreenDays != null && (
              <text x={8} y={80} className="fill-emerald-700" style={{ fontSize: 11, fontWeight: 600 }}>Forecast available: {hovered.forecastGreenDays}d</text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
