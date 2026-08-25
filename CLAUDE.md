# CLAUDE.md — Memória do Projeto

> Este ficheiro é a "memória" entre sessões. Quando uma equipa termina o seu
> período de trabalho, o Claude Code deve atualizar a secção relevante
> antes de fazer commit. A próxima pessoa (da mesma equipa, ou quem fizer
> o merge) começa a sua sessão pedindo ao Claude Code para ler este
> ficheiro primeiro.

> **OBRIGATÓRIO:** lê também [`docs/regras-claude-code.md`](docs/regras-claude-code.md)
> antes de fazeres seja o que for — são as regras de como trabalhar
> neste projeto (git, Supabase/SQL, o que é partilhado vs. o que é só
> da tua página).

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

### Fase 0 — obrigatória antes de as equipas se separarem

Cada branch é uma sessão de Claude Code isolada: **nenhuma equipa vê o
código de outra automaticamente.** Se as páginas de equipas diferentes
trabalham sobre a mesma entidade (ex: um "Projeto" que passa por vários
estados, visto em páginas diferentes), os nomes de tabelas/campos e o
vocabulário (ex: os valores de um estado) têm de ser decididos **em
conjunto, uma única vez, em `main`**, antes de as branches serem usadas
— não inventados independentemente por cada equipa.

Isto fica registado em quatro sítios, preenchidos todos juntos:
- `docs/modelo-de-dados.md` — as entidades, campos e vocabulário/estados.
- `lib/constants.js` — esses mesmos valores como constantes de código,
  para que nenhuma página escreva texto de estado à mão.
- `docs/estrutura-do-site.md` — a lista de páginas/rotas e o menu de
  navegação partilhado.
- `components/NavBar.jsx` + `app/layout.js` — a casca da app (barra de
  navegação e layout comum a todas as páginas). Construída uma única
  vez, por quem facilitar a Fase 0 — nenhuma equipa cria a sua própria
  versão disto na sua branch.

Só depois disto estar commitado em `main` é que cada equipa corre
`git merge main` na sua branch (ver `COMO_COMECAR.md`) e começa a
construir. Se as páginas das equipas forem genuinamente independentes
(sem dados partilhados), a Fase 0 pode ser dispensada — mas confirma
isso antes de assumir.

## Estado Atual do Projeto (o que já está feito)

- Repositório Git no GitHub: https://github.com/joaoosantos16/formacao-vibe-coding (privado).
- Arquitetura base criada: Next.js 14 (App Router) + Tailwind CSS +
  Supabase (`@supabase/supabase-js`).
- A app mostra apenas uma página de estado (sem funcionalidades de produto
  ainda).
- **Produto decidido: "KI BT&B"** — plataforma interna Kaizen para
  standardizar o benefit tracking, com 3 páginas/equipas:
  - `equipa-a` → **Benchmarking** (`/benchmarking`)
  - `equipa-b` → **Benefit Tracking Projetos** (`/benefit-tracking-projetos`)
  - `equipa-c` → **Benefit Tracking Kaizen** (`/benefit-tracking-kaizen`)
  - `equipa-d` fica livre/reserva (não há 4ª página).
- Casca partilhada construída: `app/layout.js` renderiza
  `components/NavBar.jsx` (menu fixo no topo, com as 3 páginas acima),
  com direção visual decidida — glassmorphism, tons claros, sombras
  suaves, menu que esconde/mostra com o scroll (ver
  `docs/estrutura-do-site.md`, secção "Direção visual").
- As 3 páginas já existem como esqueleto em `app/<rota>/page.js`,
  prontas para cada equipa construir o conteúdo.
- **Primeira integração feita** (todas as branches de equipa merged em
  `main`): a Equipa A já tem um botão de teste em `/benchmarking`
  (contador de cliques, confirma que a página é interativa). As
  equipas B e C testaram o deploy com elementos visuais na página
  inicial partilhada (ver "Problemas Conhecidos" — provavelmente para
  remover antes de conteúdo a sério). Notas de cada equipa vivem agora
  em `NOTAS-EQUIPA-A.md` a `NOTAS-EQUIPA-D.md` (foram unificadas de
  `NOTAS.md` por causa de um conflito de nome ao integrar).
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
  todas as equipas: Postgres + Auth + API prontos a usar. Tabelas
  **partilhadas** (a maioria) são definidas em conjunto na Fase 0, sem
  prefixo; só tabelas genuinamente privadas de uma equipa levam prefixo
  (ver `supabase/README.md`) — inicialmente assumi que cada equipa
  isolava os seus dados por prefixo, mas isso só funciona se as páginas
  forem independentes. Corrigido depois de perceber que várias páginas
  vão ler/escrever a mesma entidade partilhada.
- **Modelo de equipas em paralelo, em vez de sessão única sequencial**:
  com 20 pessoas, um único condutor de cada vez deixava a maioria parada.
  Dividir em 4 equipas com branches e previews próprios permite trabalho
  simultâneo real, ao custo de precisar de um merge para `main` de vez em
  quando (feito pelo formador).
- **`supabase/migrations/`**: todas as alterações ao esquema da base de
  dados ficam registadas em SQL nesta pasta (ver `supabase/README.md`).
- **CLAUDE.md como memória entre sessões**: reflete sempre o estado
  consolidado em `main`, atualizado nos momentos de merge.

- **"Benefit Tracking" com 3 páginas/equipas** (Kaizen, Projetos,
  Benchmarking): o produto é para um concurso interno — a qualidade
  visual conta muito, por isso o design (glassmorphism, tons claros,
  menu animado) foi decidido e construído antes das equipas se
  separarem, para todas as páginas partilharem a mesma linguagem
  visual em vez de cada equipa inventar a sua.

_(as próximas decisões — de arquitetura ou de produto — devem ser
acrescentadas aqui por quem as tomar, com uma frase do porquê)_

## Próximo Passo Imediato

1. Falta só o **modelo de dados partilhado** (ver `docs/modelo-de-dados.md`):
   que tabelas/campos o benefit tracking precisa e o vocabulário de
   estados. A estrutura do site e o menu já estão feitos.
2. Cada equipa faz `git merge main` na sua branch e começa a construir
   o conteúdo da sua página (já existe o esqueleto em
   `app/<rota>/page.js`) — ver `COMO_COMECAR.md`.

## Problemas Conhecidos / Por Resolver

- A página inicial (`app/page.js`, partilhada) tem dois elementos de
  teste deixados pelas equipas B e C durante a validação do deploy
  (um quadrado preto, um retângulo azul com "Equipa C — teste de
  deployment"). São inofensivos mas não são conteúdo a sério — alguém
  deve limpá-los quando a página inicial for desenhada de verdade
  (lembrar: é partilhada, avisar as equipas antes de mexer).

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
