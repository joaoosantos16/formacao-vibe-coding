export default function Home() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="max-w-xl w-full text-center space-y-4 rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 p-10">
        <h1 className="text-3xl font-semibold tracking-tight">KI BT&amp;B</h1>
        <p className="text-slate-500">
          Escolhe uma das três áreas no menu acima: <strong>Benefit Tracking
          Kaizen</strong>, <strong>Benefit Tracking Projetos</strong> ou{' '}
          <strong>Benchmarking</strong>. Consulta o{' '}
          <code className="mx-1 px-1.5 py-0.5 bg-slate-900/5 rounded-md">CLAUDE.md</code>
          para o estado atual do projeto.
        </p>
        <p className={supabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}>
          Supabase:{' '}
          {supabaseConfigured
            ? 'variáveis de ambiente configuradas'
            : 'variáveis de ambiente em falta (ver .env.example)'}
        </p>
        <div className="w-40 h-24 bg-blue-500 rounded-lg mx-auto" />
        <p className="text-sm text-gray-500">
          Equipa C — teste de deployment
        </p>
      </div>
    </div>
  );
}
