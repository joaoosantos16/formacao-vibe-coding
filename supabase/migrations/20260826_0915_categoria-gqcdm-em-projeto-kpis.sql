-- Categoria GQCDM do KPI (Growth/Quality/Cost/Delivery/Motivation),
-- usada para agrupar os KPIs no Benchmarking (Equipa A).
alter table projeto_kpis
  add column if not exists categoria text check (categoria in ('growth', 'quality', 'cost', 'delivery', 'motivation'));
