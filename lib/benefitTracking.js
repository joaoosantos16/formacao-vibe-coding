// Dados mock para a secção Benefit Tracking. Substituir por queries reais
// ao Supabase (via `supabase` de '@/lib/supabaseClient') assim que a Fase 0
// definir as tabelas partilhadas (ver docs/modelo-de-dados.md).

// Hoshin Overview — inputs vêm de KIM e do Planner (ver quadro da equipa).
// Números abaixo são fictícios (não os do dashboard real mostrado na sessão),
// só para desenhar o layout; a equipa liga aos dados reais mais tarde.

// Hoshin anual: 13.0M€ (o valor real do quadro da equipa). "Mês atual" = Ago,
// hoshin-a-data = 13.0 * 8/12 = 8.67M€. As restantes figuras derivam daqui,
// para os KPIs, o gauge e a tabela nunca contarem histórias diferentes.
const HOSHIN_TARGET_M = 13.0;
const CURRENT_MONTH_INDEX = 7; // Ago (0 = Jan)
const HOSHIN_YTD_M = round2((HOSHIN_TARGET_M / 12) * (CURRENT_MONTH_INDEX + 1));
const DELIVERED_YTD_M = 6.82;

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

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function getDeliveredSeries() {
  const deliveredByMonth = [0.65, 1.40, 2.15, 2.95, 3.80, 4.70, 5.65, DELIVERED_YTD_M];

  return MONTHS.map((month, i) => ({
    month,
    hoshin: round2((HOSHIN_TARGET_M / 12) * (i + 1)),
    delivered: deliveredByMonth[i] ?? null,
  }));
}

export function getHoshinTeamRows() {
  return [
    { team: 'Ana Ferreira', days: 68.5, valueK: 1570.1, variablesK: 89.2 },
    { team: 'Bruno Costa', days: 54.0, valueK: 1213.8, variablesK: 70.5 },
    { team: 'Carla Mendes', days: 61.5, valueK: 1413.3, variablesK: 80.4 },
    { team: 'Diogo Ramos', days: 47.0, valueK: 1061.3, variablesK: 56.2 },
    { team: 'Inês Duarte', days: 66.0, valueK: 1562.1, variablesK: 85.1 },
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

export function getVariables() {
  return [
    { variable: 'Tempo de Setup', project: 'Redução de Setup — Linha A', valorAtual: 34, valorAlvo: 20, unidade: 'min' },
    { variable: 'Nível de Stock', project: 'Otimização de Armazém', valorAtual: 4.2, valorAlvo: 3, unidade: 'dias' },
    { variable: 'OEE', project: 'Melhoria OEE — Embalagem', valorAtual: 61, valorAlvo: 75, unidade: '%' },
  ];
}

export function getProductivity() {
  return [
    { project: 'Redução de Setup — Linha A', horasPlaneadas: 240, horasReais: 268 },
    { project: 'Otimização de Armazém', horasPlaneadas: 160, horasReais: 150 },
    { project: 'Melhoria OEE — Embalagem', horasPlaneadas: 320, horasReais: 410 },
  ];
}
