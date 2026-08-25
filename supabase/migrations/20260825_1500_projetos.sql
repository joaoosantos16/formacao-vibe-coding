-- Entidade partilhada "projetos" (Benefits Tracking) — equipa B, para ser
-- aplicada por quem faz merge para main (ver supabase/README.md).
--
-- ATENÇÃO: já existe uma tabela "projetos" nesta base de dados, criada por
-- outra equipa, com colunas diferentes (ex: "codigo" em vez de "code").
-- NÃO corras isto sem antes alinhar o esquema com quem criou essa tabela
-- — ver conversa com o João. Por agora a página usa dados dummy no
-- front-end (app/projetos/page.js) e não toca nesta tabela.
--
-- Corre isto no SQL Editor do projeto Supabase, só depois de resolvido:
-- https://supabase.com/dashboard/project/lkwgkupyzictgknpyxzs/sql/new

create table if not exists projetos (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  company text not null,
  sector text,
  em text,
  sr text,
  logo_url text,
  estado text not null default 'active' check (estado in ('active', 'close')),
  created_at timestamptz not null default now()
);

alter table projetos enable row level security;

-- Sem login implementado ainda nesta app — políticas abertas por agora.
-- Quando houver autenticação, isto deve ser restringido (ex: só o EM
-- dono do projeto pode editar/apagar).
create policy "projetos_select" on projetos for select using (true);
create policy "projetos_insert" on projetos for insert with check (true);
create policy "projetos_update" on projetos for update using (true);
create policy "projetos_delete" on projetos for delete using (true);

-- Bucket de Storage para o logo (upload opcional).
insert into storage.buckets (id, name, public)
values ('project-logos', 'project-logos', true)
on conflict (id) do nothing;

create policy "project_logos_public_read" on storage.objects
  for select using (bucket_id = 'project-logos');

create policy "project_logos_public_upload" on storage.objects
  for insert with check (bucket_id = 'project-logos');
