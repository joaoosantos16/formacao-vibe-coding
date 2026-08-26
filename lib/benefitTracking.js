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
// the rest are new fields this page needs that aren't in that shared table
// yet — mock for now, flag as shared before creating a real column/table.
// quarterPotentialK/quarterInvoicedK are the € slice of potential/invoiced
// attributable to the current quarter (not a time label — always money).

// Update requests are meant to go out automatically every other Thursday —
// see getNextAutoUpdateDate(). There's no real scheduler/notification
// channel wired up yet (no cron, no email/Slack integration), so this date
// is a UI-only preview of the cadence until that's built.
export function getNextAutoUpdateDate(from = new Date()) {
  const anchor = new Date('2026-01-01T00:00:00Z'); // a Thursday
  const dayMs = 24 * 60 * 60 * 1000;
  const daysSinceAnchor = Math.floor((from.getTime() - anchor.getTime()) / dayMs);
  const cyclesElapsed = Math.floor(daysSinceAnchor / 14);
  let next = new Date(anchor.getTime() + cyclesElapsed * 14 * dayMs);
  if (next.getTime() <= from.getTime()) next = new Date(next.getTime() + 14 * dayMs);
  return next;
}
export function getVariablesRows() {
  return [
    {
      client: 'Acme Pharma',
      project: 'Setup Time Reduction – Line 3',
      projectCode: 'ACME-201-POR',
      em: 'J. Rosa',
      start: '2026-02-01',
      end: '2026-11-30',
      potentialK: 45.0,
      invoicedK: 18.0,
      status: 'Pending',
      quarterPotentialK: 12.0,
      quarterInvoicedK: 6.0,
      lastUpdate: '2026-08-10',
    },
    {
      client: 'Northwind Foods',
      project: 'Warehouse Layout Redesign',
      projectCode: 'NWFD-202-POR',
      em: 'M. Alves',
      start: '2026-01-15',
      end: '2026-09-30',
      potentialK: 32.5,
      invoicedK: 32.5,
      status: 'Invoiced',
      quarterPotentialK: 8.0,
      quarterInvoicedK: 8.0,
      lastUpdate: '2026-07-22',
    },
    {
      client: 'Contoso Auto',
      project: 'Changeover Standardization',
      projectCode: 'CTSO-203-POR',
      em: 'T. Nunes',
      start: '2026-03-01',
      end: '2026-12-15',
      potentialK: 58.0,
      invoicedK: 0,
      status: 'Overdue',
      quarterPotentialK: 15.0,
      quarterInvoicedK: 0.0,
      lastUpdate: '2026-06-30',
    },
    {
      client: 'Fabrikam Health',
      project: 'Inventory Accuracy Improvement',
      projectCode: 'FBRK-204-POR',
      em: 'J. Rosa',
      start: '2026-04-01',
      end: '2026-10-31',
      potentialK: 21.0,
      invoicedK: 10.5,
      status: 'Pending',
      quarterPotentialK: 7.0,
      quarterInvoicedK: 3.5,
      lastUpdate: '2026-08-18',
    },
    {
      client: 'Globex Logistics',
      project: 'Delivery Performance Program',
      projectCode: 'GLBX-205-POR',
      em: 'S. Costa',
      start: '2026-05-01',
      end: '2027-01-31',
      potentialK: 40.0,
      invoicedK: 0,
      status: 'Pending',
      quarterPotentialK: 10.0,
      quarterInvoicedK: 0.0,
      lastUpdate: '2026-08-05',
    },
    {
      client: 'Initech Retail',
      project: 'Replenishment Process Redesign',
      projectCode: 'INIT-206-POR',
      em: 'M. Alves',
      start: '2026-02-15',
      end: '2026-08-31',
      potentialK: 27.0,
      invoicedK: 27.0,
      status: 'Invoiced',
      quarterPotentialK: 9.0,
      quarterInvoicedK: 9.0,
      lastUpdate: '2026-08-20',
    },
    {
      client: 'Umbrella Labs',
      project: 'Batch Size Optimization',
      projectCode: 'UMBR-207-POR',
      em: 'T. Nunes',
      start: '2026-06-01',
      end: '2027-02-28',
      potentialK: 63.0,
      invoicedK: 12.0,
      status: 'Overdue',
      quarterPotentialK: 16.0,
      quarterInvoicedK: 4.0,
      lastUpdate: '2026-07-01',
    },
  ];
}

// Productivity — occupation (billed days / days on client) per project, so
// the team can see who has free capacity. "Top Free" = sorted by lowest
// occupation first. "project" here is the project code (matches the
// projectCode field in the Variables section's rows) — not a descriptive
// initiative name. "em" is a consultant code from getConsultants() — the
// same identity space, so the Consultant view's filters can match a
// consultant to their projects. occPct/varK/varStatus/greenDays line up
// 1:1 with the Variables section's rows for the same underlying project.
// jxavier deliberately has 3 projects, to have a real multi-project case
// to test the Consultant filter against.
// "Critical" and "Continuidade" are manual flags for now — the team hasn't
// decided the exact rule for Critical yet (told me they'll specify it
// later), so don't infer one from occupation/status.
export function getProductivityTopFree() {
  return [
    { project: 'ACME-201-POR', em: 'jxavier', occPct: 62, varK: 45.0, varStatus: 'OK', greenDays: 38, critical: false, continuidade: null },
    { project: 'NWFD-202-POR', em: 'msoares', occPct: 88, varK: 32.5, varStatus: 'OK', greenDays: 55, critical: false, continuidade: 'Yes' },
    { project: 'CTSO-203-POR', em: 'ppereira', occPct: 34, varK: 58.0, varStatus: 'NOK', greenDays: 12, critical: true, continuidade: 'No' },
    { project: 'FBRK-204-POR', em: 'jxavier', occPct: 71, varK: 21.0, varStatus: 'OK', greenDays: 44, critical: false, continuidade: null },
    { project: 'GLBX-205-POR', em: 'jxavier', occPct: 45, varK: 40.0, varStatus: 'NOK', greenDays: 20, critical: true, continuidade: null },
    { project: 'INIT-206-POR', em: 'joaosilva', occPct: 91, varK: 27.0, varStatus: 'OK', greenDays: 58, critical: false, continuidade: 'Yes' },
    { project: 'UMBR-207-POR', em: 'pcarvalho', occPct: 39, varK: 63.0, varStatus: 'NOK', greenDays: 15, critical: true, continuidade: 'No' },
  ];
}

// Weekly trend for one project, deterministic mock (no real KIM/Planner
// feed yet). Two independent tracks, each with its own left/right axis:
//
// Occupation (left axis) — "Real" is the measured trend up to "now"; a
// real measurement is never a flat constant, so there's no separate
// "Objective" line holding one number — "Forecast" (green) continues from
// "now" by extrapolating the slope of the last few Real weeks.
//
// Green days (right axis) — a control chart, same idea as a burn-down but
// climbing instead of draining: "Theoretical" is a straight line rising at
// a fixed target pace (one green day per working day). "Real" is the
// actual cumulative green days up to "now", anchored to the same total
// shown in the Top Free table — the gap between the two is the point:
// it's what lets the team see if they're accumulating green days faster
// or slower than the plan.
const WEEKS = 12;
const NOW_WEEK_INDEX = 7; // week 8 of 12
const GREEN_DAYS_TARGET_PER_WEEK = 5; // one per working day

export function getProjectWeeklySeries(projectCode) {
  const rows = getProductivityTopFree();
  const row = rows.find((r) => r.project === projectCode) ?? rows[0];
  const seed = row.project.length;

  const startOcc = 90;
  const real = [];
  for (let w = 0; w <= NOW_WEEK_INDEX; w++) {
    const progress = w / NOW_WEEK_INDEX;
    const trend = startOcc + (row.occPct - startOcc) * progress;
    const wobble = Math.sin(w * 1.3 + seed) * 4;
    real.push(Math.round(trend + wobble));
  }

  const slopeWindow = real.slice(-3);
  const avgSlope = (slopeWindow[slopeWindow.length - 1] - slopeWindow[0]) / (slopeWindow.length - 1);

  const forecast = [real[NOW_WEEK_INDEX]];
  for (let w = NOW_WEEK_INDEX + 1; w < WEEKS; w++) {
    forecast.push(Math.max(0, Math.round(forecast[forecast.length - 1] + avgSlope)));
  }

  const theoreticalGreenDays = Array.from({ length: WEEKS }, (_, w) => Math.round(GREEN_DAYS_TARGET_PER_WEEK * w));

  // Ramps up to the project's actual current total (row.greenDays) by
  // "now" — not a straight line, so it visibly tracks ahead of or behind
  // Theoretical along the way, not just at the end.
  const realGreenDays = [];
  for (let w = 0; w <= NOW_WEEK_INDEX; w++) {
    const progress = NOW_WEEK_INDEX === 0 ? 1 : w / NOW_WEEK_INDEX;
    const wobble = Math.sin(w * 1.1 + seed) * 1.5;
    realGreenDays.push(w === NOW_WEEK_INDEX ? row.greenDays : Math.max(0, Math.round(row.greenDays * progress + wobble)));
  }

  return Array.from({ length: WEEKS }, (_, w) => ({
    week: `W${w + 1}`,
    real: w <= NOW_WEEK_INDEX ? real[w] : null,
    forecast: w >= NOW_WEEK_INDEX ? forecast[w - NOW_WEEK_INDEX] : null,
    theoreticalGreenDays: theoreticalGreenDays[w],
    realGreenDays: w <= NOW_WEEK_INDEX ? realGreenDays[w] : null,
  }));
}

export const PROJECT_OVERVIEW_NOW_WEEK_INDEX = NOW_WEEK_INDEX;

// Real Kaizen career ladder (given by the team). There are also more
// junior titles below "Consultant" that weren't fully specified yet —
// ask before inventing one, don't guess a name for them.
export const CONSULTANT_LEVELS = [
  'Consultant',
  'Senior Consultant',
  'Project Leader',
  'Senior Project Leader',
  'Manager',
  'Senior Manager',
  'Principal',
  'Senior Principal',
];

// Productivity — Consultant view. Reuses the real consultant codes from the
// Hoshin team table (see getHoshinTeamRows); "pt no team" is a bucket, not
// a person, so it's excluded here. Level/occPct/fridayUtilPct are
// illustrative — there's no real source for them yet.
export function getConsultants() {
  return [
    { consultant: 'ppereira', level: 'Senior Consultant', occPct: 82, fridayUtilPct: 65 },
    { consultant: 'msoares', level: 'Manager', occPct: 88, fridayUtilPct: 70 },
    { consultant: 'asaraiva', level: 'Project Leader', occPct: 75, fridayUtilPct: 58 },
    { consultant: 'acunha', level: 'Consultant', occPct: 69, fridayUtilPct: 52 },
    { consultant: 'joaosilva', level: 'Senior Project Leader', occPct: 91, fridayUtilPct: 74 },
    { consultant: 'pcarvalho', level: 'Consultant', occPct: 63, fridayUtilPct: 48 },
    { consultant: 'jxavier', level: 'Consultant', occPct: 55, fridayUtilPct: 40 },
    { consultant: 'martalemos', level: 'Consultant', occPct: 48, fridayUtilPct: 35 },
    { consultant: 'aandion', level: 'Senior Consultant', occPct: 71, fridayUtilPct: 55 },
  ];
}

export function getConsultantLevels() {
  return [...new Set(getConsultants().map((c) => c.level))];
}

// Global (all-consultant average) occupation over the same 12-week window
// as the Project Overview chart.
export function getGlobalOccupationSeries() {
  const consultants = getConsultants();
  const avgOcc = consultants.reduce((sum, c) => sum + c.occPct, 0) / consultants.length;
  return Array.from({ length: WEEKS }, (_, w) => ({
    week: `W${w + 1}`,
    occPct: Math.round(avgOcc + Math.sin(w * 0.9) * 6 - (WEEKS - w) * 0.3),
  }));
}

// Cumulative green days across the team over the same window.
export function getGreenDaysEvolution() {
  const totalGreenDays = getProductivityTopFree().reduce((sum, r) => sum + r.greenDays, 0);
  return Array.from({ length: WEEKS }, (_, w) => ({
    week: `W${w + 1}`,
    greenDays: Math.round((totalGreenDays / WEEKS) * (w + 1) * (0.85 + 0.03 * w)),
  }));
}
