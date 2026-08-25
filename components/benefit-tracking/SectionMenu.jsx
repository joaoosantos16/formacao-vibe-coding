'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTIONS = [
  { label: 'Hoshin Overview', href: '/benefit-tracking-kaizen/hoshin' },
  { label: 'Variables', href: '/benefit-tracking-kaizen/variables' },
  { label: 'Productivity', href: '/benefit-tracking-kaizen/productivity' },
];

export default function SectionMenu() {
  const pathname = usePathname();

  return (
    <div className="inline-flex gap-1 rounded-full bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-1.5">
      {SECTIONS.map((section) => {
        const isActive = pathname === section.href;
        return (
          <Link
            key={section.href}
            href={section.href}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-900/5'
            }`}
          >
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}
