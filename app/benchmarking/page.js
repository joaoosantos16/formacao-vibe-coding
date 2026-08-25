"use client";

// Equipa A — branch `equipa-a`.
// Constrói aqui o conteúdo desta página. O menu e o layout à volta
// (components/NavBar.jsx, app/layout.js) são partilhados — não mexer
// nesses sem combinar com as outras equipas.
//
// Estado atual: apenas UI, com dados mock (mockProjects / mockGqcdm).
// Sem ligação à base de dados — isso fica para uma fase seguinte.
//
// Nomenclatura de campos (Código, EM, Setor, SubSetor, Consultores, KPI,
// Revenue, #Colaboradores, EBITDA, Cliente, Ativo/Desativado) e as listas
// de Industry / Macro Sector / Business Area / Workshop vêm dos ficheiros
// partilhados pelo utilizador (Standard_Workshops(C).xlsx e
// "Industry Macro Sector Business Area.xlsx"). Isto é usado aqui, na
// minha página, livremente — mas como é suposto ser a mesma linguagem
// usada por todas as equipas, a versão definitiva partilhada só deve ir
// para docs/modelo-de-dados.md e lib/constants.js depois de confirmado
// com o formador (ver regras-claude-code.md, secção 1).

import { Fragment, useState } from "react";

const STANDARD_INDUSTRIES = [
  "Agriculture", "Automotive", "Building Materials", "Consumer Electronics",
  "Consumer Goods", "Furniture", "Medical Devices", "Others", "Plastics",
  "Stamping", "Tableware", "Textiles", "Hospital & Healthcare", "Laboratory",
  "Pharmaceuticals", "Airlines/Aviation", "Maritime", "Package/Freight Delivery",
  "Transportation/Trucking/Railroad", "Warehousing", "Warehousing & Transportation",
  "Chemicals", "Food & Beverages", "Glass, Ceramics and Concrete", "Mining & Metals",
  "Oil & Energy", "Paper & Forest Products", "Printing", "Construction",
  "Information Technology and Services", "Research", "Central Administration",
  "Local Administration", "Apparel & Fashion", "Luxury Goods & Jewerly", "Retail",
  "Sporting goods", "Supermarkets", "Telecommunications", "Wholesale",
  "After-sales services", "Banking", "Civic & Social Organization",
  "Consumer Services", "Field Services", "Hospitality", "Insurance",
  "Investment Management", "Leisure, Travel & Tourism", "Management Consulting",
  "Public Relations & Communications", "Real Estate", "Shared Services", "Utilities",
];

const STANDARD_MACRO_SECTORS = [
  "Healthcare", "Discrete & Assembly Industries", "Project Based, IT, Construction",
  "Public Sector", "Retail", "Services Industries", "Logistics", "Services",
  "Process Industries",
];

const STANDARD_BUSINESS_AREAS = [
  "Analytics", "Office Production", "Customer Support", "Digital", "Finance",
  "Human Resources", "IT", "Lean", "Warehouse & Transports", "Maintenance",
  "Marketing", "Product Development", "Production & Internal Logistics",
  "Project Management", "Quality", "Retail Stores", "Sales", "Sourcing", "Strat",
  "Customer Experience", "Environment and Sustainability",
];

const STANDARD_WORKSHOPS = [
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

const COLABORADORES_RANGES = ["<50", "50-200", "200-500", "500+"];
const REVENUE_RANGES = ["<20M", "20-50M", "50-100M", "100M+"];

const mockProjects = [
  {
    codigo: "PRJ-2311",
    cliente: "Empresa A",
    em: "Jane Silva",
    consultores: "Marco Reis, Sofia Martins",
    industry: "Automotive",
    setor: "Discrete & Assembly Industries",
    subSetor: "Production & Internal Logistics",
    workshop: "Production - Layout and Line Design",
    colaboradoresRange: "200-500",
    colaboradores: 320,
    country: "Portugal",
    revenue: "€45M",
    revenueRange: "20-50M",
    ebitda: "18%",
    ativo: true,
    date: "2024-03-01",
    duration: "6 months",
    details: "Lean transformation on assembly line 3",
    kpis: [
      { name: "On-Time Delivery", baseline: "79%", target: "96%", increase: "+17pp", benefit: "€140K" },
      { name: "Lead Time", baseline: "13 days", target: "5 days", increase: "-62%", benefit: "€190K" },
      { name: "Cost per Unit", baseline: "€13.10", target: "€9.50", increase: "-27%", benefit: "€260K" },
    ],
  },
  {
    codigo: "PRJ-2287",
    cliente: "Empresa B",
    em: "Ricardo Alves",
    consultores: "Marco Reis",
    industry: "Consumer Electronics",
    setor: "Discrete & Assembly Industries",
    subSetor: "Quality",
    workshop: "Quality - Six Sigma",
    colaboradoresRange: "50-200",
    colaboradores: 140,
    country: "Spain",
    revenue: "€22M",
    revenueRange: "20-50M",
    ebitda: "14%",
    ativo: true,
    date: "2023-11-15",
    duration: "4 months",
    details: "OEE improvement on SMT lines",
    kpis: [
      { name: "Defect Rate", baseline: "3.8%", target: "1.6%", increase: "-58%", benefit: "€165K" },
      { name: "First Pass Yield", baseline: "86%", target: "95%", increase: "+9pp", benefit: "€120K" },
    ],
  },
  {
    codigo: "PRJ-2199",
    cliente: "Empresa C",
    em: "Ana Costa",
    consultores: "Pedro Nunes, Laura Gomez",
    industry: "Banking",
    setor: "Services Industries",
    subSetor: "Finance",
    workshop: "Office & Services - Process Optimisation",
    colaboradoresRange: "500+",
    colaboradores: 1200,
    country: "Germany",
    revenue: "€310M",
    revenueRange: "100M+",
    ebitda: "27%",
    ativo: true,
    date: "2023-08-01",
    duration: "8 months",
    details: "Back-office process redesign",
    kpis: [
      { name: "Overhead Ratio", baseline: "19%", target: "15%", increase: "-4pp", benefit: "€310K" },
      { name: "Employee Engagement", baseline: "6.1/10", target: "7.9/10", increase: "+30%", benefit: "€40K" },
    ],
  },
  {
    codigo: "PRJ-2345",
    cliente: "Empresa D",
    em: "Jane Silva",
    consultores: "Tomasz Kowalski",
    industry: "Warehousing & Transportation",
    setor: "Logistics",
    subSetor: "Warehouse & Transports",
    workshop: "Logistics & SC - Warehouse design",
    colaboradoresRange: "200-500",
    colaboradores: 260,
    country: "Portugal",
    revenue: "€38M",
    revenueRange: "20-50M",
    ebitda: "11%",
    ativo: true,
    date: "2024-01-10",
    duration: "5 months",
    details: "Warehouse slotting and picking optimization",
    kpis: [
      { name: "On-Time Delivery", baseline: "80%", target: "98%", increase: "+18pp", benefit: "€150K" },
      { name: "Lead Time", baseline: "15 days", target: "7 days", increase: "-53%", benefit: "€200K" },
    ],
  },
  {
    codigo: "PRJ-2410",
    cliente: "Empresa E",
    em: "Sofia Martins",
    consultores: "Ana Costa",
    industry: "Pharmaceuticals",
    setor: "Healthcare",
    subSetor: "Production & Internal Logistics",
    workshop: "Production - SMED",
    colaboradoresRange: "50-200",
    colaboradores: 95,
    country: "Brazil",
    revenue: "€19M",
    revenueRange: "<20M",
    ebitda: "21%",
    ativo: true,
    date: "2024-05-20",
    duration: "3 months",
    details: "Production line balancing",
    kpis: [
      { name: "Cost per Unit", baseline: "€11.90", target: "€9.20", increase: "-23%", benefit: "€95K" },
      { name: "Waste Reduction", baseline: "7%", target: "2.5%", increase: "-64%", benefit: "€70K" },
    ],
  },
  {
    codigo: "PRJ-2158",
    cliente: "Empresa F",
    em: "Ricardo Alves",
    consultores: "Tomasz Kowalski",
    industry: "Food & Beverages",
    setor: "Process Industries",
    subSetor: "Maintenance",
    workshop: "Maintenance - Autonomous Maintenance",
    colaboradoresRange: "<50",
    colaboradores: 38,
    country: "Poland",
    revenue: "€6M",
    revenueRange: "<20M",
    ebitda: "9%",
    ativo: false,
    date: "2023-06-05",
    duration: "4 months",
    details: "Changeover time reduction",
    kpis: [
      { name: "Waste Reduction", baseline: "5.5%", target: "1.8%", increase: "-67%", benefit: "€35K" },
      { name: "Defect Rate", baseline: "2.9%", target: "1.4%", increase: "-52%", benefit: "€28K" },
    ],
  },
  {
    codigo: "PRJ-2378",
    cliente: "Empresa G",
    em: "Laura Gomez",
    consultores: "Marco Reis, Pedro Nunes",
    industry: "Automotive",
    setor: "Discrete & Assembly Industries",
    subSetor: "Project Management",
    workshop: "Lean Project Management",
    colaboradoresRange: "500+",
    colaboradores: 890,
    country: "Spain",
    revenue: "€180M",
    revenueRange: "100M+",
    ebitda: "16%",
    ativo: true,
    date: "2024-02-14",
    duration: "7 months",
    details: "Plant-wide layout redesign",
    kpis: [
      { name: "Revenue Growth", baseline: "7.5%", target: "14%", increase: "+6.5pp", benefit: "€980K" },
      { name: "Market Share", baseline: "3.8%", target: "5.9%", increase: "+2.1pp", benefit: "€610K" },
      { name: "On-Time Delivery", baseline: "84%", target: "98%", increase: "+14pp", benefit: "€220K" },
    ],
  },
  {
    codigo: "PRJ-2290",
    cliente: "Empresa H",
    em: "Ana Costa",
    consultores: "Ricardo Alves",
    industry: "Banking",
    setor: "Services Industries",
    subSetor: "Sales",
    workshop: "Marketing & Sales",
    colaboradoresRange: "200-500",
    colaboradores: 410,
    country: "Portugal",
    revenue: "€64M",
    revenueRange: "50-100M",
    ebitda: "23%",
    ativo: true,
    date: "2023-12-01",
    duration: "6 months",
    details: "Loan approval process Kaizen",
    kpis: [
      { name: "Revenue Growth", baseline: "8.5%", target: "16%", increase: "+7.5pp", benefit: "€1.1M" },
      { name: "New Client Acquisition", baseline: "14", target: "22", increase: "+57%", benefit: "€320K" },
    ],
  },
];

const mockGqcdm = [
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
    ],
  },
  {
    key: "cost",
    label: "Cost",
    kpis: [
      { name: "Cost per Unit", baseline: "€12.40", target: "€9.80", increase: "-21%", benefit: "€890K" },
      { name: "Overhead Ratio", baseline: "18%", target: "14%", increase: "-4pp", benefit: "€520K" },
      { name: "Waste Reduction", baseline: "6%", target: "2%", increase: "-67%", benefit: "€275K" },
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

const uniqueValues = (field) =>
  Array.from(new Set(mockProjects.map((p) => p[field]))).sort();

const filterFields = [
  { key: "industry", label: "Industry", options: STANDARD_INDUSTRIES },
  { key: "setor", label: "Sector", options: STANDARD_MACRO_SECTORS },
  { key: "subSetor", label: "Business Area", options: STANDARD_BUSINESS_AREAS },
  { key: "workshop", label: "Workshop", options: STANDARD_WORKSHOPS },
  { key: "colaboradoresRange", label: "# of Employees", options: COLABORADORES_RANGES },
  { key: "revenueRange", label: "Revenue", options: REVENUE_RANGES },
  { key: "country", label: "Country", options: uniqueValues("country") },
];

const emptyFilters = Object.fromEntries(filterFields.map((f) => [f.key, ""]));

function computeMatch(project, filters) {
  const active = filterFields.filter((f) => filters[f.key]);
  if (active.length === 0) return 100;
  const matched = active.filter((f) => project[f.key] === filters[f.key]);
  return Math.round((matched.length / active.length) * 100);
}

function FilterBar({ filters, setFilters }) {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-8">
      <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Filters
      </h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterFields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">{field.label}</label>
            <select
              value={filters[field.key]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">All</option>
              {field.options.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {filterFields.some((f) => filters[f.key]) && (
        <button
          onClick={() => setFilters(emptyFilters)}
          className="mt-4 text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function KpiTable({ category, expanded, onToggle, filters }) {
  const isExpanded = expanded.has(category.key);

  return (
    <div className="border-t border-slate-100 first:border-t-0 py-5">
      <button
        onClick={() => onToggle(category.key)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-medium text-slate-700">{category.label}</h3>
        <span className="text-xs text-slate-500 underline underline-offset-2">
          {isExpanded ? "Hide KPIs" : `Show ${category.kpis.length} KPIs`}
        </span>
      </button>
      {isExpanded && (
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400">
              <th className="font-normal pb-2">KPI</th>
              <th className="font-normal pb-2">Average Baseline</th>
              <th className="font-normal pb-2">Benchmark Target</th>
              <th className="font-normal pb-2">Average % Increase</th>
              <th className="font-normal pb-2">Financial Benefit</th>
              <th className="font-normal pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {category.kpis.map((kpi) => (
              <KpiRow key={kpi.name} kpi={kpi} filters={filters} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function KpiRow({ kpi, filters }) {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <>
      <tr className="border-t border-slate-50">
        <td className="py-2 text-slate-700">{kpi.name}</td>
        <td className="py-2 text-slate-500">{kpi.baseline}</td>
        <td className="py-2 text-slate-500">{kpi.target}</td>
        <td className="py-2 text-slate-500">{kpi.increase}</td>
        <td className="py-2 text-slate-700">{kpi.benefit}</td>
        <td className="py-2 text-right">
          <button
            onClick={() => setShowProjects((v) => !v)}
            className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
          >
            {showProjects ? "Hide projects" : "Related projects"}
          </button>
        </td>
      </tr>
      {showProjects && (
        <tr>
          <td colSpan={6} className="pb-4">
            <RelatedProjects kpiName={kpi.name} filters={filters} />
          </td>
        </tr>
      )}
    </>
  );
}

function RelatedProjects({ kpiName, filters }) {
  const [openCode, setOpenCode] = useState(null);

  const rows = mockProjects
    .filter((project) => project.kpis.some((k) => k.name === kpiName))
    .map((project) => ({
      ...project,
      match: computeMatch(project, filters),
      kpiData: project.kpis.find((k) => k.name === kpiName),
    }))
    .sort((a, b) => b.match - a.match);

  if (rows.length === 0) {
    return (
      <p className="mt-1 rounded-2xl bg-slate-50/80 px-4 py-3 text-xs text-slate-400">
        No projects linked to this KPI yet.
      </p>
    );
  }

  return (
    <table className="mt-1 w-full rounded-2xl bg-slate-50/80 text-sm">
      <thead>
        <tr className="text-left text-xs text-slate-400">
          <th className="font-normal px-4 pt-3 pb-2">Project Code / Client</th>
          <th className="font-normal pt-3 pb-2">KPI</th>
          <th className="font-normal pt-3 pb-2">Baseline</th>
          <th className="font-normal pt-3 pb-2">Benchmark Target</th>
          <th className="font-normal pt-3 pb-2">% Increase</th>
          <th className="font-normal pt-3 pb-2">Financial Benefit</th>
          <th className="font-normal pt-3 pb-2">Match</th>
          <th className="font-normal pt-3 pb-2"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((project) => (
          <Fragment key={project.codigo}>
            <tr className="border-t border-white">
              <td className="px-4 py-2 text-slate-700">
                {project.codigo}
                <span className="block text-xs text-slate-400">
                  {project.cliente}
                  {!project.ativo && " — Deactivated"}
                </span>
              </td>
              <td className="py-2 text-slate-500">{project.kpiData.name}</td>
              <td className="py-2 text-slate-500">{project.kpiData.baseline}</td>
              <td className="py-2 text-slate-500">{project.kpiData.target}</td>
              <td className="py-2 text-slate-500">{project.kpiData.increase}</td>
              <td className="py-2 text-slate-700">{project.kpiData.benefit}</td>
              <td className="py-2">
                <MatchBar value={project.match} />
              </td>
              <td className="py-2 text-right pr-4">
                <button
                  onClick={() =>
                    setOpenCode((current) => (current === project.codigo ? null : project.codigo))
                  }
                  className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
                >
                  {openCode === project.codigo ? "Hide" : "Details"}
                </button>
              </td>
            </tr>
            {openCode === project.codigo && <ProjectDetail project={project} />}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

function MatchBar({ value }) {
  return (
    <div className="flex items-center gap-2 min-w-[104px]">
      <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-slate-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 w-9 text-right">{value}%</span>
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
    <tr className="bg-slate-50/60">
      <td colSpan={8} className="px-4 py-4">
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-slate-400">{label}</dt>
              <dd className="text-sm text-slate-700">{value}</dd>
            </div>
          ))}
        </dl>
      </td>
    </tr>
  );
}

export default function BenchmarkingPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [expanded, setExpanded] = useState(new Set());

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
          Benchmarking
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          UI preview with mock data — not yet connected to real project data.
        </p>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Benchmark KPIs (GQCDM)
        </h2>
        <div>
          {mockGqcdm.map((category) => (
            <KpiTable
              key={category.key}
              category={category}
              expanded={expanded}
              onToggle={toggleCategory}
              filters={filters}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
