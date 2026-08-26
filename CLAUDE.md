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
- Arquitetura base: Next.js 14 (App Router) + Tailwind CSS + Supabase
  (`@supabase/supabase-js`).
- **Produto: "KI BT&B"** — plataforma interna Kaizen de benefit
  tracking, com 3 páginas/equipas:
  - `equipa-a` → **Benchmarking** (`/benchmarking`)
  - `equipa-b` → **Benefit Tracking Projetos** (`/benefit-tracking-projetos`)
  - `equipa-c` → **Benefit Tracking Kaizen** (`/benefit-tracking-kaizen`)
  - `equipa-d` ficou livre/reserva (sem trabalho, não há 4ª página).
- Casca partilhada: `app/layout.js` + `components/NavBar.jsx` (menu
  fixo, esconde/mostra com scroll), landing page (`/`) com fundo escuro
  full-bleed, 1 cor (índigo/violeta), tipografia Inter — ver
  `docs/estrutura-do-site.md`.
- **Modelo de dados fechado e schema criado no Supabase**: tabela
  `projetos` (campos originais + `pais`, `sr`, `data_inicio`,
  `data_fim`, `critico`, `continuidade`, `client_revenue`,
  `project_cost`, `variable_fee`), mais `projeto_kpis` (com `categoria`
  GQCDM e `chart_type`), `projeto_kpi_medicoes`,
  `projeto_honorarios_variaveis`, `projeto_ocupacao_semanal`. RLS ativo
  com políticas abertas (sem auth implementada) — ver
  `docs/modelo-de-dados.md`. 75 projetos reais da Spark Week já na
  tabela `projetos`.
- **Integração final feita (25/08) — as 3 páginas têm conteúdo real**:
  - **Benefit Tracking Projetos** (Equipa B) — **ligada ao Supabase a
    sério** (26/08): portfólio, criação, edição e página individual de
    projeto, configuração e medição de KPIs — tudo lê/escreve nas
    tabelas reais (`lib/benefitTrackingStore.js`). Build de produção
    validado.
  - **Motor de Benefit Tracking completo (26/08)**, portado de um
    protótipo mais rico trazido de outra equipa
    (`Benefit_Tracking_Final_...html`, não commitado — dados/lógica de
    referência, não código a copiar literalmente): separador "Benefit"
    (antes "Dashboard & Reports", fraco) reescrito com Matriz Benefit
    editável (Plano/Atual/Volume/Poupança € por mês, com override
    célula-a-célula), RAG (verde/amber/vermelho comparando Atual vs
    rampa de Plano), estatísticas (potencial/anualizado/%/acumulado/
    horas), tooltips de metodologia em cada €, gráfico mensal
    (logrado vs plano) e de reparto por KPI, e histórico de alterações.
    Motor em `lib/benefitCalc.js` (puro, sem I/O — ver
    `docs/modelo-de-dados.md`).
  - **Benchmarking** (Equipa A) — **ligado ao Supabase a sério (26/08)**:
    `app/benchmarking/data.js` exporta `fetchBenchmarkProjects()`, que lê
    `projetos` + `projeto_kpis` reais em vez de `mockProjects` (removido).
    Industry/Sector/Business Area usam agora exatamente os mesmos valores
    que `projetos.subsetor`/`.setor`/`.area_negocio` (Equipa B) — as
    listas `STANDARD_INDUSTRIES`/`STANDARD_MACRO_SECTORS` (Equipa A) e
    `INDUSTRIES`/`SECTORS` (`lib/benefitTrackingStore.js`, Equipa B) foram
    alinhadas às mesmas 36/8 opções reais, e o formulário "General
    Information" (Equipa B) ganhou os campos Business Area/Country. O
    catálogo GQCDM (`mockGqcdm`) continua estático — representa a norma
    de benchmark da empresa, não um resultado de projeto — mas foi
    alargado com OEE/Scrap Rate/Inventory Days para cobrir os KPIs reais.
  - **Benefit Tracking Kaizen** (Equipa C): Hoshin Overview,
    Productivity, Variables (`components/benefit-tracking/`). Dados em
    `lib/benefitTracking.js` — **ainda mock**. Hoshin fica sempre mock
    (é dashboard agregado, fora de alcance — ver
    `docs/modelo-de-dados.md`). Variables/Productivity têm tabelas
    prontas (`projeto_honorarios_variaveis`,
    `projeto_ocupacao_semanal`) mas sem formulário de criação — ligar
    mostraria só estados vazios até haver como lá meter dados.
- **Dados decoy (26/08)**: os 75 projetos importados só tinham
  codigo/cliente/setor/subsetor/em/sr — sem KPIs, medições, datas ou
  financeiro. Populado via script gerado localmente (não commitado —
  um-uso só, ver histórico do chat): `pais`, `area_negocio` (nova
  coluna), `data_inicio`/`data_fim`, `client_revenue`, `colaboradores`,
  `project_cost`, `variable_fee` em todos os 75; 216 `projeto_kpis`
  (3 por projeto, GQCDM quality/cost/delivery: OEE, Cost per Unit, Lead
  Time, First Pass Yield, Scrap Rate, Inventory Days, On-Time Delivery)
  e 1293 `projeto_kpi_medicoes` mensais nos 72 projetos que ainda não
  tinham KPI (os 3 que já tinham — FPLA-203-POR, ALES-901-SPA,
  OSCA-201-POR — não foram tocados, para não duplicar/estragar dados
  reais de teste).
- Projeto Vercel ligado ao repositório: deploy automático por branch.
  Produção (`main`): https://formacao-vibe-coding.vercel.app
- Projeto Supabase dedicado (org Kaizen Institute, região eu-west-1,
  ref `lkwgkupyzictgknpyxzs`): https://lkwgkupyzictgknpyxzs.supabase.co

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

1. **Ligar Benefit Tracking Kaizen (Equipa C) ao Supabase** — Benchmarking
   (Equipa A) e Benefit Tracking Projetos (Equipa B) já estão ligados a
   sério; só falta a Equipa C. Variables/Productivity precisam primeiro
   de formulários de criação — sem isso, ligar às tabelas reais só
   mostra vazio. Hoshin fica sempre mock (dashboard agregado, fora de
   alcance).
2. Decidir se as políticas de RLS abertas da tabela `projetos` ficam
   assim (é uma formação, sem dados sensíveis a sério) ou se vale a
   pena apertar antes de mostrar a alguém de fora.
3. Rever visualmente as 3 páginas em conjunto — foram construídas em
   paralelo, vale a pena confirmar que a linguagem visual (cores,
   ícones/emojis, cartões) ficou mesmo consistente entre elas.

## Problemas Conhecidos / Por Resolver

- **BLOQUEADOR (26/08, em stand-by):** as variáveis de ambiente
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) **nunca
  foram configuradas no Vercel** — nem Production nem Preview. Isto
  causa **falha real de build** (`supabaseUrl is required`) desde que
  a Equipa B ligou ao Supabase. `main` está com deploys de produção a
  falhar (o site continua a servir a última versão antiga que
  funcionou). Não há ferramenta disponível para configurar isto por
  API — só o utilizador consegue, no dashboard do Vercel
  (Settings → Environments → Production/Preview → Add Environment
  Variable). Depois de configurado, avisar para redisparar os deploys.
- Confirmar que os overrides de plano/volume (`projeto_kpi_plano_
  overrides`, `projeto_kpi_volume_overrides`) e a auditoria
  (`projeto_kpi_auditoria`) do motor de Benefit Tracking novo
  funcionam em produção assim que o bloqueador acima for resolvido —
  só foram validados com `npm run build` local.

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
