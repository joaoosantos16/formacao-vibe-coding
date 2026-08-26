-- Extensão à tabela projetos
alter table projetos
  add column if not exists pais text,
  add column if not exists sr text,
  add column if not exists data_inicio date,
  add column if not exists data_fim date,
  add column if not exists critico boolean,
  add column if not exists continuidade text;

-- KPIs por projeto (une a necessidade da Equipa A e da Equipa B)
create table if not exists projeto_kpis (
  id uuid primary key default gen_random_uuid(),
  projeto_codigo text not null references projetos(codigo) on delete cascade,
  nome text not null,
  formula text,
  unidade text,
  direcao text check (direcao in ('higher', 'lower')),
  baseline numeric,
  target numeric,
  beneficio numeric,
  frequencia text check (frequencia in ('weekly', 'monthly')),
  created_at timestamptz not null default now()
);

alter table projeto_kpis enable row level security;
create policy "projeto_kpis_select_all" on projeto_kpis for select using (true);
create policy "projeto_kpis_insert_all" on projeto_kpis for insert with check (true);
create policy "projeto_kpis_update_all" on projeto_kpis for update using (true) with check (true);
create policy "projeto_kpis_delete_all" on projeto_kpis for delete using (true);

-- Série temporal de medições por KPI (Equipa B)
create table if not exists projeto_kpi_medicoes (
  id uuid primary key default gen_random_uuid(),
  kpi_id uuid not null references projeto_kpis(id) on delete cascade,
  periodo text not null,
  valor numeric,
  created_at timestamptz not null default now()
);

alter table projeto_kpi_medicoes enable row level security;
create policy "projeto_kpi_medicoes_select_all" on projeto_kpi_medicoes for select using (true);
create policy "projeto_kpi_medicoes_insert_all" on projeto_kpi_medicoes for insert with check (true);
create policy "projeto_kpi_medicoes_update_all" on projeto_kpi_medicoes for update using (true) with check (true);
create policy "projeto_kpi_medicoes_delete_all" on projeto_kpi_medicoes for delete using (true);

-- Honorários variáveis (Equipa C - secção Variables)
create table if not exists projeto_honorarios_variaveis (
  id uuid primary key default gen_random_uuid(),
  projeto_codigo text not null references projetos(codigo) on delete cascade,
  potencial numeric,
  faturado numeric,
  potencial_trimestre numeric,
  faturado_trimestre numeric,
  estado text check (estado in ('pending', 'invoiced', 'overdue')) default 'pending',
  ultima_atualizacao date,
  created_at timestamptz not null default now()
);

alter table projeto_honorarios_variaveis enable row level security;
create policy "projeto_honorarios_variaveis_select_all" on projeto_honorarios_variaveis for select using (true);
create policy "projeto_honorarios_variaveis_insert_all" on projeto_honorarios_variaveis for insert with check (true);
create policy "projeto_honorarios_variaveis_update_all" on projeto_honorarios_variaveis for update using (true) with check (true);
create policy "projeto_honorarios_variaveis_delete_all" on projeto_honorarios_variaveis for delete using (true);

-- Ocupação semanal (Equipa C - secção Productivity)
create table if not exists projeto_ocupacao_semanal (
  id uuid primary key default gen_random_uuid(),
  projeto_codigo text not null references projetos(codigo) on delete cascade,
  semana text not null,
  ocupacao_pct numeric,
  created_at timestamptz not null default now()
);

alter table projeto_ocupacao_semanal enable row level security;
create policy "projeto_ocupacao_semanal_select_all" on projeto_ocupacao_semanal for select using (true);
create policy "projeto_ocupacao_semanal_insert_all" on projeto_ocupacao_semanal for insert with check (true);
create policy "projeto_ocupacao_semanal_update_all" on projeto_ocupacao_semanal for update using (true) with check (true);
create policy "projeto_ocupacao_semanal_delete_all" on projeto_ocupacao_semanal for delete using (true);
