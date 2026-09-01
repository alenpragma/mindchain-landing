import React from 'react';
import { PresaleCalculator } from '../components/PresaleCalculator';
import { AppliedCoupon } from '../types';
import { MIND_PRICE_USD } from '../utils/crypto';
import {
  Zap,
  ShieldCheck,
  Coins,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PresalePageProps {
  isLoggedIn: boolean;
  onOpenBuyFlow: (amount?: number, coupon?: AppliedCoupon | null) => void;
}

export const PresalePage: React.FC<PresalePageProps> = ({ isLoggedIn, onOpenBuyFlow }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            OFFICIAL MINDCHAIN ECOSYSTEM PRESALE ROUND
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Presale Terminal & <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Bonus Allocation</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Acquire native MindChain Layer-1 coins at the early-access fixed rate of <strong className="text-emerald-400 font-mono">${MIND_PRICE_USD} USD</strong>. Receive tier bonuses up to +15% and automated instant credit to your EVM account.
          </p>
        </div>

        {/* Top Key Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Current Price</span>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-1">${MIND_PRICE_USD} USD</p>
            <span className="text-[10px] text-slate-500 font-mono">Guaranteed Floor</span>
          </div>

          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Raised</span>
            <p className="text-2xl font-black text-cyan-400 font-mono mt-1">$4,850,000</p>
            <span className="text-[10px] text-slate-500 font-mono">Round 2 Target: $6.5M</span>
          </div>

          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Max Bonus Tier</span>
            <p className="text-2xl font-black text-amber-400 font-mono mt-1">+15% MIND</p>
            <span className="text-[10px] text-slate-500 font-mono">On $1,000+ Deposits</span>
          </div>

          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Payment Gateway</span>
            <p className="text-2xl font-black text-white font-mono mt-1">USDT (BEP-20)</p>
            <span className="text-[10px] text-emerald-400 font-mono">Automated QR Verification</span>
          </div>
        </div>

        {/* Main Interactive Terminal Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Calculator Widget */}
          <div className="lg:col-span-7">
            <PresaleCalculator
              isLoggedIn={isLoggedIn}
              onProceedToPay={(amt, coupon) => onOpenBuyFlow(amt, coupon)}
            />
          </div>

          {/* Right: Presale Benefits & Step Guide */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tier Bonus Card */}
            <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Volume Bonus Tiers
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">$100 – $499 Deposit</p>
                    <p className="text-[10px] text-slate-400">Standard Pioneer Tier</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                    +5% Free MIND
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-white">$500 – $999 Deposit</p>
                    <p className="text-[10px] text-slate-400">Validator Tier</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-mono font-bold">
                    +10% Free MIND
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 shadow-lg shadow-amber-500/5">
                  <div>
                    <p className="text-xs font-bold text-white">$1,000+ Deposit</p>
                    <p className="text-[10px] text-amber-300/80">Whale & Institutional Tier</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-black">
                    +15% Free MIND
                  </span>
                </div>
              </div>
            </div>

            {/* How to Participate Steps */}
            <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Simple 3-Step Process
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono shrink-0 text-[11px]">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-white">Select USD Deposit Amount</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Input desired amount or choose a quick preset to instantly calculate coin return and bonus.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono shrink-0 text-[11px]">
                    2
                  </span>
                  <div>
                    <p className="font-bold text-white">Transfer USDT (BEP-20)</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Scan the dynamic QR code or copy the official MindChain treasury deposit address.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono shrink-0 text-[11px]">
                    3
                  </span>
                  <div>
                    <p className="font-bold text-white">Instant Balance Credited</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      The automated system verifies your on-chain transaction and assigns MIND coins directly to your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Audit Badge */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">Smart Contract Verified & Audited</p>
                <p className="text-slate-400 text-[11px]">
                  Presale contracts audited by CertiK and Hacken with zero critical vulnerabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
