// Motor de cálculo do Benefit Tracking.
//
// Portado do motor trazido de outra equipa (ficheiro de referência
// Benefit_Tracking_Final_...html, função renderBT/calc/totals),
// adaptado ao nosso esquema: projeto_kpis + projeto_kpi_medicoes +
// projeto_kpi_plano_overrides + projeto_kpi_volume_overrides.
//
// Módulo puro (sem I/O) e testável — dado um projeto + KPIs +
// medições, devolve as séries Plano/Atual/Poupança por mês, o RAG, e
// os totais do projeto. Ver docs/modelo-de-dados.md.

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_ABBR_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

export function monthKey(year, month1to12) {
  return `${year}-${pad2(month1to12)}`;
}

function parseMonthKey(mk) {
  const [y, m] = String(mk).split('-').map(Number);
  return { y, m };
}

function isoToMonthKey(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return monthKey(d.getFullYear(), d.getMonth() + 1);
}

// Gera a lista de meses (YYYY-MM) entre dois meses, inclusive.
export function monthsBetween(startMonthKey, endMonthKey) {
  if (!startMonthKey || !endMonthKey) return [];
  const { y: y0, m: m0 } = parseMonthKey(startMonthKey);
  const { y: y1, m: m1 } = parseMonthKey(endMonthKey);
  const out = [];
  let y = y0;
  let m = m0;
  let guard = 0;
  while ((y < y1 || (y === y1 && m <= m1)) && guard < 600) {
    out.push({ key: monthKey(y, m), y, m, label: MONTH_ABBR_PT[m - 1] });
    m += 1;
    if (m > 12) { m = 1; y += 1; }
    guard += 1;
  }
  return out;
}

// Deriva o intervalo de meses de acompanhamento de um projeto a partir
// das datas do projeto (fallback: o ano corrente inteiro, para nunca
// devolver uma grelha vazia).
export function projectMonthRange(project) {
  const now = new Date();
  const fallbackStart = monthKey(now.getFullYear(), 1);
  const fallbackEnd = monthKey(now.getFullYear(), 12);
  const start = isoToMonthKey(project.startDate) || fallbackStart;
  const end = isoToMonthKey(project.endDate) || fallbackEnd;
  return { start: start <= end ? start : end, end: start <= end ? end : start };
}

// Para uma frequência de captura, gera os períodos (rótulo tal como
// aparece em generatePeriods, em benefitTrackingStore.js) já
// emparelhados com o mês (YYYY-MM) a que pertencem — semanas
// atribuídas pela quinta-feira ISO (resolve semanas a cavalo de dois
// meses), meses mapeados diretamente.
export function periodsWithMonths(startDateIso, endDateIso, frequency) {
  if (!startDateIso || !endDateIso) return [];
  const start = new Date(startDateIso);
  const end = new Date(endDateIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const out = [];
  if (frequency === 'monthly') {
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor <= end) {
      const label = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      out.push({ label, month: monthKey(cursor.getFullYear(), cursor.getMonth() + 1) });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else {
    const cursor = new Date(start);
    while (cursor <= end) {
      const oneJan = new Date(cursor.getFullYear(), 0, 1);
      const week = Math.ceil(((cursor - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
      // quinta-feira desta semana ISO (segunda = cursor, quinta = +3 dias).
      const thursday = new Date(cursor);
      thursday.setDate(thursday.getDate() + 3);
      out.push({ label: `W${week}`, month: monthKey(thursday.getFullYear(), thursday.getMonth() + 1) });
      cursor.setDate(cursor.getDate() + 7);
    }
  }
  return out;
}

// Mapa período->mês para um KPI (usa o início/objetivo do próprio KPI
// se definidos, senão as datas do projeto).
export function periodMonthMap(project, kpi) {
  const startIso = kpi.mesInicio ? `${kpi.mesInicio}-01` : project.startDate;
  const endIso = kpi.mesObjetivo ? `${kpi.mesObjetivo}-01` : project.endDate;
  const pairs = periodsWithMonths(startIso, endIso, kpi.frequency);
  const map = {};
  pairs.forEach(({ label, month }) => { map[label] = month; });
  return map;
}

// Agrega as medições (periodo -> valor) para mês (YYYY-MM -> valor),
// segundo a regra de agregação: 'avg' | 'sum' | 'last'.
export function aggregateToMonths(measurements, periodMonth, aggregation = 'avg') {
  const byMonth = {};
  Object.keys(measurements || {}).forEach((periodo) => {
    const mes = periodMonth[periodo];
    const raw = measurements[periodo];
    if (!mes || raw === null || raw === undefined || raw === '') return;
    const v = Number(raw);
    if (Number.isNaN(v)) return;
    (byMonth[mes] ??= []).push(v);
  });
  const out = {};
  Object.keys(byMonth).forEach((mes) => {
    const vals = byMonth[mes];
    if (aggregation === 'sum') out[mes] = vals.reduce((a, b) => a + b, 0);
    else if (aggregation === 'last') out[mes] = vals[vals.length - 1];
    else out[mes] = vals.reduce((a, b) => a + b, 0) / vals.length;
  });
  return out;
}

// Rampa de plano linear baseline -> objetivo entre o mês de início e o
// mês de objetivo do KPI, com overrides manuais célula-a-célula.
export function planSeries(kpi, months) {
  const out = {};
  const b = Number(kpi.baseline);
  const t = Number(kpi.target);
  const monthKeys = months.map((m) => m.key);
  const startKey = kpi.mesInicio && monthKeys.includes(kpi.mesInicio) ? kpi.mesInicio : monthKeys[0];
  let endKey = kpi.mesObjetivo && monthKeys.includes(kpi.mesObjetivo) ? kpi.mesObjetivo : monthKeys[monthKeys.length - 1];
  const i0 = Math.max(0, monthKeys.indexOf(startKey));
  let i1 = monthKeys.indexOf(endKey);
  if (i1 < 0) i1 = monthKeys.length - 1;
  if (i1 < i0) i1 = i0;

  months.forEach((m, i) => {
    let v;
    if (Number.isNaN(b) || Number.isNaN(t)) v = null;
    else if (i < i0) v = b;
    else if (i >= i1) v = t;
    else v = b + ((t - b) * (i - i0)) / (i1 - i0);

    const override = kpi.planOverrides ? kpi.planOverrides[m.key] : undefined;
    if (override !== undefined && override !== null && override !== '') {
      const ov = Number(override);
      if (!Number.isNaN(ov)) v = ov;
    }
    out[m.key] = v === null || Number.isNaN(v) ? null : v;
  });
  return out;
}

export function isPlanOverridden(kpi, mk) {
  return Boolean(kpi.planOverrides && kpi.planOverrides[mk] !== undefined && kpi.planOverrides[mk] !== '');
}

// Tarifa unitária: € de impacto por (unidade de volume x unidade do KPI).
export function rateOf(kpi) {
  const b = Number(kpi.baseline);
  const t = Number(kpi.target);
  const v = Number(kpi.volume);
  const i = Number(kpi.beneficio); // impacto económico ao objetivo
  if ([b, t, v, i].some((n) => Number.isNaN(n)) || v === 0 || b === t) return NaN;
  return i / (v * Math.abs(b - t));
}

export function volumeOfMonth(kpi, mk) {
  const override = kpi.volumeOverrides ? kpi.volumeOverrides[mk] : undefined;
  if (override !== undefined && override !== null && override !== '') {
    const v = Number(override);
    if (!Number.isNaN(v)) return v;
  }
  const v = Number(kpi.volume);
  return Number.isNaN(v) ? NaN : v / 12;
}

export function savingFrom(kpi, mk, value) {
  const b = Number(kpi.baseline);
  const rate = rateOf(kpi);
  const vm = volumeOfMonth(kpi, mk);
  if (value === null || value === undefined || Number.isNaN(b) || Number.isNaN(rate) || Number.isNaN(vm)) return null;
  const improvement = kpi.direction === 'lower' ? b - value : value - b;
  return improvement * vm * rate;
}

// Só convertemos para horas quando a unidade do KPI já é h/min — sem
// um parâmetro de "custo por hora" (que não temos), outras unidades
// não têm forma fiável de converter em horas.
export function hoursFrom(kpi, mk, value) {
  const b = Number(kpi.baseline);
  if (value === null || value === undefined || Number.isNaN(b)) return null;
  const improvement = kpi.direction === 'lower' ? b - value : value - b;
  const unit = (kpi.unit || '').trim().toLowerCase();
  if (['h', 'horas', 'hours', 'hour'].includes(unit)) {
    const vm = volumeOfMonth(kpi, mk);
    return Number.isNaN(vm) ? improvement : improvement * vm;
  }
  if (['min', 'minutos', 'minutes', 'minute'].includes(unit)) {
    const vm = volumeOfMonth(kpi, mk);
    const total = Number.isNaN(vm) ? improvement : improvement * vm;
    return total / 60;
  }
  return null;
}

// Calcula todas as séries derivadas de um KPI para os meses do
// projeto. `kpi.measurements` é o dicionário {periodo: valor} tal como
// guardado em projeto_kpi_medicoes; `kpi.planOverrides` e
// `kpi.volumeOverrides` são {mes: valor}.
export function calcKpi(project, kpi, months) {
  const periodMonth = periodMonthMap(project, kpi);
  const act = aggregateToMonths(kpi.measurements || {}, periodMonth, kpi.monthlyAggregation || 'avg');
  const plan = planSeries(kpi, months);

  const sav = {};
  const savPlan = {};
  const hrs = {};
  months.forEach((m) => {
    const a = act[m.key] ?? null;
    sav[m.key] = savingFrom(kpi, m.key, a);
    savPlan[m.key] = savingFrom(kpi, m.key, plan[m.key]);
    hrs[m.key] = hoursFrom(kpi, m.key, a);
  });

  const withAct = months.filter((m) => act[m.key] !== null && act[m.key] !== undefined);
  const lastMonth = withAct.length ? withAct[withAct.length - 1].key : null;
  const current = lastMonth ? act[lastMonth] : null;
  const last3Act = withAct.slice(-3);
  const quarterAvg = last3Act.length
    ? last3Act.reduce((s, m) => s + act[m.key], 0) / last3Act.length
    : null;

  const monthsWithSaving = months.filter((m) => sav[m.key] !== null && !Number.isNaN(sav[m.key]));
  const savList = monthsWithSaving.map((m) => sav[m.key]);
  const savLast3 = monthsWithSaving.slice(-3).map((m) => sav[m.key]);
  const annualized = savLast3.length
    ? (savLast3.reduce((s, v) => s + v, 0) / savLast3.length) * 12
    : null;

  const hrList = months.map((m) => hrs[m.key]).filter((v) => v !== null && !Number.isNaN(v));

  const b = Number(kpi.baseline);
  const t = Number(kpi.target);
  const progress = current === null || Number.isNaN(b) || Number.isNaN(t) || t === b
    ? null
    : ((current - b) / (t - b)) * 100;

  let rag = 'N';
  if (lastMonth !== null) {
    const a = act[lastMonth];
    const pl = plan[lastMonth];
    if (a !== null && pl !== null) {
      const better = kpi.direction === 'lower' ? a <= pl : a >= pl;
      const overBaseline = kpi.direction === 'lower' ? a < b : a > b;
      rag = better ? 'G' : overBaseline ? 'A' : 'R';
    }
  }

  return {
    months, plan, act, sav, savPlan, hrs,
    lastMonth, current, quarterAvg,
    accumulated: savList.reduce((s, v) => s + v, 0),
    annualized,
    hoursTotal: hrList.reduce((s, v) => s + v, 0),
    potential: Number.isNaN(Number(kpi.beneficio)) ? null : Number(kpi.beneficio),
    rate: rateOf(kpi),
    progress, rag, ragMonth: lastMonth,
    periodMonth,
  };
}

// Totais do projeto, dado [{kpi, calc}] já calculados por calcKpi.
export function projectTotals(kpisWithCalc, months) {
  const byMonth = {};
  const byMonthPlan = {};
  const hoursByMonth = {};
  months.forEach((m) => { byMonth[m.key] = 0; byMonthPlan[m.key] = 0; hoursByMonth[m.key] = 0; });

  let potential = 0;
  let annual = 0;
  let hours = 0;
  let accumulated = 0;
  const rag = { G: 0, A: 0, R: 0, N: 0 };

  kpisWithCalc.forEach(({ calc }) => {
    months.forEach((m) => {
      const s = calc.sav[m.key];
      if (s !== null && !Number.isNaN(s)) { byMonth[m.key] += s; accumulated += s; }
      const sp = calc.savPlan[m.key];
      if (sp !== null && !Number.isNaN(sp)) byMonthPlan[m.key] += sp;
      const h = calc.hrs[m.key];
      if (h !== null && !Number.isNaN(h)) { hoursByMonth[m.key] += h; hours += h; }
    });
    if (calc.potential !== null) potential += calc.potential;
    if (calc.annualized !== null && !Number.isNaN(calc.annualized)) annual += calc.annualized;
    rag[calc.rag] = (rag[calc.rag] || 0) + 1;
  });

  return { months, byMonth, byMonthPlan, hoursByMonth, potential, annual, hours, accumulated, rag };
}

export const KPI_PALETTE = [
  '#0E7A68', '#A15A2E', '#2A5C94', '#6653A0', '#B0563D',
  '#1F7A4C', '#A9791F', '#7E57C2', '#C2185B', '#00838F',
];

export function kpiColor(index) {
  return KPI_PALETTE[index % KPI_PALETTE.length];
}

export function formatEur(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e6) return `${(value / 1e6).toFixed(1)} M€`;
  if (abs >= 1e3) return `${Math.round(value / 1e3)} k€`;
  return `${Math.round(value)} €`;
}
