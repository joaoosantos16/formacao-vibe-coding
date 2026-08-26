'use client';

import { formatEur } from '@/lib/benefitCalc';
import MethodologyTooltip from './MethodologyTooltip';

const RAG_LABEL = { G: 'Verde', A: 'Amber', R: 'Vermelho', N: 'Sem dado' };
const RAG_DOT = { G: 'bg-emerald-500', A: 'bg-amber-500', R: 'bg-rose-500', N: 'bg-slate-300' };
const RAG_BADGE = {
  G: 'bg-emerald-100 text-emerald-700',
  A: 'bg-amber-100 text-amber-700',
  R: 'bg-rose-100 text-rose-700',
  N: 'bg-slate-100 text-slate-500',
};
const RAG_BAR = { G: '#10B981', A: '#F59E0B', R: '#F43F5E', N: '#CBD5E1' };

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

// Barra de progresso estilo "bullet chart": preenchimento colorido por
// nível atingido (vermelho/amber/verde), com um marcador no 100%.
function ProgressBar(props) {
  const { pct, dark = false } = props;
  const clamped = Math.max(0, Math.min(100, pct ?? 0));
  const color = pct === null ? '#94A3B8' : pct >= 75 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#F43F5E';
  return (
    <div className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${dark ? 'bg-white/15' : 'bg-slate-100'}`}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${clamped}%`, background: color }}
      />
    </div>
  );
}

export default function BenefitStats({ totals }) {
  const potentialPct = totals.potential > 0 ? Math.round((totals.annual / totals.potential) * 100) : null;
  const ragTotal = Object.values(totals.rag).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Poupança potencial ao objetivo</p>
        <MethodologyTooltip
          title="Poupança potencial"
          rows={[{ label: 'KPIs visíveis', value: String(ragTotal) }]}
          footnote="Soma do impacto € ao objetivo — é o teto do business case, não o que já foi alcançado."
        >
          <p className="mt-2 text-3xl font-bold text-slate-800">{formatEur(totals.potential)}</p>
        </MethodologyTooltip>
      </Card>

      <Card accent>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Benefício anualizado logrado</p>
        <MethodologyTooltip
          title="Benefício anualizado"
          rows={[
            { label: 'Método', value: 'Média dos 3 últimos meses × 12' },
            { label: 'Depois', value: 'Soma por KPI' },
          ]}
        >
          <p className="mt-2 text-3xl font-bold">{formatEur(totals.annual)}</p>
        </MethodologyTooltip>
        <ProgressBar pct={potentialPct} dark />
        <p className="mt-1.5 text-xs font-medium text-emerald-300">
          {potentialPct !== null ? `${potentialPct}% do potencial` : 'sem potencial definido'}
        </p>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Poupança acumulada no período</p>
        <p className="mt-2 text-3xl font-bold text-slate-800">{formatEur(totals.accumulated)}</p>
        <p className="mt-1 text-xs text-slate-400">só meses com dado real</p>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Horas poupadas</p>
        <p className="mt-2 text-3xl font-bold text-slate-800">
          {Math.round(totals.hours || 0).toLocaleString('pt-PT')} <span className="text-base font-normal text-slate-400">h</span>
        </p>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Semáforo Atual vs Plano</p>
        <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
          {(['G', 'A', 'R', 'N']).map((key) => {
            const n = totals.rag[key] || 0;
            if (!n) return null;
            return <div key={key} style={{ width: `${(n / ragTotal) * 100}%`, background: RAG_BAR[key] }} />;
          })}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-600">
          {(['G', 'A', 'R', 'N']).map((key) => (
            <span key={key} className="inline-flex items-center gap-1.5 font-medium">
              <span className={`h-2.5 w-2.5 rounded-full ${RAG_DOT[key]}`} />
              {totals.rag[key] || 0}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

export { RAG_LABEL, RAG_DOT, RAG_BADGE };
