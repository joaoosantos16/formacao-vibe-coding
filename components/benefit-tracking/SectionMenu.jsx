'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTIONS = [
  { label: 'Hoshin Overview', href: '/benefit-tracking/hoshin' },
  { label: 'Variables', href: '/benefit-tracking/variables' },
  { label: 'Productivity', href: '/benefit-tracking/productivity' },
];

export default function SectionMenu() {
  const pathname = usePathname();

  return (
    <div className="flex gap-3">
      {SECTIONS.map((section) => {
        const isActive = pathname === section.href;
        return (
          <Link
            key={section.href}
            href={section.href}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}
