import Image from 'next/image';
import Link from 'next/link';
import { Inter } from 'next/font/google';

// Página inicial partilhada — não é de nenhuma equipa em particular
// (ver docs/estrutura-do-site.md). Mudanças aqui devem ser combinadas
// entre equipas, tal como o layout e o menu.
//
// Exceção deliberada à regra "sem cor forte" (ver
// docs/regras-claude-code.md): só esta página tem fundo escuro e cor —
// uma única família de cor (azul Kaizen), tipografia simples,
// movimento lento e subtil. O menu e as páginas de cada equipa
// continuam claros e minimalistas.
const inter = Inter({ subsets: ['latin'], weight: ['500', '700'] });

const SECTIONS = [
  { label: 'Benefit Tracking Kaizen', href: '/benefit-tracking-kaizen' },
  { label: 'Benefit Tracking Projects', href: '/benefit-tracking-projetos' },
  { label: 'Benchmarking', href: '/benchmarking' },
];

export default function Home() {
  return (
    <section
      className="relative -mt-28 overflow-hidden bg-slate-950 pt-28"
      style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', width: '100vw' }}
    >
      {/* glow de fundo — uma só cor, movimento lento */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-drift-slow absolute left-1/4 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/25 blur-[110px]" />
        <div className="animate-drift-slower absolute right-1/4 bottom-1/4 h-[28rem] w-[28rem] translate-x-1/2 translate-y-1/2 rounded-full bg-sky-500/20 blur-[110px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-14 px-6 text-center">
        <div className="space-y-5">
          <span className="inline-flex rounded-xl bg-white px-4 py-2.5 shadow-lg">
            <Image src="/kaizen-logo.png" alt="Kaizen Institute" width={140} height={27} priority />
          </span>
          <h1
            className={`${inter.className} text-6xl font-bold tracking-tight text-white sm:text-7xl`}
          >
            KI BT&amp;B
          </h1>
          <p className="text-lg text-slate-400">
            Kaizen benefit tracking and benchmarking, in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 hover:text-white"
            >
              {section.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
