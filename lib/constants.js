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
