'use client';

import { formatEur } from '@/lib/benefitCalc';
import MethodologyTooltip from './MethodologyTooltip';

const RAG_LABEL = { G: 'Verde', A: 'Amber', R: 'Vermelho', N: 'Sem dado' };
const RAG_DOT = { G: 'bg-emerald-500', A: 'bg-amber-500', R: 'bg-rose-500', N: 'bg-slate-300' };

function Card({ children, accent = false, className = '' }) {
  return (
    <div
      className={`rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 ${
        accent ? 'bg-slate-900 text-white' : 'bg-white/70 backdrop-blur-xl'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function BenefitStats({ totals }) {
  const potentialPct = totals.potential > 0 ? Math.round((totals.annual / totals.potential) * 100) : null;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <Card>
        <p className="text-xs uppercase tracking-wide text-slate-400">Poupança potencial ao objetivo</p>
        <MethodologyTooltip
          title="Poupança potencial"
          rows={[{ label: 'KPIs visíveis', value: String(Object.values(totals.rag).reduce((a, b) => a + b, 0)) }]}
          footnote="Soma do impacto € ao objetivo — é o teto do business case, não o que já foi alcançado."
        >
          <p className="mt-2 text-2xl font-semibold text-slate-800">{formatEur(totals.potential)}</p>
        </MethodologyTooltip>
      </Card>

      <Card accent>
        <p className="text-xs uppercase tracking-wide text-emerald-300">Benefício anualizado logrado</p>
        <MethodologyTooltip
          title="Benefício anualizado"
          rows={[
            { label: 'Método', value: 'Média dos 3 últimos meses × 12' },
            { label: 'Depois', value: 'Soma por KPI' },
          ]}
        >
          <p className="mt-2 text-2xl font-semibold">{formatEur(totals.annual)}</p>
        </MethodologyTooltip>
        <p className="mt-1 text-xs text-emerald-200">
          {potentialPct !== null ? `${potentialPct}% do potencial` : '—'}
        </p>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-wide text-slate-400">Poupança acumulada no período</p>
        <p className="mt-2 text-2xl font-semibold text-slate-800">{formatEur(totals.accumulated)}</p>
        <p className="mt-1 text-xs text-slate-400">só meses com dado real</p>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-wide text-slate-400">Horas poupadas</p>
        <p className="mt-2 text-2xl font-semibold text-slate-800">
          {Math.round(totals.hours || 0).toLocaleString('pt-PT')} <span className="text-sm font-normal text-slate-400">h</span>
        </p>
      </Card>

      <Card>
        <p className="text-xs uppercase tracking-wide text-slate-400">Semáforo Atual vs Plano</p>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600">
          {(['G', 'A', 'R', 'N']).map((key) => (
            <span key={key} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${RAG_DOT[key]}`} />
              {totals.rag[key] || 0}
            </span>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-400">verde / amber / vermelho / sem dado</p>
      </Card>
    </div>
  );
}

export { RAG_LABEL, RAG_DOT };
