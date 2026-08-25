# CLAUDE.md — Memória do Projeto

> Este ficheiro é a "memória" entre sessões. Quando uma equipa termina o seu
> período de trabalho, o Claude Code deve atualizar a secção relevante
> antes de fazer commit. A próxima pessoa (da mesma equipa, ou quem fizer
> o merge) começa a sua sessão pedindo ao Claude Code para ler este
> ficheiro primeiro.

## Modelo de trabalho: equipas em paralelo (não é sessão única)

Este projeto **não** usa um único fio de trabalho sequencial. Está dividido
em 4 equipas que trabalham ao mesmo tempo, cada uma na sua própria branch,
com o seu próprio link de site ao vivo (preview do Vercel):

| Equipa | Branch      | Preview (Vercel)                                                                 | Prefixo de tabelas no Supabase |
|--------|-------------|-----------------------------------------------------------------------------------|----------------------------------|
| A      | `equipa-a`  | formacao-vibe-coding-git-equipa-a-joaoosantos16s-projects.vercel.app              | `equipa_a_`                      |
| B      | `equipa-b`  | formacao-vibe-coding-git-equipa-b-joaoosantos16s-projects.vercel.app              | `equipa_b_`                      |
| C      | `equipa-c`  | formacao-vibe-coding-git-equipa-c-joaoosantos16s-projects.vercel.app              | `equipa_c_`                      |
| D      | `equipa-d`  | formacao-vibe-coding-git-equipa-d-joaoosantos16s-projects.vercel.app              | `equipa_d_`                      |

Regras importantes:
- Ninguém trabalha diretamente em `main`. Cada equipa só mexe na sua branch.
- `main` só é atualizado quando o formador (ou quem estiver a integrar)
  faz merge de uma branch de equipa — isso é feito fora do trabalho normal
  das equipas.
- Este `CLAUDE.md`, na raiz, reflete o estado **consolidado** do projeto
  (o que já foi integrado em `main`). Não é o sítio para notas do trabalho
  em curso de cada equipa — ver `COMO_COMECAR.md` para o fluxo do dia a dia.

## Estado Atual do Projeto (o que já está feito)

- Repositório Git no GitHub: https://github.com/joaoosantos16/formacao-vibe-coding (privado).
- Arquitetura base criada: Next.js 14 (App Router) + Tailwind CSS +
  Supabase (`@supabase/supabase-js`).
- A app mostra apenas uma página de estado (sem funcionalidades de produto
  ainda).
- Projeto Vercel criado e ligado ao repositório: cada branch tem o seu
  próprio deploy automático. Produção (`main`): https://formacao-vibe-coding.vercel.app
- Projeto Supabase dedicado criado (org Kaizen Institute, região eu-west-1,
  ref `lkwgkupyzictgknpyxzs`). URL: https://lkwgkupyzictgknpyxzs.supabase.co
  Variáveis de ambiente já configuradas no Vercel.
- 4 branches de equipa criadas (`equipa-a` a `equipa-d`), todas a partir
  do estado atual de `main`.

## Decisões Tomadas e Porquê

- **Next.js (App Router)** em vez de outra framework: é a framework nativa
  do Vercel (deploy automático a cada `git push`, zero configuração), e é a
  stack mais bem documentada para programar com apoio de IA.
- **Tailwind CSS**: estilização dentro do próprio ficheiro do componente —
  menos ficheiros a coordenar entre pessoas diferentes.
- **Supabase**, um único projeto dedicado a esta formação, partilhado por
  todas as equipas: Postgres + Auth + API prontos a usar. Cada equipa usa
  um prefixo de tabela próprio (ver tabela acima) para não colidir com as
  outras no mesmo esquema partilhado.
- **Modelo de equipas em paralelo, em vez de sessão única sequencial**:
  com 20 pessoas, um único condutor de cada vez deixava a maioria parada.
  Dividir em 4 equipas com branches e previews próprios permite trabalho
  simultâneo real, ao custo de precisar de um merge para `main` de vez em
  quando (feito pelo formador).
- **`supabase/migrations/`**: todas as alterações ao esquema da base de
  dados ficam registadas em SQL nesta pasta (ver `supabase/README.md`).
- **CLAUDE.md como memória entre sessões**: reflete sempre o estado
  consolidado em `main`, atualizado nos momentos de merge.

_(as próximas decisões — de arquitetura ou de produto — devem ser
acrescentadas aqui por quem as tomar, com uma frase do porquê)_

## Próximo Passo Imediato

Ainda não há nenhuma funcionalidade definida. Cada equipa deve decidir o
que vai construir na sua parte da plataforma e começar a trabalhar na sua
branch — ver `COMO_COMECAR.md`.

## Problemas Conhecidos / Por Resolver

Nenhum, por agora.

## Como Correr o Projeto Localmente

Ver `COMO_COMECAR.md` para o passo a passo completo (linguagem simples,
sem assumir conhecimento prévio de git/terminal). Resumo técnico:

```bash
git clone https://github.com/joaoosantos16/formacao-vibe-coding.git
cd formacao-vibe-coding
git checkout equipa-a          # trocar "equipa-a" pela tua equipa
npm install
cp .env.example .env.local     # preencher com as credenciais reais do Supabase
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).
