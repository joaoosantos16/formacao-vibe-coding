'use client';

import { useState } from 'react';
import ConsultantTable from '@/components/benefit-tracking/productivity/ConsultantTable';
import SimpleTrendChart from '@/components/benefit-tracking/productivity/SimpleTrendChart';
import ProjectsOccupationDetailTable from '@/components/benefit-tracking/productivity/ProjectsOccupationDetailTable';
import { CONSULTANT_LEVELS, getGlobalOccupationSeries, getGreenDaysEvolution } from '@/lib/benefitTracking';

const DATE_RANGES = ['Last 12 weeks', 'This quarter', 'Year to date'];

export default function ConsultantView() {
  const [level, setLevel] = useState('all');
  const [dateRange, setDateRange] = useState(DATE_RANGES[0]);

  const occupationSeries = getGlobalOccupationSeries().map((d) => ({ week: d.week, value: d.occPct }));
  const greenDaysSeries = getGreenDaysEvolution().map((d) => ({ week: d.week, value: d.greenDays }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-500">
          Level
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="text-sm rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
          >
            <option value="all">All levels</option>
            {CONSULTANT_LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
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

      <ConsultantTable level={level} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SimpleTrendChart title="% Occupation global (average) over time" data={occupationSeries} unit="%" color="#6366f1" />
        <SimpleTrendChart title="# Green days evolution over time" data={greenDaysSeries} unit="" color="#059669" />
      </div>

      <ProjectsOccupationDetailTable />
    </div>
  );
}
