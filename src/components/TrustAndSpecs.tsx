import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  Lock,
  Coins,
  RefreshCw,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  badge?: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'Why should I buy MIND through this official platform portal?',
    answer:
      'This portal is the official liquidity and ecosystem channel offering exclusive bonus incentives (up to +15% extra MIND tokens depending on your deposit tier). You receive instant, direct credit to your EVM address with zero slippage and verified smart contract delivery.',
    badge: 'Bonus Advantage',
  },
  {
    question: 'Can I withdraw my MIND coins and trade/sell on mindchain.info?',
    answer:
      'Yes, absolutely! MindChain is an established Layer-1 blockchain. Once purchased, you can immediately withdraw your MIND coins to any external EVM wallet (MetaMask, Trust Wallet) or transfer them to mindchain.info to trade, provide liquidity, or sell anytime on active markets.',
    badge: 'Full Liquidity',
  },
  {
    question: 'Which payment currencies are accepted?',
    answer:
      'We exclusively accept USDT on the BEP-20 (BNB Smart Chain) network. This guarantees ultra-low gas fees (<$0.05 per transfer) and rapid 3-block confirmation times for your deposit.',
    badge: 'USDT BEP-20',
  },
  {
    question: 'Do I need to create an account before purchasing?',
    answer:
      'Yes. To ensure your purchase bonus and purchased MIND tokens are cryptographically associated with your unique wallet identity, a simple 1-step EVM wallet connection or passcode sign-up is required before initiating an invoice.',
    badge: 'Security',
  },
  {
    question: 'How fast are MindChain transactions and network finality?',
    answer:
      'MindChain L1 delivers sub-second finality (~0.8 seconds) and achieves over 65,000 TPS through its parallelized EVM architecture, with gas costs averaging less than $0.0001 per transaction.',
    badge: 'L1 Performance',
  },
];

export const TrustAndSpecs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="specs" className="py-16 sm:py-24 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 1. L1 COMPARISON MATRIX */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              Architectural Superiority
            </span>
            <h2 className="text-3xl font-extrabold text-white">How MindChain Outperforms Legacy Chains</h2>
            <p className="text-slate-400 text-sm">
              Engineered with state-optimized storage and parallelized EVM execution for institutional throughput.
            </p>
          </div>

          <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-xs font-mono">
                <thead className="bg-slate-900/80 text-slate-400 uppercase border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="py-4 px-5">Metric / Feature</th>
                    <th className="py-4 px-5 text-cyan-400 font-black bg-cyan-950/20 border-x border-cyan-500/20">
                      MindChain (MIND)
                    </th>
                    <th className="py-4 px-5">Ethereum L1</th>
                    <th className="py-4 px-5">Solana</th>
                    <th className="py-4 px-5">BNB Chain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">Consensus Speed (Finality)</td>
                    <td className="py-3.5 px-5 text-cyan-300 font-bold bg-cyan-950/10 border-x border-cyan-500/20">
                      0.8 Seconds
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">12–15 Minutes</td>
                    <td className="py-3.5 px-5 text-slate-400">2.5 Seconds</td>
                    <td className="py-3.5 px-5 text-slate-400">3.0 Seconds</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">Average Gas Fee</td>
                    <td className="py-3.5 px-5 text-emerald-400 font-bold bg-cyan-950/10 border-x border-cyan-500/20">
                      &lt; $0.0001
                    </td>
                    <td className="py-3.5 px-5 text-rose-400">$2.50 – $25.00</td>
                    <td className="py-3.5 px-5 text-slate-400">$0.002</td>
                    <td className="py-3.5 px-5 text-slate-400">$0.10</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">Throughput (TPS)</td>
                    <td className="py-3.5 px-5 text-cyan-300 font-bold bg-cyan-950/10 border-x border-cyan-500/20">
                      65,000+ TPS
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">15–20 TPS</td>
                    <td className="py-3.5 px-5 text-slate-400">3,000–5,000 TPS</td>
                    <td className="py-3.5 px-5 text-slate-400">2,200 TPS</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">EVM Full Compatibility</td>
                    <td className="py-3.5 px-5 text-emerald-400 font-bold bg-cyan-950/10 border-x border-cyan-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> 100% Native
                    </td>
                    <td className="py-3.5 px-5 text-emerald-400">Native</td>
                    <td className="py-3.5 px-5 text-rose-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Non-EVM (Rust)
                    </td>
                    <td className="py-3.5 px-5 text-emerald-400">Native</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white">Built-in CEX/DEX/DeFi Suite</td>
                    <td className="py-3.5 px-5 text-cyan-300 font-bold bg-cyan-950/10 border-x border-cyan-500/20">
                      Integrated 6-Pillars
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">Fragmented 3rd Party</td>
                    <td className="py-3.5 px-5 text-slate-400">Fragmented 3rd Party</td>
                    <td className="py-3.5 px-5 text-slate-400">Partial</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <div id="faq" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              Answers & Clarifications
            </span>
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">
              Everything you need to know about buying MIND with platform bonus and transferring to mindchain.info.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold transition-colors ${
                          isOpen
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 group-hover:text-white'
                        }`}
                      >
                        Q{idx + 1}
                      </div>
                      <span className="text-base font-bold text-white">{item.question}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-cyan-400' : ''
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
