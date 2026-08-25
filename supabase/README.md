# Base de dados (Supabase)

Este projeto usa um projeto Supabase dedicado a esta formação (ver README.md
principal para como configurar as variáveis de ambiente).

## Convenção para alterações ao esquema

Sempre que criares ou alterares uma tabela, coluna, policy (RLS), etc.:

1. Guarda o SQL exato que correste num ficheiro novo dentro de
   `supabase/migrations/`, com o nome no formato:
   `AAAAMMDD_HHmm_descricao-curta.sql` (ex: `20260825_1430_criar-tabela-tarefas.sql`).
2. Faz commit desse ficheiro junto com o código que depende dele.
3. Atualiza a secção "Decisões Tomadas e Porquê" do `CLAUDE.md` se for uma
   decisão de estrutura relevante (ex: porque escolheste aquele modelo de dados).

Isto garante que qualquer consultor consegue perceber (ou recriar do zero)
a base de dados só a partir do histórico do git — não fica nada "só na
cabeça de quem fez" ou só visível no dashboard do Supabase.

## Row Level Security (RLS)

Ativa sempre RLS em qualquer tabela nova e define policies explícitas.
Não deixes tabelas sem RLS ou com policies genéricas (`using (true)`) em
dados que não devem ser públicos.
