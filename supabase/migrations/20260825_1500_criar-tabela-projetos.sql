-- Tabela partilhada "projetos" — entidade central do benefit tracking,
-- usada pelas 3 páginas (Kaizen, Projetos, Benchmarking).
-- Ver docs/modelo-de-dados.md para a definição completa dos campos.

create table if not exists projetos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  em text,
  setor text,
  subsetor text,
  consultores text,
  kpi text,
  revenue numeric,
  colaboradores integer,
  ebitda numeric,
  cliente text,
  estado text not null default 'ativo' check (estado in ('ativo', 'desativado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projetos enable row level security;

-- Sem autenticação implementada ainda nesta app (é uma formação, não
-- há login) — políticas abertas por agora. Se isto vier a guardar
-- dados sensíveis a sério, apertar isto com autenticação primeiro.
create policy "projetos_select_all" on projetos
  for select using (true);

create policy "projetos_insert_all" on projetos
  for insert with check (true);

create policy "projetos_update_all" on projetos
  for update using (true) with check (true);
