"use client";

// Gerador de apresentação de benchmark (Equipa A).
// Spec: "Feature spec: Benchmark presentation generator".
//
// DECISÕES TÉCNICAS (e o que fica por ligar):
//
// 1. Sem dependências novas. A spec sugere Chart.js + html2canvas + jsPDF,
//    mas package.json é partilhado pelas 4 equipas — acrescentar pacotes
//    obrigava a combinar com o formador. Em vez disso:
//      - gráfico feito em CSS puro (controlo total sobre "sem gridlines,
//        sem eixo Y, cantos arredondados, data labels");
//      - export por print-to-PDF do browser (@page landscape). Sai
//        vetorial, portanto MAIS nítido que o raster do html2canvas, e
//        respeita o "sem UI da app no PDF".
//    Custo: passa pela caixa de diálogo de impressão em vez de descarregar
//    o ficheiro direto. Se quiserem download num clique, é preciso jsPDF
//    e alterar o package.json partilhado.
//
// 2. Logótipo Kaizen: NÃO existe nenhum ficheiro de marca no repositório
//    e não invento o logótipo de uma empresa real. Fica um wordmark em
//    texto, marcado como placeholder — basta pôr o SVG/PNG oficial em
//    public/ e trocar <BrandMark />.
//
// 3. Cor "KI Blue": não sei o hex oficial. BRAND.blue abaixo é um
//    placeholder — trocar pelo valor das guidelines.
//
// 4. Benchmark externo: a spec exige pesquisa web real. Isto é uma página
//    client-side sem backend, por isso não há pesquisa. O slide diz isso
//    de forma explícita, em vez de inventar números — a própria spec manda
//    ser honesto quando os dados não existem.
//
// 5. Benchmark interno e conclusões: lógica real (mediana, contagem,
//    confiança, fallback por níveis) — mas a correr sobre os dados mock
//    de data.js. Quando o Supabase entrar, muda-se só data.js.

import { useEffect, useMemo, useState } from "react";
import {
  mockGqcdm,
  filterFields,
  parseMetric,
  parseBenefit,
  formatBenefit,
} from "./data";

// Placeholder — substituir pelos valores oficiais das brand guidelines.
const BRAND = {
  blue: "#0B3D91",
  blueDark: "#072A66",
  blueSoft: "#E8EEF8",
  accent: "#00A3A1",
  ink: "#1B2430",
  muted: "#6B7789",
};

const SECTIONS = [
  {
    key: "intro",
    label: "Intro / framing",
    hint: "Client, sector, size and what is being compared",
  },
  {
    key: "internal",
    label: "Internal benchmark",
    hint: "Results from comparable past Kaizen projects",
  },
  {
    key: "external",
    label: "External benchmark",
    hint: "Public/official sources — needs a search backend",
  },
  {
    key: "chart",
    label: "KPI chart visualization",
    hint: "Baseline vs target per selected KPI",
  },
  {
    key: "conclusions",
    label: "Conclusions & recommendations",
    hint: "Where the financial opportunity is",
  },
];

const allKpis = mockGqcdm.flatMap((c) =>
  c.kpis.map((k) => ({ ...k, category: c.label }))
);

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Fallback por níveis: tenta o match exato e vai alargando. Devolve
// sempre qual o nível usado, para o slide poder dizê-lo em vez de
// apresentar um match largo como se fosse exato.
function findComparable(kpiName, filters, projects) {
  const withKpi = projects.filter((p) =>
    p.kpis.some((k) => k.name === kpiName)
  );
  const activeKeys = filterFields
    .filter((f) => filters[f.key])
    .map((f) => f.key);

  const tiers = [
    { label: "Exact match", keys: activeKeys },
    {
      label: "Widened — company size and revenue relaxed",
      keys: activeKeys.filter(
        (k) => k !== "colaboradoresRange" && k !== "revenueRange"
      ),
    },
    {
      label: "Widened — methodology relaxed",
      keys: activeKeys.filter(
        (k) => !["colaboradoresRange", "revenueRange", "workshop"].includes(k)
      ),
    },
    { label: "All comparable projects", keys: [] },
  ];

  const MIN = 2;
  for (const tier of tiers) {
    const matched = withKpi.filter((p) =>
      tier.keys.every((k) => p[k] === filters[k])
    );
    if (matched.length >= MIN || tier.keys.length === 0) {
      return {
        projects: matched,
        tier: tier.label,
        widened: tier.keys.length < activeKeys.length,
      };
    }
  }
  return { projects: [], tier: "All comparable projects", widened: true };
}

function buildInternal(kpiName, filters, allProjects) {
  const { projects, tier, widened } = findComparable(kpiName, filters, allProjects);
  const records = projects
    .map((p) => p.kpis.find((k) => k.name === kpiName))
    .filter(Boolean);

  const improvements = records
    .map((r) => parseMetric(r.increase))
    .filter((v) => v !== null)
    .map(Math.abs);

  const benefits = records.map((r) => parseBenefit(r.benefit));

  const count = projects.length;
  const confidence =
    count >= 4 && !widened ? "High" : count >= 2 ? "Medium" : "Low";

  return {
    kpiName,
    count,
    tier,
    widened,
    confidence,
    medianImprovement: median(improvements),
    totalBenefit: benefits.reduce((a, b) => a + b, 0),
    projects,
  };
}

function BrandMark({ variant = "full" }) {
  const light = variant === "light";
  // Logótipo oficial (public/kaizen-logo.png) em fundo claro. Em fundo
  // escuro (capa) o PNG a cores perde contraste, por isso mantém-se o
  // wordmark em texto branco — trocar quando houver uma versão
  // monocromática/branca do logótipo.
  if (!light) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- slide impresso a PDF, next/image não ajuda aqui
      <img src="/kaizen-logo.png" alt="Kaizen Institute" className="h-[1.6em] w-auto" />
    );
  }
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-[0.95em] font-bold tracking-tight" style={{ color: "#fff" }}>
        KAIZEN
      </span>
      <span className="text-[0.8em] font-medium tracking-[0.2em]" style={{ color: "rgba(255,255,255,.75)" }}>
        INSTITUTE
      </span>
    </span>
  );
}

function Slide({ children, index, total, title, cover = false }) {
  return (
    <section
      className="kib-slide relative mx-auto flex w-full flex-col overflow-hidden rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.12)]"
      style={{
        aspectRatio: "16 / 9",
        background: cover ? BRAND.blue : "#fff",
        color: cover ? "#fff" : BRAND.ink,
      }}
    >
      {!cover && (
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: BRAND.blue }}
        />
      )}

      <div className="flex flex-1 flex-col px-[6%] pb-[5%] pt-[6%]">
        {title && !cover && (
          <h2
            className="mb-[3%] text-[2.6cqw] font-semibold tracking-tight"
            style={{ fontSize: "clamp(15px, 2.9cqw, 34px)" }}
          >
            {title}
          </h2>
        )}
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>

      <footer
        className="flex items-center justify-between px-[6%] pb-[3%] text-[1.4cqw]"
        style={{ fontSize: "clamp(7px, 1.35cqw, 13px)" }}
      >
        <span style={{ opacity: cover ? 0 : 0.65 }}>
          <BrandMark variant={cover ? "light" : "full"} />
        </span>
        <span style={{ color: cover ? "rgba(255,255,255,.7)" : BRAND.muted }}>
          {index} / {total}
        </span>
      </footer>
    </section>
  );
}

function StatCard({ value, label, tone = "default" }) {
  const isBrand = tone === "brand";
  return (
    <div
      className="flex flex-1 flex-col justify-center rounded-xl px-[4%] py-[3%]"
      style={{
        background: isBrand ? BRAND.blue : BRAND.blueSoft,
        color: isBrand ? "#fff" : BRAND.ink,
      }}
    >
      <span
        className="font-semibold tracking-tight tabular-nums"
        style={{ fontSize: "clamp(16px, 3.4cqw, 40px)" }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "clamp(7px, 1.3cqw, 13px)",
          color: isBrand ? "rgba(255,255,255,.8)" : BRAND.muted,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ConfidenceBadge({ level }) {
  const map = {
    High: { bg: "#DCF5E7", fg: "#15683F" },
    Medium: { bg: "#FDF0D5", fg: "#8A5A00" },
    Low: { bg: "#F6E0E0", fg: "#8C2F2F" },
  };
  const c = map[level] || map.Low;
  return (
    <span
      className="inline-flex items-center rounded-full px-[1.2em] py-[0.35em] font-semibold"
      style={{
        background: c.bg,
        color: c.fg,
        fontSize: "clamp(7px, 1.25cqw, 12px)",
      }}
    >
      {level} confidence
    </span>
  );
}

function EmptyNote({ children }) {
  return (
    <div
      className="flex flex-1 items-center justify-center rounded-xl border border-dashed px-[5%] text-center"
      style={{ borderColor: "#C9D3E0", color: BRAND.muted }}
    >
      <p style={{ fontSize: "clamp(8px, 1.6cqw, 16px)", lineHeight: 1.5 }}>
        {children}
      </p>
    </div>
  );
}

// Gráfico de barras em CSS: sem gridlines, sem eixo Y, cantos
// arredondados, valores como data labels por cima de cada barra.
function KpiChart({ kpis }) {
  const series = [
    { key: "baseline", label: "Kaizen baseline", color: "#9BB2D4" },
    { key: "target", label: "Kaizen target", color: BRAND.blue },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 items-end justify-around gap-[3%] pb-[1%]">
        {kpis.map((kpi) => {
          const values = series.map((s) => parseMetric(kpi[s.key]) ?? 0);
          const max = Math.max(...values, 1);
          return (
            <div
              key={kpi.name}
              className="flex h-full min-w-0 flex-1 flex-col justify-end gap-[6%]"
            >
              <div className="flex h-full items-end justify-center gap-[8%]">
                {series.map((s, i) => (
                  <div
                    key={s.key}
                    className="flex h-full max-w-[34%] flex-1 flex-col justify-end"
                  >
                    <span
                      className="mb-[6%] text-center font-semibold tabular-nums"
                      style={{
                        fontSize: "clamp(6px, 1.25cqw, 12px)",
                        color: BRAND.ink,
                      }}
                    >
                      {kpi[s.key]}
                    </span>
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${Math.max((values[i] / max) * 100, 4)}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                ))}
              </div>
              <span
                className="truncate text-center"
                style={{
                  fontSize: "clamp(6px, 1.2cqw, 12px)",
                  color: BRAND.muted,
                }}
                title={kpi.name}
              >
                {kpi.name}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className="mt-[2%] flex items-center justify-center gap-[4%] border-t pt-[2%]"
        style={{ borderColor: "#E6EBF2" }}
      >
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-[0.5em]">
            <span
              className="inline-block rounded-sm"
              style={{
                background: s.color,
                width: "0.8em",
                height: "0.8em",
              }}
            />
            <span
              style={{
                fontSize: "clamp(6px, 1.25cqw, 12px)",
                color: BRAND.muted,
              }}
            >
              {s.label}
            </span>
          </span>
        ))}
        <span
          style={{ fontSize: "clamp(6px, 1.2cqw, 12px)", color: BRAND.muted }}
        >
          · Client baseline and external benchmark pending data sources
        </span>
      </div>
    </div>
  );
}

function buildSlides({ sections, kpiNames, clientName, filters, projects }) {
  const slides = [];
  const scope = filterFields
    .filter((f) => filters[f.key])
    .map((f) => `${f.label}: ${filters[f.key]}`);
  const chosen = allKpis.filter((k) => kpiNames.includes(k.name));
  const internals = kpiNames.map((name) => buildInternal(name, filters, projects));

  if (sections.intro) slides.push({ type: "intro", scope, clientName });
  if (sections.internal) slides.push({ type: "internal", internals });
  if (sections.external) slides.push({ type: "external" });
  if (sections.chart) slides.push({ type: "chart", kpis: chosen });
  if (sections.conclusions)
    slides.push({ type: "conclusions", internals, chosen });

  return slides;
}

function SlideBody({ slide, index, total }) {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (slide.type === "intro") {
    return (
      <Slide index={index} total={total} cover>
        <div className="flex flex-1 flex-col justify-between">
          <div style={{ fontSize: "clamp(10px, 2cqw, 20px)" }}>
            <BrandMark variant="light" />
          </div>
          <div>
            <p
              style={{
                fontSize: "clamp(7px, 1.4cqw, 14px)",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,.7)",
                textTransform: "uppercase",
              }}
            >
              Benchmark review
            </p>
            <h1
              className="mt-[1.5%] font-semibold tracking-tight"
              style={{ fontSize: "clamp(20px, 5cqw, 58px)", lineHeight: 1.05 }}
            >
              {slide.clientName || "Client name"}
            </h1>
            <div
              className="mt-[3%] flex flex-wrap gap-x-[4%] gap-y-[1%]"
              style={{
                fontSize: "clamp(7px, 1.4cqw, 14px)",
                color: "rgba(255,255,255,.8)",
              }}
            >
              <span>{date}</span>
              {slide.scope.length ? (
                slide.scope.map((s) => <span key={s}>{s}</span>)
              ) : (
                <span>Scope: full project portfolio</span>
              )}
            </div>
          </div>
        </div>
      </Slide>
    );
  }

  if (slide.type === "internal") {
    const usable = slide.internals.filter((i) => i.count > 0);
    return (
      <Slide index={index} total={total} title="Internal benchmark">
        {usable.length === 0 ? (
          <EmptyNote>
            No directly comparable Kaizen projects found for the selected KPIs
            and filters.
          </EmptyNote>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-[2.5%]">
            {usable.slice(0, 3).map((item) => (
              <div key={item.kpiName} className="flex flex-1 items-stretch gap-[2%]">
                <div className="flex flex-[1.3] flex-col justify-center">
                  <span
                    className="font-semibold"
                    style={{ fontSize: "clamp(9px, 1.9cqw, 19px)" }}
                  >
                    {item.kpiName}
                  </span>
                  <span
                    className="mt-[0.4em]"
                    style={{
                      fontSize: "clamp(6px, 1.2cqw, 12px)",
                      color: BRAND.muted,
                    }}
                  >
                    {item.tier}
                    {item.widened ? " (widened)" : ""}
                  </span>
                  <span className="mt-[0.5em]">
                    <ConfidenceBadge level={item.confidence} />
                  </span>
                </div>
                <StatCard
                  value={
                    item.medianImprovement !== null
                      ? `${item.medianImprovement}%`
                      : "n/a"
                  }
                  label="Median improvement"
                />
                <StatCard value={item.count} label="Comparable projects" />
                <StatCard
                  value={formatBenefit(item.totalBenefit)}
                  label="Benefit achieved"
                  tone="brand"
                />
              </div>
            ))}
          </div>
        )}
      </Slide>
    );
  }

  if (slide.type === "external") {
    return (
      <Slide index={index} total={total} title="External benchmark">
        <EmptyNote>
          No external sources retrieved — this section needs a server-side
          search step, which is not wired up yet.
          <br />
          <br />
          Once connected, every figure here will carry its source name and link
          so it can be verified before it goes in front of a client.
        </EmptyNote>
      </Slide>
    );
  }

  if (slide.type === "chart") {
    return (
      <Slide index={index} total={total} title="KPI comparison">
        {slide.kpis.length === 0 ? (
          <EmptyNote>No KPIs selected.</EmptyNote>
        ) : (
          <KpiChart kpis={slide.kpis.slice(0, 5)} />
        )}
      </Slide>
    );
  }

  if (slide.type === "conclusions") {
    const withData = slide.internals.filter((i) => i.count > 0);
    const totalBenefit = withData.reduce((s, i) => s + i.totalBenefit, 0);
    const best = [...withData].sort(
      (a, b) => (b.medianImprovement ?? 0) - (a.medianImprovement ?? 0)
    )[0];

    return (
      <Slide index={index} total={total} title="Conclusions & recommendations">
        {withData.length === 0 ? (
          <EmptyNote>
            Not enough comparable data to draw conclusions — widen the filters
            or select different KPIs.
          </EmptyNote>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-[3%]">
            <div className="flex flex-[1.1] gap-[2%]">
              <StatCard
                value={formatBenefit(totalBenefit)}
                label="Benefit achieved across comparable projects"
                tone="brand"
              />
              <StatCard
                value={best?.medianImprovement != null ? `${best.medianImprovement}%` : "n/a"}
                label={`Largest median gap — ${best?.kpiName ?? ""}`}
              />
              <StatCard
                value={withData.reduce((s, i) => s + i.count, 0)}
                label="Projects evidencing this"
              />
            </div>
            <ul
              className="flex flex-1 flex-col justify-center gap-[1.5%]"
              style={{ fontSize: "clamp(8px, 1.6cqw, 16px)", lineHeight: 1.4 }}
            >
              {withData.slice(0, 3).map((i) => (
                <li key={i.kpiName} className="flex gap-[1em]">
                  <span style={{ color: BRAND.blue, fontWeight: 600 }}>
                    {i.kpiName}
                  </span>
                  <span style={{ color: BRAND.muted }}>
                    median {i.medianImprovement ?? "n/a"}% improvement across{" "}
                    {i.count} comparable project{i.count > 1 ? "s" : ""} —{" "}
                    {formatBenefit(i.totalBenefit)} benefit
                  </span>
                </li>
              ))}
            </ul>
            <p
              style={{
                fontSize: "clamp(6px, 1.2cqw, 12px)",
                color: BRAND.muted,
              }}
            >
              Figures are Kaizen-internal results. Client-specific € impact
              requires the client baseline, which is not connected yet.
            </p>
          </div>
        )}
      </Slide>
    );
  }

  return null;
}

export default function PresentationGenerator({ filters, projects }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [clientName, setClientName] = useState("");
  const [sections, setSections] = useState(
    Object.fromEntries(SECTIONS.map((s) => [s.key, true]))
  );
  const [kpiNames, setKpiNames] = useState(
    allKpis.slice(0, 4).map((k) => k.name)
  );
  const [slides, setSlides] = useState([]);

  // Fecha com Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (previewOpen) setPreviewOpen(false);
      else if (modalOpen) setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, previewOpen]);

  const anySection = Object.values(sections).some(Boolean);
  const chartNeedsKpis = sections.chart && kpiNames.length === 0;

  const handleGenerate = () => {
    setGenerating(true);
    // Só calcula o que está selecionado.
    setTimeout(() => {
      setSlides(buildSlides({ sections, kpiNames, clientName, filters, projects }));
      setGenerating(false);
      setModalOpen(false);
      setPreviewOpen(true);
    }, 250);
  };

  const handleDownload = () => {
    const safe = (clientName || "client").replace(/[^\w\-]+/g, "-");
    const stamp = new Date().toISOString().slice(0, 10);
    const previous = document.title;
    // O browser usa o document.title como nome sugerido do PDF.
    document.title = `Kaizen-benchmark-${safe}-${stamp}`;
    const restore = () => {
      document.title = previous;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="rounded-full bg-gradient-to-br from-blue-400 to-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        Generate benchmark presentation
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Generate benchmark presentation"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5"
          >
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Generate benchmark presentation
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pick the sections and KPIs to include. Only checked sections are
              computed.
            </p>

            <label className="mt-6 block">
              <span className="text-xs font-medium text-slate-500">
                Client name
              </span>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Empresa A"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              />
            </label>

            <fieldset className="mt-6">
              <legend className="text-xs font-medium text-slate-500">
                Sections
              </legend>
              <div className="mt-2 space-y-1.5">
                {SECTIONS.map((s) => (
                  <label
                    key={s.key}
                    className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-900/[0.03]"
                  >
                    <input
                      type="checkbox"
                      checked={sections[s.key]}
                      onChange={(e) =>
                        setSections((prev) => ({
                          ...prev,
                          [s.key]: e.target.checked,
                        }))
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400/40"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-800">
                        {s.label}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {s.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="text-xs font-medium text-slate-500">
                KPIs to visualise ({kpiNames.length} selected)
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {allKpis.map((k) => {
                  const on = kpiNames.includes(k.name);
                  return (
                    <button
                      key={k.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setKpiNames((prev) =>
                          prev.includes(k.name)
                            ? prev.filter((n) => n !== k.name)
                            : [...prev, k.name]
                        )
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        on
                          ? "bg-blue-500/15 text-blue-800 ring-1 ring-blue-300"
                          : "bg-slate-900/5 text-slate-600 hover:bg-slate-900/10"
                      }`}
                    >
                      {k.name}
                    </button>
                  );
                })}
              </div>
              {chartNeedsKpis && (
                <p className="mt-2 text-xs text-amber-700">
                  The chart section is checked but no KPIs are selected.
                </p>
              )}
            </fieldset>

            <div className="mt-8 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-900/5"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!anySection || generating}
                className="rounded-full bg-gradient-to-br from-blue-400 to-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {generating ? "Generating…" : "Generate presentation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewOpen && (
        <div className="kib-overlay fixed inset-0 z-[70] overflow-y-auto bg-slate-100 p-6">
          <div className="kib-noprint sticky top-0 z-10 mx-auto mb-6 flex max-w-5xl items-center justify-between rounded-2xl bg-white/90 px-5 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Presentation preview
              </p>
              <p className="text-xs text-slate-500">
                {slides.length} slide{slides.length === 1 ? "" : "s"} · 16:9
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-900/5"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="rounded-full bg-gradient-to-br from-blue-400 to-sky-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div id="kib-deck" className="mx-auto max-w-5xl space-y-6">
            {slides.map((slide, i) => (
              <div key={i} style={{ containerType: "inline-size" }}>
                <SlideBody slide={slide} index={i + 1} total={slides.length} />
              </div>
            ))}
          </div>

          <style>{`
            @media print {
              @page { size: 297mm 167mm; margin: 0; }
              html, body { background: #fff !important; }
              header, .fixed:not(.kib-overlay) { display: none !important; }
              main { padding: 0 !important; margin: 0 !important; max-width: none !important; }
              .kib-noprint { display: none !important; }
              .kib-overlay {
                position: static !important;
                overflow: visible !important;
                background: #fff !important;
                padding: 0 !important;
              }
              #kib-deck { max-width: none !important; margin: 0 !important; }
              #kib-deck > * { margin: 0 !important; }
              .kib-slide {
                width: 297mm !important;
                height: 167mm !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                break-after: page;
                page-break-after: always;
              }
              #kib-deck > *:last-child .kib-slide {
                break-after: auto;
                page-break-after: auto;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
