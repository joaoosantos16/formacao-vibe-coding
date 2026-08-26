-- Tipo de gráfico a usar para as medições deste KPI (Line Chart, Gauge,
-- Bar Chart, etc — Equipa B).
alter table projeto_kpis add column if not exists chart_type text;
