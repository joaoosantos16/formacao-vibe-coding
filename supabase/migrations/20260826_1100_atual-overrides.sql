-- "Atual" editado à mão diretamente na Matriz Benefit (célula a
-- célula), à semelhança de projeto_kpi_plano_overrides e
-- projeto_kpi_volume_overrides — pedido do utilizador (26/08): a
-- linha "Atual" era só de leitura (vinha sempre das capturas do
-- separador "Benefit Tracking Update"), sem forma de a corrigir na
-- própria matriz. Quando existe override, ganha ao valor agregado das
-- medições — ver calcKpi em lib/benefitCalc.js.
create table if not exists projeto_kpi_atual_overrides (
  id uuid primary key default gen_random_uuid(),
  kpi_id uuid not null references projeto_kpis(id) on delete cascade,
  mes text not null,
  valor numeric,
  created_at timestamptz not null default now(),
  unique (kpi_id, mes)
);
alter table projeto_kpi_atual_overrides enable row level security;
create policy "projeto_kpi_atual_overrides_select_all" on projeto_kpi_atual_overrides for select using (true);
create policy "projeto_kpi_atual_overrides_insert_all" on projeto_kpi_atual_overrides for insert with check (true);
create policy "projeto_kpi_atual_overrides_update_all" on projeto_kpi_atual_overrides for update using (true) with check (true);
create policy "projeto_kpi_atual_overrides_delete_all" on projeto_kpi_atual_overrides for delete using (true);
