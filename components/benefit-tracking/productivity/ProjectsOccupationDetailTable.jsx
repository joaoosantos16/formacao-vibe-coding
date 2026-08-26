'use client';

import { useMemo, useState } from 'react';
import { getProductivityTopFree } from '@/lib/benefitTracking';

const COLUMNS = [
  { key: 'project', label: 'Project', type: 'text' },
  { key: 'em', label: 'EM', type: 'text' },
  { key: 'occPct', label: 'Occupation', type: 'number' },
  { key: 'greenDays', label: '# Green Days', type: 'number' },
];

export default function ProjectsOccupationDetailTable() {
  const rows = getProductivityTopFree();
  const [sort, setSort] = useState({ key: 'project', direction: 'asc' });

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  }

  const sorted = useMemo(() => {
    const column = COLUMNS.find((c) => c.key === sort.key);
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      if (column.type === 'number') return (va - vb) * factor;
      return String(va).localeCompare(String(vb)) * factor;
    });
  }, [rows, sort]);

  return (
    <div className="overflow-x-auto rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5">
      <div className="px-4 pt-3 text-xs font-medium text-slate-500">Projects — occupation detail</div>
      <table className="min-w-full text-sm">
        <thead className="text-left text-slate-500">
          <tr>
            {COLUMNS.map((col) => {
              const active = sort.key === col.key;
              return (
                <th key={col.key} className="px-4 py-3 font-medium whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`text-left ${active ? 'font-semibold text-slate-800' : 'hover:text-slate-700'}`}
                  >
                    {col.label}
                    {active && <span className="ml-1 text-xs text-slate-400">({sort.direction === 'asc' ? 'low–high' : 'high–low'})</span>}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((row) => (
            <tr key={row.project}>
              <td className="px-4 py-2 font-medium text-slate-800 whitespace-nowrap">{row.project}</td>
              <td className="px-4 py-2 text-slate-600 whitespace-nowrap">{row.em}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.occPct < 50 ? 'bg-red-400' : row.occPct < 75 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                      style={{ width: `${row.occPct}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-slate-600">{row.occPct}%</span>
                </div>
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-600 whitespace-nowrap">{row.greenDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
