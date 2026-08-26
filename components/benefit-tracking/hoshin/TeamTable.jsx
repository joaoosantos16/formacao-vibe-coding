import { getHoshinTeamRows } from '@/lib/benefitTracking';

export default function TeamTable() {
  const rows = getHoshinTeamRows();
  const totals = rows.reduce(
    (acc, row) => ({
      days: acc.days + row.days,
      valueK: acc.valueK + row.valueK,
      variablesK: acc.variablesK + row.variablesK,
    }),
    { days: 0, valueK: 0, variablesK: 0 }
  );

  return (
    <div className="overflow-x-auto rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5">
      <table className="min-w-full text-sm">
        <thead className="text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Consultant</th>
            <th className="px-4 py-3 font-medium text-right">Days</th>
            <th className="px-4 py-3 font-medium text-right">Value</th>
            <th className="px-4 py-3 font-medium text-right">Variables</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.consultant}>
              <td className="px-4 py-2 font-medium text-slate-800">{row.consultant}</td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-600">{row.days.toFixed(1)}</td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-600">{formatK(row.valueK)}</td>
              <td className="px-4 py-2 text-right tabular-nums text-slate-600">{formatK(row.variablesK)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-slate-200 font-semibold text-slate-800">
          <tr>
            <td className="px-4 py-3">Total</td>
            <td className="px-4 py-3 text-right tabular-nums">{totals.days.toFixed(1)}</td>
            <td className="px-4 py-3 text-right tabular-nums">{formatK(totals.valueK)}</td>
            <td className="px-4 py-3 text-right tabular-nums">{formatK(totals.variablesK)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function formatK(valueK) {
  return `€${valueK.toLocaleString('en-GB', { maximumFractionDigits: 1 })}K`;
}
