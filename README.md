# Formação Vibe Coding — Plataforma Kaizen

Este repositório é a base de uma plataforma web construída ao vivo, em
grupo, numa formação Kaizen sobre "vibe coding" (programar com apoio de
IA, no Claude Code) em sessões curtas e rotativas: quando uma pessoa fica
sem créditos, outra pessoa, noutro computador, continua exatamente de onde
ficou — mesmo código, mesma base de dados, mesmo deployment.

## Antes de começares

1. Lê o [CLAUDE.md](./CLAUDE.md) — diz o estado atual do projeto, as
   decisões já tomadas, e qual é o próximo passo. É sempre o ponto de
   partida de qualquer sessão nova.
2. Confirma que tens acesso a três coisas (o formador distribui isto —
   ver instruções à parte, nunca em texto simples num canal público):
   - o repositório no GitHub;
   - o projeto no Vercel;
   - as credenciais do Supabase (`NEXT_PUBLIC_SUPABASE_URL` e
     `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Stack

- [Next.js](https://nextjs.org/) (App Router) — frontend e backend no
  mesmo projeto.
- [Tailwind CSS](https://tailwindcss.com/) — estilos.
- [Supabase](https://supabase.com/) — base de dados Postgres + autenticação.
- [Vercel](https://vercel.com/) — deployment automático a cada `git push`
  para o branch principal.

## Começar uma sessão

```bash
git clone <URL-do-repositorio>       # só na primeira vez
cd formacao-vibe-coding
git pull                              # traz o trabalho da pessoa anterior
npm install                           # instala/atualiza dependências
cp .env.example .env.local            # só na primeira vez; depois preencher
npm run dev                           # abre em http://localhost:3000
```

Depois abre o Claude Code nesta pasta e pede-lhe para **ler o `CLAUDE.md`
antes de continuar qualquer trabalho**.

## Terminar uma sessão

```bash
git add -A
git commit -m "descrição curta do que foi feito"
git push
```

Antes do `git push`, pede ao Claude Code para **atualizar o `CLAUDE.md`**
(pelo menos as secções "Estado Atual", "Próximo Passo Imediato" e, se
aplicável, "Problemas Conhecidos"). É isso que permite à próxima pessoa
continuar sem perder contexto — sem isto, o handoff não funciona.

## Estrutura do projeto

```
app/                páginas e layouts (Next.js App Router)
components/         componentes de UI reutilizáveis
lib/                código partilhado (ex: ligação ao Supabase)
public/             imagens e ficheiros estáticos
supabase/           histórico de alterações à base de dados (migrations)
CLAUDE.md           estado do projeto e memória entre sessões
.env.example        variáveis de ambiente necessárias (sem valores reais)
```

## Base de dados

Todas as alterações à estrutura da base de dados (novas tabelas, colunas,
policies de RLS) devem ficar registadas em `supabase/` — ver
[supabase/README.md](./supabase/README.md) para a convenção.

## Deployment

O deploy é automático: o Vercel está ligado a este repositório e faz
deploy de qualquer `git push` para o branch principal. Não há passos
manuais de deploy a fazer.
