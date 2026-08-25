import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'Formação Vibe Coding',
  description: 'Plataforma construída em formação Kaizen com sessões rotativas.',
};

// Casca partilhada por toda a app (ver components/NavBar.jsx e
// docs/estrutura-do-site.md). Cada equipa constrói o conteúdo da sua
// própria página em app/<rota>/page.js — este ficheiro não é de
// nenhuma equipa em particular.
export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
