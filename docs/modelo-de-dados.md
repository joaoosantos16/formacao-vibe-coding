# Modelo de Dados Partilhado

> Preencher isto **todos juntos**, projetado no ecrã, ANTES de as equipas
> se separarem para as suas branches. Depois de isto ficar em `main`,
> cada equipa sincroniza a sua branch com `git merge main` antes de
> começar a construir (ver `COMO_COMECAR.md`, passo "Fase 0").

## Porquê é que isto existe

Cada equipa trabalha isolada, na sua própria branch e sessão de Claude
Code — **ninguém vê automaticamente o código de outra equipa.** Se cada
equipa inventar os seus próprios nomes de tabelas, campos e valores (ex:
uma escreve `"Em Projeto"`, outra escreve `"in_progress"`, outra
`"A decorrer"`), o trabalho não encaixa quando for tudo junto. Este
ficheiro é o único sítio combinado por todos, para que o Claude Code de
qualquer equipa saiba exatamente que nomes e valores usar — sem ter de
adivinhar o que as outras equipas fizeram.

**Isto NÃO é "definir tudo à partida".** Só entra aqui o que é
genuinamente **partilhado** — uma entidade ou um campo que mais do que
uma página/equipa vai ler ou escrever. Tudo o resto (estado interno de
uma página, componentes, variáveis, como cada equipa organiza o seu
próprio código) fica de fora deste ficheiro e é decidido livremente por
cada equipa, sem precisar de combinação nenhuma. Na maioria das
formações isto acaba por ser 1 a 3 tabelas e um punhado de valores — um
exercício de 10-15 minutos, não uma especificação completa.

**Isto também não é um portão único.** Se a meio do dia uma equipa
perceber que precisa de mais uma coisa partilhada que ninguém previu:
1. Acrescenta essa entidade/campo/valor aqui e em `lib/constants.js`.
2. Faz commit e push para `main` (ou pede ao formador para o fazer).
3. Avisa as outras equipas para correrem `git merge main` outra vez.

Não é preciso parar tudo nem voltar a reunir toda a gente — só manter
este ficheiro como a única fonte de verdade sempre que algo passa a ser
partilhado.

## Entidades principais

### `projetos` (partilhada — sem prefixo de equipa)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | gerado automaticamente |
| `codigo` | text | identificador único do projeto (ex: código interno Kaizen) |
| `em` | text | nome do Engagement Manager (responsável do projeto) |
| `setor` | text | |
| `subsetor` | text | |
| `consultores` | text | |
| `kpi` | text | |
| `revenue` | numeric | |
| `colaboradores` | integer | nº de colaboradores do cliente (campo original "#Colaboradores") |
| `ebitda` | numeric | |
| `cliente` | text | |
| `estado` | text | ver "Vocabulário / estados" abaixo |
| `pais` | text | país do cliente (Equipa A) |
| `sr` | text | Sales Responsible — distinto do `em` (Equipa B) |
| `data_inicio` / `data_fim` | date | datas do projeto (Equipa B) |
| `critico` | boolean | flag manual de produtividade (Equipa C) |
| `continuidade` | text | flag manual de produtividade (Equipa C) |
| `created_at` / `updated_at` | timestamptz | geridos automaticamente |

### `projeto_kpis` (partilhada) — um KPI acompanhado num projeto

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `projeto_codigo` | text | FK → `projetos.codigo` |
| `nome` | text | |
| `categoria` | text | GQCDM: `growth`/`quality`/`cost`/`delivery`/`motivation` |
| `formula` | text | opcional |
| `unidade` | text | opcional |
| `direcao` | text | `higher` / `lower` — ver vocabulário |
| `baseline` | numeric | |
| `target` | numeric | |
| `beneficio` | numeric | € |
| `frequencia` | text | `weekly` / `monthly`, opcional — só quando há medições (ver abaixo) |

### `projeto_kpi_medicoes` (partilhada) — série temporal por KPI

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `kpi_id` | uuid | FK → `projeto_kpis.id` |
| `periodo` | text | ex: `"W35"`, `"August 2025"` |
| `valor` | numeric | |

### `projeto_honorarios_variaveis` (partilhada) — Equipa C, secção Variables

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `projeto_codigo` | text | FK → `projetos.codigo` |
| `potencial` / `faturado` | numeric | € totais |
| `potencial_trimestre` / `faturado_trimestre` | numeric | € do trimestre atual |
| `estado` | text | `pending` / `invoiced` / `overdue` |
| `ultima_atualizacao` | date | |

### `projeto_ocupacao_semanal` (partilhada) — Equipa C, secção Productivity

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `projeto_codigo` | text | FK → `projetos.codigo` |
| `semana` | text | ex: `"W1"`..`"W12"` |
| `ocupacao_pct` | numeric | |

**Fora de alcance por agora**: o Hoshin Overview da Equipa C (metas
globais do escritório, ranking de consultores) é um dashboard agregado
a partir de `days.xlsx`/`invoices.xlsx` da Spark Week, não dados por
projeto — não faz parte destas tabelas, continua mock.

### Motor de Benefit Tracking (26/08 — trazido de outra equipa)

Portado de um motor de referência mais completo (`Benefit_Tracking_
Final_...html`, outra equipa da formação). Ver `lib/benefitCalc.js`
para as fórmulas exatas (rampa de plano, tarifa unitária, RAG,
anualização pelos últimos 3 meses válidos).

Campos extra em `projeto_kpis`:

| Campo | Tipo | Notas |
|---|---|---|
| `volume` | numeric | volume anual (junto com `beneficio`, define a tarifa unitária: `beneficio / (volume × |baseline-target|)`) |
| `mes_inicio` / `mes_objetivo` | text (`YYYY-MM`) | início/fim da rampa de plano deste KPI — sem valor, usa as datas do projeto |
| `agregacao_mensal` | text | `avg` / `sum` / `last` — como agregar capturas não-mensais a mês |

### `projeto_kpi_plano_overrides` / `projeto_kpi_volume_overrides` (partilhadas)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `kpi_id` | uuid | FK → `projeto_kpis.id` |
| `mes` | text (`YYYY-MM`) | |
| `valor` | numeric | sobrepõe sempre o cálculo automático (rampa / volume anual÷12) |

### `projeto_kpi_auditoria` (partilhada) — histórico de alterações

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `projeto_codigo` | text | FK → `projetos.codigo` |
| `kpi_id` | uuid, opcional | FK → `projeto_kpis.id` |
| `autor` | text, opcional | em branco por agora — sem autenticação implementada |
| `campo` / `valor_antigo` / `valor_novo` | text | o que mudou |
| `created_at` | timestamptz | |

## Vocabulário / estados

Qualquer campo do tipo "estado" ou "categoria" (ex: o estado de um
projeto, o tipo de um pedido) tem de ter aqui a **lista fechada** de
valores possíveis — o valor tal como vai ser guardado no código, e o
rótulo em português a mostrar ao utilizador. Ninguém escreve texto à
mão no código: todos importam de `lib/constants.js` (ver esse ficheiro).

| Valor no código (`lib/constants.js`) | Rótulo em português a mostrar |
|---|---|
| `ativo` | "Ativo" |
| `desativado` | "Desativado" |
| `higher` (`projeto_kpis.direcao`) | "Quanto maior, melhor" |
| `lower` (`projeto_kpis.direcao`) | "Quanto menor, melhor" |
| `weekly` (`projeto_kpis.frequencia`) | "Semanal" |
| `monthly` (`projeto_kpis.frequencia`) | "Mensal" |
| `pending` (`projeto_honorarios_variaveis.estado`) | "Pendente" |
| `invoiced` (`projeto_honorarios_variaveis.estado`) | "Faturado" |
| `overdue` (`projeto_honorarios_variaveis.estado`) | "Em atraso" |

## Quem constrói/lê o quê

| Entidade | Equipa responsável (cria/edita) | Outras equipas que leem |
|---|---|---|
| `projetos` | Todas podem criar/editar registos (é a entidade central do benefit tracking) | Todas (Kaizen, Projetos, Benchmarking) |
| `projeto_kpis`, `projeto_kpi_medicoes` | Equipas A e B | Benchmarking, Benefit Tracking Projetos |
| `projeto_honorarios_variaveis`, `projeto_ocupacao_semanal` | Equipa C | Benefit Tracking Kaizen |

---

Depois de preenchido, isto converte-se em duas coisas concretas no código:

1. **Uma migração SQL** em `supabase/migrations/` — as tabelas reais,
   criadas uma única vez, antes das equipas se separarem.
2. **As constantes** em `lib/constants.js` — os valores e rótulos da
   secção "Vocabulário / estados" acima, para que o código nunca precise
   de escrever esse texto à mão.
