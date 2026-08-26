'use client';

import { useState } from 'react';
import TopFreeTable from '@/components/benefit-tracking/productivity/TopFreeTable';
import OccupationRanking from '@/components/benefit-tracking/productivity/OccupationRanking';
import ProjectOverviewChart from '@/components/benefit-tracking/productivity/ProjectOverviewChart';
import ConsultantView from '@/components/benefit-tracking/productivity/ConsultantView';

const VIEWS = [
  { key: 'project', label: 'Project' },
  { key: 'consultant', label: 'Consultant' },
];

export default function ProductivityView() {
  const [view, setView] = useState('project');

  return (
    <div className="space-y-4">
      <div className="inline-flex gap-1 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-1.5">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              view === v.key
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-900/5'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'project' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4 items-start">
            <TopFreeTable />
            <OccupationRanking />
          </div>
          <ProjectOverviewChart />
        </div>
      ) : (
        <ConsultantView />
      )}
    </div>
  );
}
