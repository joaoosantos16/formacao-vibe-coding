'use client';

import { useMemo, useState } from 'react';
import { getConsultants } from '@/lib/benefitTracking';

const COLUMNS = [
  { key: 'consultant', label: 'Consultant', type: 'text' },
  { key: 'level', label: 'Level', type: 'text' },
  { key: 'occPct', label: '% Occupation', type: 'number' },
  { key: 'fridayUtilPct', label: '% Friday Utilization', type: 'number' },
];

export default function ConsultantTable({ level }) {
  const rows = getConsultants();
  const [sort, setSort] = useState({ key: 'occPct', direction: 'desc' });

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  }

  const filtered = useMemo(() => (level === 'all' ? rows : rows.filter((r) => r.level === level)), [rows, level]);

  const sorted = useMemo(() => {
    const column = COLUMNS.find((c) => c.key === sort.key);
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      if (column.type === 'number') return (va - vb) * factor;
      return String(va).localeCompare(String(vb)) * factor;
    });
  }, [filtered, sort]);

  return (
    <div className="overflow-x-auto rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5">
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
            <tr key={row.consultant}>
              <td className="px-4 py-2 font-medium text-slate-800 whitespace-nowrap">{row.consultant}</td>
              <td className="px-4 py-2 text-slate-600 whitespace-nowrap">{row.level}</td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-600 whitespace-nowrap">{row.occPct}%</td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-600 whitespace-nowrap">{row.fridayUtilPct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
