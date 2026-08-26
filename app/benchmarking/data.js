// Dados e lógica partilhados da página de Benchmarking (Equipa A).
//
// Está separado de page.js para que tanto a página como o gerador de
// apresentação usem exatamente os mesmos números — e para que a troca
// de dados mock por Supabase seja feita só aqui, num sítio.
//
// Nomenclatura dos campos segue docs/modelo-de-dados.md (Fase 0).

export const STANDARD_INDUSTRIES = [
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

export const STANDARD_MACRO_SECTORS = [
  "Healthcare", "Discrete & Assembly Industries", "Project Based, IT, Construction",
  "Public Sector", "Retail", "Services Industries", "Logistics", "Services",
  "Process Industries",
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

export const mockProjects = [
  {
    codigo: "EMPA-201-POR",
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
    codigo: "EMPB-214-SPA",
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
    codigo: "EMPC-187-GER",
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
    codigo: "EMPD-233-POR",
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
    codigo: "EMPE-245-BRA",
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
    codigo: "EMPF-158-POL",
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
    codigo: "EMPG-219-SPA",
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
    codigo: "EMPH-190-POR",
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

export const uniqueValues = (field) =>
  Array.from(new Set(mockProjects.map((p) => p[field]))).sort();

export const filterFields = [
  { key: "industry", label: "Industry", options: STANDARD_INDUSTRIES },
  { key: "setor", label: "Sector", options: STANDARD_MACRO_SECTORS },
  { key: "subSetor", label: "Business Area", options: STANDARD_BUSINESS_AREAS },
  { key: "workshop", label: "Workshop", options: STANDARD_WORKSHOPS },
  { key: "colaboradoresRange", label: "# of Employees", options: COLABORADORES_RANGES },
  { key: "revenueRange", label: "Revenue", options: REVENUE_RANGES },
  { key: "country", label: "Country", options: uniqueValues("country") },
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
export function projectKpisFor(kpiName) {
  return mockProjects
    .map((project) => project.kpis.find((k) => k.name === kpiName))
    .filter(Boolean);
}
