# Modelo de Dados Partilhado

> Preencher isto **todos juntos**, projetado no ecrã, ANTES de as equipas
> se separarem para as suas branches. Depois de isto ficar em `main`,
> cada equipa sincroniza a sua branch com `git merge main` antes de
> começar a construir (ver `COMO_COMECAR.md`, passo "Fase 0").

## Porquê é que isto existe

Cada equipa trabalha isolada, na sua própria branch e sessão de Claude
Code — **ninguém vê automaticamente o código de outra equipa.** Se cada
equipa inventar os seus próprios nomes de tabelas, campos e valores (ex:
uma escreve `"Em Projeto"`, outra escreve `"in_progress"`, outra
`"A decorrer"`), o trabalho não encaixa quando for tudo junto. Este
ficheiro é o único sítio combinado por todos, para que o Claude Code de
qualquer equipa saiba exatamente que nomes e valores usar — sem ter de
adivinhar o que as outras equipas fizeram.

**Isto NÃO é "definir tudo à partida".** Só entra aqui o que é
genuinamente **partilhado** — uma entidade ou um campo que mais do que
uma página/equipa vai ler ou escrever. Tudo o resto (estado interno de
uma página, componentes, variáveis, como cada equipa organiza o seu
próprio código) fica de fora deste ficheiro e é decidido livremente por
cada equipa, sem precisar de combinação nenhuma. Na maioria das
formações isto acaba por ser 1 a 3 tabelas e um punhado de valores — um
exercício de 10-15 minutos, não uma especificação completa.

**Isto também não é um portão único.** Se a meio do dia uma equipa
perceber que precisa de mais uma coisa partilhada que ninguém previu:
1. Acrescenta essa entidade/campo/valor aqui e em `lib/constants.js`.
2. Faz commit e push para `main` (ou pede ao formador para o fazer).
3. Avisa as outras equipas para correrem `git merge main` outra vez.

Não é preciso parar tudo nem voltar a reunir toda a gente — só manter
este ficheiro como a única fonte de verdade sempre que algo passa a ser
partilhado.

## Entidades principais

_(preencher: nome da entidade/tabela, os seus campos, e o tipo de cada campo)_

Formato sugerido:

### `nome_da_tabela`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | gerado automaticamente |
| ... | ... | ... |

## Vocabulário / estados

Qualquer campo do tipo "estado" ou "categoria" (ex: o estado de um
projeto, o tipo de um pedido) tem de ter aqui a **lista fechada** de
valores possíveis — o valor tal como vai ser guardado no código, e o
rótulo em português a mostrar ao utilizador. Ninguém escreve texto à
mão no código: todos importam de `lib/constants.js` (ver esse ficheiro).

| Valor no código (`lib/constants.js`) | Rótulo em português a mostrar |
|---|---|
| _exemplo:_ `em_projeto` | _exemplo:_ "Em Projeto" |
| | |

## Quem constrói/lê o quê

_(que equipa/página cria ou atualiza cada entidade, e que outras equipas
apenas leem essa informação — para se saber quem "é dono" de cada tabela)_

| Entidade | Equipa responsável (cria/edita) | Outras equipas que leem |
|---|---|---|
| | | |

---

Depois de preenchido, isto converte-se em duas coisas concretas no código:

1. **Uma migração SQL** em `supabase/migrations/` — as tabelas reais,
   criadas uma única vez, antes das equipas se separarem.
2. **As constantes** em `lib/constants.js` — os valores e rótulos da
   secção "Vocabulário / estados" acima, para que o código nunca precise
   de escrever esse texto à mão.
