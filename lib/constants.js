// Vocabulário partilhado por toda a app.
//
// REGRA: nenhuma página escreve textos de estado/categoria à mão
// (ex: "Ativo"). Importa sempre destas constantes. É isto que garante
// que todas as equipas usam exatamente as mesmas palavras, mesmo
// trabalhando em branches separadas sem verem o código umas das
// outras.
//
// Decidido na Fase 0 — ver docs/modelo-de-dados.md para a tabela
// `projetos` completa (campos, tipos, dono de cada campo).

export const PROJETO_ESTADO = {
  ATIVO: 'ativo',
  DESATIVADO: 'desativado',
};

export const PROJETO_ESTADO_LABELS = {
  [PROJETO_ESTADO.ATIVO]: 'Ativo',
  [PROJETO_ESTADO.DESATIVADO]: 'Desativado',
};

// Tabela projeto_kpis.categoria — grupo GQCDM (Equipa A, Benchmarking).
export const KPI_CATEGORIA = {
  GROWTH: 'growth',
  QUALITY: 'quality',
  COST: 'cost',
  DELIVERY: 'delivery',
  MOTIVATION: 'motivation',
};

export const KPI_CATEGORIA_LABELS = {
  [KPI_CATEGORIA.GROWTH]: 'Growth',
  [KPI_CATEGORIA.QUALITY]: 'Quality',
  [KPI_CATEGORIA.COST]: 'Cost',
  [KPI_CATEGORIA.DELIVERY]: 'Delivery',
  [KPI_CATEGORIA.MOTIVATION]: 'Motivation',
};

// Tabela projeto_kpis.direcao — sentido de melhoria do KPI.
export const KPI_DIRECAO = {
  HIGHER: 'higher',
  LOWER: 'lower',
};

export const KPI_DIRECAO_LABELS = {
  [KPI_DIRECAO.HIGHER]: 'Quanto maior, melhor',
  [KPI_DIRECAO.LOWER]: 'Quanto menor, melhor',
};

// Tabela projeto_kpis.frequencia — cadência das medições em
// projeto_kpi_medicoes.
export const KPI_FREQUENCIA = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

export const KPI_FREQUENCIA_LABELS = {
  [KPI_FREQUENCIA.WEEKLY]: 'Semanal',
  [KPI_FREQUENCIA.MONTHLY]: 'Mensal',
};

// Tabela projeto_honorarios_variaveis.estado
export const HONORARIO_ESTADO = {
  PENDING: 'pending',
  INVOICED: 'invoiced',
  OVERDUE: 'overdue',
};

export const HONORARIO_ESTADO_LABELS = {
  [HONORARIO_ESTADO.PENDING]: 'Pendente',
  [HONORARIO_ESTADO.INVOICED]: 'Faturado',
  [HONORARIO_ESTADO.OVERDUE]: 'Em atraso',
};
