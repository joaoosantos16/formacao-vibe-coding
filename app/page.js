export default function Home() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold">Base do projeto pronta 🚀</h1>
        <p className="text-gray-600">
          Ainda não há nenhuma funcionalidade definida. Este é o ponto de
          partida para a formação — a próxima pessoa a continuar deve
          consultar o <code className="mx-1 px-1 bg-gray-100 rounded">CLAUDE.md</code>
          para saber o estado atual e o próximo passo.
        </p>
        <p className={supabaseConfigured ? 'text-green-600' : 'text-amber-600'}>
          Supabase:{' '}
          {supabaseConfigured
            ? 'variáveis de ambiente configuradas ✅'
            : 'variáveis de ambiente em falta ⚠️ (ver .env.example)'}
        </p>
        <div className="w-24 h-24 bg-black mx-auto" />
      </div>
    </main>
  );
}
