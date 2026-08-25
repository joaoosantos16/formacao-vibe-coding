'use client';

import { useMemo, useState } from 'react';
import { getProductivityTopFree } from '@/lib/benefitTracking';

export default function OccupationRanking() {
  const rows = getProductivityTopFree();
  const [direction, setDirection] = useState('asc');

  const sorted = useMemo(() => {
    const factor = direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => (a.occPct - b.occPct) * factor);
  }, [rows, direction]);

  const maxOcc = Math.max(...rows.map((r) => r.occPct));

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500">Occupation by project</p>
        <button
          type="button"
          onClick={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
          className="text-xs font-medium text-slate-600 hover:text-slate-800"
        >
          Sort: {direction === 'asc' ? 'lowest first' : 'highest first'}
        </button>
      </div>
      <div className="space-y-2.5">
        {sorted.map((row) => (
          <div key={row.project}>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span className="font-medium text-slate-700">{row.project}</span>
              <span>{row.occPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${row.occPct < 50 ? 'bg-red-400' : row.occPct < 75 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                style={{ width: `${(row.occPct / maxOcc) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
