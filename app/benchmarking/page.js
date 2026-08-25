"use client";

// Equipa A — branch `equipa-a`.
// Constrói aqui o conteúdo desta página. O menu e o layout à volta
// (components/NavBar.jsx, app/layout.js) são partilhados — não mexer
// nesses sem combinar com as outras equipas.
import { useState } from "react";

export default function BenchmarkingPage() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
        Benchmarking
      </h1>
      <p className="mt-3 text-slate-500">Em construção — Equipa A.</p>

      <button
        onClick={() => setClicks((c) => c + 1)}
        className="mt-6 px-5 py-2.5 rounded-full text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 transition-colors"
      >
        Test button — clicked {clicks} times
      </button>
    </div>
  );
}
