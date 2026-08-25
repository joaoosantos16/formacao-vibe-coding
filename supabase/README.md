# Base de dados (Supabase)

Este projeto usa um único projeto Supabase, **partilhado por todas as
equipas** da formação (ver `CLAUDE.md` para o URL e como obter as
credenciais).

## Cada equipa tem o seu prefixo de tabelas

Como a base de dados é partilhada, cada equipa deve prefixar todas as
tabelas que criar com o nome da sua equipa, para não colidir com as
tabelas de outra equipa:

| Equipa | Prefixo      | Exemplo de tabela        |
|--------|--------------|---------------------------|
| A      | `equipa_a_`  | `equipa_a_tarefas`        |
| B      | `equipa_b_`  | `equipa_b_comentarios`    |
| C      | `equipa_c_`  | `equipa_c_utilizadores`   |
| D      | `equipa_d_`  | `equipa_d_pedidos`        |

## Convenção para alterações ao esquema

Sempre que criares ou alterares uma tabela, coluna, policy (RLS), etc.:

1. Guarda o SQL exato que correste num ficheiro novo dentro de
   `supabase/migrations/`, com o nome no formato:
   `AAAAMMDD_HHmm_equipa-x_descricao-curta.sql` (ex:
   `20260825_1430_equipa-a_criar-tabela-tarefas.sql`).
2. Faz commit desse ficheiro junto com o código que depende dele, na
   branch da tua equipa.
3. Se for uma decisão de estrutura relevante, menciona-a quando a tua
   equipa pedir ao formador para fazer merge para `main` — essa
   informação entra no `CLAUDE.md` nesse momento.

Isto garante que qualquer pessoa consegue perceber (ou recriar do zero)
a base de dados só a partir do histórico do git — não fica nada "só na
cabeça de quem fez" ou só visível no dashboard do Supabase.

## Row Level Security (RLS)

Ativa sempre RLS em qualquer tabela nova e define policies explícitas.
Não deixes tabelas sem RLS ou com policies genéricas (`using (true)`) em
dados que não devem ser públicos. Como a base de dados é partilhada entre
equipas, isto também evita que uma equipa veja ou altere sem querer os
dados de outra.
