# Estrutura do Site — Fase 0

> Preencher isto todos juntos, ao mesmo tempo que o modelo de dados
> (`docs/modelo-de-dados.md`), antes de as equipas se separarem para as
> suas branches.

## Porque é que isto existe

Além dos dados, as páginas de cada equipa vivem dentro de uma "casca"
partilhada — o mesmo cabeçalho, o mesmo menu de navegação, as mesmas
cores base. Se cada equipa construir a sua própria versão disto dentro
da sua branch, acabamos com várias páginas soltas que só por acaso
partilham repositório, não uma plataforma coerente. Esta casca é
construída **uma vez, em `main`**, por quem estiver a facilitar a Fase
0 — não nasce dentro de nenhuma equipa.

## Páginas e rotas

| Página | Rota (URL) | Equipa |
|---|---|---|
| Benefit Tracking Kaizen | `/benefit-tracking-kaizen` | A (`equipa-a`) |
| Benefit Tracking Projetos | `/benefit-tracking-projetos` | B (`equipa-b`) |
| Benchmarking | `/benchmarking` | C (`equipa-c`) |

`equipa-d` fica livre/reserva (não há uma 4ª página) — só é preciso se
surgir um grupo extra ou se uma das três equipas quiser dividir-se.

## Menu de navegação

Menu fixo no topo, nesta ordem: Benefit Tracking Kaizen → Benefit
Tracking Projetos → Benchmarking (igual à tabela acima).

## Direção visual (decidido — é para concurso, a estética conta muito)

- Tons claros, fundo em gradiente suave (slate/sky/violet pastel).
- Menu em pílula flutuante, efeito vidro (glassmorphism: fundo
  translúcido + blur), sombra suave, cantos muito arredondados.
- Item de menu ativo com gradiente e leve elevação (efeito "bubbly" ao
  fazer hover: sobe ligeiramente + sombra).
- O menu desaparece com fade ao fazer scroll para baixo, e volta a
  aparecer ao fazer scroll para cima, ao clicar perto do topo, ou ao
  passar o rato perto do topo do ecrã.
- Já implementado em `components/NavBar.jsx` — cada equipa deve manter
  o mesmo estilo (cartões translúcidos com `backdrop-blur`, cantos
  arredondados `rounded-3xl`, sombras suaves) dentro da sua própria
  página, para a app parecer um produto só.

## Onde isto vive no código

- `app/layout.js` — a casca à volta de todas as páginas (já existe).
- `components/NavBar.jsx` — a barra de navegação partilhada (já existe,
  vazia por preencher — substituir a lista `PAGES` pelas rotas reais
  decididas acima).
- Cada equipa cria a sua página em `app/<rota-da-equipa>/page.js` — só
  o conteúdo de dentro é da equipa; `layout.js` e `NavBar.jsx` são
  partilhados.

## Regra

Se uma equipa precisar de mudar algo na casca partilhada (navbar, cores
base, cabeçalho) a meio da formação, não faz isso só na sua branch —
avisa as outras equipas e o formador, exatamente como faria para uma
alteração a uma tabela partilhada no modelo de dados.
