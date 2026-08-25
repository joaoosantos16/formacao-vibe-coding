# Getting started — a guide for people who've never done this

You don't need to know anything about programming to follow this. Just
copy and paste commands, then talk to Claude Code in plain English, as
if it were a colleague who writes the code for you.

_(This is the English version of `COMO_COMECAR.md`. Both are kept in
sync — if you update one, update the other.)_

## 1. The 4 pieces, explained simply

| Name | What it is, in plain language |
|---|---|
| **Claude Code** | The AI assistant you'll talk to. Tell it what you want the app to do, and it writes the code. |
| **Git / GitHub** | The "warehouse" where the code is stored, with a full history of every change. Like Dropbox, but for code, that never forgets an old version. |
| **Vercel** | The "shop window": the site that shows the app running, at a link anyone can open in a browser. It updates itself automatically whenever someone saves new work to the warehouse (GitHub). |
| **Supabase** | The "box" where the app's data lives (like an online spreadsheet, but wired into the app). |

Three words you'll see a lot:

- **Commit** = take a "snapshot" of the current state of the code, with a label saying what changed.
- **Push** = send that snapshot to the shared warehouse (GitHub), for the other teams and Vercel to see.
- **Pull** = fetch whatever is already there (so you always start from the latest version).

## 2. What's already done (you don't need to set up any of this)

- The project already exists on GitHub, is already connected to Vercel (automatic deploys), and already has a Supabase database ready to use.
- 4 separate "workrooms" (branches) already exist, one per team, each with its own live site link.
- The database credentials are already configured — you just need to copy a file, not create any accounts.

## 3. Install on your computer (once, before the training)

1. **Git** — [git-scm.com/downloads](https://git-scm.com/downloads) (regular install, "Next" all the way).
2. **Node.js** (LTS version) — [nodejs.org](https://nodejs.org).
3. **Claude Code** — follow the instructions the trainer sends you.
4. A GitHub account, with the trainer's invite already accepted.

## 4. Before we split up: Phase 0 (done all together)

Each team will work in isolation, in its own "room" (branch), with its
own Claude Code session. **This means Team A does not automatically see
what Team B is writing.** If different teams' pages will show/edit the
same thing (e.g. a "Project" that appears on several pages, with a
status like "In Progress"), we need to agree BEFORE splitting up:

- which tables and fields exist (e.g. `projects`, with a `status` field);
- the exact wording for each status/category (e.g. `in_progress` in the
  code, "In Progress" in what the user sees).

This is done **as a group, projected on screen, on `main`** (before we
move into the team branches), by filling in `docs/modelo-de-dados.md`
and the constants in `lib/constants.js`. It's then committed and pushed,
and only then does each team pull that into its branch (step 6 below,
"sync"). If the pages are genuinely independent of each other, the
trainer can skip this step.

**This is not "define everything upfront."** Only what's genuinely
shared between pages goes here — everything else (how each team
organizes its own page) is free, decided by each team however it likes.
It usually takes 10-15 minutes, not a long meeting. And it's not a
one-time gate: if halfway through the day a team realizes it needs one
more shared thing, it gets added to the file, committed to `main`, and
the other teams run `git merge main` again — no need to stop everything
and redo it.

## 5. Your team

| Team | "Branch" name (your workroom) | Your live site (updates itself) | Your table prefix in the database |
|---|---|---|---|
| A | `equipa-a` | [formacao-vibe-coding-git-equipa-a-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-a-joaoosantos16s-projects.vercel.app) | `equipa_a_` |
| B | `equipa-b` | [formacao-vibe-coding-git-equipa-b-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-b-joaoosantos16s-projects.vercel.app) | `equipa_b_` |
| C | `equipa-c` | [formacao-vibe-coding-git-equipa-c-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-c-joaoosantos16s-projects.vercel.app) | `equipa_c_` |
| D | `equipa-d` | [formacao-vibe-coding-git-equipa-d-joaoosantos16s-projects.vercel.app](https://formacao-vibe-coding-git-equipa-d-joaoosantos16s-projects.vercel.app) | `equipa_d_` |

Branch names stay in Portuguese (`equipa-a`, `equipa-b`...) — that's
just the literal name in the repository, don't translate it when typing
commands. Confirm with the trainer which team you're on. Whenever you
see `equipa-x` in the commands below, swap it for your team's branch
(e.g. `git checkout equipa-b`).

## 6. Start working (do this once, at the start)

Open a terminal (on Windows: search for "Git Bash" in the Start menu)
and paste these commands, one at a time:

```bash
git clone https://github.com/joaoosantos16/formacao-vibe-coding.git
cd formacao-vibe-coding
git checkout equipa-x
git merge main
```
*(swap `equipa-x` for your team, e.g. `git checkout equipa-b`. The
`git merge main` brings into your branch whatever was decided in Phase
0 — do this again whenever the trainer says `main` has been updated.)*

```bash
npm install
```
*(takes a minute or two — it's installing the pieces the project needs)*

```bash
cp .env.example .env.local
```
*(ask the trainer for the two values to put inside `.env.local` — open
that file in any text editor and replace the example values)*

```bash
npm run dev
```

This will show a message with a link (usually `http://localhost:3000`).
Open that link in your browser — that's the app running on your
computer. Leave this terminal open while you work.

Then, open Claude Code **inside this folder** (`formacao-vibe-coding`)
and tell it:

> "Read the CLAUDE.md file before doing anything else."

## 7. The daily work cycle (repeat this all day)

1. **Ask Claude Code**, in plain English, for what you want to build or
   change (e.g. "Create a page with a form to request feedback").
2. **Check the result** in the browser, at `http://localhost:3000` — it
   updates itself automatically whenever Claude Code changes something.
3. When you like the result, **save and send the work**:
   ```bash
   git add -A
   git commit -m "short description of what you did"
   git push
   ```
   (You can always ask Claude Code to write these three commands for
   you and explain what they do.)
4. A few minutes after you `push`, your team's live site (the Vercel
   link) updates itself — you don't need to do anything else.

Repeat this cycle as many times as you like during the training — there
is no set number of times. `commit` + `push` every time you reach a
point that works, so you don't risk losing work.

## 8. What you do NOT need to know or do

- **You don't need to touch `main`** — only your team's branch (`equipa-x`).
- **You don't need to do a "merge" or "Pull Request"** — when your team
  wants to fold its work into the main project, the trainer does that.
- **You don't need to know anything about Vercel or Supabase beyond the
  links and credentials you're given** — Claude Code handles the
  technical side if you ask it to.
- **You don't need to resolve git "conflicts" yourself** — if that comes
  up, call the trainer.

## 9. If something goes wrong

Paste the whole error message into Claude Code and ask "what does this
mean and how do I fix it?" — most of the time it fixes itself. If it
doesn't, call the trainer.
