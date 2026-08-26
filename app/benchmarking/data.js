// Dados e lógica partilhados da página de Benchmarking (Equipa A).
//
// Está separado de page.js para que tanto a página como o gerador de
// apresentação usem exatamente os mesmos números.
//
// LIGADO AO SUPABASE (26/08): fetchBenchmarkProjects() lê projetos e
// projeto_kpis reais em vez de mockProjects. Industry / Sector / Business
// Area são exatamente os mesmos valores que a Equipa B usa em Benefit
// Tracking Projetos (projetos.subsetor / .setor / .area_negocio) — as
// listas abaixo foram alinhadas aos valores reais que lá existem, para
// as duas páginas baterem certo (antes eram duas listas soltas,
// parecidas mas não iguais).

import { supabase } from '@/lib/supabaseClient';

// = valores reais de projetos.subsetor (ver lib/benefitTrackingStore.js).
export const STANDARD_INDUSTRIES = [
  "Agriculture", "Airlines/Aviation", "Automotive", "Aviation & Aerospace",
  "Building Materials", "Business Supplies and Equipment", "Chemicals",
  "Computer Software", "Construction", "Consumer Goods", "Defense & Space",
  "Electrical/Electronic Manufacturing", "Environmental Services", "Farming",
  "Field Services", "Financial Services", "Food & Beverages", "Food Production",
  "Furniture", "Hospital & Health Care", "Hospitality", "Lean",
  "Leisure, Travel & Tourism", "Logistics and Supply Chain",
  "Management Consulting", "Mechanical or Industrial Engineering",
  "Medical Devices", "Mining & Metals", "Oil & Energy", "Others",
  "Paper & Forest Products", "Plastics", "Research", "Retail Stores",
  "Transportation/Trucking/Railroad", "Warehousing & Transportation",
];

// = valores reais de projetos.setor.
export const STANDARD_MACRO_SECTORS = [
  "Agriculture", "Discrete & Assembly Industries", "Healthcare", "Logistics",
  "Process Industries", "Project Based, IT, Construction", "Retail",
  "Service Industries",
];

export const STANDARD_BUSINESS_AREAS = [
  "Analytics", "Office Production", "Customer Support", "Digital", "Finance",
  "Human Resources", "IT", "Lean", "Warehouse & Transports", "Maintenance",
  "Marketing", "Product Development", "Production & Internal Logistics",
  "Project Management", "Quality", "Retail Stores", "Sales", "Sourcing", "Strat",
  "Customer Experience", "Environment and Sustainability",
];

export const STANDARD_WORKSHOPS = [
  "3P Production Preparation Process", "5S", "AI/ML - Assessment",
  "AI/ML - Implementation", "AI/ML Implementation", "Agile Organisation",
  "Agile Software Development", "Analytics - Implementation",
  "Analytics - Planning Phase", "Coaching", "Customer Experience",
  "Daily Kaizen - Audits", "Daily Kaizen - Daily Management",
  "Daily Kaizen - Kamishibai & Gemba Walks", "Daily Kaizen - Leader Standard Work",
  "Daily Kaizen - Planning Phase", "Daily Kaizen - Problem Solving",
  "Daily Kaizen - Standardisation", "Daily Kaizen - TDP (Manual & Deployment)",
  "Data Architecture & Engineering", "Design Sprints", "Digital Kaizen - Assessment",
  "Digital Kaizen - Implementation", "Follow-up & Process Confirmation",
  "Innovation", "Internal Logistics", "KCM Assessment", "Kobetsu Kaizen",
  "Leader Standard Work", "Lean Portfolio Management", "Lean Product Design",
  "Lean Project Management", "Logistics & SC - Network design",
  "Logistics & SC - Transport optimisation", "Logistics & SC - Warehouse design",
  "M&A Due Diligence", "Maintenance - Autonomous Maintenance",
  "Maintenance - Early Equipment Management", "Maintenance - Planned Maintenance",
  "Maintenance - Predictive Maintenance", "Marketing & Sales",
  "Material Development", "Office & Services - Process Optimisation",
  "Portfolio and Capacity Management", "Process & Workflow Automation",
  "Product Management", "Production - Layout and Line Design", "Production - SMED",
  "Program Governance", "Project Buffer", "Pull Planning",
  "Quality - Autonomous Quality", "Quality - Six Sigma",
  "Resource Planning/ Dimensioning", "Safety", "Sales", "Seminar - Foundations",
  "Seminar - Problem Solving", "Set Based Engineering", "Sourcing",
  "Standard Work", "Steering Committee & Mission Control", "Stock Reduction",
  "Strat Kaizen - Hoshin Review", "Strat Kaizen - Strat Planning",
  "Sustainability - Implementation", "Sustainability - Strategy & Reporting",
  "TWI (Job Instruction/ Job Relations)", "Training", "Training Academy",
  "Transformation Kaizen", "Value Analysis Value Engineering (VAVE)",
  "Value Review", "Value Stream Analysis", "Variable Fee", "Voice of Customer",
];

export const COLABORADORES_RANGES = ["<50", "50-200", "200-500", "500+"];
export const REVENUE_RANGES = ["<20M", "20-50M", "50-100M", "100M+"];

// Países reais presentes na carteira (ver seed em supabase/migrations —
// país é derivado do sufixo do código do projeto / sede real do
// cliente). Lista estática porque os filtros são montados uma vez, no
// carregamento do módulo — antes de fetchBenchmarkProjects() responder.
export const COUNTRIES = [
  "Angola", "Australia", "Belgium", "Brazil", "France", "Germany", "Malta",
  "Morocco", "Netherlands", "Nigeria", "Portugal", "Spain",
  "United Kingdom", "United States",
];

function formatEurCompact(value) {
  const v = Number(value);
  if (!Number.isFinite(v)) return null;
  if (Math.abs(v) >= 1e6) return `€${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `€${Math.round(v / 1e3)}K`;
  return `€${Math.round(v)}`;
}

function bucket(value, ranges) {
  // ranges tal como COLABORADORES_RANGES/REVENUE_RANGES: ["<X", "X-Y", ..., "Z+"]
  if (value === null || value === undefined) return ranges[0];
  const nums = ranges.map((r) => parseFloat(r.replace(/[^0-9.]/g, "")) || 0);
  if (value < nums[1]) return ranges[0];
  for (let i = 1; i < ranges.length - 1; i++) {
    if (value < nums[i + 1]) return ranges[i];
  }
  return ranges[ranges.length - 1];
}

function formatKpiValue(value, unit) {
  const v = Number(value);
  if (!Number.isFinite(v)) return "—";
  if (unit === "%") return `${v}%`;
  if (unit === "days") return `${v} days`;
  if (unit === "EUR/unit") return `€${v.toFixed(2)}`;
  return `${v}${unit ? ` ${unit}` : ""}`;
}

function formatIncrease(baseline, target, unit) {
  const b = Number(baseline);
  const t = Number(target);
  if (!Number.isFinite(b) || !Number.isFinite(t)) return "—";
  const delta = t - b;
  if (unit === "%") {
    const sign = delta >= 0 ? "+" : "";
    return `${sign}${Math.round(delta * 10) / 10}pp`;
  }
  if (b === 0) return "—";
  const pct = Math.round((delta / Math.abs(b)) * 100);
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

function monthsBetween(startIso, endIso) {
  if (!startIso || !endIso) return null;
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24 * 30.44)));
}

// Transforma uma linha real de `projetos` (+ `projeto_kpis` associados)
// no formato que esta página já sabe desenhar (o mesmo shape que
// mockProjects tinha) — assim BulletBar/KpiTable/RelatedProjects não
// precisaram de mudar, só a fonte dos dados.
function toBenchmarkProject(row, kpiRows) {
  const today = new Date();
  const end = row.data_fim ? new Date(row.data_fim) : null;
  const ativo = !end || Number.isNaN(end.getTime()) || end >= today;
  const duration = monthsBetween(row.data_inicio, row.data_fim);

  return {
    codigo: row.codigo,
    cliente: row.cliente,
    em: row.em,
    consultores: row.consultores,
    industry: row.subsetor || null,
    setor: row.setor || null,
    subSetor: row.area_negocio || null, // "Business Area" — mesmo campo que a Equipa B usa
    workshop: null, // sem equivalente real ainda (só existe no protótipo mock)
    colaboradoresRange: bucket(row.colaboradores, COLABORADORES_RANGES),
    colaboradores: row.colaboradores,
    country: row.pais || null,
    revenue: formatEurCompact(row.client_revenue) || "—",
    revenueRange: bucket(row.client_revenue ? row.client_revenue / 1e6 : null, REVENUE_RANGES),
    ebitda: null,
    ativo,
    date: row.data_inicio,
    duration: duration ? `${duration} months` : null,
    details: null,
    kpis: kpiRows
      .filter((k) => k.projeto_codigo === row.codigo && k.baseline != null && k.target != null)
      .map((k) => ({
        name: k.nome,
        baseline: formatKpiValue(k.baseline, k.unidade),
        target: formatKpiValue(k.target, k.unidade),
        increase: formatIncrease(k.baseline, k.target, k.unidade),
        benefit: k.beneficio != null ? formatEurCompact(k.beneficio) : "—",
      })),
  };
}

// Lê projetos + KPIs reais do Supabase e devolve a lista no formato do
// Benchmarking. Chamado uma vez no carregamento da página (ver page.js
// e PresentationGenerator.jsx) — é assim que "os valores do benchmark
// bebem dos projetos" em vez de serem inventados à parte.
export async function fetchBenchmarkProjects() {
  const [{ data: projetos, error: e1 }, { data: kpis, error: e2 }] = await Promise.all([
    supabase.from('projetos').select('*'),
    supabase.from('projeto_kpis').select('*'),
  ]);
  if (e1 || e2) {
    console.error('[benchmarking/data] fetchBenchmarkProjects', e1 || e2);
    return [];
  }
  return (projetos ?? [])
    .map((row) => toBenchmarkProject(row, kpis ?? []))
    .filter((p) => p.kpis.length > 0);
}

export const mockGqcdm = [
  {
    key: "growth",
    label: "Growth",
    kpis: [
      { name: "Revenue Growth", baseline: "8%", target: "15%", increase: "+7pp", benefit: "€2.1M" },
      { name: "New Client Acquisition", baseline: "12", target: "20", increase: "+67%", benefit: "€640K" },
      { name: "Market Share", baseline: "4%", target: "6%", increase: "+2pp", benefit: "€1.3M" },
    ],
  },
  {
    key: "quality",
    label: "Quality",
    kpis: [
      { name: "Defect Rate", baseline: "3.2%", target: "1.5%", increase: "-53%", benefit: "€480K" },
      { name: "First Pass Yield", baseline: "88%", target: "96%", increase: "+8pp", benefit: "€310K" },
      { name: "OEE", baseline: "52%", target: "74%", increase: "+22pp", benefit: "€420K" },
      { name: "Scrap Rate", baseline: "6.5%", target: "3.5%", increase: "-46%", benefit: "€280K" },
    ],
  },
  {
    key: "cost",
    label: "Cost",
    kpis: [
      { name: "Cost per Unit", baseline: "€12.40", target: "€9.80", increase: "-21%", benefit: "€890K" },
      { name: "Overhead Ratio", baseline: "18%", target: "14%", increase: "-4pp", benefit: "€520K" },
      { name: "Waste Reduction", baseline: "6%", target: "2%", increase: "-67%", benefit: "€275K" },
      { name: "Inventory Days", baseline: "38 days", target: "27 days", increase: "-29%", benefit: "€350K" },
    ],
  },
  {
    key: "delivery",
    label: "Delivery",
    kpis: [
      { name: "On-Time Delivery", baseline: "82%", target: "97%", increase: "+15pp", benefit: "€410K" },
      { name: "Lead Time", baseline: "14 days", target: "6 days", increase: "-57%", benefit: "€560K" },
    ],
  },
  {
    key: "motivation",
    label: "Motivation",
    kpis: [
      { name: "Employee Engagement", baseline: "6.4/10", target: "8.2/10", increase: "+28%", benefit: "€95K" },
      { name: "Absenteeism", baseline: "5.1%", target: "2.8%", increase: "-45%", benefit: "€150K" },
      { name: "Suggestion Rate", baseline: "0.8/employee", target: "2.1/employee", increase: "+163%", benefit: "€60K" },
    ],
  },
];

export const filterFields = [
  { key: "industry", label: "Industry", options: STANDARD_INDUSTRIES },
  { key: "setor", label: "Sector", options: STANDARD_MACRO_SECTORS },
  { key: "subSetor", label: "Business Area", options: STANDARD_BUSINESS_AREAS },
  { key: "workshop", label: "Workshop", options: STANDARD_WORKSHOPS },
  { key: "colaboradoresRange", label: "# of Employees", options: COLABORADORES_RANGES },
  { key: "revenueRange", label: "Revenue", options: REVENUE_RANGES },
  { key: "country", label: "Country", options: COUNTRIES },
];

export const emptyFilters = Object.fromEntries(filterFields.map((f) => [f.key, ""]));

export function computeMatch(project, filters) {
  const active = filterFields.filter((f) => filters[f.key]);
  if (active.length === 0) return 100;
  const matched = active.filter((f) => project[f.key] === filters[f.key]);
  return Math.round((matched.length / active.length) * 100);
}

// "€2.1M" / "€640K" -> número, para poder somar no resumo do topo.
export function parseBenefit(text) {
  const match = /([\d.]+)\s*([MK])?/.exec(String(text).replace("€", ""));
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const scale = match[2] === "M" ? 1e6 : match[2] === "K" ? 1e3 : 1;
  return value * scale;
}

export function formatBenefit(value) {
  if (value >= 1e6) return `€${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `€${Math.round(value / 1e3)}K`;
  return `€${Math.round(value)}`;
}

// Primeiro número de um valor de KPI: "€12.40" -> 12.4, "14 days" -> 14,
// "6.4/10" -> 6.4. Serve para desenhar as barras e para ordenar colunas.
export function parseMetric(text) {
  const match = /-?[\d.]+/.exec(String(text));
  return match ? parseFloat(match[0]) : null;
}

// Todos os registos de projeto para um dado KPI (cada projeto tem os seus
// próprios baseline/target — é isso que se vê como pontos na barra).
// `projects` vem de fetchBenchmarkProjects() — carregado uma vez no
// componente de topo e passado por props até aqui.
export function projectKpisFor(kpiName, projects) {
  return (projects ?? [])
    .map((project) => project.kpis.find((k) => k.name === kpiName))
    .filter(Boolean);
}
