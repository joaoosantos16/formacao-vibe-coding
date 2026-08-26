'use client';

import { useState } from 'react';
import ConsultantTable from '@/components/benefit-tracking/productivity/ConsultantTable';
import SimpleTrendChart from '@/components/benefit-tracking/productivity/SimpleTrendChart';
import ProjectsOccupationDetailTable from '@/components/benefit-tracking/productivity/ProjectsOccupationDetailTable';
import {
  CONSULTANT_LEVELS,
  getConsultants,
  getOccupationSeries,
  getGreenDaysEvolution,
  getProductivityTopFree,
} from '@/lib/benefitTracking';

const DATE_RANGES = ['Last 12 weeks', 'This quarter', 'Year to date'];

export default function ConsultantView() {
  const consultants = getConsultants();
  const [level, setLevel] = useState('all');
  const [consultant, setConsultant] = useState('all');
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);

  const consultantsForLevel = level === 'all' ? consultants : consultants.filter((c) => c.level === level);

  function handleLevelChange(newLevel) {
    setLevel(newLevel);
    const stillValid = newLevel === 'all' || consultants.some((c) => c.level === newLevel && c.consultant === consultant);
    if (!stillValid) setConsultant('all');
  }

  // The two charts below sync to whichever Level/Consultant filter is
  // active — same subset the table and Projects detail table use — rather
  // than always showing the whole-team average.
  const levelByConsultant = Object.fromEntries(consultants.map((c) => [c.consultant, c.level]));
  const filteredConsultants = consultants
    .filter((c) => level === 'all' || c.level === level)
    .filter((c) => consultant === 'all' || c.consultant === consultant);
  const filteredProjects = getProductivityTopFree()
    .filter((p) => consultant === 'all' || p.em === consultant)
    .filter((p) => level === 'all' || levelByConsultant[p.em] === level);

  const occupationSeries = getOccupationSeries(filteredConsultants).map((d) => ({ week: d.week, value: d.occPct }));
  const greenDaysSeries = getGreenDaysEvolution(filteredProjects).map((d) => ({ week: d.week, value: d.greenDays }));

  const scopeLabel = consultant !== 'all' ? consultant : level !== 'all' ? level : 'global (average)';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Level
          <select
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
          >
            <option value="all">All levels</option>
            {CONSULTANT_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Consultant
          <select
            value={consultant}
            onChange={(e) => setConsultant(e.target.value)}
            className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
          >
            <option value="all">All consultants</option>
            {consultantsForLevel.map((c) => (
              <option key={c.consultant} value={c.consultant}>{c.consultant}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Date
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
          >
            {DATE_RANGES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <ConsultantTable level={level} consultant={consultant} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleTrendChart title={`% Occupation — ${scopeLabel} — over time`} data={occupationSeries} unit="%" color="#6366f1" />
        <SimpleTrendChart title={`# Green days evolution — ${scopeLabel} — over time`} data={greenDaysSeries} unit="" color="#059669" />
      </div>

      <ProjectsOccupationDetailTable level={level} consultant={consultant} />
    </div>
  );
}
