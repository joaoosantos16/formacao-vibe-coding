import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'KI BT&B',
  description: 'Kaizen benefit tracking and benchmarking platform — Kaizen, Projects and Benchmarking.',
};

// Casca partilhada por toda a app (ver components/NavBar.jsx e
// docs/estrutura-do-site.md). Cada equipa constrói o conteúdo da sua
// própria página em app/<rota>/page.js — este ficheiro não é de
// nenhuma equipa em particular.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 text-slate-800">
        <NavBar />
        <main className="pt-28 px-3 sm:px-6 lg:px-10 pb-16 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
