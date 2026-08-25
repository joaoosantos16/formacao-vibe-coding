# Base de dados (Supabase)

Este projeto usa um único projeto Supabase, **partilhado por todas as
equipas** da formação (ver `CLAUDE.md` para o URL e como obter as
credenciais).

## Dois tipos de tabela: partilhadas vs. privadas de equipa

**Tabelas partilhadas** (a maioria, provavelmente) — entidades que mais
do que uma equipa/página usa (ex: um "Projeto" que aparece em várias
páginas). Estas:
- **não levam prefixo**;
- são definidas **uma única vez, em conjunto**, na "Fase 0" (ver
  `docs/modelo-de-dados.md` e `COMO_COMECAR.md`), **antes** de as
  equipas se separarem para as suas branches;
- nenhuma equipa cria a sua própria versão de uma tabela partilhada —
  se falta um campo, isso é discutido e adicionado ao modelo comum, não
  duplicado numa branch.

**Tabelas privadas de equipa** — só fazem sentido para dados que
genuinamente só a tua equipa usa (ex: notas de rascunho, uma tabela de
teste). Estas sim levam prefixo, para não colidirem:

| Equipa | Prefixo      | Exemplo de tabela privada |
|--------|--------------|-----------------------------|
| A      | `equipa_a_`  | `equipa_a_rascunho`         |
| B      | `equipa_b_`  | `equipa_b_rascunho`         |
| C      | `equipa_c_`  | `equipa_c_rascunho`         |
| D      | `equipa_d_`  | `equipa_d_rascunho`         |

Na dúvida sobre se uma tabela é partilhada ou privada: se outra
equipa/página alguma vez precisar de ler ou escrever esses dados, é
partilhada — não uses prefixo, e trata-a como as outras entidades
comuns.

## Convenção para alterações ao esquema

Sempre que criares ou alterares uma tabela, coluna, policy (RLS), etc.:

1. Guarda o SQL exato que correste num ficheiro novo dentro de
   `supabase/migrations/`, com o nome no formato:
   `AAAAMMDD_HHmm_descricao-curta.sql` (tabelas partilhadas) ou
   `AAAAMMDD_HHmm_equipa-x_descricao-curta.sql` (tabelas privadas de
   equipa).
2. Se for uma tabela **partilhada**, isto acontece na Fase 0, em
   `main`, antes das branches de equipa existirem/serem sincronizadas —
   não numa branch de equipa.
3. Faz commit desse ficheiro junto com o código que depende dele.
4. Se for uma decisão de estrutura relevante feita a meio do dia,
   menciona-a quando a tua equipa pedir ao formador para fazer merge
   para `main` — essa informação entra no `CLAUDE.md` nesse momento.

Isto garante que qualquer pessoa consegue perceber (ou recriar do zero)
a base de dados só a partir do histórico do git — não fica nada "só na
cabeça de quem fez" ou só visível no dashboard do Supabase.

## Row Level Security (RLS)

Ativa sempre RLS em qualquer tabela nova e define policies explícitas.
Não deixes tabelas sem RLS ou com policies genéricas (`using (true)`) em
dados que não devem ser públicos. Nas tabelas privadas de equipa, a
policy também deve impedir que outra equipa veja ou altere esses dados
sem querer.
