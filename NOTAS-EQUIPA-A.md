# Notas da Equipa A — Benchmarking

Página: `/benchmarking` · Ficheiros: `app/benchmarking/{page.js, data.js, PresentationGenerator.jsx}`

**Não foi tocado nada partilhado** — nem `app/layout.js`, nem
`components/NavBar.jsx`, nem `lib/constants.js`, nem `package.json`.
O merge para `main` não deve dar conflito fora da pasta da equipa.

## O que está feito

- **Filtros** (Industry, Sector, Business Area, Workshop, # of Employees,
  Revenue, Country) com chips removíveis. Os filtros **pontuam**, não
  excluem: cada projeto recebe uma % de match conforme quantos filtros
  ativos satisfaz. Há um toggle "Hide non-matching" para esconder os 0%.
- **KPIs por GQCDM** (Growth / Quality / Cost / Delivery / Motivation).
  Cada categoria abre para a sua tabela de KPIs; cada KPI abre para os
  projetos ligados a esse KPI; cada projeto abre para o detalhe.
- **Barra baseline → target**: a escala é o próprio percurso do
  benchmark (0 = baseline, marca = target, 25% de folga à direita). Cada
  ponto é um projeto; teal = atingiu ou superou o target, cinzento =
  ficou aquém. Funciona nos dois sentidos — em KPIs onde o bom é descer
  (Defect Rate, Lead Time) a leitura continua da esquerda para a direita.
- **Resumo no topo** (Projects / KPIs covered / Total benefit / Avg.
  match) recalcula com os filtros ativos.
- **Gerador de apresentação**: botão → modal (secções + escolha de KPIs +
  nome do cliente) → pré-visualização em slides 16:9 → export PDF.

## Decisões e porquê

- **Dados mock em `data.js`, num sítio só.** A página e o gerador de
  apresentação leem daqui. Quando o Supabase entrar, muda-se só este
  ficheiro. Os campos seguem `docs/modelo-de-dados.md` (codigo, em,
  setor, subSetor, consultores, revenue, colaboradores, ebitda, cliente,
  ativo).
- **Códigos de projeto no formato `EMPA-201-POR`** — 4 letras da empresa,
  3 dígitos, código de país.
- **Sem dependências novas.** A spec da apresentação sugeria Chart.js +
  html2canvas + jsPDF, mas `package.json` é partilhado. O gráfico é CSS e
  o export usa print-to-PDF do browser (`@page` landscape). Sai vetorial,
  portanto mais nítido que o raster do html2canvas. Custo: passa pela
  caixa de impressão em vez de descarregar direto.
- **Rótulos em inglês no frontend**, nomes de campos em português no
  código (conforme combinado — a tabela partilhada é a linguagem do
  backend, o UI é o que o cliente vê).

## Por fechar / a decidir

1. **O export PDF nunca foi visto.** As regras de impressão estão
   escritas e os slides aparecem certos no ecrã, mas ninguém confirmou o
   PDF em si (quebras de página, nada cortado, navbar escondida).
   **Testar antes de apresentar.**
2. **Marca por colocar**: `BRAND.blue` em `PresentationGenerator.jsx` é
   um placeholder e o logótipo é um wordmark em texto. Falta o hex
   oficial do KI Blue e o ficheiro do logótipo em `public/`.
3. **Sem ligação a dados reais.** Tudo mock. A troca é em `data.js`.
4. **Benchmark externo não existe.** O slide diz isso de forma explícita
   em vez de inventar números. Precisa de um passo servidor com pesquisa
   web e de uma API key — e, mais importante, de resolver a
   comparabilidade: um número público muitas vezes mede coisa diferente
   do nosso KPI (unidade, população, definição), e um número que parece
   comparável mas não é, é pior do que não ter número.
5. **Baseline do cliente** não está em lado nenhum — o gráfico da
   apresentação só tem as séries Kaizen.
