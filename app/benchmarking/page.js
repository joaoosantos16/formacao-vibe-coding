"use client";

// Equipa A — branch `equipa-a`.
// Constrói aqui o conteúdo desta página. O menu e o layout à volta
// (components/NavBar.jsx, app/layout.js) são partilhados — não mexer
// nesses sem combinar com as outras equipas.
//
// LIGADO AO SUPABASE (26/08): os projetos e KPIs vêm de
// fetchBenchmarkProjects() (./data.js), não de dados mock — cada barra
// "bullet" e cada "Related projects" reflete a carteira real. mockGqcdm
// continua estático: é o catálogo de referência (o que conta como "bom"
// por KPI/GQCDM), não um resultado de projeto.
//
// Nomenclatura de campos (Código, EM, Setor, SubSetor, Consultores, KPI,
// Revenue, #Colaboradores, EBITDA, Cliente, Ativo/Desativado) e as listas
// de Industry / Macro Sector / Business Area / Workshop vêm dos ficheiros
// partilhados pelo utilizador (Standard_Workshops(C).xlsx e
// "Industry Macro Sector Business Area.xlsx"), alinhadas aos valores reais
// de projetos.setor/.subsetor/.area_negocio (mesmos que a Equipa B usa em
// Benefit Tracking Projetos) — ver STANDARD_INDUSTRIES/STANDARD_MACRO_SECTORS
// em ./data.js.

import { Fragment, useEffect, useState } from "react";

import {
  fetchBenchmarkProjects,
  mockGqcdm,
  filterFields,
  emptyFilters,
  computeMatch,
  parseBenefit,
  formatBenefit,
  parseMetric,
  projectKpisFor,
} from "./data";
import PresentationGenerator from "./PresentationGenerator";


// Barra "bullet".
//
// A escala é o PRÓPRIO percurso do benchmark: 0 = baseline da categoria,
// 1 = target da categoria. A posição de cada projeto é
//   (target do projeto - baseline) / (target da categoria - baseline)
// o que resolve sozinho o sentido do KPI — quando o bom é descer (Defect
// Rate, Lead Time) o numerador e o denominador são ambos negativos e o
// rácio continua positivo.
//
// Assim todas as linhas partilham a mesma escala e o que varia — e o que
// portanto informa — são os pontos: à esquerda da marca ficaram aquém do
// benchmark, em cima ou à direita atingiram-no ou superaram-no.
const BAR_SCALE = 1.25; // 25% de folga à direita do target

function BulletBar({ kpi, projects }) {
  const baseline = parseMetric(kpi.baseline);
  const target = parseMetric(kpi.target);
  if (baseline === null || target === null || baseline === target) return null;

  const span = target - baseline;
  const ratios = projectKpisFor(kpi.name, projects)
    .map((k) => parseMetric(k.target))
    .filter((v) => v !== null)
    .map((v) => (v - baseline) / span);

  const toPct = (ratio) =>
    Math.max(0, Math.min(1, ratio / BAR_SCALE)) * 100;
  const targetPct = toPct(1);
  const metCount = ratios.filter((r) => r >= 0.999).length;

  return (
    <div
      className="relative h-6 w-full min-w-[132px]"
      title={
        `${kpi.baseline} → ${kpi.target}` +
        (ratios.length
          ? `\n${ratios.length} project${ratios.length > 1 ? "s" : ""}, ` +
            `${metCount} at or above the benchmark target`
          : "\nNo projects linked yet")
      }
    >
      {/* calha */}
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-900/[0.06]" />

      {/* percurso baseline -> target */}
      <div
        className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-l-full bg-gradient-to-r from-blue-200 to-sky-400"
        style={{ width: `${targetPct}%` }}
      />

      {/* marca do target — é o ponto de referência da leitura */}
      <span
        className="absolute top-1/2 h-3.5 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-700"
        style={{ left: `${targetPct}%` }}
      />

      {/* um ponto por projeto */}
      {ratios.map((ratio, i) => (
        <span
          key={i}
          className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white ${
            ratio >= 0.999 ? "bg-sky-700" : "bg-slate-400"
          }`}
          style={{ left: `${toPct(ratio)}%` }}
        />
      ))}
    </div>
  );
}


// Cabeçalho de coluna clicável para ordenar.
function SortHeader({ label, columnKey, sort, setSort, className = "" }) {
  const active = sort.key === columnKey;
  return (
    <th className={`font-medium ${className}`}>
      <button
        onClick={() =>
          setSort((prev) =>
            prev.key === columnKey
              ? { key: columnKey, dir: prev.dir === "asc" ? "desc" : "asc" }
              : { key: columnKey, dir: "asc" }
          )
        }
        className={`inline-flex items-center gap-1 uppercase tracking-wider transition-colors hover:text-slate-600 ${
          active ? "text-slate-600" : ""
        }`}
      >
        {label}
        <span className={active ? "text-blue-600" : "text-transparent"}>
          {active && sort.dir === "desc" ? "↓" : "↑"}
        </span>
      </button>
    </th>
  );
}

function sortRows(rows, sort, accessors) {
  if (!sort.key) return rows;
  const accessor = accessors[sort.key];
  if (!accessor) return rows;
  const sorted = [...rows].sort((a, b) => {
    const av = accessor(a);
    const bv = accessor(b);
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av).localeCompare(String(bv));
  });
  return sort.dir === "desc" ? sorted.reverse() : sorted;
}

// Abre/fecha com transição de altura (truque grid 0fr -> 1fr), sem
// animação para quem prefere movimento reduzido.
function Collapsible({ open, children }) {
  return (
    <div
      // `inert` tira o conteúdo fechado da navegação por teclado e dos
      // leitores de ecrã, sem perder a animação de fecho.
      inert={open ? undefined : ""}
      className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, trailing }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {children}
      </h2>
      {trailing}
    </div>
  );
}

function SummaryStrip({ filters, projects }) {
  // Os números do topo têm de descrever o conjunto FILTRADO, não a
  // carteira toda — senão filtrar por "Logistics" continua a mostrar o
  // benefício de todos os projetos, que é o número que alguém citaria.
  const scored = projects.map((p) => ({
    project: p,
    match: computeMatch(p, filters),
  }));
  const matched = scored.filter((s) => s.match === 100).map((s) => s.project);

  const kpiNames = new Set();
  let totalBenefit = 0;
  for (const project of matched) {
    for (const kpi of project.kpis) {
      kpiNames.add(kpi.name);
      totalBenefit += parseBenefit(kpi.benefit);
    }
  }

  const avgMatch = Math.round(
    scored.reduce((sum, s) => sum + s.match, 0) / (scored.length || 1)
  );

  const isFiltered = matched.length !== projects.length;
  const outOf = isFiltered ? `of ${projects.length}` : null;

  const stats = [
    { label: "Projects", value: matched.length, sub: outOf },
    { label: "KPIs covered", value: kpiNames.size },
    { label: "Total benefit", value: formatBenefit(totalBenefit), accent: true },
    { label: "Avg. match", value: `${avgMatch}%` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <SectionCard key={stat.label} className="px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {stat.label}
          </p>
          <p
            className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${
              stat.accent ? "text-blue-600" : "text-slate-800"
            }`}
          >
            {stat.value}
            {stat.sub && (
              <span className="ml-1.5 text-sm font-normal text-slate-400">
                {stat.sub}
              </span>
            )}
          </p>
        </SectionCard>
      ))}
    </div>
  );
}

function FilterBar({ filters, setFilters, hideNonMatching, setHideNonMatching }) {
  const activeFields = filterFields.filter((f) => filters[f.key]);

  return (
    <SectionCard className="px-8 py-6">
      <SectionLabel
        trailing={
          activeFields.length > 0 ? (
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setHideNonMatching((v) => !v)}
                aria-pressed={hideNonMatching}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  hideNonMatching
                    ? "bg-blue-500/15 text-blue-800 ring-1 ring-blue-300"
                    : "bg-slate-900/5 text-slate-600 hover:bg-slate-900/10 hover:text-slate-800"
                }`}
              >
                Hide non-matching
              </button>
              <button
                onClick={() => setFilters(emptyFilters)}
                className="rounded-full bg-slate-900/5 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-900/10 hover:text-slate-800"
              >
                Clear all
              </button>
            </div>
          ) : null
        }
      >
        Filters
      </SectionLabel>

      {activeFields.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFields.map((field) => (
            <button
              key={field.key}
              onClick={() => setFilters((prev) => ({ ...prev, [field.key]: "" }))}
              title={`Remove ${field.label} filter`}
              className="group inline-flex max-w-full items-center gap-2 rounded-full bg-blue-500/10 py-1.5 pl-3 pr-2.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-500/20"
            >
              <span className="truncate">
                <span className="text-blue-600/70">{field.label}:</span>{" "}
                {filters[field.key]}
              </span>
              <span className="text-blue-600/60 transition-colors group-hover:text-blue-800">
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {filterFields.map((field) => {
          const isActive = Boolean(filters[field.key]);
          return (
            <select
              key={field.key}
              aria-label={field.label}
              value={filters[field.key]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className={`w-full truncate rounded-xl border px-3 py-2 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
                isActive
                  ? "border-blue-300 bg-blue-50/60 font-medium text-slate-800"
                  : "border-slate-200 bg-white/80 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <option value="">{field.label}</option>
              {field.options.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          );
        })}
      </div>
    </SectionCard>
  );
}

function KpiTable({ category, expanded, onToggle, filters, hideNonMatching, projects }) {
  const isExpanded = expanded.has(category.key);
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const categoryBenefit = category.kpis.reduce(
    (sum, k) => sum + parseBenefit(k.benefit),
    0
  );

  const sortedKpis = sortRows(category.kpis, sort, {
    name: (k) => k.name,
    baseline: (k) => parseMetric(k.baseline) ?? 0,
    target: (k) => parseMetric(k.target) ?? 0,
    increase: (k) => parseMetric(k.increase) ?? 0,
    benefit: (k) => parseBenefit(k.benefit),
  });

  return (
    <div className="border-t border-slate-200/70 first:border-t-0">
      <button
        onClick={() => onToggle(category.key)}
        className="group flex w-full items-center gap-4 px-2 py-5 text-left transition-colors hover:bg-slate-900/[0.02]"
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-semibold transition-colors ${
            isExpanded
              ? "bg-gradient-to-br from-blue-400 to-sky-500 text-white shadow-sm shadow-blue-500/30"
              : "bg-slate-900/5 text-slate-500 group-hover:bg-slate-900/10"
          }`}
        >
          {category.label.charAt(0)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-base font-medium tracking-tight text-slate-800">
            {category.label}
          </span>
          <span className="block text-xs text-slate-400">
            {category.kpis.length} KPIs · {formatBenefit(categoryBenefit)} benefit
          </span>
        </span>

        <span className="shrink-0 rounded-full bg-slate-900/5 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors group-hover:bg-slate-900/10">
          {isExpanded ? "Hide" : "Expand"}
        </span>
      </button>

      <Collapsible open={isExpanded}>
        <div className="overflow-x-auto pb-5">
          <table className="w-full min-w-[940px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 [&_th]:pb-3">
                <SortHeader
                  label="KPI"
                  columnKey="name"
                  sort={sort}
                  setSort={setSort}
                  className="px-2"
                />
                <SortHeader
                  label="Avg. Baseline"
                  columnKey="baseline"
                  sort={sort}
                  setSort={setSort}
                />
                <SortHeader
                  label="Benchmark Target"
                  columnKey="target"
                  sort={sort}
                  setSort={setSort}
                />
                <th className="font-medium pb-3">Baseline → Target</th>
                <SortHeader
                  label="Avg. % Increase"
                  columnKey="increase"
                  sort={sort}
                  setSort={setSort}
                />
                <SortHeader
                  label="Financial Benefit"
                  columnKey="benefit"
                  sort={sort}
                  setSort={setSort}
                />
                <th className="font-medium pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {sortedKpis.map((kpi) => (
                <KpiRow
                  key={kpi.name}
                  kpi={kpi}
                  filters={filters}
                  hideNonMatching={hideNonMatching}
                  projects={projects}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Collapsible>
    </div>
  );
}

function KpiRow({ kpi, filters, hideNonMatching, projects }) {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <>
      <tr
        className={`border-t border-slate-100 transition-colors ${
          showProjects ? "bg-blue-50/40" : "hover:bg-slate-900/[0.02]"
        }`}
      >
        <td className="px-2 py-3 font-medium text-slate-800">{kpi.name}</td>
        <td className="py-3 tabular-nums text-slate-500">{kpi.baseline}</td>
        <td className="py-3 tabular-nums text-slate-500">{kpi.target}</td>
        <td className="py-3 pr-4">
          <BulletBar kpi={kpi} projects={projects} />
        </td>
        <td className="py-3 tabular-nums text-slate-500">{kpi.increase}</td>
        <td className="py-3 tabular-nums font-medium text-blue-600">
          {kpi.benefit}
        </td>
        <td className="py-3 pr-2 text-right">
          <button
            onClick={() => setShowProjects((v) => !v)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              showProjects
                ? "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
                : "bg-slate-900/5 text-slate-600 hover:bg-slate-900/10 hover:text-slate-800"
            }`}
          >
            {showProjects ? "Hide projects" : "Related projects"}
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={7} className="p-0">
          <Collapsible open={showProjects}>
            <div className="pb-4">
              <RelatedProjects
                kpiName={kpi.name}
                filters={filters}
                hideNonMatching={hideNonMatching}
                projects={projects}
              />
            </div>
          </Collapsible>
        </td>
      </tr>
    </>
  );
}

function RelatedProjects({ kpiName, filters, hideNonMatching, projects }) {
  const [openCode, setOpenCode] = useState(null);
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const allRows = projects
    .filter((project) => project.kpis.some((k) => k.name === kpiName))
    .map((project) => ({
      ...project,
      match: computeMatch(project, filters),
      kpiData: project.kpis.find((k) => k.name === kpiName),
    }))
    .sort((a, b) => b.match - a.match);

  const baseRows = hideNonMatching
    ? allRows.filter((r) => r.match > 0)
    : allRows;
  const hiddenCount = allRows.length - baseRows.length;

  const rows = sortRows(baseRows, sort, {
    codigo: (p) => p.codigo,
    baseline: (p) => parseMetric(p.kpiData.baseline) ?? 0,
    target: (p) => parseMetric(p.kpiData.target) ?? 0,
    increase: (p) => parseMetric(p.kpiData.increase) ?? 0,
    benefit: (p) => parseBenefit(p.kpiData.benefit),
    match: (p) => p.match,
  });

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-5 text-center text-xs text-slate-400">
        {hiddenCount > 0
          ? `No project matches the current filters (${hiddenCount} hidden).`
          : "No projects linked to this KPI yet."}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-black/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-900/[0.03] text-left text-[11px] uppercase tracking-wider text-slate-400 [&_th]:py-2.5">
            <SortHeader
              label="Project / Client"
              columnKey="codigo"
              sort={sort}
              setSort={setSort}
              className="px-4"
            />
            <th className="font-medium">KPI</th>
            <SortHeader label="Baseline" columnKey="baseline" sort={sort} setSort={setSort} />
            <SortHeader label="Target" columnKey="target" sort={sort} setSort={setSort} />
            <SortHeader label="% Increase" columnKey="increase" sort={sort} setSort={setSort} />
            <SortHeader label="Benefit" columnKey="benefit" sort={sort} setSort={setSort} />
            <SortHeader label="Match" columnKey="match" sort={sort} setSort={setSort} />
            <th className="font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((project) => {
            const isOpen = openCode === project.codigo;
            return (
              <Fragment key={project.codigo}>
                <tr
                  className={`border-t border-slate-100 transition-colors ${
                    isOpen ? "bg-slate-900/[0.02]" : "hover:bg-slate-900/[0.02]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="block font-medium text-slate-800">
                      {project.codigo}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {project.cliente}
                      {!project.ativo && (
                        <span className="ml-1.5 rounded-full bg-slate-900/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                          Deactivated
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{project.kpiData.name}</td>
                  <td className="py-3 tabular-nums text-slate-500">
                    {project.kpiData.baseline}
                  </td>
                  <td className="py-3 tabular-nums text-slate-500">
                    {project.kpiData.target}
                  </td>
                  <td className="py-3 tabular-nums text-slate-500">
                    {project.kpiData.increase}
                  </td>
                  <td className="py-3 tabular-nums font-medium text-blue-600">
                    {project.kpiData.benefit}
                  </td>
                  <td className="py-3">
                    <MatchBar value={project.match} />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() =>
                        setOpenCode((current) =>
                          current === project.codigo ? null : project.codigo
                        )
                      }
                      className="whitespace-nowrap rounded-full bg-slate-900/5 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-900/10 hover:text-slate-800"
                    >
                      {isOpen ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {isOpen && <ProjectDetail project={project} />}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MatchBar({ value }) {
  const strong = value >= 67;
  const mid = value >= 34 && value < 67;

  return (
    <div className="flex min-w-[112px] items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-900/[0.07]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            strong
              ? "bg-gradient-to-r from-blue-400 to-sky-500"
              : mid
              ? "bg-slate-400"
              : "bg-slate-300"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span
        className={`w-9 text-right text-xs tabular-nums ${
          strong ? "font-medium text-blue-700" : "text-slate-400"
        }`}
      >
        {value}%
      </span>
    </div>
  );
}

function ProjectDetail({ project }) {
  const fields = [
    ["Industry", project.industry],
    ["Sector", project.setor],
    ["Business Area", project.subSetor],
    ["Country", project.country],
    ["Engagement Manager", project.em],
    ["Consultants", project.consultores],
    ["Workshop", project.workshop],
    ["# of Employees", project.colaboradores],
    ["Revenue", project.revenue],
    ["EBITDA", project.ebitda],
    ["Status", project.ativo ? "Active" : "Deactivated"],
    ["Date", project.date],
    ["Duration", project.duration],
    ["Project Details", project.details],
  ];

  return (
    <tr>
      <td colSpan={8} className="px-4 pb-5">
        <div className="rounded-2xl bg-slate-900/[0.03] p-5">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </td>
    </tr>
  );
}

export default function BenchmarkingPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [expanded, setExpanded] = useState(new Set());
  const [hideNonMatching, setHideNonMatching] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchBenchmarkProjects().then((rows) => {
      if (!cancelled) {
        setProjects(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleCategory = (key) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const allExpanded = expanded.size === mockGqcdm.length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
            KI BT&amp;B
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
            Benchmarking
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Filter the project portfolio, then open a GQCDM category to compare KPI
            baselines, benchmark targets and the financial benefit achieved.
          </p>
        </div>
        <PresentationGenerator filters={filters} projects={projects} />
      </header>

      {loading ? (
        <SectionCard className="px-8 py-10 text-center text-sm text-slate-400">
          Loading projects…
        </SectionCard>
      ) : (
        <SummaryStrip filters={filters} projects={projects} />
      )}

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        hideNonMatching={hideNonMatching}
        setHideNonMatching={setHideNonMatching}
      />

      <SectionCard className="px-8 py-7">
        <SectionLabel
          trailing={
            <button
              onClick={() =>
                setExpanded(
                  allExpanded ? new Set() : new Set(mockGqcdm.map((c) => c.key))
                )
              }
              className="rounded-full bg-slate-900/5 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-900/10 hover:text-slate-800"
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </button>
          }
        >
          Benchmark KPIs · GQCDM
        </SectionLabel>

        <div className="mt-3">
          {mockGqcdm.map((category) => (
            <KpiTable
              key={category.key}
              category={category}
              expanded={expanded}
              onToggle={toggleCategory}
              filters={filters}
              hideNonMatching={hideNonMatching}
              projects={projects}
            />
          ))}
        </div>

        {/* Legenda da barra — sem isto, quem vê a página pela primeira
            vez não sabe o que são os pontos. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200/70 pt-4 text-[11px] text-slate-400">
          <span className="font-medium uppercase tracking-wider">
            Baseline → Target
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-200 to-sky-400" />
            Baseline to benchmark target
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-[2px] rounded-full bg-sky-700" />
            Benchmark target
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-700 ring-2 ring-white" />
            Project met or beat it
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400 ring-2 ring-white" />
            Project fell short
          </span>
        </div>
      </SectionCard>

      <p className="pb-4 text-center text-xs text-slate-400">
        {projects.length} real project{projects.length === 1 ? "" : "s"} with KPI data · GQCDM targets are the company benchmark norm.
      </p>
    </div>
  );
}
