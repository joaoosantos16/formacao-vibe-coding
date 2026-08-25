import { getProductivity } from '@/lib/benefitTracking';

export default function ProductivityView() {
  const rows = getProductivity();

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <th className="px-4 py-2 font-medium">Projeto</th>
            <th className="px-4 py-2 font-medium">Horas Planeadas</th>
            <th className="px-4 py-2 font-medium">Horas Reais</th>
            <th className="px-4 py-2 font-medium">Produtividade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => {
            const productivity = Math.round((row.horasPlaneadas / row.horasReais) * 100);
            return (
              <tr key={row.project}>
                <td className="px-4 py-2 font-medium">{row.project}</td>
                <td className="px-4 py-2 text-gray-600">{row.horasPlaneadas}h</td>
                <td className="px-4 py-2 text-gray-600">{row.horasReais}h</td>
                <td className={`px-4 py-2 font-medium ${productivity >= 100 ? 'text-green-600' : 'text-amber-600'}`}>
                  {productivity}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
