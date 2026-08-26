'use client';

import { isPlanOverridden, isAtualOverridden, formatEur } from '@/lib/benefitCalc';
import { formatNumber } from '@/lib/format';
import MethodologyTooltip from './MethodologyTooltip';
import { RAG_LABEL, RAG_BADGE } from './BenefitStats';

// Grelha "Matriz Benefit" — Plano / Atual / Volume / Poupança € por
// KPI e por mês, agrupada por ano. Plano e Volume são editáveis célula
// a célula (sobrepõem o cálculo automático); Atual vem sempre das
// capturas (separador "Benefit Tracking Update"). Ver lib/benefitCalc.js.
export default function BenefitMatrix({ kpisWithCalc, months, onPlanChange, onVolumeChange, onAtualChange }) {
  if (!kpisWithCalc.length) return null;

  const years = Array.from(new Set(months.map((m) => m.y))).sort((a, b) => a - b);
  const W1 = 28;
  const W2 = 210;

  return (
    <div className="rounded-2xl ring-1 ring-black/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-xs" style={{ minWidth: 760 + months.length * 68 }}>
          <thead>
            <tr className="bg-slate-900 text-left text-[10px] uppercase tracking-wide text-slate-300">
              <th className="sticky left-0 z-10 bg-slate-900 px-1.5 py-2" style={{ minWidth: W1, width: W1 }}>#</th>
              <th className="sticky z-10 bg-slate-900 px-2 py-2" style={{ left: W1, minWidth: W2, width: W2 }}>
                KPI
              </th>
              <th className="px-2 py-2">Baseline</th>
              <th className="px-2 py-2">Target</th>
              <th className="px-2 py-2">Actual</th>
              <th className="px-2 py-2">RAG</th>
              <th className="px-2 py-2">Series</th>
              {months.map((m) => (
                <th key={m.key} className="px-2 py-2 text-right font-medium">
                  {m.label}<br /><span className="text-[9px] text-slate-400">{String(m.y).slice(2)}</span>
                </th>
              ))}
              <th className="px-2 py-2 text-right">Annualized €</th>
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
                onAtualChange={onAtualChange}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 bg-slate-50 px-3 py-2.5 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Equal to or better than plan</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Worse than plan, better than baseline</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Worse than baseline</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full ring-2 ring-inset ring-violet-400 bg-white" /> Edited by hand (overrides the automatic calculation)</span>
        <span className="ml-auto font-medium text-blue-700">Hover over any € figure to see the methodology</span>
      </div>
    </div>
  );
}

function KpiRows({ n, kpi, calc, color, months, w1, w2, onPlanChange, onVolumeChange, onAtualChange }) {
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
            {kpi.unit || '—'} · {kpi.frequency === 'monthly' ? 'monthly' : 'weekly'}
          </p>
        </td>
        <td rowSpan={4} className="px-2 text-slate-500">{kpi.baseline ?? '—'}</td>
        <td rowSpan={4} className="px-2 text-slate-500">{kpi.target ?? '—'}</td>
        <td rowSpan={4} className="px-2 text-slate-500">{calc.current ?? '—'}</td>
        <td rowSpan={4} className="px-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${RAG_BADGE[calc.rag]}`}
            title={RAG_LABEL[calc.rag]}
          >
            {RAG_LABEL[calc.rag]}
          </span>
        </td>
        <td className="px-2 py-1 font-medium text-slate-400">Plan</td>
        {months.map((m) => (
          <td key={m.key} className={`px-1 py-1 text-right ${isPlanOverridden(kpi, m.key) ? 'bg-violet-50' : ''}`}>
            <input
              type="number"
              step="any"
              defaultValue={calc.plan[m.key] ?? ''}
              placeholder="—"
              onBlur={(e) => onPlanChange(kpi.id, m.key, e.target.value)}
              className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 text-right text-slate-500 hover:border-slate-200 focus:border-blue-400 focus:bg-white focus:outline-none"
            />
          </td>
        ))}
        <td className="px-2" />
      </tr>

      {/* Atual — editável célula a célula; sobrepõe o valor agregado das capturas quando definido */}
      <tr>
        <td className="px-2 py-1 font-medium text-slate-500">Actual</td>
        {months.map((m) => {
          const a = calc.act[m.key];
          const pl = calc.plan[m.key];
          let cellCls = '';
          let textCls = 'text-slate-500';
          if (a !== null && a !== undefined && pl !== null && !Number.isNaN(b)) {
            const better = kpi.direction === 'lower' ? a <= pl : a >= pl;
            const overBase = kpi.direction === 'lower' ? a < b : a > b;
            if (better) { cellCls = 'bg-emerald-50'; textCls = 'text-emerald-700 font-semibold'; }
            else if (overBase) { cellCls = 'bg-amber-50'; textCls = 'text-amber-700 font-semibold'; }
            else { cellCls = 'bg-rose-50'; textCls = 'text-rose-700 font-semibold'; }
          }
          const overridden = isAtualOverridden(kpi, m.key);
          return (
            <td
              key={m.key}
              className={`px-1 py-1 text-right ${cellCls} ${overridden ? 'ring-1 ring-inset ring-violet-300' : ''}`}
            >
              <input
                type="number"
                step="any"
                defaultValue={a ?? ''}
                placeholder="—"
                onBlur={(e) => onAtualChange(kpi.id, m.key, e.target.value)}
                className={`w-16 rounded border border-transparent bg-transparent px-1 py-0.5 text-right ${textCls} hover:border-slate-200 focus:border-blue-400 focus:bg-white focus:outline-none`}
              />
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
              className="w-16 rounded border border-transparent bg-transparent px-1 py-0.5 text-right text-slate-400 hover:border-slate-200 focus:border-blue-400 focus:bg-white focus:outline-none"
            />
          </td>
        ))}
        <td className="px-2" />
      </tr>

      {/* Poupança € */}
      <tr className="border-b border-slate-100">
        <td className="px-2 py-1.5 font-semibold text-slate-700">Savings €</td>
        {months.map((m) => {
          const s = calc.sav[m.key];
          if (s === null || Number.isNaN(s)) return <td key={m.key} className="px-1 py-1.5" />;
          const a = calc.act[m.key];
          const vm = kpi.volumeOverrides?.[m.key] ?? (kpi.volume ? Number(kpi.volume) / 12 : null);
          return (
            <td key={m.key} className={`px-1 py-1.5 text-right ${s >= 0 ? 'bg-emerald-50/70' : 'bg-rose-50/70'}`}>
              <MethodologyTooltip
                title={`${kpi.name} · ${m.label} ${m.y}`}
                rows={[
                  { label: 'Baseline', value: kpi.baseline ?? '—' },
                  { label: 'Actual', value: a ?? '—' },
                  { label: 'Monthly volume', value: vm !== null ? formatNumber(vm) : '—' },
                  { label: 'Unit rate', value: Number.isNaN(calc.rate) ? '—' : calc.rate.toFixed(3) },
                ]}
                footnote={`Savings = improvement × volume × rate = ${formatEur(s)}`}
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
            title={`${kpi.name} · annualized`}
            rows={[{ label: 'Method', value: 'Average of the last 3 months × 12' }]}
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
