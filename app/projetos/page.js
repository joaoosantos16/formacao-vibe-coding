'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PROJETO_STATUS, PROJETO_STATUS_LABELS } from '@/lib/constants';

const ESTADO_STYLES = {
  [PROJETO_STATUS.CLOSE]: 'bg-green-50 border-green-400 text-green-700',
  [PROJETO_STATUS.ACTIVE]: 'bg-amber-50 border-amber-400 text-amber-700',
};

// Dados dummy — só para desenhar o front-end. Substituir pelo fetch ao
// Supabase quando o esquema da tabela partilhada "projetos" estiver
// alinhado com as outras equipas (ver conversa com o João).
const DUMMY_PROJETOS = [
  { id: 1, code: 'BT-001', company: 'Continente', sector: 'Retail', em: 'Ana Silva', sr: 'João Pais', estado: PROJETO_STATUS.ACTIVE, logo_url: null },
  { id: 2, code: 'BT-002', company: 'EDP', sector: 'Energy', em: 'Rui Costa', sr: 'Marta Alves', estado: PROJETO_STATUS.CLOSE, logo_url: null },
  { id: 3, code: 'BT-003', company: 'TAP', sector: 'Aviation', em: 'Sofia Marques', sr: 'João Pais', estado: PROJETO_STATUS.ACTIVE, logo_url: null },
  { id: 4, code: 'BT-004', company: 'Jerónimo Martins', sector: 'Retail', em: 'Ana Silva', sr: 'Marta Alves', estado: PROJETO_STATUS.CLOSE, logo_url: null },
  { id: 5, code: 'BT-005', company: 'Galp', sector: 'Energy', em: 'Rui Costa', sr: 'Pedro Nunes', estado: PROJETO_STATUS.ACTIVE, logo_url: null },
  { id: 6, code: 'BT-006', company: 'Sonae', sector: 'Retail', em: 'Sofia Marques', sr: 'Pedro Nunes', estado: PROJETO_STATUS.CLOSE, logo_url: null },
];

export default function ProjetosPage() {
  const [projetos] = useState(DUMMY_PROJETOS);
  const [search, setSearch] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('');
  const [emFiltro, setEmFiltro] = useState('');
  const [srFiltro, setSrFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const empresas = useMemo(
    () => Array.from(new Set(projetos.map((p) => p.company).filter(Boolean))).sort(),
    [projetos]
  );
  const ems = useMemo(
    () => Array.from(new Set(projetos.map((p) => p.em).filter(Boolean))).sort(),
    [projetos]
  );
  const srs = useMemo(
    () => Array.from(new Set(projetos.map((p) => p.sr).filter(Boolean))).sort(),
    [projetos]
  );

  const projetosFiltrados = projetos.filter((p) => {
    const searchAlvo = `${p.code ?? ''} ${p.company ?? ''} ${p.sector ?? ''}`.toLowerCase();
    if (search && !searchAlvo.includes(search.toLowerCase())) return false;
    if (empresaFiltro && p.company !== empresaFiltro) return false;
    if (emFiltro && p.em !== emFiltro) return false;
    if (srFiltro && p.sr !== srFiltro) return false;
    if (estadoFiltro && p.estado !== estadoFiltro) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 border-r p-6 flex flex-col gap-6">
        <h1 className="font-bold text-lg">👤 Profile</h1>

        <div>
          <p className="text-xs uppercase text-gray-400 mb-2">Status</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setEstadoFiltro('')}
              className={`text-left px-3 py-2 rounded text-sm ${
                estadoFiltro === '' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {Object.values(PROJETO_STATUS).map((estado) => (
              <button
                key={estado}
                onClick={() => setEstadoFiltro(estado)}
                className={`text-left px-3 py-2 rounded text-sm ${
                  estadoFiltro === estado ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {PROJETO_STATUS_LABELS[estado]}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/projetos/novo"
          className="mt-auto px-4 py-2 rounded bg-black text-white text-sm font-medium text-center hover:bg-gray-800"
        >
          + Add
        </Link>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search (code, company, sector)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
          <select
            value={empresaFiltro}
            onChange={(e) => setEmpresaFiltro(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Company: all</option>
            {empresas.map((empresa) => (
              <option key={empresa} value={empresa}>
                {empresa}
              </option>
            ))}
          </select>
          <select
            value={emFiltro}
            onChange={(e) => setEmFiltro(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">EM: all</option>
            {ems.map((em) => (
              <option key={em} value={em}>
                {em}
              </option>
            ))}
          </select>
          <select
            value={srFiltro}
            onChange={(e) => setSrFiltro(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">SR: all</option>
            {srs.map((sr) => (
              <option key={sr} value={sr}>
                {sr}
              </option>
            ))}
          </select>
        </div>

        {projetosFiltrados.length === 0 && (
          <p className="text-gray-500">No projects found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {projetosFiltrados.map((projeto) => (
            <div
              key={projeto.id}
              className={`border-2 rounded-lg p-4 flex flex-col items-center text-center gap-2 ${
                ESTADO_STYLES[projeto.estado] ?? 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
            >
              {projeto.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={projeto.logo_url}
                  alt={`Logo ${projeto.company}`}
                  className="w-12 h-12 object-contain rounded bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-white border flex items-center justify-center text-xs text-gray-400">
                  no logo
                </div>
              )}
              <p className="text-xs">
                <span className="font-semibold">Code:</span> {projeto.code}
              </p>
              <p className="text-xs">
                <span className="font-semibold">Company:</span> {projeto.company}
              </p>
              <p className="text-xs">
                <span className="font-semibold">Sector:</span> {projeto.sector}
              </p>
              <p className="text-xs">
                <span className="font-semibold">EM:</span> {projeto.em}
              </p>
              <p className="text-xs">
                <span className="font-semibold">SR:</span> {projeto.sr}
              </p>
              <span className="text-xs font-medium mt-1">
                {PROJETO_STATUS_LABELS[projeto.estado] ?? projeto.estado}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
