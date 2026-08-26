// Camada de dados da Equipa B (Benefit Tracking Projetos) — ligada à
// tabela partilhada `projetos` + `projeto_kpis` + `projeto_kpi_medicoes`
// no Supabase (ver docs/modelo-de-dados.md).
//
// Todas as funções exportadas mantêm exatamente a mesma assinatura que
// tinham quando isto era um protótipo em localStorage — só o "por
// dentro" mudou. `id` continua a identificar um projeto, mas agora é o
// `codigo` (estável e único), não um id gerado aleatoriamente.

import { supabase } from './supabaseClient';

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

// Roster fixo de pessoas — usado para SR, EM e Consultores enquanto não
// há sistema de utilizadores a sério.
export const PEOPLE = ['Ana Silva', 'Rui Costa', 'Sofia Marques', 'João Pais', 'Marta Alves', 'Pedro Nunes'];

// Catálogo genérico de KPIs — usado tanto para a pesquisa (Search KPI)
// como para alimentar as recomendações por projeto.
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

function kpiRowToKpi(row) {
  return {
    id: row.id,
    name: row.nome,
    formula: row.formula,
    unit: row.unidade,
    direction: row.direcao,
    chart: row.chart_type,
    categoria: row.categoria,
    baseline: row.baseline,
    target: row.target,
    beneficio: row.beneficio,
    frequency: row.frequencia,
    // Campos do motor de cálculo (ver lib/benefitCalc.js).
    volume: row.volume,
    mesInicio: row.mes_inicio,
    mesObjetivo: row.mes_objetivo,
    monthlyAggregation: row.agregacao_mensal || 'avg',
  };
}

function rowToProject(row, kpiRows = [], measurements = {}) {
  return {
    id: row.codigo,
    client: row.cliente,
    sector: row.setor,
    subsector: row.subsetor,
    code: row.codigo,
    sr: row.sr,
    em: row.em,
    consultants: row.consultores
      ? row.consultores.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    clientRevenue: row.client_revenue,
    employees: row.colaboradores,
    projectCost: row.project_cost,
    variableFee: row.variable_fee,
    startDate: row.data_inicio,
    endDate: row.data_fim,
    businessCase: null,
    kpis: kpiRows.map(kpiRowToKpi),
    measurements,
  };
}

export async function getProjects() {
  const { data: rows, error } = await supabase
    .from('projetos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[benefitTrackingStore] getProjects', error);
    return [];
  }
  const { data: kpiRows } = await supabase.from('projeto_kpis').select('*');
  const kpisByCode = {};
  (kpiRows ?? []).forEach((k) => {
    (kpisByCode[k.projeto_codigo] ??= []).push(k);
  });
  return (rows ?? []).map((row) => {
    const project = rowToProject(row, kpisByCode[row.codigo] ?? []);
    return { ...project, status: computeStatus(project) };
  });
}

export async function getProject(id) {
  const { data: row, error } = await supabase
    .from('projetos')
    .select('*')
    .eq('codigo', id)
    .maybeSingle();
  if (error || !row) return null;

  const { data: kpiRows } = await supabase
    .from('projeto_kpis')
    .select('*')
    .eq('projeto_codigo', id);
  const kpis = kpiRows ?? [];

  const kpiIds = kpis.map((k) => k.id);
  let medicoes = [];
  let planOv = [];
  let volOv = [];
  let atualOv = [];
  if (kpiIds.length) {
    const [medRes, planRes, volRes, atualRes] = await Promise.all([
      supabase.from('projeto_kpi_medicoes').select('*').in('kpi_id', kpiIds),
      supabase.from('projeto_kpi_plano_overrides').select('*').in('kpi_id', kpiIds),
      supabase.from('projeto_kpi_volume_overrides').select('*').in('kpi_id', kpiIds),
      supabase.from('projeto_kpi_atual_overrides').select('*').in('kpi_id', kpiIds),
    ]);
    medicoes = medRes.data ?? [];
    planOv = planRes.data ?? [];
    volOv = volRes.data ?? [];
    atualOv = atualRes.data ?? [];
  }
  const measurements = {};
  const planOverridesByKpi = {};
  const volumeOverridesByKpi = {};
  const atualOverridesByKpi = {};
  for (const k of kpis) {
    measurements[k.id] = {};
    planOverridesByKpi[k.id] = {};
    volumeOverridesByKpi[k.id] = {};
    atualOverridesByKpi[k.id] = {};
  }
  for (const m of medicoes) {
    measurements[m.kpi_id] = measurements[m.kpi_id] ?? {};
    measurements[m.kpi_id][m.periodo] = m.valor;
  }
  for (const o of planOv) {
    planOverridesByKpi[o.kpi_id] = planOverridesByKpi[o.kpi_id] ?? {};
    planOverridesByKpi[o.kpi_id][o.mes] = o.valor;
  }
  for (const o of volOv) {
    volumeOverridesByKpi[o.kpi_id] = volumeOverridesByKpi[o.kpi_id] ?? {};
    volumeOverridesByKpi[o.kpi_id][o.mes] = o.valor;
  }
  for (const o of atualOv) {
    atualOverridesByKpi[o.kpi_id] = atualOverridesByKpi[o.kpi_id] ?? {};
    atualOverridesByKpi[o.kpi_id][o.mes] = o.valor;
  }

  const project = rowToProject(row, kpis, measurements);
  project.kpis = project.kpis.map((k) => ({
    ...k,
    measurements: measurements[k.id] ?? {},
    planOverrides: planOverridesByKpi[k.id] ?? {},
    volumeOverrides: volumeOverridesByKpi[k.id] ?? {},
    atualOverrides: atualOverridesByKpi[k.id] ?? {},
  }));
  return { ...project, status: computeStatus(project) };
}

export async function createProject(data) {
  const code = data.code || `PROJ-${Date.now()}`;
  const { error } = await supabase.from('projetos').insert({
    codigo: code,
    cliente: data.client ?? null,
    setor: data.sector ?? null,
    subsetor: data.subsector ?? null,
    sr: data.sr ?? null,
    em: data.em ?? null,
    consultores: (data.consultants ?? []).join(', ') || null,
    client_revenue: data.clientRevenue ?? null,
    colaboradores: data.employees ?? null,
    project_cost: data.projectCost ?? null,
    variable_fee: data.variableFee ?? null,
    data_inicio: data.startDate || null,
    data_fim: data.endDate || null,
    estado: 'ativo',
  });
  if (error) throw error;

  for (const kpi of data.kpis ?? []) {
    await addKpiToProject(code, kpi);
  }
  return code;
}

export async function updateProject(id, patch) {
  const payload = {};
  if ('client' in patch) payload.cliente = patch.client;
  if ('sector' in patch) payload.setor = patch.sector;
  if ('subsector' in patch) payload.subsetor = patch.subsector;
  if ('sr' in patch) payload.sr = patch.sr;
  if ('em' in patch) payload.em = patch.em;
  if ('consultants' in patch) payload.consultores = (patch.consultants ?? []).join(', ') || null;
  if ('clientRevenue' in patch) payload.client_revenue = patch.clientRevenue;
  if ('employees' in patch) payload.colaboradores = patch.employees;
  if ('projectCost' in patch) payload.project_cost = patch.projectCost;
  if ('variableFee' in patch) payload.variable_fee = patch.variableFee;
  if ('startDate' in patch) payload.data_inicio = patch.startDate || null;
  if ('endDate' in patch) payload.data_fim = patch.endDate || null;
  if (Object.keys(payload).length === 0) return;
  const { error } = await supabase.from('projetos').update(payload).eq('codigo', id);
  if (error) throw error;
}

export async function deleteProject(id) {
  // ON DELETE CASCADE em projeto_kpis / projeto_kpi_medicoes trata do resto.
  const { error } = await supabase.from('projetos').delete().eq('codigo', id);
  if (error) throw error;
}

export async function addKpiToProject(id, kpi) {
  const { data, error } = await supabase
    .from('projeto_kpis')
    .insert({
      projeto_codigo: id,
      nome: kpi.name,
      formula: kpi.formula ?? null,
      unidade: kpi.unit ?? null,
      direcao: kpi.direction ?? null,
      baseline: kpi.baseline ?? null,
      target: kpi.target ?? null,
      beneficio: kpi.beneficio ?? null,
      frequencia: kpi.frequency ?? null,
      chart_type: kpi.chart ?? null,
      categoria: kpi.categoria ?? null,
      volume: kpi.volume ?? null,
      mes_inicio: kpi.mesInicio ?? null,
      mes_objetivo: kpi.mesObjetivo ?? null,
      agregacao_mensal: kpi.monthlyAggregation ?? 'avg',
    })
    .select()
    .single();
  if (error) throw error;
  await logAudit(id, data.id, 'kpi_adicionado', null, kpi.name);
  return data.id;
}

export async function removeKpiFromProject(_id, kpiId) {
  const { error } = await supabase.from('projeto_kpis').delete().eq('id', kpiId);
  if (error) throw error;
}

export async function updateKpiConfig(id, kpiId, patch) {
  const payload = {};
  if ('name' in patch) payload.nome = patch.name;
  if ('formula' in patch) payload.formula = patch.formula;
  if ('unit' in patch) payload.unidade = patch.unit;
  if ('direction' in patch) payload.direcao = patch.direction;
  if ('baseline' in patch) payload.baseline = patch.baseline;
  if ('target' in patch) payload.target = patch.target;
  if ('beneficio' in patch) payload.beneficio = patch.beneficio;
  if ('frequency' in patch) payload.frequencia = patch.frequency;
  if ('chart' in patch) payload.chart_type = patch.chart;
  if ('categoria' in patch) payload.categoria = patch.categoria;
  if ('volume' in patch) payload.volume = patch.volume;
  if ('mesInicio' in patch) payload.mes_inicio = patch.mesInicio;
  if ('mesObjetivo' in patch) payload.mes_objetivo = patch.mesObjetivo;
  if ('monthlyAggregation' in patch) payload.agregacao_mensal = patch.monthlyAggregation;
  if (Object.keys(payload).length === 0) return;
  const { error } = await supabase.from('projeto_kpis').update(payload).eq('id', kpiId);
  if (error) throw error;
  const [campo, valor] = Object.entries(patch)[0] ?? [];
  if (campo) await logAudit(id, kpiId, campo, null, String(valor));
}

export async function setMeasurement(id, kpiId, period, value) {
  const { data: existing } = await supabase
    .from('projeto_kpi_medicoes')
    .select('id')
    .eq('kpi_id', kpiId)
    .eq('periodo', period)
    .maybeSingle();
  if (existing) {
    const { error } = await supabase
      .from('projeto_kpi_medicoes')
      .update({ valor: value })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('projeto_kpi_medicoes')
      .insert({ kpi_id: kpiId, periodo: period, valor: value });
    if (error) throw error;
  }
  await logAudit(id, kpiId, `Act ${period}`, null, value === null ? '(apagado)' : String(value));
}

// ---------- Motor de Benefit Tracking: overrides de plano/volume ----------
// Ver lib/benefitCalc.js. "Plano" é a rampa linear baseline->objetivo,
// editável célula a célula (mês) — quando existe override, ganha
// sempre à rampa automática. "Volume" segue a mesma lógica sobre
// volume anual / 12.

export async function setPlanOverride(projetoCodigo, kpiId, mes, value) {
  if (value === null || value === undefined || value === '') {
    const { error } = await supabase
      .from('projeto_kpi_plano_overrides')
      .delete()
      .eq('kpi_id', kpiId)
      .eq('mes', mes);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('projeto_kpi_plano_overrides')
      .upsert({ kpi_id: kpiId, mes, valor: value }, { onConflict: 'kpi_id,mes' });
    if (error) throw error;
  }
  await logAudit(projetoCodigo, kpiId, `Plano ${mes}`, null, value === null ? '(rampa automática)' : String(value));
}

export async function setVolumeOverride(projetoCodigo, kpiId, mes, value) {
  if (value === null || value === undefined || value === '') {
    const { error } = await supabase
      .from('projeto_kpi_volume_overrides')
      .delete()
      .eq('kpi_id', kpiId)
      .eq('mes', mes);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('projeto_kpi_volume_overrides')
      .upsert({ kpi_id: kpiId, mes, valor: value }, { onConflict: 'kpi_id,mes' });
    if (error) throw error;
  }
  await logAudit(projetoCodigo, kpiId, `Volume ${mes}`, null, value === null ? '(volume anual / 12)' : String(value));
}

// "Atual" editado diretamente na Matriz Benefit — ganha ao valor
// agregado a partir das capturas (separador "Benefit Tracking
// Update") quando definido. Mesma lógica de override que Plano/Volume.
export async function setAtualOverride(projetoCodigo, kpiId, mes, value) {
  if (value === null || value === undefined || value === '') {
    const { error } = await supabase
      .from('projeto_kpi_atual_overrides')
      .delete()
      .eq('kpi_id', kpiId)
      .eq('mes', mes);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('projeto_kpi_atual_overrides')
      .upsert({ kpi_id: kpiId, mes, valor: value }, { onConflict: 'kpi_id,mes' });
    if (error) throw error;
  }
  await logAudit(projetoCodigo, kpiId, `Atual ${mes}`, null, value === null ? '(capturas)' : String(value));
}

// ---------- Histórico de alterações ----------
// Sem autenticação implementada ainda (ver docs/modelo-de-dados.md),
// por isso o autor fica em branco por agora — a coluna já existe,
// pronta para quando houver login.

export async function logAudit(projetoCodigo, kpiId, campo, valorAntigo, valorNovo) {
  const { error } = await supabase.from('projeto_kpi_auditoria').insert({
    projeto_codigo: projetoCodigo,
    kpi_id: kpiId ?? null,
    autor: null,
    campo,
    valor_antigo: valorAntigo === null || valorAntigo === undefined ? null : String(valorAntigo),
    valor_novo: valorNovo === null || valorNovo === undefined ? null : String(valorNovo),
  });
  // O histórico é um extra informativo — uma falha aqui não deve
  // impedir a operação principal (ex: gravar uma medição).
  if (error) console.error('[benefitTrackingStore] logAudit', error);
}

export async function getAuditTrail(projetoCodigo, limit = 100) {
  const { data, error } = await supabase
    .from('projeto_kpi_auditoria')
    .select('*')
    .eq('projeto_codigo', projetoCodigo)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[benefitTrackingStore] getAuditTrail', error);
    return [];
  }
  return data ?? [];
}

export { recommendKpis, generatePeriods, computeStatus };
