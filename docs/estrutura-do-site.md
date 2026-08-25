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

_(preencher com a lista de páginas decidida na sessão "Desenhar a
ferramenta": o nome, o caminho/URL, e a equipa responsável)_

| Página | Rota (URL) | Equipa |
|---|---|---|
| _exemplo:_ Lista de Projetos | `/projetos` | A |
| | | |

## Menu de navegação

_(a lista e ordem dos links que aparecem na barra partilhada —
normalmente igual à tabela acima)_

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
