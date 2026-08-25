'use client';

import { useEffect, useRef, useState } from 'react';

// Igual ao ComboSelect, mas permite escolher vários valores (chips).
// Usado para Consultants.
export default function MultiComboSelect({ label, values, onChange, options }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = values ?? [];

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const available = options.filter(
    (o) => !selected.includes(o) && o.toLowerCase().includes(query.toLowerCase())
  );

  function add(option) {
    onChange([...selected, option]);
    setQuery('');
    setOpen(false);
  }

  function remove(option) {
    onChange(selected.filter((v) => v !== option));
  }

  return (
    <div className="relative" ref={ref}>
      {label && <span className="block text-xs font-medium text-slate-500 mb-1.5">{label}</span>}
      <div className="w-full rounded-xl border border-slate-200 px-2 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-emerald-400">
        {selected.map((v) => (
          <span key={v} className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-1 text-xs font-medium">
            {v}
            <button type="button" onClick={() => remove(v)} className="text-emerald-500 hover:text-emerald-800">
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={selected.length ? '' : 'Add consultant...'}
          className="flex-1 min-w-[120px] text-sm px-2 py-1 focus:outline-none"
        />
      </div>
      {open && available.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-1">
          {available.map((option) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(option)}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
