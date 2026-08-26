'use client';

import { useMemo, useState } from 'react';
import { getVariablesRows, getNextAutoUpdateDate } from '@/lib/benefitTracking';

const COLUMNS = [
  { key: 'client', label: 'Client', type: 'text' },
  { key: 'project', label: 'Project', type: 'text' },
  { key: 'projectCode', label: 'Project Code', type: 'text' },
  { key: 'em', label: 'EM', type: 'text' },
  { key: 'start', label: 'Start', type: 'date' },
  { key: 'end', label: 'End', type: 'date' },
  { key: 'potentialK', label: 'Potential', type: 'number' },
  { key: 'invoicedK', label: 'Invoiced', type: 'number' },
  { key: 'status', label: 'Status', type: 'text' },
  { key: 'quarterPotentialK', label: 'Quarter Potential', type: 'number' },
  { key: 'quarterInvoicedK', label: 'Quarter Invoiced', type: 'number' },
  { key: 'lastUpdate', label: 'Last Update', type: 'date' },
];

const STATUS_STYLES = {
  Invoiced: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Overdue: 'bg-red-50 text-red-700',
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'ok', label: 'Quarter · Status OK' },
  { key: 'nok', label: 'Quarter · Status NOK' },
];

export default function VariablesTable() {
  const rows = getVariablesRows();
  const [sort, setSort] = useState({ key: 'quarterPotentialK', direction: 'asc' });
  const [filter, setFilter] = useState('all');
  const [requested, setRequested] = useState({});
  const nextAutoUpdate = getNextAutoUpdateDate();

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  }

  function sendUpdateRequest(client, project) {
    setRequested((current) => ({ ...current, [`${client}__${project}`]: true }));
  }

  const filtered = useMemo(() => {
    if (filter === 'ok') return rows.filter((r) => r.status !== 'Overdue');
    if (filter === 'nok') return rows.filter((r) => r.status === 'Overdue');
    return rows;
  }, [filter, rows]);

  const sorted = useMemo(() => {
    const column = COLUMNS.find((c) => c.key === sort.key);
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (column.type === 'number') return (va - vb) * factor;
      return String(va).localeCompare(String(vb)) * factor;
    });
  }, [filtered, sort]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-1 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                filter === f.key
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-900/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Update requests go out automatically every other Thursday — next: {formatDate(nextAutoUpdate)}
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5">
        <table className="min-w-full text-xs">
          <thead className="text-left text-slate-500">
            <tr>
              {COLUMNS.map((col) => {
                const active = sort.key === col.key;
                return (
                  <th key={col.key} className="px-1.5 py-2 font-medium max-w-[80px]">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={`text-left ${active ? 'font-semibold text-slate-800' : 'hover:text-slate-700'}`}
                    >
                      {col.label}
                      {active && <span className="ml-1 text-xs text-slate-400">({sort.direction === 'asc' ? 'A–Z' : 'Z–A'})</span>}
                    </button>
                  </th>
                );
              })}
              <th className="px-1.5 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((row) => {
              const rowKey = `${row.client}__${row.project}`;
              const alreadyRequested = requested[rowKey];
              return (
                <tr key={rowKey}>
                  <td className="px-1.5 py-1.5 font-medium text-slate-800 max-w-[110px]">{row.client}</td>
                  <td className="px-1.5 py-1.5 text-slate-600 max-w-[130px]">{row.project}</td>
                  <td className="px-1.5 py-1.5 text-slate-600 whitespace-nowrap">{row.projectCode}</td>
                  <td className="px-1.5 py-1.5 text-slate-600 whitespace-nowrap">{row.em}</td>
                  <td className="px-1.5 py-1.5 text-slate-600 whitespace-nowrap">{formatDate(row.start)}</td>
                  <td className="px-1.5 py-1.5 text-slate-600 whitespace-nowrap">{formatDate(row.end)}</td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">{formatK(row.potentialK)}</td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">{formatK(row.invoicedK)}</td>
                  <td className="px-1.5 py-1.5 whitespace-nowrap">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">{formatK(row.quarterPotentialK)}</td>
                  <td className="px-1.5 py-1.5 text-right tabular-nums text-slate-600 whitespace-nowrap">{formatK(row.quarterInvoicedK)}</td>
                  <td className="px-1.5 py-1.5 text-slate-500 whitespace-nowrap">{formatDate(row.lastUpdate)}</td>
                  <td className="px-1.5 py-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      disabled={alreadyRequested}
                      onClick={() => sendUpdateRequest(row.client, row.project)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        alreadyRequested
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white hover:shadow-md'
                      }`}
                    >
                      {alreadyRequested ? 'Sent' : 'Send now'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatK(valueK) {
  return `€${valueK.toLocaleString('en-GB', { maximumFractionDigits: 1 })}K`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
