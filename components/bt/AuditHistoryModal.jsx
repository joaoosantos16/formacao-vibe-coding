'use client';

function formatWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Histórico de alterações — quem mudou o quê, quando. Sem
// autenticação implementada ainda, o "quem" fica em branco por agora
// (ver docs/modelo-de-dados.md).
export default function AuditHistoryModal({ entries, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Histórico de alterações</h3>
          <button type="button" onClick={onClose} className="text-sm text-slate-400 hover:text-slate-700">
            Fechar
          </button>
        </div>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-400">Sem alterações registadas ainda.</p>
        ) : (
          <ul className="space-y-2">
            {entries.map((e) => (
              <li key={e.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span className="text-xs text-slate-400">{formatWhen(e.created_at)}</span>
                <p className="text-slate-700">
                  <span className="font-medium">{e.autor || 'Alguém'}</span> · {e.campo}
                  {e.valor_novo ? <span className="text-slate-500"> → {e.valor_novo}</span> : null}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
