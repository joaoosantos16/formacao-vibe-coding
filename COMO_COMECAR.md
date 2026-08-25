# Como começar — guia para quem nunca fez isto

Não precisas de saber nada de programação para seguir isto. É só
copiar e colar comandos, e depois falar com o Claude Code em português
normal, como se fosse um colega que escreve o código por ti.

## 1. As 4 peças, explicadas em português simples

| Nome | O que é, em linguagem simples |
|---|---|
| **Claude Code** | O assistente de IA com quem vais falar. Dizes-lhe o que queres que a app faça, e ele escreve o código. |
| **Git / GitHub** | O "armazém" onde o código fica guardado, com histórico de tudo o que foi mudado. Como um Dropbox, mas para código, que guarda todas as versões antigas. |
| **Vercel** | A "montra": o sítio que mostra a app a funcionar, num link que qualquer pessoa pode abrir no browser. Atualiza-se sozinho sempre que alguém guarda trabalho novo no armazém (GitHub). |
| **Supabase** | A "caixa" onde ficam guardados os dados da app (como uma folha de Excel online, mas ligada à app). |

Três palavras que vais ver muitas vezes:

- **Commit** = tirar uma "fotografia" do estado atual do código, com uma etiqueta a dizer o que mudou.
- **Push** = enviar essa fotografia para o armazém partilhado (GitHub), para as outras equipas e o Vercel a verem.
- **Pull** = ir buscar ao armazém o que já lá está (para começar sempre com a versão mais recente).

## 2. O que já está feito (não precisas de configurar nada disto)

- O projeto já existe no GitHub, já está ligado ao Vercel (deploy automático) e já tem uma base de dados Supabase pronta a usar.
- Já estão criadas 4 "salas de trabalho" separadas (branches), uma por equipa, cada uma com o seu próprio link de site ao vivo.
- As credenciais da base de dados já estão configuradas — só precisas de copiar um ficheiro, não de criar contas.

## 3. Instalar no teu computador (uma vez, antes da formação)

1. **Git** — [git-scm.com/downloads](https://git-scm.com/downloads) (instalação normal, "Next" até ao fim).
2. **Node.js** (versão LTS) — [nodejs.org](https://nodejs.org).
3. **Claude Code** — segue as instruções que o formador te enviar.
4. Uma conta no GitHub, com o convite do formador já aceite.

## 4. Antes de nos separarmos: a Fase 0 (feita todos juntos)

Cada equipa vai trabalhar isolada, na sua própria "sala" (branch), com a
sua própria sessão de Claude Code. **Isto quer dizer que a equipa A não
vê automaticamente o que a equipa B está a escrever.** Se as páginas de
equipas diferentes forem mostrar/editar a mesma coisa (ex: um "Projeto"
que aparece em várias páginas, com um estado como "Em Projeto"), temos
de combinar ANTES:

- que tabelas e campos existem (ex: `projetos`, com um campo `status`);
- as palavras exatas para cada estado/categoria (ex: `em_projeto` no
  código, "Em Projeto" no que o utilizador vê).

Isto é feito **em grupo, projetado no ecrã, em `main`** (antes de
entrarmos nas branches das equipas), preenchendo o ficheiro
`docs/modelo-de-dados.md` e as constantes em `lib/constants.js`. Depois
disso é commitado e enviado, e só aí é que cada equipa vai buscar isso à
sua branch (passo 6 abaixo, "sincronizar"). Se as páginas forem mesmo
independentes umas das outras, o formador pode dispensar este passo.

**Isto não é definir tudo à partida.** Só entra aqui o que é
genuinamente partilhado entre páginas — o resto (como cada equipa
organiza a sua própria página) fica livre, decidido por cada equipa à
vontade. Costuma ser 10-15 minutos, não uma reunião longa. E não é um
portão único: se a meio do dia surgir a necessidade de mais uma coisa
partilhada, acrescenta-se ao ficheiro, faz-se commit para `main`, e as
outras equipas voltam a correr `git merge main` — não é preciso parar
tudo outra vez.

## 5. A tua equipa

| Equipa | Nome do "branch" (a tua sala de trabalho) | O teu site ao vivo (atualiza sozinho) | Prefixo das tuas tabelas na base de dados |
|---|---|---|---|
| A | `equipa-a` | [formacao-vibe-coding-git-equipa-a-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-a-joaoosantos16s-projects.vercel.app) | `equipa_a_` |
| B | `equipa-b` | [formacao-vibe-coding-git-equipa-b-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-b-joaoosantos16s-projects.vercel.app) | `equipa_b_` |
| C | `equipa-c` | [formacao-vibe-coding-git-equipa-c-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-c-joaoosantos16s-projects.vercel.app) | `equipa_c_` |
| D | `equipa-d` | [formacao-vibe-coding-git-equipa-d-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-d-joaoosantos16s-projects.vercel.app) | `equipa_d_` |

Confirma com o formador qual é a tua equipa. Sempre que vires `equipa-x`
nos comandos abaixo, troca pelo nome da tua equipa (ex: `equipa-b`).

## 6. Começar a trabalhar (fazer isto uma vez, no início)

Abre um terminal (no Windows: procura por "Git Bash" no menu Iniciar) e
cola estes comandos, um de cada vez:

```bash
git clone https://github.com/joaoosantos16/formacao-vibe-coding.git
cd formacao-vibe-coding
git checkout equipa-x
git merge main
```
*(troca `equipa-x` pela tua equipa, ex: `git checkout equipa-b`. O
`git merge main` traz para a tua branch o que foi decidido na Fase 0 —
faz isto sempre que o formador disser que atualizou o `main`.)*

```bash
npm install
```
*(demora um minuto ou dois — está a instalar as peças de que o projeto precisa)*

```bash
cp .env.example .env.local
```
*(pede ao formador os dois valores para colocares dentro do `.env.local` — abre esse ficheiro num editor de texto qualquer e substitui os valores de exemplo)*

```bash
npm run dev
```

Isto vai mostrar uma mensagem com um link (normalmente
`http://localhost:3000`). Abre esse link no browser — é a app a correr
no teu computador. Deixa este terminal aberto enquanto trabalhas.

Depois, abre o Claude Code **dentro desta pasta** (`formacao-vibe-coding`)
e escreve-lhe:

> "Lê o ficheiro CLAUDE.md antes de fazeres seja o que for."

## 7. O ciclo de trabalho (repetir isto o dia todo)

1. **Pede ao Claude Code**, em português, o que queres construir ou mudar
   (ex: "Cria uma página com um formulário para pedir feedback").
2. **Vê o resultado** no browser, no link `http://localhost:3000` — atualiza
   sozinho sempre que o Claude Code muda algo.
3. Quando gostares do resultado, **guarda e envia o trabalho**:
   ```bash
   git add -A
   git commit -m "descrição curta do que fizeste"
   git push
   ```
   (Podes sempre pedir ao Claude Code para escrever estes três comandos
   por ti e explicar o que fazem.)
4. Uns minutos depois de fazeres `push`, o site ao vivo da tua equipa
   (o link no Vercel) atualiza-se sozinho — não precisas de fazer mais
   nada.

Repete este ciclo tantas vezes quantas quiseres durante a formação —
não há um número certo de vezes. Faz `commit` + `push` sempre que
chegares a um ponto que funciona, para não arriscares perder trabalho.

## 8. O que NÃO precisas de saber nem de fazer

- **Não precisas de mexer em `main`** — só a tua branch (`equipa-x`).
- **Não precisas de fazer "merge" nem "Pull Request"** — quando a tua
  equipa quiser juntar o trabalho ao projeto principal, é o formador que
  o faz.
- **Não precisas de saber nada de Vercel nem de Supabase além dos links
  e credenciais que te derem** — o Claude Code trata da parte técnica se
  lhe pedires.
- **Não precisas de resolver "conflitos" de git sozinho** — se aparecer
  algo assim, chama o formador.

## 9. Se alguma coisa correr mal

Cola a mensagem de erro toda no Claude Code e pergunta "o que significa
isto e como resolvo?" — na maior parte das vezes ele resolve sozinho. Se
não resolver, chama o formador.
