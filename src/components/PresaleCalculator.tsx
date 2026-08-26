import React, { useState } from 'react';
import { MIND_PRICE_USD, calculateMindAmount, formatNumber, formatUSD } from '../utils/crypto';
import { ArrowDown, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface PresaleCalculatorProps {
  onProceedToPay: (usdAmount: number) => void;
  className?: string;
  isLoggedIn?: boolean;
}

export const PresaleCalculator: React.FC<PresaleCalculatorProps> = ({
  onProceedToPay,
  className = '',
  isLoggedIn = false,
}) => {
  const [usdInput, setUsdInput] = useState<string>('500');

  const numericUsd = parseFloat(usdInput) || 0;
  const { baseMind, bonusPercent, bonusMind, totalMind } = calculateMindAmount(numericUsd);

  const presetAmounts = [100, 250, 500, 1000, 2500, 5000];

  const handleInputChange = (val: string) => {
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setUsdInput(val);
    }
  };

  const handlePresetClick = (amount: number) => {
    setUsdInput(amount.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericUsd < 10) return;
    onProceedToPay(numericUsd);
  };

  return (
    <div
      className={`bg-[#131d31] border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative ${className}`}
    >
      {/* Sleek top highlight bar */}
      <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Official Bonus Rate
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white mt-1">Buy MIND Coin</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-mono text-slate-400">Rate</p>
          <p className="text-sm font-black text-cyan-400 font-mono">1 MIND = ${MIND_PRICE_USD} USD</p>
        </div>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Input: You Pay */}
        <div>
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              You Pay (USDT - BEP20)
            </label>
            <span className="text-[11px] font-mono text-slate-400">Min: $10</span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-400 font-mono text-lg font-bold">$</span>
            <input
              type="text"
              value={usdInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="500"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 pl-8 pr-28 text-white font-mono text-lg font-bold placeholder-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors"
            />
            <div className="absolute right-2.5 flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-emerald-400 font-mono">USDT</span>
            </div>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-6 gap-1.5 mt-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handlePresetClick(amt)}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                  numericUsd === amt
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                ${amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>
        </div>

        {/* Divider / Arrow */}
        <div className="flex justify-center -my-1">
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-md">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Output: You Receive */}
        <div>
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              You Receive
            </label>
            {bonusPercent > 0 ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> +{bonusPercent}% Bonus Included
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400">
                Bonus: $500 (+5%), $1k (+10%)
              </span>
            )}
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={formatNumber(totalMind)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3 px-4 text-cyan-300 font-mono text-xl font-extrabold outline-none cursor-default"
            />
            <div className="absolute right-2.5 flex items-center gap-1 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-lg">
              <span className="text-xs font-black text-cyan-300 font-mono">MIND</span>
            </div>
          </div>

          {/* Simple 2-line calculation receipt */}
          <div className="mt-2.5 px-3 py-2 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Base: {formatNumber(baseMind)} MIND</span>
            {bonusPercent > 0 ? (
              <span className="text-emerald-400 font-bold">Bonus: +{formatNumber(bonusMind)} MIND</span>
            ) : (
              <span className="text-slate-400">Standard Tier</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={numericUsd < 10}
          className="w-full py-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl uppercase tracking-widest text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          {isLoggedIn ? `Buy MIND (${formatUSD(numericUsd)})` : `Sign In & Buy MIND (${formatUSD(numericUsd)})`}
        </button>

        {/* Clean trust note */}
        <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Instant EVM credit • Transfer & sell anytime on mindchain.info</span>
        </div>
      </form>
    </div>
  );
};
