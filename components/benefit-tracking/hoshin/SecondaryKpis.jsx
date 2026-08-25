import { getOrderBook, getVariablesFeesToInvoice } from '@/lib/benefitTracking';

const CARDS = [
  { key: 'orderBook', label: 'Order Book', getter: getOrderBook },
  { key: 'variablesFees', label: 'Variables Fees to be Invoiced', getter: getVariablesFeesToInvoice },
];

export default function SecondaryKpis() {
  return (
    <div className="space-y-3">
      {CARDS.map(({ key, label, getter }) => {
        const { valueM, deltaVsLastYearPct } = getter();
        const positive = deltaVsLastYearPct >= 0;
        return (
          <div key={key} className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-4">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-800">€{valueM.toFixed(2)}M</p>
            <p className={`text-xs mt-1 ${positive ? 'text-emerald-700' : 'text-red-600'}`}>
              {positive ? '+' : ''}
              {deltaVsLastYearPct.toFixed(1)}% vs. last year
            </p>
          </div>
        );
      })}
    </div>
  );
}
