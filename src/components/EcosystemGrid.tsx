import React, { useState } from 'react';
import { EcosystemItem } from '../types';
import {
  TrendingUp,
  Repeat,
  Landmark,
  Wallet2,
  Search,
  GraduationCap,
  ArrowUpRight,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';

const ECOSYSTEM_ITEMS: EcosystemItem[] = [
  {
    id: 'cex',
    name: 'Mind CEX',
    category: 'Centralized Exchange',
    tagline: 'Institutional Grade Matching Engine with Zero Gas Deposits',
    description:
      'High-frequency spot and derivatives exchange powered by an in-memory order book capable of handling 2.5 million transactions per second with microsecond latency.',
    features: [
      'Sub-millisecond trade execution',
      'Zero maker fees for MIND holders',
      'Proof-of-Reserves with Merkle tree verification',
      'Instant fiat on/off ramps (Credit Card, SEPA, Wire)',
    ],
    stats: '$48.2M 24h Volume',
    badge: 'Flagship Core',
    status: 'Live',
  },
  {
    id: 'dex',
    name: 'Mind DEX & AMM',
    category: 'Decentralized Exchange',
    tagline: 'Multi-Hop Concentrated Liquidity Swaps with Lowest Slippage',
    description:
      'Next-generation non-custodial automated market maker built natively on MindChain L1. Swap any EVM-wrapped asset instantly at sub-cent network gas fees.',
    features: [
      'Concentrated liquidity yield farms (up to 42% APY)',
      'Sub-second atomic swap routing',
      'MEV-resistant ordering architecture',
      'Automated portfolio rebalancing vaults',
    ],
    stats: '$14.6M Total Value Locked',
    badge: 'High Yield',
    status: 'Live',
  },
  {
    id: 'defi',
    name: 'Mind DeFi Suite & Lending',
    category: 'Decentralized Finance',
    tagline: 'Autonomous Money Markets, Liquid Staking & Yield Vaults',
    description:
      'Decentralized collateralized lending and borrowing protocol. Deposit MIND, USDT, ETH, or BTC to earn passive supply interest or borrow against crypto collateral.',
    features: [
      'Over-collateralized loans with dynamic interest rates',
      'MindLiquid (stMIND) liquid staking derivative',
      'Flash loan infrastructure with 0.05% fee',
      'Automated liquidation safeguard bots',
    ],
    stats: '$9.2M Active Borrows',
    badge: 'Audited',
    status: 'Live',
  },
  {
    id: 'wallet',
    name: 'Mind Web3 Wallet',
    category: 'Self-Custodial Wallet',
    tagline: 'Biometric Smart Contract Wallet with Gasless Transaction Relays',
    description:
      'The unified gateway to MindChain and all EVM chains. Enjoy account abstraction (ERC-4337), social recovery, session keys, and built-in cross-chain bridge.',
    features: [
      'Available as iOS, Android, and Chrome Extension',
      'Account Abstraction: Pay gas with any stablecoin',
      'Biometric FaceID / Passkey authorization',
      'Phishing protection and smart contract scanner',
    ],
    stats: '85,000+ Downloads',
    badge: 'Mobile & Web',
    status: 'Live',
  },
  {
    id: 'explorer',
    name: 'Mind Block Explorer',
    category: 'Network Analytics',
    tagline: 'Real-Time EVM Telemetry, Contract Verification & Gas Tracker',
    description:
      'High-speed block explorer and smart contract analytics terminal. Inspect blocks, transactions, ERC-20/721/1155 tokens, internal contract calls, and gas spikes.',
    features: [
      'Live WebSocket block streaming (0.8s block time)',
      'One-click Solidity bytecode verification',
      'DEX liquidity analytics and whale watcher alerts',
      'Free REST & GraphQL Developer APIs',
    ],
    stats: '18.4M+ Blocks Indexed',
    badge: 'Open API',
    status: 'Live',
  },
  {
    id: 'academy',
    name: 'Mind Developer Academy',
    category: 'Education & Grants',
    tagline: 'Interactive Web3 Bootcamps, Grants & Developer Toolkits',
    description:
      'Comprehensive educational hub for Solidity/Vyper developers building on MindChain. Apply for the $5,000,000 Ecosystem Developer Grant Program.',
    features: [
      '$5,000,000 Ecosystem Grant Fund actively awarding teams',
      'Ready-to-deploy Audited Smart Contract Templates',
      'Interactive Web3 Solidity sandbox & CLI guides',
      'Official Developer Certification & NFT Badges',
    ],
    stats: '$5M Grant Fund',
    badge: 'Grants Open',
    status: 'Live',
  },
];

interface EcosystemGridProps {
  onSelectAction?: (id: string) => void;
}

export const EcosystemGrid: React.FC<EcosystemGridProps> = ({ onSelectAction }) => {
  const [selectedItem, setSelectedItem] = useState<EcosystemItem | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'cex':
        return <TrendingUp className="w-6 h-6 text-cyan-400" />;
      case 'dex':
        return <Repeat className="w-6 h-6 text-emerald-400" />;
      case 'defi':
        return <Landmark className="w-6 h-6 text-teal-400" />;
      case 'wallet':
        return <Wallet2 className="w-6 h-6 text-cyan-300" />;
      case 'explorer':
        return <Search className="w-6 h-6 text-blue-400" />;
      case 'academy':
        return <GraduationCap className="w-6 h-6 text-emerald-300" />;
      default:
        return <Layers className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="ecosystem" className="py-16 sm:py-24 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5" /> Full-Stack Layer-1 Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            An Interconnected Web3 Powerhouse
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            MindChain isn't just a layer-1 blockchain. It's a complete, vertically integrated financial ecosystem designed to capture and distribute real yield to MIND coin holders.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ECOSYSTEM_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-[#1e293b]/50 hover:bg-[#1e293b]/90 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-cyan-500/10 relative overflow-hidden"
            >
              {/* Subtle hover gradient accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all"></div>

              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/70 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:scale-105 transition-all shadow-inner">
                    {getIcon(item.id)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs font-mono text-cyan-400/90 font-medium mt-0.5 mb-2.5">
                  {item.category}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {item.description}
                </p>

                {/* Feature Bullets Preview */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  {item.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Stat & View Link */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 font-bold">{item.stats}</span>
                <span className="text-cyan-400 group-hover:text-cyan-300 font-bold flex items-center gap-1">
                  Details <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Modal when a card is clicked */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-[#1e293b] border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative text-white space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center">
                    {getIcon(selectedItem.id)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                    <p className="text-xs font-mono text-cyan-400">{selectedItem.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{selectedItem.description}</p>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Core Architecture & Capabilities
                </p>
                <div className="space-y-1.5">
                  {selectedItem.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Telemetry: {selectedItem.stats}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
