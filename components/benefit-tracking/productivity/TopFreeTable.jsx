'use client';

import { useMemo, useState } from 'react';
import { getProductivityTopFree } from '@/lib/benefitTracking';

const COLUMNS = [
  { key: 'project', label: 'Project', type: 'text' },
  { key: 'em', label: 'EM', type: 'text' },
  { key: 'occPct', label: 'Occ %', type: 'number' },
  { key: 'varK', label: 'Vari', type: 'number' },
  { key: 'varStatus', label: 'Var. Status', type: 'text' },
  { key: 'greenDays', label: '# Green Days', type: 'number' },
  { key: 'critical', label: 'Critical', type: 'text' },
  { key: 'continuidade', label: 'Continuity', type: 'text' },
];

const VAR_STATUS_STYLES = {
  OK: 'bg-emerald-50 text-emerald-700',
  NOK: 'bg-red-50 text-red-700',
};

export default function TopFreeTable() {
  const rows = getProductivityTopFree();
  const [sort, setSort] = useState({ key: 'occPct', direction: 'asc' });

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
      return String(va ?? '').localeCompare(String(vb ?? '')) * factor;
    });
  }, [rows, sort]);

  return (
    <div className="overflow-x-auto rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5">
      <div className="px-4 pt-3 text-xs font-medium text-slate-500">Top Free</div>
      <table className="min-w-full text-xs">
        <thead className="text-left text-slate-500">
          <tr>
            {COLUMNS.map((col) => {
              const active = sort.key === col.key;
              return (
                <th key={col.key} className="px-1.5 py-2 font-medium whitespace-nowrap">
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
              <td className="px-1.5 py-1.5 font-medium text-slate-800 whitespace-nowrap">{row.project}</td>
              <td className="px-1.5 py-1.5 text-slate-600 whitespace-nowrap">{row.em}</td>
              <td className="px-1.5 py-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">{row.occPct}%</td>
              <td className="px-1.5 py-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">€{row.varK.toFixed(1)}K</td>
              <td className="px-1.5 py-1.5 whitespace-nowrap">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${VAR_STATUS_STYLES[row.varStatus]}`}>
                  {row.varStatus}
                </span>
              </td>
              <td className="px-1.5 py-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">{row.greenDays}</td>
              <td className="px-1.5 py-1.5 whitespace-nowrap">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${row.critical ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'}`}>
                  {row.critical ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-1.5 py-1.5 text-slate-600 whitespace-nowrap">{row.continuidade ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
