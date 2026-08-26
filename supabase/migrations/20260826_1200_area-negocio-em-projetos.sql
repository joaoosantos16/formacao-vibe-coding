-- "Business Area" por projeto — para o Benchmarking (Equipa A) e o
-- Benefit Tracking Projetos (Equipa B) passarem a usar exatamente o
-- mesmo campo/vocabulário (ver lib/taxonomy.js), em vez de cada
-- equipa ter a sua própria lista solta que não batia com a outra.
alter table projetos add column if not exists area_negocio text;
