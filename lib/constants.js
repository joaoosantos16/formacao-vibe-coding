// Vocabulário partilhado por toda a app.
//
// REGRA: nenhuma página escreve textos de estado/categoria à mão
// (ex: "Em Projeto"). Importa sempre destas constantes. É isto que
// garante que todas as equipas usam exatamente as mesmas palavras,
// mesmo trabalhando em branches separadas sem verem o código umas
// das outras.
//
// Preencher isto na "Fase 0" (ver docs/modelo-de-dados.md), todos
// juntos, antes de as equipas se separarem. Se precisares de um valor
// novo a meio da formação, adiciona-o aqui primeiro e avisa as outras
// equipas — não inventes um valor só na tua branch.

export const PROJETO_STATUS = {
  ACTIVE: 'active',
  CLOSE: 'close',
};

export const PROJETO_STATUS_LABELS = {
  [PROJETO_STATUS.ACTIVE]: 'Active',
  [PROJETO_STATUS.CLOSE]: 'Close',
};
