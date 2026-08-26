'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Casca partilhada por toda a app — decidida na Fase 0 (ver
// docs/estrutura-do-site.md). Nenhuma equipa edita este ficheiro para
// adicionar a sua página; mudanças aqui são combinadas entre todas.
const PAGES = [
  { label: 'Benefit Tracking Kaizen', href: '/benefit-tracking-kaizen' },
  { label: 'Benefit Tracking Projects', href: '/benefit-tracking-projetos' },
  { label: 'Benchmarking', href: '/benchmarking' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y < 40) {
        setVisible(true);
      } else if (y > lastY + 4) {
        setVisible(false); // a descer -> esconde
      } else if (y < lastY - 4) {
        setVisible(true); // a subir -> mostra
      }
      setLastY(y);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  return (
    <>
      {/* faixa sensível ao rato junto ao topo: passar o rato aqui volta a mostrar o menu */}
      <div
        className="fixed top-0 inset-x-0 h-4 z-40"
        onMouseEnter={() => setVisible(true)}
      />

      <header
        className={`fixed top-0 inset-x-0 z-50 flex justify-center pt-5 px-4 transition-all duration-500 ease-out ${
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
        onClick={() => setVisible(true)}
      >
        <nav className="flex items-center gap-1 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.10)] ring-1 ring-black/5 px-2 py-2">
          <Link href="/" className="hidden sm:flex items-center gap-2.5 pl-3 pr-4">
            <Image src="/kaizen-logo.png" alt="Kaizen Institute" width={104} height={20} priority className="h-5 w-auto" />
            <span className="h-4 w-px bg-slate-300" />
            <span className="font-semibold text-slate-700 tracking-tight">BT&amp;B</span>
          </Link>
          {PAGES.map((page) => {
            const active = pathname === page.href;
            return (
              <Link
                key={page.href}
                href={page.href}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : 'text-slate-600 hover:bg-slate-900/5 hover:-translate-y-0.5'
                }`}
              >
                {page.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
