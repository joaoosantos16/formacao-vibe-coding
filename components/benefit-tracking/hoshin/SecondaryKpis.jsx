import { getOrderBook, getVariablesFeesToInvoice } from '@/lib/benefitTracking';

const CARDS = [
  { key: 'orderBook', label: 'Order Book', icon: '📘', getter: getOrderBook },
  { key: 'variablesFees', label: 'Variables Fees to be Invoiced', icon: '🧾', getter: getVariablesFeesToInvoice },
];

export default function SecondaryKpis() {
  return (
    <div className="space-y-3">
      {CARDS.map(({ key, label, icon, getter }) => {
        const { valueM, deltaVsLastYearPct } = getter();
        const positive = deltaVsLastYearPct >= 0;
        return (
          <div key={key} className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <span aria-hidden="true">{icon}</span> {label}
            </p>
            <p className="mt-1 text-xl font-semibold">{valueM.toFixed(2)}M €</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${positive ? 'text-green-700' : 'text-red-600'}`}>
              <span aria-hidden="true">{positive ? '▲' : '▼'}</span>
              {positive ? '+' : ''}
              {deltaVsLastYearPct.toFixed(1)}% vs. ano anterior
            </p>
          </div>
        );
      })}
    </div>
  );
}
