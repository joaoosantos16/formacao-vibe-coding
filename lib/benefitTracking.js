// Dados mock para a secção Benefit Tracking. Substituir por queries reais
// ao Supabase (via `supabase` de '@/lib/supabaseClient') assim que a Fase 0
// definir as tabelas partilhadas (ver docs/modelo-de-dados.md).

// Hoshin Overview — inputs vêm de KIM e do Planner (ver quadro da equipa).
// Números abaixo são fictícios (não os do dashboard real mostrado na sessão),
// só para desenhar o layout; a equipa liga aos dados reais mais tarde.

export function getHoshinKpis() {
  return {
    deltaHoshinYTDPct: -21.3,
    gapHoshinM: -1.7,
    deltaSamePeriodLYPct: -3.05,
  };
}

export function getHoshinGauge() {
  return { targetM: 12.0, deliveredM: 6.3 };
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function getDeliveredSeries() {
  const hoshinByMonth = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0];
  const deliveredByMonth = [0.6, 1.3, 2.0, 2.9, 3.7, 4.6, 5.4, 6.3];

  return MONTHS.map((month, i) => ({
    month,
    hoshin: hoshinByMonth[i],
    delivered: deliveredByMonth[i] ?? null,
  }));
}

export function getHoshinTeamRows() {
  return [
    { team: 'Ana Ferreira', days: 68.5, valueK: 1450.2, variablesK: 82.4 },
    { team: 'Bruno Costa', days: 54.0, valueK: 1120.8, variablesK: 65.1 },
    { team: 'Carla Mendes', days: 61.5, valueK: 1305.6, variablesK: 74.3 },
    { team: 'Diogo Ramos', days: 47.0, valueK: 980.4, variablesK: 51.9 },
    { team: 'Inês Duarte', days: 66.0, valueK: 1443.0, variablesK: 78.6 },
  ];
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
