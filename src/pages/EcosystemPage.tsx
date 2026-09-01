import React from 'react';
import { EcosystemGrid } from '../components/EcosystemGrid';
import { Layers, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EcosystemPageProps {
  onOpenBuyFlow: (amount?: number) => void;
}

export const EcosystemPage: React.FC<EcosystemPageProps> = ({ onOpenBuyFlow }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            LIVE PRODUCTS & INFRASTRUCTURE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            The Complete <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">MindChain Ecosystem</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Explore live, production-grade applications built natively on MindChain Layer-1 — including our centralized exchange, decentralized swap, cross-chain bridge, and official blockchain explorer.
          </p>
        </div>

        {/* Grid Component */}
        <EcosystemGrid onSelectAction={() => onOpenBuyFlow(100)} />

        {/* Call to action card */}
        <div className="bg-gradient-to-r from-cyan-900/30 via-slate-900 to-emerald-950/30 border border-cyan-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Join the MindChain L1 Economy?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Take advantage of exclusive presale tier bonuses before public exchange listings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/presale"
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Access Presale Terminal
            </Link>
            <a
              href="https://mindchain.info"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              Mainnet Explorer (mindchain.info)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
