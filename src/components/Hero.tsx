import React from 'react';
import { PresaleCalculator } from './PresaleCalculator';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Globe,
  Cpu,
  Lock,
  Layers,
  Coins,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

import { AppliedCoupon } from '../types';

interface HeroProps {
  onBuyClick: (usdAmount?: number, coupon?: AppliedCoupon | null) => void;
  onExploreClick: () => void;
  isLoggedIn?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onBuyClick, onExploreClick, isLoggedIn = false }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-24 border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[300px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[250px] sm:w-[400px] h-[200px] sm:h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 backdrop-blur-md max-w-full">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-cyan-300 truncate">
              Official Bonus Portal — Buy with Bonus & Instant Withdraw to mindchain.info
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 hidden sm:block" />
          </div>
        </div>

        {/* 2-Column Grid: Value Prop & Live Presale Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Ecosystem Highlights */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] sm:text-xs font-mono font-bold">
              <span>ESTABLISHED EVM LAYER-1 NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] sm:leading-[1.1]">
              MindChain Ecosystem{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Exclusive Bonus
              </span>{' '}
              Portal
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              MindChain (MIND) is an established, high-throughput EVM Layer-1 blockchain with an active ecosystem. Through this official platform portal, buyers receive up to <strong className="text-cyan-300 font-bold">+15% extra bonus MIND tokens</strong>. All coins can be freely withdrawn and traded or sold on <strong className="text-white">mindchain.info</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={() => onBuyClick(500)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl uppercase tracking-widest text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer min-h-[48px]"
              >
                <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
                <span>{isLoggedIn ? 'Buy with Bonus (USDT BEP-20)' : 'Login & Buy with Bonus'}</span>
              </button>

              <a
                href="https://mindchain.info"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer text-center text-xs sm:text-sm min-h-[48px]"
              >
                <span>Visit mindchain.info</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400 shrink-0" />
              </a>
            </div>

            {/* Quick Proof Points */}
            <div className="pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-3 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-left">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Speed</p>
                <p className="text-base sm:text-lg font-black text-white font-mono">0.8s</p>
                <p className="text-[9px] sm:text-[10px] text-emerald-400 truncate">Instant Finality</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-left">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gas Fee</p>
                <p className="text-base sm:text-lg font-black text-cyan-400 font-mono">&lt;$0.0001</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">Sub-cent tx</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 sm:p-3 rounded-xl border border-slate-800 text-left">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Withdrawal</p>
                <p className="text-base sm:text-lg font-black text-white font-mono">Instant</p>
                <p className="text-[9px] sm:text-[10px] text-emerald-400 truncate">mindchain.info</p>
              </div>
            </div>
          </div>

          {/* Right Column: Presale Calculator Widget */}
          <div className="lg:col-span-5 w-full">
            <PresaleCalculator
              isLoggedIn={isLoggedIn}
              onProceedToPay={(amount, coupon) => onBuyClick(amount, coupon)}
            />
          </div>
        </div>

        {/* Live Network Telemetry Bar */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3 sm:mb-4">
            MindChain Mainnet Live Network Telemetry
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            <div className="bg-[#1e293b]/40 border border-slate-800/80 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono">Max Throughput</span>
              <span className="text-base sm:text-lg font-black text-white font-mono mt-1">65,000 TPS</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <Activity className="w-2.5 h-2.5 shrink-0" /> Benchmarked
              </span>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono">Total Blocks</span>
              <span className="text-base sm:text-lg font-black text-cyan-400 font-mono mt-1">18,429,102</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5">Height #18.4M</span>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono">Active Validators</span>
              <span className="text-base sm:text-lg font-black text-white font-mono mt-1">164 Nodes</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono mt-0.5">99.99% Uptime</span>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono">Value Staked</span>
              <span className="text-base sm:text-lg font-black text-white font-mono mt-1">$18.9M USD</span>
              <span className="text-[9px] sm:text-[10px] text-cyan-400 font-mono mt-0.5">46.2M MIND</span>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono">Consensus</span>
              <span className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-1">PoS-BFT</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5">Slashing enabled</span>
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800/80 p-2.5 sm:p-3 rounded-xl flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono">Security Audits</span>
              <span className="text-base sm:text-lg font-black text-white font-mono mt-1">Passed (0 Vuln)</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono mt-0.5">CertiK & Hacken</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
