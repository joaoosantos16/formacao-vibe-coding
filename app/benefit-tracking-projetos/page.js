'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getProjects, deleteProject, STATUS_LABELS } from '@/lib/benefitTrackingStore';

const STATUS_STYLES = {
  active: 'bg-blue-50 text-blue-700 ring-blue-200',
  closed: 'bg-slate-100 text-slate-500 ring-slate-200',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB');
}

export default function BenefitTrackingProjetosPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [clientFiltro, setClientFiltro] = useState('');
  const [sectorFiltro, setSectorFiltro] = useState('');
  const [subsectorFiltro, setSubsectorFiltro] = useState('');
  const [emFiltro, setEmFiltro] = useState('');
  const [srFiltro, setSrFiltro] = useState('');
  const [consultantFiltro, setConsultantFiltro] = useState('');

  async function reload() {
    setProjects(await getProjects());
  }

  useEffect(() => {
    reload();
    // recarrega sempre que a janela volta a ganhar foco — protótipo
    // guarda tudo em localStorage, por isso é preciso reler quando se
    // volta desta rota (ex: depois de criar/apagar um projeto).
    window.addEventListener('focus', reload);
    return () => window.removeEventListener('focus', reload);
  }, []);

  const options = useMemo(() => {
    const unique = (fn) => Array.from(new Set(projects.map(fn).filter(Boolean))).sort();
    return {
      clients: unique((p) => p.client),
      sectors: unique((p) => p.sector),
      subsectors: unique((p) => p.subsector),
      ems: unique((p) => p.em),
      srs: unique((p) => p.sr),
      consultants: Array.from(new Set(projects.flatMap((p) => p.consultants ?? []))).sort(),
    };
  }, [projects]);

  const filtered = projects.filter((p) => {
    const searchAlvo = `${p.code ?? ''} ${p.client ?? ''} ${p.sector ?? ''}`.toLowerCase();
    if (search && !searchAlvo.includes(search.toLowerCase())) return false;
    if (statusFiltro && p.status !== statusFiltro) return false;
    if (clientFiltro && p.client !== clientFiltro) return false;
    if (sectorFiltro && p.sector !== sectorFiltro) return false;
    if (subsectorFiltro && p.subsector !== subsectorFiltro) return false;
    if (emFiltro && p.em !== emFiltro) return false;
    if (srFiltro && p.sr !== srFiltro) return false;
    if (consultantFiltro && !(p.consultants ?? []).includes(consultantFiltro)) return false;
    return true;
  });

  const summary = {
    total: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    closed: projects.filter((p) => p.status === 'closed').length,
  };

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    await deleteProject(id);
    reload();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Profile</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Project Portfolio
          </h1>
        </div>
        <Link
          href="/benefit-tracking-projetos/novo"
          className="rounded-full bg-gradient-to-br from-blue-400 to-sky-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-transform hover:-translate-y-0.5"
        >
          + Add New Project
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Total Projects" value={summary.total} />
        <SummaryCard label="Active Projects" value={summary.active} accent="blue" />
        <SummaryCard label="Closed Projects" value={summary.closed} accent="slate" />
      </div>

      <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-6 space-y-4">
        <input
          type="text"
          placeholder="Search projects (code, client, sector)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Status" value={statusFiltro} onChange={setStatusFiltro} options={['active', 'closed']} labels={STATUS_LABELS} />
          <FilterSelect label="Client" value={clientFiltro} onChange={setClientFiltro} options={options.clients} />
          <FilterSelect label="Sector" value={sectorFiltro} onChange={setSectorFiltro} options={options.sectors} />
          <FilterSelect label="Subsector" value={subsectorFiltro} onChange={setSubsectorFiltro} options={options.subsectors} />
          <FilterSelect label="EM" value={emFiltro} onChange={setEmFiltro} options={options.ems} />
          <FilterSelect label="SR" value={srFiltro} onChange={setSrFiltro} options={options.srs} />
          <FilterSelect label="Consultant" value={consultantFiltro} onChange={setConsultantFiltro} options={options.consultants} />
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500 text-sm">No projects found.</p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/benefit-tracking-projetos/${project.id}`}
            className="group relative rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-6 flex flex-col gap-2 transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(0,0,0,0.10)]"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-slate-800 leading-snug">{project.code}</h2>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ring-1 ${STATUS_STYLES[project.status]}`}
              >
                {STATUS_LABELS[project.status]}
              </span>
            </div>
            <p className="text-sm text-slate-500">{project.client}</p>
            <p className="text-xs text-slate-400">{project.sector}</p>
            <p className="text-xs text-slate-400">EM: {project.em}</p>
            <p className="text-xs text-slate-400">SR: {project.sr}</p>
            <div className="mt-2 flex justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
              <span>{formatDate(project.startDate)}</span>
              <span>{formatDate(project.endDate)}</span>
            </div>
            <button
              type="button"
              onClick={(e) => handleDelete(e, project.id)}
              className="absolute top-3 right-3 text-xs text-slate-300 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"
            >
              Delete
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  const accentText =
    accent === 'blue'
      ? 'text-blue-600'
      : accent === 'slate'
      ? 'text-slate-500'
      : 'text-slate-800';
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-semibold ${accentText}`}>{value}</p>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, labels }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">{label}: all</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {labels ? labels[opt] : opt}
        </option>
      ))}
    </select>
  );
}
