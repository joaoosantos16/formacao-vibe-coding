-- Campos extra por KPI necessários para o motor de cálculo (rampa de
-- plano, tarifa unitária, volume mensal) — inspirado no motor de
-- benefit tracking trazido de outra equipa (Benefit_Tracking_Final...html).
alter table projeto_kpis
  add column if not exists volume numeric,
  add column if not exists mes_inicio text,
  add column if not exists mes_objetivo text,
  add column if not exists agregacao_mensal text check (agregacao_mensal in ('avg', 'sum', 'last')) default 'avg';

-- Plano editado à mão, célula a célula (sobrepõe a rampa linear
-- baseline->objetivo calculada automaticamente).
create table if not exists projeto_kpi_plano_overrides (
  id uuid primary key default gen_random_uuid(),
  kpi_id uuid not null references projeto_kpis(id) on delete cascade,
  mes text not null,
  valor numeric,
  created_at timestamptz not null default now(),
  unique (kpi_id, mes)
);
alter table projeto_kpi_plano_overrides enable row level security;
create policy "projeto_kpi_plano_overrides_select_all" on projeto_kpi_plano_overrides for select using (true);
create policy "projeto_kpi_plano_overrides_insert_all" on projeto_kpi_plano_overrides for insert with check (true);
create policy "projeto_kpi_plano_overrides_update_all" on projeto_kpi_plano_overrides for update using (true) with check (true);
create policy "projeto_kpi_plano_overrides_delete_all" on projeto_kpi_plano_overrides for delete using (true);

-- Volume mensal editado à mão (sobrepõe volume anual / 12).
create table if not exists projeto_kpi_volume_overrides (
  id uuid primary key default gen_random_uuid(),
  kpi_id uuid not null references projeto_kpis(id) on delete cascade,
  mes text not null,
  valor numeric,
  created_at timestamptz not null default now(),
  unique (kpi_id, mes)
);
alter table projeto_kpi_volume_overrides enable row level security;
create policy "projeto_kpi_volume_overrides_select_all" on projeto_kpi_volume_overrides for select using (true);
create policy "projeto_kpi_volume_overrides_insert_all" on projeto_kpi_volume_overrides for insert with check (true);
create policy "projeto_kpi_volume_overrides_update_all" on projeto_kpi_volume_overrides for update using (true) with check (true);
create policy "projeto_kpi_volume_overrides_delete_all" on projeto_kpi_volume_overrides for delete using (true);

-- Histórico de alterações (quem mudou o quê, quando) - "Histórico" no
-- ecrã de Benefit.
create table if not exists projeto_kpi_auditoria (
  id uuid primary key default gen_random_uuid(),
  projeto_codigo text not null references projetos(codigo) on delete cascade,
  kpi_id uuid references projeto_kpis(id) on delete set null,
  autor text,
  campo text not null,
  valor_antigo text,
  valor_novo text,
  created_at timestamptz not null default now()
);
alter table projeto_kpi_auditoria enable row level security;
create policy "projeto_kpi_auditoria_select_all" on projeto_kpi_auditoria for select using (true);
create policy "projeto_kpi_auditoria_insert_all" on projeto_kpi_auditoria for insert with check (true);
