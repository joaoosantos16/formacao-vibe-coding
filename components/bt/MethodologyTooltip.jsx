'use client';

// Tooltip de metodologia — em cada € importante, mostra como foi
// calculado (baseline, atual, volume, tarifa...). Inspirado no
// "dtip()" do motor de referência (Benefit_Tracking_Final...html):
// nenhum número financeiro fica sem se poder explicar.
export default function MethodologyTooltip({ title, rows = [], footnote, children }) {
  return (
    <span className="group relative inline-flex cursor-help">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-xl bg-slate-900 p-3 text-left opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-sky-300">
          {title}
        </span>
        <span className="mt-1.5 block space-y-1">
          {rows.map((row) => (
            <span key={row.label} className="flex items-center justify-between gap-3 text-xs text-slate-200">
              <span className="text-slate-400">{row.label}</span>
              <span className="font-medium tabular-nums">{row.value}</span>
            </span>
          ))}
        </span>
        {footnote && (
          <span className="mt-1.5 block border-t border-slate-700 pt-1.5 text-[11px] italic text-slate-400">
            {footnote}
          </span>
        )}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-slate-900" />
      </span>
    </span>
  );
}
