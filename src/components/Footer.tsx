import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCode2, Send, Globe, ExternalLink, Zap } from 'lucide-react';

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

      {/* 2. Footer Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-center">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  className="w-full h-full transform group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                >
                  <defs>
                    <linearGradient id="mndFootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <rect width="36" height="36" rx="10" fill="#0f172a" stroke="url(#mndFootGrad)" strokeWidth="1.5" />
                  <path
                    d="M9 25V11L18 18L27 11V25"
                    stroke="url(#mndFootGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="18" cy="18" r="2" fill="#38bdf8" />
                  <circle cx="9" cy="11" r="1.5" fill="#34d399" />
                  <circle cx="27" cy="11" r="1.5" fill="#34d399" />
                </svg>
              </div>
              <span className="text-base font-extrabold text-white">
                MindChain <span className="text-cyan-400">L1</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              High-throughput EVM Layer-1 blockchain with institutional throughput, sub-second finality, and direct ecosystem bonus distribution.
            </p>
          </div>

          {/* Quick Internal & External Links */}
          <div className="md:col-span-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link to="/presale" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Presale Terminal
            </Link>
            <Link to="/ecosystem" className="hover:text-cyan-400 transition-colors">Ecosystem Suite</Link>
            <Link to="/tokenomics" className="hover:text-cyan-400 transition-colors">L1 Comparison</Link>
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
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X / Twitter"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a
                href="https://mindchain.info"
                target="_blank"
                rel="noreferrer"
                aria-label="Website"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
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
