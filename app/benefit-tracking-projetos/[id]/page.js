'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ComboSelect from '@/components/bt/ComboSelect';
import MultiComboSelect from '@/components/bt/MultiComboSelect';
import BenefitStats from '@/components/bt/BenefitStats';
import BenefitMatrix from '@/components/bt/BenefitMatrix';
import MonthlyBenefitChart from '@/components/bt/MonthlyBenefitChart';
import KpiShareChart from '@/components/bt/KpiShareChart';
import AuditHistoryModal from '@/components/bt/AuditHistoryModal';
import { formatNumber, formatWithUnit } from '@/lib/format';
import { projectMonthRange, monthsBetween, calcKpi, projectTotals, kpiColor } from '@/lib/benefitCalc';
import {
  getProject,
  updateProject,
  deleteProject,
  updateKpiConfig,
  addKpiToProject,
  removeKpiFromProject,
  setMeasurement,
  setPlanOverride,
  setVolumeOverride,
  setAtualOverride,
  getAuditTrail,
  generatePeriods,
  KPI_FREQUENCY,
  KPI_FREQUENCY_LABELS,
  KPI_DIRECTION,
  KPI_DIRECTION_LABELS,
  CHART_TYPES,
  SECTORS,
  SECTOR_SUBSECTORS,
  PEOPLE,
  KPI_CATALOG,
  STATUS_LABELS,
} from '@/lib/benefitTrackingStore';

const TABS = [
  { key: 'dashboard', label: 'Benefit' },
  { key: 'general', label: 'General Information' },
  { key: 'kpi-config', label: 'KPI Configuration' },
  { key: 'tracking', label: 'Benefit Tracking Update' },
];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB');
}

export default function ProjectPage() {
  const params = useParams();
  // undefined = ainda a carregar; null = carregado, mas não encontrado.
  const [project, setProject] = useState(undefined);
  const [activeTab, setActiveTab] = useState('dashboard');

  async function reload() {
    setProject(await getProject(params.id));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (project === undefined) {
    return <p className="text-slate-500">Loading project...</p>;
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <p className="text-slate-500">Project not found.</p>
        <Link href="/benefit-tracking-projetos" className="text-blue-600 font-medium">
          ← Project Portfolio
        </Link>
      </div>
    );
  }

  async function handleDeleteProject() {
    if (!window.confirm(`Delete project ${project.code}? This cannot be undone.`)) return;
    await deleteProject(project.id);
    window.location.href = '/benefit-tracking-projetos';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/benefit-tracking-projetos" className="text-xs text-slate-400 hover:text-slate-600">
            ← Project Portfolio
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800 mt-1">{project.code}</h1>
          <p className="text-sm text-slate-500">{project.client} · {project.sector}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 px-4 py-1.5 text-sm font-medium h-fit">
            {STATUS_LABELS[project.status]}
          </span>
          <button
            type="button"
            onClick={handleDeleteProject}
            className="text-sm text-slate-400 hover:text-rose-500"
          >
            Delete Project
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-full bg-white/70 backdrop-blur-xl ring-1 ring-black/5 p-1.5 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-br from-blue-400 to-sky-500 text-white shadow'
                : 'text-slate-600 hover:bg-slate-900/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <BenefitTab project={project} onSaved={reload} />}
      {activeTab === 'general' && <GeneralInfoTab project={project} onSaved={reload} />}
      {activeTab === 'kpi-config' && <KpiConfigTab project={project} onSaved={reload} />}
      {activeTab === 'tracking' && <TrackingTab project={project} onSaved={reload} />}
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-6 ${className}`}>
      {children}
    </div>
  );
}

// ---------- Benefit ----------
// Vista principal do projeto — inspirada no motor de referência trazido
// de outra equipa (Benefit_Tracking_Final_...html): Plano (rampa linear
// baseline->objetivo, editável célula a célula), Atual (das capturas),
// Poupança € com tooltip de metodologia, RAG, e histórico de alterações.
// Ver lib/benefitCalc.js.

function BenefitTab({ project, onSaved }) {
  const [showAudit, setShowAudit] = useState(false);
  const [auditEntries, setAuditEntries] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  if (project.kpis.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">
          Este projeto ainda não tem indicadores. Vai a <strong>KPI Configuration</strong> e escolhe do catálogo.
        </p>
      </Card>
    );
  }

  const { start, end } = projectMonthRange(project);
  const months = monthsBetween(start, end);
  const kpisWithCalc = project.kpis.map((kpi, i) => ({
    kpi,
    calc: calcKpi(project, kpi, months),
    color: kpiColor(i),
  }));
  const totals = projectTotals(kpisWithCalc, months);
  const alerts = kpisWithCalc.filter(({ calc }) => Number.isNaN(calc.rate));

  async function handlePlanChange(kpiId, mk, value) {
    await setPlanOverride(project.id, kpiId, mk, value === '' ? null : Number(value));
    onSaved();
  }

  async function handleVolumeChange(kpiId, mk, value) {
    await setVolumeOverride(project.id, kpiId, mk, value === '' ? null : Number(value));
    onSaved();
  }

  async function handleAtualChange(kpiId, mk, value) {
    await setAtualOverride(project.id, kpiId, mk, value === '' ? null : Number(value));
    onSaved();
  }

  async function openAudit() {
    setAuditLoading(true);
    setAuditEntries(await getAuditTrail(project.id));
    setAuditLoading(false);
    setShowAudit(true);
  }

  return (
    <div className="space-y-6">
      <BenefitStats totals={totals} />

      {alerts.length > 0 && (
        <Card>
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-semibold text-slate-700">Avisos</h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {alerts.length}
            </span>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-600">
            {alerts.map(({ kpi }) => (
              <li key={kpi.id}>
                <strong>{kpi.name}</strong> não é possível converter a € — falta baseline, objetivo, volume ou
                benefício ao objetivo (ver <em>KPI Configuration</em>).
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
          <div>
            <h2 className="font-semibold text-slate-700">Matriz Benefit</h2>
            <p className="text-xs text-slate-400">
              {kpisWithCalc.length} KPI · Plano e Volume editáveis célula a célula · Atual vem das capturas
            </p>
          </div>
          <button
            type="button"
            onClick={openAudit}
            className="rounded-full px-4 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-900/5"
          >
            {auditLoading ? 'A carregar…' : 'Histórico'}
          </button>
        </div>
        <div className="mt-4 px-2 pb-2">
          <BenefitMatrix
            kpisWithCalc={kpisWithCalc}
            months={months}
            onPlanChange={handlePlanChange}
            onVolumeChange={handleVolumeChange}
            onAtualChange={handleAtualChange}
          />
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <h2 className="mb-3 font-semibold text-slate-700">Benefício mensal · logrado vs plano</h2>
        <MonthlyBenefitChart months={months} byMonth={totals.byMonth} byMonthPlan={totals.byMonthPlan} />
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold text-slate-700">Reparto do benefício por KPI</h2>
        <KpiShareChart kpisWithCalc={kpisWithCalc} />
      </Card>

      {showAudit && <AuditHistoryModal entries={auditEntries} onClose={() => setShowAudit(false)} />}
    </div>
  );
}

// ---------- General Information ----------

function GeneralInfoTab({ project, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(project);

  useEffect(() => setForm(project), [project]);

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateSector(sector) {
    setForm((f) => ({
      ...f,
      sector,
      subsector: SECTOR_SUBSECTORS[sector]?.includes(f.subsector) ? f.subsector : '',
    }));
  }

  async function save() {
    await updateProject(project.id, form);
    setEditing(false);
    onSaved();
  }

  const view = editing ? form : project;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setForm(project); }} className="rounded-full px-5 py-2 text-sm text-slate-500 hover:bg-slate-900/5">
              Cancel
            </button>
            <button onClick={save} className="rounded-full bg-gradient-to-br from-blue-400 to-sky-500 px-5 py-2 text-sm font-medium text-white">
              Save
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="rounded-full px-5 py-2 text-sm font-medium ring-1 ring-slate-200 text-slate-600 hover:bg-slate-900/5">
            Edit Information
          </button>
        )}
      </div>

      <Card>
        <h2 className="font-semibold text-slate-700 mb-4">Project Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="Project Code" value={view.code} editing={editing} onChange={(v) => field('code', v)} />
          <InfoField label="Client" value={view.client} editing={editing} onChange={(v) => field('client', v)} />
          {editing ? (
            <>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">Sector</p>
                <ComboSelect value={view.sector} onChange={updateSector} options={SECTORS} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">Subsector</p>
                <ComboSelect
                  value={view.subsector}
                  onChange={(v) => field('subsector', v)}
                  options={SECTOR_SUBSECTORS[view.sector] ?? []}
                  disabled={!view.sector}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">SR</p>
                <ComboSelect value={view.sr} onChange={(v) => field('sr', v)} options={PEOPLE} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1.5">EM</p>
                <ComboSelect value={view.em} onChange={(v) => field('em', v)} options={PEOPLE} />
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-slate-400 mb-1.5">Consultants</p>
                <MultiComboSelect values={view.consultants} onChange={(v) => field('consultants', v)} options={PEOPLE} />
              </div>
            </>
          ) : (
            <>
              <InfoField label="Sector" value={view.sector} editing={false} />
              <InfoField label="Subsector" value={view.subsector} editing={false} />
              <InfoField label="SR" value={view.sr} editing={false} />
              <InfoField label="EM" value={view.em} editing={false} />
              <InfoField label="Consultants" value={(view.consultants ?? []).join(', ')} editing={false} />
            </>
          )}
        </div>
      </Card>

      <InfoSection title="Client Information">
        <InfoField label="Revenue" value={formatWithUnit(view.clientRevenue, 'EUR')} editing={editing} onChange={(v) => field('clientRevenue', Number(v))} type="number" raw={view.clientRevenue} />
        <InfoField label="Number of Employees" value={formatNumber(view.employees)} editing={editing} onChange={(v) => field('employees', Number(v))} type="number" raw={view.employees} />
      </InfoSection>

      <InfoSection title="Financial Information">
        <InfoField label="Project Cost" value={formatWithUnit(view.projectCost, 'EUR')} editing={editing} onChange={(v) => field('projectCost', Number(v))} type="number" raw={view.projectCost} />
        <InfoField label="Variable Fee" value={formatWithUnit(view.variableFee, 'EUR')} editing={editing} onChange={(v) => field('variableFee', Number(v))} type="number" raw={view.variableFee} />
      </InfoSection>

      <InfoSection title="Timeline">
        <InfoField label="Start Date" value={view.startDate} editing={editing} onChange={(v) => field('startDate', v)} type="date" />
        <InfoField label="End Date" value={view.endDate} editing={editing} onChange={(v) => field('endDate', v)} type="date" />
        <InfoField label="Project Status" value={STATUS_LABELS[project.status]} editing={false} />
      </InfoSection>

      <InfoSection title="Documents">
        <p className="text-sm text-slate-400 sm:col-span-2">
          {project.businessCase ? project.businessCase : 'No Business Case uploaded.'}
        </p>
      </InfoSection>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <Card>
      <h2 className="font-semibold text-slate-700 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </Card>
  );
}

function InfoField({ label, value, editing, onChange, type = 'text', raw }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      {editing && onChange ? (
        <input
          type={type}
          value={(type === 'number' ? raw : value) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ) : (
        <p className="mt-1 text-sm text-slate-700">{type === 'date' ? formatDate(value) : (value ?? '—')}</p>
      )}
    </div>
  );
}

// ---------- KPI Configuration ----------

function KpiConfigTab({ project, onSaved }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  async function save(kpiId, patch) {
    await updateKpiConfig(project.id, kpiId, patch);
    onSaved();
  }

  async function remove(kpiId) {
    if (!window.confirm('Remove this KPI from the project?')) return;
    await removeKpiFromProject(project.id, kpiId);
    onSaved();
  }

  const selectedIds = project.kpis.map((k) => k.id);
  const searchResults = search
    ? KPI_CATALOG.filter((k) => !selectedIds.includes(k.id) && k.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  async function addExisting(kpi) {
    await addKpiToProject(project.id, {
      id: kpi.id,
      name: kpi.name,
      formula: kpi.formula,
      unit: kpi.unit,
      direction: kpi.direction,
      chart: kpi.chart,
      baseline: null,
      target: null,
      frequency: null,
    });
    setSearch('');
    onSaved();
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-x-auto">
        {project.kpis.length === 0 ? (
          <p className="text-slate-500">No KPIs selected for this project yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="py-2 pr-4">KPI Name</th>
                <th className="py-2 pr-4">Formula</th>
                <th className="py-2 pr-4">Unit</th>
                <th className="py-2 pr-4">Direction</th>
                <th className="py-2 pr-4">Chart</th>
                <th className="py-2 pr-4">Baseline</th>
                <th className="py-2 pr-4">Target</th>
                <th className="py-2 pr-4">Frequency</th>
                <th className="py-2 pr-4">Aggregation</th>
                <th className="py-2 pr-4" title="Impacto económico ao objetivo (€) — junto com Volume, define a tarifa unitária usada na Matriz Benefit">Impact at target (€)</th>
                <th className="py-2 pr-4" title="Volume anual (ex: unidades produzidas/ano) — usado para calcular a tarifa unitária">Annual volume</th>
                <th className="py-2 pr-4">Start month</th>
                <th className="py-2 pr-4">Target month</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.kpis.map((k) => (
                <tr key={k.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-2 pr-4 font-medium text-slate-700">{k.name}</td>
                  <td className="py-2 pr-4 text-slate-500">{k.formula}</td>
                  <td className="py-2 pr-4 text-slate-500">{k.unit}</td>
                  <td className="py-2 pr-4">
                    <select
                      defaultValue={k.direction}
                      onChange={(e) => save(k.id, { direction: e.target.value })}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    >
                      {Object.values(KPI_DIRECTION).map((d) => (
                        <option key={d} value={d}>{KPI_DIRECTION_LABELS[d]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      defaultValue={k.chart}
                      onChange={(e) => save(k.id, { chart: e.target.value })}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    >
                      {CHART_TYPES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      defaultValue={k.baseline ?? ''}
                      onBlur={(e) => save(k.id, { baseline: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      defaultValue={k.target ?? ''}
                      onBlur={(e) => save(k.id, { target: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      defaultValue={k.frequency ?? ''}
                      onChange={(e) => save(k.id, { frequency: e.target.value || null })}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    >
                      <option value="">—</option>
                      {Object.values(KPI_FREQUENCY).map((f) => (
                        <option key={f} value={f}>{KPI_FREQUENCY_LABELS[f]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <select
                      defaultValue={k.monthlyAggregation ?? 'avg'}
                      onChange={(e) => save(k.id, { monthlyAggregation: e.target.value })}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    >
                      <option value="avg">Average</option>
                      <option value="sum">Sum</option>
                      <option value="last">Last</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      defaultValue={k.beneficio ?? ''}
                      onBlur={(e) => save(k.id, { beneficio: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      defaultValue={k.volume ?? ''}
                      onBlur={(e) => save(k.id, { volume: e.target.value === '' ? null : Number(e.target.value) })}
                      className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="month"
                      defaultValue={k.mesInicio ?? ''}
                      onChange={(e) => save(k.id, { mesInicio: e.target.value || null })}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="month"
                      defaultValue={k.mesObjetivo ?? ''}
                      onChange={(e) => save(k.id, { mesObjetivo: e.target.value || null })}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <button type="button" onClick={() => remove(k.id)} className="text-xs text-slate-400 hover:text-rose-500">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700">Add KPI</h2>
          <button type="button" onClick={() => setShowAdd(true)} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            + Add New KPI
          </button>
        </div>
        <input
          type="text"
          placeholder="Search KPI Database..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map((kpi) => (
              <button
                key={kpi.id}
                type="button"
                onClick={() => addExisting(kpi)}
                className="w-full text-left rounded-xl border border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
              >
                <p className="font-medium text-slate-700">{kpi.name}</p>
                <p className="text-xs text-slate-400">{kpi.formula} · {kpi.unit}</p>
              </button>
            ))}
          </div>
        )}
      </Card>

      {showAdd && (
        <AddKpiModal
          onClose={() => setShowAdd(false)}
          onAdd={async (kpi) => {
            await addKpiToProject(project.id, { ...kpi, baseline: null, target: null, frequency: null });
            setShowAdd(false);
            onSaved();
          }}
        />
      )}
    </div>
  );
}

function AddKpiModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [formula, setFormula] = useState('');
  const [unit, setUnit] = useState('');
  const [direction, setDirection] = useState('higher');
  const [chart, setChart] = useState('Line Chart');

  function handleSubmit() {
    if (!name) return;
    onAdd({ id: `kpi-custom-${Date.now()}`, name, formula, unit, direction, chart });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4 shadow-2xl">
        <h3 className="font-semibold text-slate-700">Add New KPI</h3>
        <LabeledInput label="KPI Name" value={name} onChange={setName} />
        <LabeledInput label="Calculation Formula" value={formula} onChange={setFormula} />
        <LabeledInput label="Measurement Unit" value={unit} onChange={setUnit} />
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">KPI Direction</p>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="higher">Higher is Better</option>
            <option value="lower">Lower is Better</option>
          </select>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">Suggested Chart Type</p>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" value={chart} onChange={(e) => setChart(e.target.value)}>
            {CHART_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm text-slate-500 hover:bg-slate-900/5">Cancel</button>
          <button type="button" onClick={handleSubmit} className="rounded-full bg-gradient-to-br from-blue-400 to-sky-500 px-5 py-2.5 text-sm font-medium text-white">Add KPI</button>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
      <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

// ---------- Benefit Tracking Update ----------
// Uma tabela por frequência (semanal / mensal), períodos em linhas,
// um KPI por coluna — mais fácil de ler do que uma tabela por KPI.

function TrackingTab({ project, onSaved }) {
  const configured = project.kpis.filter((k) => k.frequency);

  if (configured.length === 0) {
    return (
      <Card>
        <p className="text-slate-500">
          No KPI has a Measurement Frequency set yet. Go to <strong>KPI Configuration</strong> and set a frequency (Weekly or Monthly) to generate update periods here.
        </p>
      </Card>
    );
  }

  const groups = Object.values(KPI_FREQUENCY)
    .map((freq) => ({ freq, kpis: configured.filter((k) => k.frequency === freq) }))
    .filter((g) => g.kpis.length > 0);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <TrackingGroup key={group.freq} project={project} freq={group.freq} kpis={group.kpis} onSaved={onSaved} />
      ))}
    </div>
  );
}

function TrackingGroup({ project, freq, kpis, onSaved }) {
  const periods = useMemo(
    () => generatePeriods(project.startDate, project.endDate, freq),
    [project.startDate, project.endDate, freq]
  );

  async function handleChange(kpiId, period, value) {
    await setMeasurement(project.id, kpiId, period, value === '' ? null : Number(value));
    onSaved();
  }

  return (
    <Card className="overflow-x-auto">
      <h2 className="font-semibold text-slate-700 mb-4">{KPI_FREQUENCY_LABELS[freq]} Update</h2>
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white/90 text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100 py-2 pr-4">
              Period
            </th>
            {kpis.map((k) => (
              <th key={k.id} className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100 py-2 pr-4 whitespace-nowrap">
                {k.name} <span className="normal-case text-slate-300">({k.unit})</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period, i) => (
            <tr key={period} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
              <td className="sticky left-0 bg-inherit py-1.5 pr-4 text-slate-500 border-b border-slate-50 font-medium">{period}</td>
              {kpis.map((k) => (
                <td key={k.id} className="py-1.5 pr-4 border-b border-slate-50">
                  <input
                    type="number"
                    defaultValue={(project.measurements[k.id] ?? {})[period] ?? ''}
                    onBlur={(e) => handleChange(k.id, period, e.target.value)}
                    className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
