import React from 'react';
import { ShieldCheck, CheckCircle2, Award, FileCode2, Github, Twitter, Send, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090d16] text-slate-400 text-xs">
      {/* 1. Verified Badges Row */}
      <div className="border-b border-slate-800/60 bg-[#0c121e]/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">Security & Audit Certified:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {/* Badge 1: CertiK */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-400">CertiK Audit:</span>
                <strong className="text-emerald-400 font-bold">Passed (98.4)</strong>
              </div>

              {/* Badge 2: Hacken */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-400">Hacken:</span>
                <strong className="text-emerald-400 font-bold">Verified Zero Flaws</strong>
              </div>

              {/* Badge 3: EVM Native */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px]">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Chain:</span>
                <strong className="text-cyan-300 font-bold">EVM Layer-1 (9982)</strong>
              </div>

              {/* Badge 4: BEP-20 USDT Gateway */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">₮</span>
                <span className="text-slate-400">Gateway:</span>
                <strong className="text-slate-200 font-bold">USDT BEP-20</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Simplified Footer Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-center">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg flex items-center justify-center text-slate-950 font-black text-sm">
                M
              </div>
              <span className="text-base font-extrabold text-white">
                MindChain <span className="text-cyan-400">L1</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              High-throughput EVM Layer-1 blockchain with institutional throughput, sub-second finality, and direct ecosystem bonus distribution.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono">
            <a href="#ecosystem" className="hover:text-cyan-400 transition-colors">Ecosystem Suite</a>
            <a href="#specs" className="hover:text-cyan-400 transition-colors">L1 Comparison</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">Platform FAQ</a>
            <a
              href="https://mindchain.info"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
            >
              mindchain.info <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Socials & Smart Contract */}
          <div className="md:col-span-3 space-y-2 md:text-right">
            <div className="flex items-center md:justify-end gap-2">
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer">
                <Twitter className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer">
                <Send className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer">
                <Github className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Secured by EVM Smart Contracts
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Network: <strong className="text-emerald-400">MindChain Mainnet (Operational)</strong></span>
          </div>

          <div>&copy; 2026 MindChain Ecosystem. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
};
