-- Campos do formulário "novo projeto" da Equipa B que ainda não tinham
-- coluna: receita do cliente, custo do projeto, fee variável.
alter table projetos
  add column if not exists client_revenue numeric,
  add column if not exists project_cost numeric,
  add column if not exists variable_fee numeric;
