'use client';

import Link from 'next/link';

// Casca partilhada por toda a app — não pertence a nenhuma equipa em
// particular. Substituir esta lista pelas páginas reais decididas na
// Fase 0 (ver docs/estrutura-do-site.md). Se precisares de mudar isto
// a meio da formação, avisa as outras equipas — é partilhado, tal como
// uma tabela partilhada no modelo de dados.
const PAGES = [
  // { label: 'Projetos', href: '/projetos' },
];

export default function NavBar() {
  return (
    <nav className="border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      <span className="font-semibold">Formação Vibe Coding</span>
      {PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {page.label}
        </Link>
      ))}
      {PAGES.length === 0 && (
        <span className="text-sm text-gray-400 italic">
          Nenhuma página ainda — preencher aqui depois da Fase 0
        </span>
      )}
    </nav>
  );
}
