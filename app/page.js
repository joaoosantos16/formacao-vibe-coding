import Link from 'next/link';
import { Unbounded } from 'next/font/google';

// Página inicial partilhada — não é de nenhuma equipa em particular
// (ver docs/estrutura-do-site.md). Mudanças aqui devem ser combinadas
// entre equipas, tal como o layout e o menu.
//
// Exceção deliberada à regra "minimalista, sem cores fortes" (ver
// docs/regras-claude-code.md): só a landing page é assim, a pedido —
// tipografia de destaque, gradientes e um efeito 3D no hover dos
// cartões. O menu e as páginas de cada equipa continuam minimalistas.
const display = Unbounded({ subsets: ['latin'], weight: ['700', '900'] });

const SECTIONS = [
  {
    label: 'Benefit Tracking Kaizen',
    description: 'Acompanha o benefício gerado pelas iniciativas Kaizen.',
    href: '/benefit-tracking-kaizen',
    gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    shadow: 'group-hover:shadow-[0_30px_80px_-15px_rgba(168,85,247,0.45)]',
  },
  {
    label: 'Benefit Tracking Projetos',
    description: 'Acompanha o benefício gerado por cada projeto.',
    href: '/benefit-tracking-projetos',
    gradient: 'from-orange-400 via-rose-500 to-fuchsia-600',
    shadow: 'group-hover:shadow-[0_30px_80px_-15px_rgba(244,63,94,0.45)]',
  },
  {
    label: 'Benchmarking',
    description: 'Compara resultados entre projetos e iniciativas.',
    href: '/benchmarking',
    gradient: 'from-cyan-400 via-sky-500 to-indigo-600',
    shadow: 'group-hover:shadow-[0_30px_80px_-15px_rgba(56,189,248,0.45)]',
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] gap-16 overflow-hidden py-10 text-center">
      {/* blobs decorativos — só atmosfera, sem conteúdo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float-slow absolute -left-24 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-400 via-purple-400 to-indigo-400 opacity-60 blur-3xl" />
        <div className="animate-float-slower absolute -right-16 top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-orange-300 via-rose-400 to-fuchsia-500 opacity-50 blur-3xl" />
        <div className="animate-float-slow absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-500 opacity-40 blur-3xl" />
      </div>

      <div className="max-w-3xl space-y-6">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.35em] text-purple-500/80">
          Kaizen Institute
        </span>
        <h1
          className={`${display.className} bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-orange-500 bg-clip-text text-6xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-7xl`}
        >
          KI BT&amp;B
        </h1>
        <p className="text-xl font-medium text-slate-600">
          Benefit tracking e benchmarking Kaizen, num único sítio.
        </p>
      </div>

      <div className="grid w-full max-w-5xl gap-8 [perspective:1600px] sm:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group relative rounded-[2rem] p-[2px] transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateX(6deg)_rotateY(-8deg)_translateY(-8px)]"
          >
            <div
              className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${section.gradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div
              className={`relative rounded-[2rem] bg-white/90 p-8 text-left backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(80,40,200,0.30)] transition-shadow duration-500 ${section.shadow}`}
            >
              <h2 className={`${display.className} text-lg font-bold text-slate-800`}>
                {section.label}
              </h2>
              <p className="mt-3 text-sm text-slate-500">{section.description}</p>
              <span
                className={`mt-6 inline-block h-1 w-10 rounded-full bg-gradient-to-r ${section.gradient}`}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
