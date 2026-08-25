# Formação Vibe Coding — Plataforma Kaizen

Plataforma web construída ao vivo, em equipas, numa formação Kaizen sobre
"vibe coding" (programar com apoio de IA, no Claude Code).

**Se és consultor(a) e é a primeira vez que fazes isto, não leias este
ficheiro — vai direto a [`COMO_COMECAR.md`](./COMO_COMECAR.md).** Este
README é a referência técnica; o outro ficheiro explica tudo em
linguagem simples, passo a passo.

## Modelo de trabalho

4 equipas trabalham em paralelo, cada uma na sua branch, com o seu
próprio site de pré-visualização (deploy automático no Vercel). Ver
`CLAUDE.md` para a tabela de equipas/branches/prefixos, e
`COMO_COMECAR.md` para o passo a passo de cada equipa.

## Stack

- [Next.js](https://nextjs.org/) (App Router) — frontend e backend no
  mesmo projeto.
- [Tailwind CSS](https://tailwindcss.com/) — estilos.
- [Supabase](https://supabase.com/) — base de dados Postgres + autenticação,
  partilhada por todas as equipas (com prefixo de tabela por equipa).
- [Vercel](https://vercel.com/) — deployment automático a cada `git push`,
  um preview por branch/equipa.

## Estrutura do projeto

```
app/                páginas e layouts (Next.js App Router)
components/         componentes de UI reutilizáveis
lib/                código partilhado (ex: ligação ao Supabase)
public/             imagens e ficheiros estáticos
supabase/           histórico de alterações à base de dados (migrations)
CLAUDE.md           estado consolidado do projeto (memória do Claude Code)
COMO_COMECAR.md     guia passo a passo para quem nunca usou estas ferramentas
.env.example        variáveis de ambiente necessárias (sem valores reais)
```

## Integração para `main`

As equipas não fazem push para `main`. Quando uma equipa quer integrar o
seu trabalho, avisa o formador, que faz o merge da branch da equipa para
`main` (e atualiza o `CLAUDE.md` com o estado consolidado).
