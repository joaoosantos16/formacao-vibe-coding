'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ComboSelect from '@/components/bt/ComboSelect';
import MultiComboSelect from '@/components/bt/MultiComboSelect';
import {
  createProject,
  recommendKpis,
  KPI_CATALOG,
  SECTORS,
  SECTOR_SUBSECTORS,
  PEOPLE,
} from '@/lib/benefitTrackingStore';

const EMPTY_FORM = {
  client: '',
  sector: '',
  subsector: '',
  code: '',
  sr: '',
  em: '',
  consultants: [],
  clientRevenue: '',
  employees: '',
  projectCost: '',
  startDate: '',
  endDate: '',
  variableFee: '',
};

const REQUIRED_FIELDS = ['code', 'client', 'sector', 'subsector', 'sr', 'em'];

export default function NovoProjetoPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedKpis, setSelectedKpis] = useState([]);
  const [kpiSearch, setKpiSearch] = useState('');
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const recommended = useMemo(() => {
    if (!form.sector) return [];
    return recommendKpis(form);
  }, [form.sector]);

  const kpiSearchResults = KPI_CATALOG.filter((k) =>
    `${k.name} ${k.unit}`.toLowerCase().includes(kpiSearch.toLowerCase())
  );

  const isValid =
    REQUIRED_FIELDS.every((f) => String(form[f] ?? '').trim() !== '') &&
    form.consultants.length > 0 &&
    form.startDate &&
    form.endDate;

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateSector(sector) {
    setForm((f) => ({
      ...f,
      sector,
      subsector: SECTOR_SUBSECTORS[sector]?.includes(f.subsector) ? f.subsector : '',
    }));
  }

  function toggleKpi(kpi) {
    setSelectedKpis((current) => {
      const exists = current.find((k) => k.id === kpi.id);
      if (exists) return current.filter((k) => k.id !== kpi.id);
      return [...current, kpi];
    });
  }

  function isSelected(id) {
    return selectedKpis.some((k) => k.id === id);
  }

  function handleAddCustomKpi(kpi) {
    setSelectedKpis((current) => [...current, kpi]);
    setShowAddKpi(false);
  }

  function buildProjectData() {
    return {
      ...form,
      clientRevenue: Number(form.clientRevenue) || 0,
      employees: Number(form.employees) || 0,
      projectCost: Number(form.projectCost) || 0,
      variableFee: Number(form.variableFee) || 0,
      kpis: selectedKpis.map((k) => ({
        id: k.id,
        name: k.name,
        formula: k.formula,
        unit: k.unit,
        direction: k.direction,
        chart: k.chart,
        baseline: null,
        target: null,
        frequency: null,
      })),
      measurements: {},
    };
  }

  async function handleCreate() {
    setAttempted(true);
    if (!isValid) return;
    const id = await createProject(buildProjectData());
    // navegação completa (não router.push) para garantir que a página
    // seguinte vai buscar os dados de fresco ao Supabase.
    window.location.href = `/benefit-tracking-projetos/${id}`;
  }

  async function handleSaveDraft() {
    setAttempted(true);
    if (!isValid) return;
    await createProject(buildProjectData());
    window.location.href = '/benefit-tracking-projetos';
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href="/benefit-tracking-projetos" className="text-xs text-slate-400 hover:text-slate-600">
          ← Project Portfolio
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 mt-1">
          Add New Project
        </h1>
      </div>

      <Section title="General Information">
        <p className="text-xs text-slate-400 -mt-2 sm:col-span-2">All fields in this section are required.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Project Code" required>
            <input className={inputClass} value={form.code} onChange={(e) => updateField('code', e.target.value)} />
          </Field>
          <Field label="Client" required>
            <input className={inputClass} value={form.client} onChange={(e) => updateField('client', e.target.value)} />
          </Field>
          <Field label="Sector" required>
            <ComboSelect value={form.sector} onChange={updateSector} options={SECTORS} placeholder="Select sector" />
          </Field>
          <Field label="Subsector" required>
            <ComboSelect
              value={form.subsector}
              onChange={(v) => updateField('subsector', v)}
              options={SECTOR_SUBSECTORS[form.sector] ?? []}
              disabled={!form.sector}
              placeholder="Select subsector"
            />
          </Field>
          <Field label="SR" required>
            <ComboSelect value={form.sr} onChange={(v) => updateField('sr', v)} options={PEOPLE} placeholder="Select SR" />
          </Field>
          <Field label="EM" required>
            <ComboSelect value={form.em} onChange={(v) => updateField('em', v)} options={PEOPLE} placeholder="Select EM" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Consultants" required>
              <MultiComboSelect values={form.consultants} onChange={(v) => updateField('consultants', v)} options={PEOPLE} />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Client & Project Data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Client Revenue (EUR)">
            <input type="number" className={inputClass} value={form.clientRevenue} onChange={(e) => updateField('clientRevenue', e.target.value)} />
          </Field>
          <Field label="Number of Employees">
            <input type="number" className={inputClass} value={form.employees} onChange={(e) => updateField('employees', e.target.value)} />
          </Field>
          <Field label="Project Cost (EUR)">
            <input type="number" className={inputClass} value={form.projectCost} onChange={(e) => updateField('projectCost', e.target.value)} />
          </Field>
          <Field label="Variable Fee (EUR)">
            <input type="number" className={inputClass} value={form.variableFee} onChange={(e) => updateField('variableFee', e.target.value)} />
          </Field>
          <Field label="Project Start Date" required>
            <input type="date" className={inputClass} value={form.startDate} onChange={(e) => updateField('startDate', e.target.value)} />
          </Field>
          <Field label="Project End Date" required>
            <input type="date" className={inputClass} value={form.endDate} onChange={(e) => updateField('endDate', e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Business Case">
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
          <p className="font-medium text-slate-500">Upload Business Case</p>
          <p className="mt-1">Drag and drop a file here, or click to browse.</p>
          <p className="mt-3 text-xs text-slate-400">
            AI document extraction is not available in this prototype — fields above are filled in manually for now.
          </p>
        </div>
      </Section>

      <Section title="KPI Recommendations">
        {!form.sector && (
          <p className="text-sm text-slate-400">Select a Sector above to see recommended KPIs.</p>
        )}
        {form.sector && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              Illustrative recommendations based on sector match with the KPI Database — not yet based on historical project similarity.
            </p>
            {recommended.map((kpi) => (
              <KpiRow key={kpi.id} kpi={kpi} selected={isSelected(kpi.id)} onToggle={() => toggleKpi(kpi)} relevance={kpi.relevance} />
            ))}
          </div>
        )}
      </Section>

      <Section title="KPI Database">
        <input
          type="text"
          placeholder="Search KPI (name, unit)"
          value={kpiSearch}
          onChange={(e) => setKpiSearch(e.target.value)}
          className={inputClass}
        />
        <div className="mt-3 space-y-2">
          {kpiSearch &&
            kpiSearchResults.map((kpi) => (
              <KpiRow key={kpi.id} kpi={kpi} selected={isSelected(kpi.id)} onToggle={() => toggleKpi(kpi)} />
            ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAddKpi(true)}
          className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          + Add New KPI
        </button>
      </Section>

      {selectedKpis.length > 0 && (
        <Section title="Selected KPIs">
          <div className="space-y-2">
            {selectedKpis.map((kpi) => (
              <KpiRow key={kpi.id} kpi={kpi} selected onToggle={() => toggleKpi(kpi)} />
            ))}
          </div>
        </Section>
      )}

      {attempted && !isValid && (
        <p className="text-sm text-rose-600 text-right">
          Please fill in all required General Information fields (Project Code, Client, Sector, Subsector, SR, EM, at least one Consultant) and the project dates.
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Link
          href="/benefit-tracking-projetos"
          className="rounded-full px-6 py-3 text-sm font-medium text-slate-500 hover:bg-slate-900/5"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSaveDraft}
          className="rounded-full px-6 py-3 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-900/5"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-transform"
        >
          Create Project
        </button>
      </div>

      {showAddKpi && (
        <AddKpiModal onClose={() => setShowAddKpi(false)} onAdd={handleAddCustomKpi} />
      )}
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400';

function Section({ title, children }) {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-6 space-y-4">
      <h2 className="font-semibold text-slate-700">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-slate-500">
        {label}
        {required && <span className="text-rose-400"> *</span>}
      </span>
      {children}
    </label>
  );
}

function KpiRow({ kpi, selected, onToggle, relevance }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={!!selected} onChange={onToggle} className="h-4 w-4 accent-emerald-500" />
        <div>
          <p className="font-medium text-slate-700">{kpi.name}</p>
          <p className="text-xs text-slate-400">{kpi.formula} · {kpi.unit} · {kpi.chart}</p>
        </div>
      </div>
      {relevance != null && (
        <span className="shrink-0 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1 text-xs font-medium">
          {relevance}% match
        </span>
      )}
    </label>
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
    onAdd({
      id: `kpi-custom-${Date.now()}`,
      name,
      formula,
      unit,
      direction,
      chart,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4 shadow-2xl">
        <h3 className="font-semibold text-slate-700">Add New KPI</h3>
        <Field label="KPI Name">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Calculation Formula">
          <input className={inputClass} value={formula} onChange={(e) => setFormula(e.target.value)} />
        </Field>
        <Field label="Measurement Unit">
          <input className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value)} />
        </Field>
        <Field label="KPI Direction">
          <select className={inputClass} value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="higher">Higher is Better</option>
            <option value="lower">Lower is Better</option>
          </select>
        </Field>
        <Field label="Suggested Chart Type">
          <select className={inputClass} value={chart} onChange={(e) => setChart(e.target.value)}>
            {['Line Chart', 'Bar Chart', 'Column Chart', 'Area Chart', 'Gauge', 'KPI Card', 'Scatter Plot'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm text-slate-500 hover:bg-slate-900/5">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 px-5 py-2.5 text-sm font-medium text-white">
            Add KPI
          </button>
        </div>
      </div>
    </div>
  );
}
