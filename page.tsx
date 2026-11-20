'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#081118] text-zinc-100 font-sans">
      <header className="border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-zinc-950 font-mono">RX</div>
          <span className="font-mono font-bold tracking-wider text-sm">REVX // ABOUT</span>
        </Link>
        <Link href="/app" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-mono font-bold rounded-xl transition-all">
          ENTER COCKPIT
        </Link>
      </header>

      <main className="max-w-3xl mx-auto py-16 px-6 space-y-8 font-mono text-xs">
        <h1 className="text-3xl font-black font-mono text-white">ABOUT REVX & RESEARCH CONTEXT</h1>
        <div className="p-6 bg-[#0c1822] border border-zinc-800 rounded-2xl space-y-4 text-zinc-300 leading-relaxed">
          <p>
            RevX is an AI-powered assistant for smarter, greener driving, developed as an academic capstone research initiative at Christ (Deemed to be University), Delhi NCR.
          </p>
          <p>
            Unlike consumer automotive apps that rely on coarse smartphone GPS or fictitious animations, RevX communicates directly with actual vehicle engine control units (ECUs) using standard OBD-II ELM327 protocols.
          </p>
          <p>
            Our core mission is addressing UN SDG 13 (Climate Action) by empowering everyday drivers with instantaneous, verifiable fuel flow telemetry and personalized eco-coaching that reduces tailpipe emissions by up to 16.88%.
          </p>
        </div>
      </main>
    </div>
  );
}
