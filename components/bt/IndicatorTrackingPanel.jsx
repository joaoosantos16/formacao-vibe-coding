'use client';

import { useState } from 'react';
import KpiChart from './KpiChart';
import MethodologyTooltip from './MethodologyTooltip';
import { RAG_LABEL, RAG_BADGE } from './BenefitStats';

// "Indicator" view for the Benefit Tracking Update tab — clone of the
// reference prototype's per-indicator tab (Benefit_Tracking_Final_...html):
// pick one KPI, see every month of the project as an editable cell (same
// override channel as the "Actual" row in the Benefit Matrix bowling
// chart, so editing here updates that matrix automatically), plus a
// detail panel (trend chart, baseline/target/current, RAG) for that KPI.
export default function IndicatorTrackingPanel({ kpisWithCalc, months, onAtualChange }) {
  const [selectedId, setSelectedId] = useState(kpisWithCalc[0]?.kpi.id ?? null);

  if (!kpisWithCalc.length) return null;
  const selected = kpisWithCalc.find(({ kpi }) => kpi.id === selectedId) ?? kpisWithCalc[0];
  const { kpi, calc, color } = selected;
  const b = Number(kpi.baseline);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      {/* Lista de indicadores */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/5 p-2 lg:max-h-[560px] lg:overflow-y-auto">
        {kpisWithCalc.map(({ kpi: k, calc: c, color: col }) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setSelectedId(k.id)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
              k.id === selected.kpi.id ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-900/[0.03]'
            }`}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: col }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-slate-700">{k.name}</span>
              <span className="block text-[11px] text-slate-400">{k.unit || '—'}</span>
            </span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${RAG_BADGE[c.rag]}`}>
              {RAG_LABEL[c.rag]}
            </span>
          </button>
        ))}
      </div>

      {/* Detalhe do indicador selecionado */}
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/5 p-5 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-800">{kpi.name}</p>
            <p className="text-xs text-slate-400">
              {kpi.formula || '—'} · {kpi.unit || '—'} · {kpi.frequency === 'monthly' ? 'Monthly' : 'Weekly'} capture
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${RAG_BADGE[calc.rag]}`}>
            {RAG_LABEL[calc.rag]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Baseline" value={kpi.baseline ?? '—'} />
          <Stat label="Target" value={kpi.target ?? '—'} />
          <Stat label="Current" value={calc.current ?? '—'} accent={color} />
          <Stat
            label="Annualized €"
            value={calc.annualized === null ? '—' : new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(calc.annualized) + ' €'}
          />
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <KpiChart
            periods={months.map((m) => `${m.label} ${String(m.y).slice(2)}`)}
            values={months.map((m) => calc.act[m.key] ?? null)}
            target={kpi.target != null ? Number(kpi.target) : undefined}
            compact={false}
            unit={kpi.unit}
          />
        </div>

        {/* Todos os meses — editar Atual aqui atualiza a Matriz Benefit automaticamente */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Monthly actuals
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="h-2 w-2 rounded-full ring-2 ring-inset ring-violet-400 bg-white" /> Manually edited
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {months.map((m) => {
              const a = calc.act[m.key];
              const pl = calc.plan[m.key];
              let cellCls = 'bg-white ring-slate-200';
              let textCls = 'text-slate-600';
              if (a !== null && a !== undefined && pl !== null && !Number.isNaN(b)) {
                const better = kpi.direction === 'lower' ? a <= pl : a >= pl;
                const overBase = kpi.direction === 'lower' ? a < b : a > b;
                if (better) { cellCls = 'bg-emerald-50 ring-emerald-200'; textCls = 'text-emerald-700 font-semibold'; }
                else if (overBase) { cellCls = 'bg-amber-50 ring-amber-200'; textCls = 'text-amber-700 font-semibold'; }
                else { cellCls = 'bg-rose-50 ring-rose-200'; textCls = 'text-rose-700 font-semibold'; }
              }
              const overridden = Boolean(kpi.atualOverrides && kpi.atualOverrides[m.key] !== undefined && kpi.atualOverrides[m.key] !== '');
              return (
                <label
                  key={m.key}
                  className={`flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-center ring-1 ${cellCls} ${
                    overridden ? 'ring-2 ring-violet-300' : ''
                  }`}
                >
                  <span className="text-[10px] font-medium text-slate-400">{m.label} {String(m.y).slice(2)}</span>
                  <input
                    type="number"
                    step="any"
                    defaultValue={a ?? ''}
                    placeholder="—"
                    onBlur={(e) => onAtualChange(kpi.id, m.key, e.target.value)}
                    className={`w-full rounded border border-transparent bg-transparent text-center text-sm ${textCls} focus:border-blue-400 focus:bg-white focus:outline-none`}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <MethodologyTooltip
          title={`${kpi.name} · annualized`}
          rows={[
            { label: 'Method', value: 'Average of the last 3 months × 12' },
            { label: 'Unit rate', value: Number.isNaN(calc.rate) ? '—' : calc.rate.toFixed(3) },
          ]}
        >
          <span className="text-xs font-medium text-blue-700">How is this calculated?</span>
        </MethodologyTooltip>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  );
}
