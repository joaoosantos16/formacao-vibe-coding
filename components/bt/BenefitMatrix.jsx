'use client';

import { isPlanOverridden, formatEur } from '@/lib/benefitCalc';
import { formatNumber } from '@/lib/format';
import MethodologyTooltip from './MethodologyTooltip';
import { RAG_DOT } from './BenefitStats';

// Grelha "Matriz Benefit" — Plano / Atual / Volume / Poupança € por
// KPI e por mês, agrupada por ano. Plano e Volume são editáveis célula
// a célula (sobrepõem o cálculo automático); Atual vem sempre das
// capturas (separador "Benefit Tracking Update"). Ver lib/benefitCalc.js.
export default function BenefitMatrix({ kpisWithCalc, months, onPlanChange, onVolumeChange }) {
  if (!kpisWithCalc.length) return null;

  const years = Array.from(new Set(months.map((m) => m.y))).sort((a, b) => a - b);
  const W1 = 28;
  const W2 = 210;

  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5">
      <table className="w-full border-separate border-spacing-0 text-xs" style={{ minWidth: 720 + months.length * 68 }}>
        <thead>
          <tr className="bg-slate-900 text-left text-[10px] uppercase tracking-wide text-slate-300">
            <th className="sticky left-0 z-10 bg-slate-900 px-1.5 py-2" style={{ minWidth: W1, width: W1 }}>#</th>
            <th className="sticky z-10 bg-slate-900 px-2 py-2" style={{ left: W1, minWidth: W2, width: W2 }}>
              KPI
            </th>
            <th className="px-2 py-2">Baseline</th>
            <th className="px-2 py-2">Objetivo</th>
            <th className="px-2 py-2">Atual</th>
            <th className="px-2 py-2">RAG</th>
            <th className="px-2 py-2">Série</th>
            {months.map((m) => (
              <th key={m.key} className="px-2 py-2 text-right font-medium">
                {m.label}<br /><span className="text-[9px] text-slate-400">{String(m.y).slice(2)}</span>
              </th>
            ))}
            <th className="px-2 py-2 text-right">Anualizado €</th>
          </tr>
        </thead>
        <tbody>
          {kpisWithCalc.map(({ kpi, calc, color }, idx) => (
            <KpiRows
              key={kpi.id}
              n={idx + 1}
              kpi={kpi}
              calc={calc}
              color={color}
              months={months}
              w1={W1}
              w2={W2}
              onPlanChange={onPlanChange}
              onVolumeChange={onVolumeChange}
            />
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 bg-white/70 px-3 py-2 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Igual ou melhor que o plano</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pior que o plano, melhor que o baseline</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Pior que o baseline</span>
        <span className="text-emerald-700">Passa o rato por cima de qualquer € para ver a metodologia</span>
      </div>
    </div>
  );
}

function KpiRows({ n, kpi, calc, color, months, w1, w2, onPlanChange, onVolumeChange }) {
  const b = Number(kpi.baseline);

  return (
    <>
      {/* Plano */}
      <tr className="border-t border-slate-100">
        <td
          rowSpan={4}
          className="sticky left-0 z-10 bg-white px-1.5 text-center text-slate-400"
          style={{ width: w1, borderLeft: `4px solid ${color}` }}
        >
          {n}
        </td>
        <td rowSpan={4} className="sticky z-10 bg-white px-2 py-2 align-top" style={{ left: w1, width: w2 }}>
          <p className="font-medium text-slate-800">{kpi.name}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            {kpi.unit || '—'} · {kpi.frequency === 'monthly' ? 'mensal' : 'semanal'}
          </p>
        </td>
        <td rowSpan={4} className="px-2 text-slate-500">{kpi.baseline ?? '—'}</td>
        <td rowSpan={4} className="px-2 text-slate-500">{kpi.target ?? '—'}</td>
        <td rowSpan={4} className="px-2 text-slate-500">{calc.current ?? '—'}</td>
        <td rowSpan={4} className="px-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${RAG_DOT[calc.rag]}`} title={calc.rag} />
        </td>
        <td className="px-2 py-1 font-medium text-slate-400">Plano</td>
        {months.map((m) => (
          <td key={m.key} className={`px-1 py-1 text-right ${isPlanOverridden(kpi, m.key) ? 'bg-violet-50' : ''}`}>
            <input
              type="number"
              step="any"
              defaultValue={calc.plan[m.key] ?? ''}
              placeholder="—"
              onBlur={(e) => onPlanChange(kpi.id, m.key, e.target.value)}
              className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 text-right text-slate-500 hover:border-slate-200 focus:border-emerald-400 focus:bg-white focus:outline-none"
            />
          </td>
        ))}
        <td className="px-2" />
      </tr>

      {/* Atual */}
      <tr>
        <td className="px-2 py-1 font-medium text-slate-500">Atual</td>
        {months.map((m) => {
          const a = calc.act[m.key];
          const pl = calc.plan[m.key];
          let cls = 'text-slate-400';
          if (a !== null && pl !== null && !Number.isNaN(b)) {
            const better = kpi.direction === 'lower' ? a <= pl : a >= pl;
            const overBase = kpi.direction === 'lower' ? a < b : a > b;
            cls = better ? 'text-emerald-700 font-medium' : overBase ? 'text-amber-700' : 'text-rose-700';
          }
          return (
            <td key={m.key} className={`px-1 py-1 text-right ${cls}`}>
              {a === null || a === undefined ? '—' : formatNumber(a)}
            </td>
          );
        })}
        <td className="px-2" />
      </tr>

      {/* Volume */}
      <tr>
        <td className="px-2 py-1 font-medium text-slate-400">Volume</td>
        {months.map((m) => (
          <td key={m.key} className="px-1 py-1 text-right">
            <input
              type="number"
              step="any"
              defaultValue={kpi.volumeOverrides?.[m.key] ?? ''}
              placeholder={kpi.volume ? String(Math.round(Number(kpi.volume) / 12)) : '—'}
              onBlur={(e) => onVolumeChange(kpi.id, m.key, e.target.value)}
              className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 text-right text-slate-400 hover:border-slate-200 focus:border-emerald-400 focus:bg-white focus:outline-none"
            />
          </td>
        ))}
        <td className="px-2" />
      </tr>

      {/* Poupança € */}
      <tr className="border-b border-slate-100">
        <td className="px-2 py-1.5 font-semibold text-slate-700">Poupança €</td>
        {months.map((m) => {
          const s = calc.sav[m.key];
          if (s === null || Number.isNaN(s)) return <td key={m.key} className="px-1 py-1.5" />;
          const a = calc.act[m.key];
          const vm = kpi.volumeOverrides?.[m.key] ?? (kpi.volume ? Number(kpi.volume) / 12 : null);
          return (
            <td key={m.key} className="px-1 py-1.5 text-right">
              <MethodologyTooltip
                title={`${kpi.name} · ${m.label} ${m.y}`}
                rows={[
                  { label: 'Baseline', value: kpi.baseline ?? '—' },
                  { label: 'Atual', value: a ?? '—' },
                  { label: 'Volume mensal', value: vm !== null ? formatNumber(vm) : '—' },
                  { label: 'Tarifa unitária', value: Number.isNaN(calc.rate) ? '—' : calc.rate.toFixed(3) },
                ]}
                footnote={`Poupança = melhoria × volume × tarifa = ${formatEur(s)}`}
              >
                <span className={`font-semibold tabular-nums ${s >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatEur(s)}
                </span>
              </MethodologyTooltip>
            </td>
          );
        })}
        <td className="px-2 py-1.5 text-right">
          <MethodologyTooltip
            title={`${kpi.name} · anualizado`}
            rows={[{ label: 'Método', value: 'Média dos 3 últimos meses × 12' }]}
          >
            <span className="font-semibold text-emerald-700">
              {calc.annualized === null ? '—' : formatEur(calc.annualized)}
            </span>
          </MethodologyTooltip>
        </td>
      </tr>
    </>
  );
}
