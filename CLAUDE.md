# CLAUDE.md — Memória do Projeto

> Este ficheiro é a "memória" entre sessões. Quando uma pessoa termina a sua
> sessão (fica sem créditos, ou diz "vou parar" / "outra pessoa vai
> continuar"), o Claude Code deve atualizar este ficheiro antes de terminar.
> A próxima pessoa começa a sua sessão pedindo ao Claude Code para ler este
> ficheiro primeiro.

## Estado Atual do Projeto (o que já está feito)

- Repositório Git inicializado.
- Arquitetura base criada: Next.js 14 (App Router) + Tailwind CSS +
  Supabase (`@supabase/supabase-js`).
- A app mostra apenas uma página de estado (sem funcionalidades de produto
  ainda) — confirma se as variáveis de ambiente do Supabase estão definidas.
- Ainda não foi criado nenhum projeto Supabase real nem feito nenhum deploy
  no Vercel (isso é feito manualmente antes da formação — ver README.md).

## Decisões Tomadas e Porquê

- **Next.js (App Router)** em vez de outra framework: é a framework nativa
  do Vercel (deploy automático a cada `git push`, zero configuração), e é a
  stack mais bem documentada para programar com apoio de IA.
- **Tailwind CSS**: estilização dentro do próprio ficheiro do componente —
  menos ficheiros a coordenar entre pessoas diferentes em sessões curtas.
- **Supabase**, um único projeto dedicado a esta formação: Postgres + Auth +
  API prontos a usar, partilhado entre todos porque a app só se liga a ele
  através de variáveis de ambiente (não fica nada preso ao computador de
  quem o criou).
- **`supabase/migrations/`**: todas as alterações ao esquema da base de
  dados devem ficar registadas em SQL nesta pasta (ver
  `supabase/README.md`), para que o histórico da base de dados também viva
  no git, e não só na cabeça de quem a alterou.
- **CLAUDE.md como memória entre sessões**: como o Claude Code não guarda
  contexto entre computadores diferentes, este ficheiro é o que permite a
  qualquer consultor continuar exatamente de onde o anterior ficou.

_(as próximas decisões — de arquitetura ou de produto — devem ser
acrescentadas aqui por quem as tomar, com uma frase do porquê)_

## Próximo Passo Imediato

Ainda não há nenhuma funcionalidade definida. O primeiro grupo da formação
deve começar por decidir em conjunto o que a plataforma vai fazer, e
escrever aqui qual é a primeira funcionalidade a construir.

## Problemas Conhecidos / Por Resolver

Nenhum, por agora.

## Como Correr o Projeto Localmente

```bash
git clone <URL-do-repositorio>      # só se ainda não tiveres o repositório
cd formacao-vibe-coding
git pull                             # trazer o trabalho mais recente
npm install
cp .env.example .env.local           # preencher com as credenciais reais do Supabase
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).
