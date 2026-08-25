import { getVariables } from '@/lib/benefitTracking';

export default function VariablesTable() {
  const rows = getVariables();

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-2 font-medium">Variável</th>
            <th className="px-4 py-2 font-medium">Projeto</th>
            <th className="px-4 py-2 font-medium">Atual</th>
            <th className="px-4 py-2 font-medium">Alvo</th>
            <th className="px-4 py-2 font-medium">Unidade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.variable}>
              <td className="px-4 py-2 font-medium">{row.variable}</td>
              <td className="px-4 py-2 text-gray-600">{row.project}</td>
              <td className="px-4 py-2">{row.valorAtual}</td>
              <td className="px-4 py-2 text-gray-500">{row.valorAlvo}</td>
              <td className="px-4 py-2 text-gray-500">{row.unidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
