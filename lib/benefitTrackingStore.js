// Protótipo front-end da Equipa B (Benefit Tracking Projetos).
//
// Dados 100% dummy, guardados em localStorage no browser — não lê nem
// escreve na tabela partilhada `projetos` do Supabase. Isto evita
// colidir com o esquema oficial (ver docs/modelo-de-dados.md) enquanto
// o âmbito completo do spec (Users, Companies, KPI Measurements,
// Dashboard Layouts, Business Cases, Reports...) não for decidido em
// conjunto com as outras equipas.

const STORAGE_KEY = 'btp_projects_v2';

export const KPI_DIRECTION = {
  HIGHER: 'higher',
  LOWER: 'lower',
};

export const KPI_DIRECTION_LABELS = {
  [KPI_DIRECTION.HIGHER]: 'Higher is Better',
  [KPI_DIRECTION.LOWER]: 'Lower is Better',
};

export const KPI_FREQUENCY = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

export const KPI_FREQUENCY_LABELS = {
  [KPI_FREQUENCY.WEEKLY]: 'Weekly',
  [KPI_FREQUENCY.MONTHLY]: 'Monthly',
};

export const CHART_TYPES = [
  'Line Chart',
  'Bar Chart',
  'Column Chart',
  'Area Chart',
  'Gauge',
  'KPI Card',
  'Scatter Plot',
];

export const STATUS_LABELS = {
  active: 'Active',
  closed: 'Closed',
};

// Catálogo fixo de setores/subsetores — dependente (o subsetor
// disponível depende do setor escolhido). Só se pode escolher valores
// desta lista (ver regra "não inventar opções fora da dropdown").
export const SECTOR_SUBSECTORS = {
  Retail: ['Grande Distribuição', 'Moda', 'Eletrónica'],
  Manufacturing: ['Automóvel', 'Bens de Consumo', 'Químico'],
  Energy: ['Distribuição de Energia', 'Renováveis'],
  Logistics: ['Aviação', 'Transporte Rodoviário', 'Armazenagem'],
};

export const SECTORS = Object.keys(SECTOR_SUBSECTORS);

// Roster fixo de pessoas — usado para SR, EM e Consultores. Um
// protótipo não tem sistema de utilizadores, por isso esta lista
// simula "os dados já existentes na plataforma".
export const PEOPLE = ['Ana Silva', 'Rui Costa', 'Sofia Marques', 'João Pais', 'Marta Alves', 'Pedro Nunes'];

// Catálogo genérico de KPIs — equivalente dummy à "KPI Database" da
// plataforma, usado tanto para a pesquisa (Search KPI) como para
// alimentar as recomendações por projeto.
export const KPI_CATALOG = [
  {
    id: 'kpi-productivity',
    name: 'Productivity',
    formula: 'Output / Hours',
    unit: 'units/h',
    direction: KPI_DIRECTION.HIGHER,
    chart: 'Line Chart',
    sectors: ['Retail', 'Manufacturing'],
  },
  {
    id: 'kpi-oee',
    name: 'OEE',
    formula: 'Availability x Performance x Quality',
    unit: '%',
    direction: KPI_DIRECTION.HIGHER,
    chart: 'Gauge',
    sectors: ['Manufacturing', 'Energy'],
  },
  {
    id: 'kpi-lead-time',
    name: 'Lead Time',
    formula: 'End Date - Start Date',
    unit: 'days',
    direction: KPI_DIRECTION.LOWER,
    chart: 'Line Chart',
    sectors: ['Retail', 'Manufacturing', 'Logistics'],
  },
  {
    id: 'kpi-scrap-rate',
    name: 'Scrap Rate',
    formula: 'Scrap / Production',
    unit: '%',
    direction: KPI_DIRECTION.LOWER,
    chart: 'Column Chart',
    sectors: ['Manufacturing'],
  },
  {
    id: 'kpi-otif',
    name: 'OTIF',
    formula: 'On Time In Full Deliveries / Total Deliveries',
    unit: '%',
    direction: KPI_DIRECTION.HIGHER,
    chart: 'Area Chart',
    sectors: ['Logistics', 'Retail'],
  },
  {
    id: 'kpi-cost-per-unit',
    name: 'Cost per Unit',
    formula: 'Total Cost / Units Produced',
    unit: 'EUR/unit',
    direction: KPI_DIRECTION.LOWER,
    chart: 'Bar Chart',
    sectors: ['Manufacturing', 'Retail', 'Energy'],
  },
];

function recommendKpis(project) {
  const bySector = KPI_CATALOG.filter((k) => k.sectors.includes(project.sector));
  const pool = bySector.length ? bySector : KPI_CATALOG;
  return pool.slice(0, 5).map((k, i) => ({
    ...k,
    relevance: Math.max(60, 95 - i * 8),
  }));
}

function generatePeriods(startDate, endDate, frequency) {
  if (!startDate || !endDate) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const periods = [];
  if (frequency === KPI_FREQUENCY.MONTHLY) {
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor <= end) {
      periods.push(cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else {
    // semana ISO aproximada, suficiente para um protótipo
    const cursor = new Date(start);
    while (cursor <= end) {
      const oneJan = new Date(cursor.getFullYear(), 0, 1);
      const week = Math.ceil(((cursor - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
      periods.push(`W${week}`);
      cursor.setDate(cursor.getDate() + 7);
    }
  }
  return periods;
}

// Só Active / Closed — "ending soon" foi removido a pedido.
function computeStatus(project) {
  const today = new Date();
  const end = new Date(project.endDate);
  if (Number.isNaN(end.getTime())) return 'active';
  return today > end ? 'closed' : 'active';
}

function seedProject(overrides) {
  return {
    id: overrides.id,
    client: overrides.client,
    sector: overrides.sector,
    subsector: overrides.subsector,
    code: overrides.code,
    sr: overrides.sr,
    em: overrides.em,
    consultants: overrides.consultants,
    clientRevenue: overrides.clientRevenue,
    employees: overrides.employees,
    projectCost: overrides.projectCost,
    variableFee: overrides.variableFee,
    startDate: overrides.startDate,
    endDate: overrides.endDate,
    businessCase: null,
    kpis: overrides.kpis,
    measurements: overrides.measurements,
  };
}

const SEED_PROJECTS = [
  seedProject({
    id: 'bt-001',
    client: 'Continente',
    sector: 'Retail',
    subsector: 'Grande Distribuição',
    code: 'BT-001',
    sr: 'João Pais',
    em: 'Ana Silva',
    consultants: ['Marta Alves', 'Pedro Nunes'],
    clientRevenue: 5000000,
    employees: 1200,
    projectCost: 80000,
    variableFee: 15000,
    startDate: '2026-01-12',
    endDate: '2026-12-20',
    kpis: [
      { id: 'kpi-productivity', name: 'Productivity', formula: 'Output / Hours', unit: 'units/h', direction: KPI_DIRECTION.HIGHER, chart: 'Line Chart', baseline: 20, target: 25, frequency: KPI_FREQUENCY.WEEKLY },
      { id: 'kpi-lead-time', name: 'Lead Time', formula: 'End Date - Start Date', unit: 'days', direction: KPI_DIRECTION.LOWER, chart: 'Line Chart', baseline: 12, target: 8, frequency: KPI_FREQUENCY.WEEKLY },
    ],
    measurements: {
      'kpi-productivity': { W35: 20, W36: 21, W37: 23, W38: 25 },
      'kpi-lead-time': { W35: 12, W36: 11, W37: 10, W38: 9 },
    },
  }),
  seedProject({
    id: 'bt-002',
    client: 'EDP',
    sector: 'Energy',
    subsector: 'Distribuição de Energia',
    code: 'BT-002',
    sr: 'Marta Alves',
    em: 'Rui Costa',
    consultants: ['João Pais'],
    clientRevenue: 12000000,
    employees: 3400,
    projectCost: 150000,
    variableFee: 30000,
    startDate: '2025-03-01',
    endDate: '2026-01-15',
    kpis: [
      { id: 'kpi-oee', name: 'OEE', formula: 'Availability x Performance x Quality', unit: '%', direction: KPI_DIRECTION.HIGHER, chart: 'Gauge', baseline: 70, target: 80, frequency: KPI_FREQUENCY.MONTHLY },
      { id: 'kpi-scrap-rate', name: 'Scrap Rate', formula: 'Scrap / Production', unit: '%', direction: KPI_DIRECTION.LOWER, chart: 'Column Chart', baseline: 6, target: 3, frequency: KPI_FREQUENCY.MONTHLY },
    ],
    measurements: {
      'kpi-oee': { 'August 2025': 70, 'September 2025': 73, 'October 2025': 76, 'November 2025': 81 },
      'kpi-scrap-rate': { 'August 2025': 6, 'September 2025': 5.2, 'October 2025': 4.1, 'November 2025': 3.4 },
    },
  }),
  seedProject({
    id: 'bt-003',
    client: 'TAP',
    sector: 'Logistics',
    subsector: 'Aviação',
    code: 'BT-003',
    sr: 'Pedro Nunes',
    em: 'Sofia Marques',
    consultants: ['Ana Silva', 'Rui Costa'],
    clientRevenue: 3000000,
    employees: 900,
    projectCost: 60000,
    variableFee: 10000,
    startDate: '2025-06-01',
    endDate: '2025-11-30',
    kpis: [
      { id: 'kpi-otif', name: 'OTIF', formula: 'On Time In Full Deliveries / Total Deliveries', unit: '%', direction: KPI_DIRECTION.HIGHER, chart: 'Area Chart', baseline: 82, target: 95, frequency: KPI_FREQUENCY.MONTHLY },
    ],
    measurements: {
      'kpi-otif': { 'June 2025': 82, 'July 2025': 86, 'August 2025': 90, 'September 2025': 93 },
    },
  }),
];

function readAll() {
  if (typeof window === 'undefined') return SEED_PROJECTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROJECTS));
      return SEED_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PROJECTS;
  }
}

function writeAll(projects) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects() {
  return readAll().map((p) => ({ ...p, status: computeStatus(p) }));
}

export function getProject(id) {
  const project = readAll().find((p) => p.id === id);
  return project ? { ...project, status: computeStatus(project) } : null;
}

export function createProject(data) {
  const projects = readAll();
  const id = `bt-${Date.now()}`;
  const project = {
    ...data,
    id,
    businessCase: null,
    kpis: data.kpis ?? [],
    measurements: data.measurements ?? {},
  };
  writeAll([...projects, project]);
  return id;
}

export function updateProject(id, patch) {
  const projects = readAll();
  const next = projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
  writeAll(next);
}

export function deleteProject(id) {
  const projects = readAll();
  writeAll(projects.filter((p) => p.id !== id));
}

export function addKpiToProject(id, kpi) {
  const projects = readAll();
  const next = projects.map((p) =>
    p.id === id ? { ...p, kpis: [...p.kpis, kpi] } : p
  );
  writeAll(next);
}

export function removeKpiFromProject(id, kpiId) {
  const projects = readAll();
  const next = projects.map((p) =>
    p.id === id ? { ...p, kpis: p.kpis.filter((k) => k.id !== kpiId) } : p
  );
  writeAll(next);
}

export function updateKpiConfig(id, kpiId, patch) {
  const projects = readAll();
  const next = projects.map((p) =>
    p.id === id
      ? { ...p, kpis: p.kpis.map((k) => (k.id === kpiId ? { ...k, ...patch } : k)) }
      : p
  );
  writeAll(next);
}

export function setMeasurement(id, kpiId, period, value) {
  const projects = readAll();
  const next = projects.map((p) => {
    if (p.id !== id) return p;
    const measurements = { ...p.measurements };
    measurements[kpiId] = { ...(measurements[kpiId] ?? {}), [period]: value };
    return { ...p, measurements };
  });
  writeAll(next);
}

export { recommendKpis, generatePeriods, computeStatus };
