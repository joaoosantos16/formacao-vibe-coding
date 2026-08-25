# Regras para o Claude Code de cada equipa

> Ler sempre logo a seguir ao `CLAUDE.md`, no início de qualquer sessão
> nesta pasta. Aplicam-se ao Claude Code das equipas A, B e C. Quando o
> pedido do utilizador ultrapassa o que está aqui, a resposta certa é
> **perguntar/escalar ao formador**, não decidir por conta própria.

## 1. Hierarquia — quem decide o quê

- **A tua própria página** (`app/<rota-da-tua-equipa>/page.js` e o que
  estiver dentro dela): decides livremente, sem pedir licença a ninguém.
- **Qualquer coisa partilhada** — `app/layout.js`,
  `components/NavBar.jsx`, `docs/modelo-de-dados.md`, `lib/constants.js`,
  `docs/estrutura-do-site.md`, ou a branch `main` — **não é tua para
  decidir sozinho**. Se o pedido implicar mexer nisto, para e diz:
  "Isto é partilhado entre equipas — confirma com o formador antes de
  eu avançar."
- O formador (e o Claude Code dele) é quem integra o trabalho das
  equipas em `main` e quem tem acesso de administração à base de
  dados. Pedidos que precisem disso são para **escalar**, não resolver
  sozinho.

## 2. Git — o que podes e não podes fazer

- Trabalhas sempre na branch da tua equipa (`equipa-a`, `equipa-b` ou
  `equipa-c`). **Nunca fazes `git checkout main`, `git push origin main`
  nem `git merge` de/para outra branch** sem o utilizador pedir
  explicitamente e confirmar que sabe o que está a fazer.
- No início de cada sessão, corre `git status` e `git log --oneline -5`
  para perceber o estado atual — não assumas.
- Se `git push` ou `git merge` derem erro de conflito, **não tentes
  resolver sozinho** editando marcadores de conflito às cegas — explica
  o erro ao utilizador e sugere chamar o formador.
- Nunca uses `git push --force` nem `git reset --hard` sem o utilizador
  pedir isso explicitamente e confirmar que percebe que pode apagar
  trabalho.

## 3. Campos já decididos — usa estes, não inventes outros

Se estiveres a construir algo relacionado com **projetos, clientes ou
benefit tracking** (em qualquer uma das 3 páginas — Kaizen, Projetos ou
Benchmarking), a tabela partilhada `projetos` **já existe** no
Supabase, com estes campos exatos:

`id`, `codigo`, `em` (Engagement Manager), `setor`, `subsetor`,
`consultores`, `kpi`, `revenue`, `colaboradores`, `ebitda`, `cliente`,
`estado` (`ativo` / `desativado`, ver `lib/constants.js` →
`PROJETO_ESTADO`), `created_at`, `updated_at`.

**Usa exatamente estes nomes de campo.** Não crias uma tabela nova para
guardar a mesma coisa, não inventas variações (ex: `codigo_projeto` em
vez de `codigo`) — consulta `docs/modelo-de-dados.md` para a definição
completa antes de escrever qualquer código que leia ou escreva
projetos/clientes. Se precisares de um campo que não está nesta lista,
trata-o como partilhado (ver secção 1) e avisa antes de o inventar.

## 4. Supabase / SQL — regras específicas

- **Nunca peças ao utilizador uma service-role key, uma connection
  string com password, ou qualquer credencial de administração da base
  de dados.** Se precisares de mais do que a `anon key` permite (ex:
  criar uma tabela), a resposta certa é sempre **gerar o SQL e pedir
  para ser enviado ao formador** — nunca tentar obter acesso direto.
- Sempre que for preciso uma tabela nova:
  1. Pergunta ao utilizador que campos são precisos, se não estiver claro.
  2. Gera o `CREATE TABLE` completo.
  3. Inclui sempre `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` e pelo
     menos uma `CREATE POLICY` — nunca entregues uma tabela sem RLS.
  4. Se a tabela for só da tua equipa, o nome leva o prefixo
     (`equipa_a_`, `equipa_b_` ou `equipa_c_`). Se outra equipa também
     puder precisar de ler/escrever a mesma coisa, **avisa que é
     partilhada** — não inventes esse esquema sozinho, tem de ser
     combinado entre equipas primeiro.
  5. Diz ao utilizador para enviar o SQL gerado ao formador. **Não
     tentes correr `CREATE TABLE` diretamente com a `anon key`** — não
     vai funcionar, e insistir é sinal de mal-entendido, não um
     obstáculo a contornar.
- Nunca escrevas texto de estado/categoria à mão (ex: `"Em Progresso"`)
  — usa sempre as constantes de `lib/constants.js`. Se o valor que
  precisas não existir lá, avisa antes de o inventares.
- Guarda sempre uma cópia do SQL final em `supabase/migrations/`, com o
  nome `AAAAMMDD_HHmm_equipa-x_descricao.sql` (sem `equipa-x` se for
  partilhada) — mesmo que quem aplique a migração seja o formador.

## 5. Desenvolvimento local — não partir o `npm run dev`

- **Nunca corras `npm run build` numa janela de terminal diferente
  enquanto o `npm run dev` do utilizador está a correr** — os dois
  processos partilham a pasta `.next` e vão pisar-se um ao outro
  (chunks JS partidos, erros 404, página presa em "A carregar...").
- Para validar que o código compila sem erros, usa antes uma destas
  opções, nesta ordem de preferência:
  1. Confia no próprio `npm run dev` — se não há erro no terminal onde
     ele está a correr, o código compila.
  2. Se precisares mesmo de correr `npm run build`, avisa primeiro o
     utilizador para parar o `npm run dev` (`Ctrl+C`), corre o build,
     e no fim manda reiniciar o `npm run dev`.
- Se isto já aconteceu e a página ficou presa a carregar: a correção é
  simples — parar e voltar a correr `npm run dev` regenera a pasta
  `.next` correta. Não é preciso reinstalar nada nem apagar mais nada.

## 6. Antes de terminar uma sessão

- Confirma que o código corre localmente (`npm run dev`, sem erros)
  antes de sugerires `commit`/`push`.
- Nunca faças commit de `.env.local` nem de qualquer credencial.
- Se decidiste algo que as outras equipas precisam de saber (uma
  tabela nova pedida, uma decisão de produto), diz ao utilizador para
  levar isso à próxima integração com o formador — não assumas que
  fica resolvido só por estar na tua branch.

## 7. Design — regra fixa

O site chama-se **"KI BT&B"** (não "Benefit Tracking"). **Nunca uses
ícones nem emojis em nada que construíres** — nem no título, nem no
conteúdo da tua página, nem em mensagens de estado. Só elementos
minimalistas: texto, tipografia, formas simples e cor. Ver
`docs/estrutura-do-site.md`, secção "Direção visual".

## 8. Quando em dúvida

Por omissão, sê conservador: se não tens a certeza se algo é "só da tua
página" ou "partilhado", trata como partilhado e pede confirmação antes
de avançar. É mais barato perguntar do que desfazer.
