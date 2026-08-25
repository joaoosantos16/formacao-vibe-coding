// Dados mock para a secção Benefit Tracking. Substituir por queries reais
// ao Supabase (via `supabase` de '@/lib/supabaseClient') assim que a Fase 0
// definir as tabelas partilhadas (ver docs/modelo-de-dados.md).

// Hoshin Overview — inputs come from KIM and Planner (see team whiteboard).
// Headline figures below match the real Lisbon Office dashboard shown in
// the working session (Hoshin 13.0M€, delivered 6.65M€, gap -1.80M€) so
// the KPIs, gauge, chart and table all tell the same story. The two new
// cards (Order Book, Variables Fees to be Invoiced) are additions the
// whiteboard asked for that don't exist in the source dashboard, so their
// values are illustrative until wired to a real source.
const HOSHIN_TARGET_M = 13.0;
const HOSHIN_YTD_M = 8.45;
const DELIVERED_YTD_M = 6.65;

export function getHoshinKpis() {
  return {
    deltaHoshinYTDPct: round1(((DELIVERED_YTD_M - HOSHIN_YTD_M) / HOSHIN_YTD_M) * 100),
    gapHoshinM: round2(DELIVERED_YTD_M - HOSHIN_YTD_M),
    deltaSamePeriodLYPct: -3.05,
  };
}

export function getHoshinGauge() {
  return { targetM: HOSHIN_TARGET_M, deliveredM: DELIVERED_YTD_M };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getDeliveredSeries() {
  const hoshinByMonth = [1.05, 2.10, 3.15, 4.20, 5.30, 6.40, 7.40, HOSHIN_YTD_M, 9.60, 10.70, 11.80, HOSHIN_TARGET_M];
  const deliveredByMonth = [0.62, 1.35, 2.05, 2.85, 3.65, 4.50, 5.55, DELIVERED_YTD_M];

  return MONTHS.map((month, i) => ({
    month,
    hoshin: hoshinByMonth[i],
    delivered: deliveredByMonth[i] ?? null,
  }));
}

// Real consultant codes and Days/Value from the Lisbon Office dashboard.
export function getHoshinTeamRows() {
  return [
    { team: 'pt ppereira', days: 360.5, valueK: 883.22, variablesK: 79.5 },
    { team: 'pt msoares', days: 401.0, valueK: 866.42, variablesK: 78.0 },
    { team: 'pt asaraiva', days: 369.5, valueK: 804.48, variablesK: 72.4 },
    { team: 'pt acunha', days: 329.5, valueK: 784.44, variablesK: 70.6 },
    { team: 'pt joaosilva', days: 327.0, valueK: 650.89, variablesK: 58.6 },
    { team: 'pt pcarvalho', days: 310.0, valueK: 644.34, variablesK: 58.0 },
    { team: 'pt jxavier', days: 286.0, valueK: 618.37, variablesK: 55.7 },
    { team: 'pt no team', days: 222.5, valueK: 525.05, variablesK: 47.3 },
    { team: 'pt martalemos', days: 219.5, valueK: 464.05, variablesK: 41.8 },
    { team: 'pt aandion', days: 211.5, valueK: 411.93, variablesK: 37.1 },
  ];
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

export function getOrderBook() {
  return { valueM: 4.8, deltaVsLastYearPct: 6.4 };
}

export function getVariablesFeesToInvoice() {
  return { valueM: 0.42, deltaVsLastYearPct: -12.0 };
}

// Variables — tracking of variable fees to be charged per project, so the
// team can chase invoicing before it slips. "client"/"project"/"em" line up
// with the shared `projetos` table fields (see docs/regras-claude-code.md);
// start/end/potential/invoiced/status/quarter/quarterInvoiced/lastUpdate are
// new fields this page needs that aren't in that shared table yet — mock
// for now, flag as shared before creating a real column/table for them.
export function getVariablesRows() {
  return [
    {
      client: 'Acme Pharma',
      project: 'Packaging OEE',
      em: 'J. Rosa',
      start: '2026-02-01',
      end: '2026-11-30',
      potentialK: 45.0,
      invoicedK: 18.0,
      status: 'Pending',
      quarter: 'Q3 2026',
      quarterInvoiced: 'Q2 2026',
      lastUpdate: '2026-08-10',
    },
    {
      client: 'Northwind Foods',
      project: 'Warehouse Flow',
      em: 'M. Alves',
      start: '2026-01-15',
      end: '2026-09-30',
      potentialK: 32.5,
      invoicedK: 32.5,
      status: 'Invoiced',
      quarter: 'Q2 2026',
      quarterInvoiced: 'Q2 2026',
      lastUpdate: '2026-07-22',
    },
    {
      client: 'Contoso Auto',
      project: 'Line Changeover',
      em: 'T. Nunes',
      start: '2026-03-01',
      end: '2026-12-15',
      potentialK: 58.0,
      invoicedK: 0,
      status: 'Overdue',
      quarter: 'Q2 2026',
      quarterInvoiced: null,
      lastUpdate: '2026-06-30',
    },
    {
      client: 'Fabrikam Health',
      project: 'Inventory Accuracy',
      em: 'J. Rosa',
      start: '2026-04-01',
      end: '2026-10-31',
      potentialK: 21.0,
      invoicedK: 10.5,
      status: 'Pending',
      quarter: 'Q3 2026',
      quarterInvoiced: 'Q3 2026',
      lastUpdate: '2026-08-18',
    },
    {
      client: 'Globex Logistics',
      project: 'Delivery Reliability',
      em: 'S. Costa',
      start: '2026-05-01',
      end: '2027-01-31',
      potentialK: 40.0,
      invoicedK: 0,
      status: 'Pending',
      quarter: 'Q4 2026',
      quarterInvoiced: null,
      lastUpdate: '2026-08-05',
    },
    {
      client: 'Initech Retail',
      project: 'Store Replenishment',
      em: 'M. Alves',
      start: '2026-02-15',
      end: '2026-08-31',
      potentialK: 27.0,
      invoicedK: 27.0,
      status: 'Invoiced',
      quarter: 'Q3 2026',
      quarterInvoiced: 'Q3 2026',
      lastUpdate: '2026-08-20',
    },
    {
      client: 'Umbrella Labs',
      project: 'Batch Setup Time',
      em: 'T. Nunes',
      start: '2026-06-01',
      end: '2027-02-28',
      potentialK: 63.0,
      invoicedK: 12.0,
      status: 'Overdue',
      quarter: 'Q2 2026',
      quarterInvoiced: 'Q2 2026',
      lastUpdate: '2026-07-01',
    },
  ];
}

export function getProductivity() {
  return [
    { project: 'Redução de Setup — Linha A', horasPlaneadas: 240, horasReais: 268 },
    { project: 'Otimização de Armazém', horasPlaneadas: 160, horasReais: 150 },
    { project: 'Melhoria OEE — Embalagem', horasPlaneadas: 320, horasReais: 410 },
  ];
}
