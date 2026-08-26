'use client';

import { useEffect, useRef, useState } from 'react';

// Campo de texto que só aceita valores existentes numa lista fechada —
// escreve para filtrar, mas só "cola" se corresponder a uma opção.
// Usado para Sector, Subsector, SR e EM (ver regra "não inventar
// opções fora da dropdown").
export default function ComboSelect({ label, value, onChange, options, disabled, placeholder }) {
  const [query, setQuery] = useState(value ?? '');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => setQuery(value ?? ''), [value]);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery(value ?? '');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [value]);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  function select(option) {
    onChange(option);
    setQuery(option);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      {label && <span className="block text-xs font-medium text-slate-500 mb-1.5">{label}</span>}
      <input
        type="text"
        disabled={disabled}
        placeholder={disabled ? 'Select Sector first' : placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          // se não corresponder a nenhuma opção válida, reverte
          if (!options.includes(query)) setQuery(value ?? '');
        }}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          disabled ? 'bg-slate-50 border-slate-100 text-slate-400' : 'border-slate-200'
        }`}
      />
      {open && !disabled && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-1">
          {filtered.map((option) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(option)}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700"
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
