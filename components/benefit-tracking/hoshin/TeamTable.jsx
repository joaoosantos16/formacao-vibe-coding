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
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-2 font-medium">Team</th>
            <th className="px-4 py-2 font-medium text-right">Days</th>
            <th className="px-4 py-2 font-medium text-right">Value</th>
            <th className="px-4 py-2 font-medium text-right">Variables</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.team}>
              <td className="px-4 py-2 font-medium">{row.team}</td>
              <td className="px-4 py-2 text-right tabular-nums text-gray-600">{row.days.toFixed(1)}</td>
              <td className="px-4 py-2 text-right tabular-nums text-gray-600">{formatK(row.valueK)}</td>
              <td className="px-4 py-2 text-right tabular-nums text-gray-600">{formatK(row.variablesK)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-gray-200 font-semibold">
          <tr>
            <td className="px-4 py-2">Total</td>
            <td className="px-4 py-2 text-right tabular-nums">{totals.days.toFixed(1)}</td>
            <td className="px-4 py-2 text-right tabular-nums">{formatK(totals.valueK)}</td>
            <td className="px-4 py-2 text-right tabular-nums">{formatK(totals.variablesK)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function formatK(valueK) {
  return `${valueK.toLocaleString('pt-PT', { maximumFractionDigits: 1 })}K €`;
}
