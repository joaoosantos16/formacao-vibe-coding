import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'KI BT&B',
  description: 'Plataforma de benefit tracking e benchmarking Kaizen — Kaizen, Projetos e Benchmarking.',
};

// Casca partilhada por toda a app (ver components/NavBar.jsx e
// docs/estrutura-do-site.md). Cada equipa constrói o conteúdo da sua
// própria página em app/<rota>/page.js — este ficheiro não é de
// nenhuma equipa em particular.
export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-violet-50 text-slate-800">
        <NavBar />
        <main className="pt-28 px-4 sm:px-8 pb-16 max-w-6xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
