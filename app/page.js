import Link from 'next/link';

// Página inicial partilhada — não é de nenhuma equipa em particular
// (ver docs/estrutura-do-site.md). Mudanças aqui devem ser combinadas
// entre equipas, tal como o layout e o menu.
const SECTIONS = [
  {
    label: 'Benefit Tracking Kaizen',
    description: 'Acompanha o benefício gerado pelas iniciativas Kaizen.',
    href: '/benefit-tracking-kaizen',
  },
  {
    label: 'Benefit Tracking Projetos',
    description: 'Acompanha o benefício gerado por cada projeto.',
    href: '/benefit-tracking-projetos',
  },
  {
    label: 'Benchmarking',
    description: 'Compara resultados entre projetos e iniciativas.',
    href: '/benchmarking',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10 text-center">
      <div className="space-y-4 max-w-2xl">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-slate-400">
          Kaizen Institute
        </span>
        <h1 className="text-5xl font-semibold tracking-tight text-slate-800">
          KI BT&amp;B
        </h1>
        <p className="text-lg text-slate-500">
          Benefit tracking e benchmarking Kaizen, num único sítio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 w-full max-w-3xl">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.10)]"
          >
            <h2 className="text-base font-semibold text-slate-800 transition-colors group-hover:text-teal-600">
              {section.label}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
