import React from 'react';
import { TrustAndSpecs } from '../components/TrustAndSpecs';
import { ShieldCheck, BarChart3, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TokenomicsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            TOKENOMICS & PERFORMANCE BENCHMARKS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Architecture & <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">L1 Comparison</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Engineered with institutional throughput, EVM compatibility (Chain ID: 9982), and verifiable deflationary mechanics.
          </p>
        </div>

        {/* Specs and Tokenomics component */}
        <TrustAndSpecs />
      </div>
    </div>
  );
};
