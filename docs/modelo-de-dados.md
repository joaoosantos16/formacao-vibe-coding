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
