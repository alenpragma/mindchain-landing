import React, { useState } from 'react';
import { UserAccount, Transaction } from '../types';
import {
  MIND_PRICE_USD,
  formatNumber,
  formatUSD,
  truncateAddress,
  generateTxHash,
} from '../utils/crypto';
import { PresaleCalculator } from './PresaleCalculator';
import {
  Wallet,
  TrendingUp,
  Users,
  Copy,
  Check,
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  Coins,
  Percent,
  Clock,
  RefreshCw,
  LogOut,
  ChevronRight,
  AlertCircle,
  Lock,
} from 'lucide-react';

interface DashboardProps {
  user: UserAccount;
  transactions: Transaction[];
  onOpenBuy: (amount?: number) => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onAddTransaction: (tx: Transaction) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  transactions,
  onOpenBuy,
  onLogout,
  onUpdateUser,
  onAddTransaction,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'buy' | 'staking' | 'referrals' | 'history'>('overview');
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Staking simulator state
  const [stakeAmount, setStakeAmount] = useState<string>('1000');
  const [stakedBalance, setStakedBalance] = useState<number>(0);
  const [stakingDays, setStakingDays] = useState<number>(90);

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState(user.address);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const referralLink = `https://mindchain.info/ref?id=${user.address.toLowerCase()}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    onShowToast('Referral link copied!', referralLink, 'success');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.address);
    setCopiedAddr(true);
    onShowToast('Wallet address copied!', user.address, 'info');
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  // Staking action
  const handleStakeMIND = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(stakeAmount) || 0;
    if (num <= 0) return;
    if (num > user.balanceMIND) {
      onShowToast('Insufficient Balance', 'You cannot stake more MIND than your current balance.', 'error');
      return;
    }

    const updatedUser: UserAccount = {
      ...user,
      balanceMIND: user.balanceMIND - num,
    };
    setStakedBalance((prev) => prev + num);
    onUpdateUser(updatedUser);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'staking_reward',
      amountMIND: num,
      amountUSD: num * MIND_PRICE_USD,
      txHash: generateTxHash(),
      timestamp: 'Just now',
      status: 'completed',
      note: `Deposited into MindStake Vault (${stakingDays} Days Lock)`,
    };
    onAddTransaction(tx);
    onShowToast('Staking Successful', `Staked ${formatNumber(num)} MIND in 28% APY Vault`, 'success');
  };

  // Withdraw action
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    const num = parseFloat(withdrawAmount) || 0;

    if (num < 50) {
      setWithdrawError('Minimum withdrawal amount is 50 MIND');
      return;
    }

    if (num > user.balanceMIND) {
      setWithdrawError('Amount exceeds current available balance');
      return;
    }

    const updatedUser: UserAccount = {
      ...user,
      balanceMIND: user.balanceMIND - num,
    };
    onUpdateUser(updatedUser);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdraw',
      amountMIND: num,
      amountUSD: num * MIND_PRICE_USD,
      txHash: generateTxHash(),
      timestamp: 'Processing',
      status: 'processing',
      note: `Withdrawal to ${truncateAddress(withdrawAddress)}`,
    };
    onAddTransaction(tx);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    onShowToast('Withdrawal Initiated', `Dispatched ${formatNumber(num)} MIND to ${truncateAddress(withdrawAddress)}`, 'info');
  };

  const calculateAPYReward = () => {
    const num = parseFloat(stakeAmount) || 0;
    const apy = 0.28; // 28% APY
    const reward = num * apy * (stakingDays / 365);
    return reward;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Sub-Header / Top Bar */}
      <div className="border-b border-slate-800 bg-[#1e293b]/40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Account Identifiers */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Connected EVM Address
                </span>
                <span className="inline-flex items-center px-2 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Mainnet Alpha
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm font-bold text-white">
                  {truncateAddress(user.address, 8, 6)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="text-slate-400 hover:text-cyan-400 p-0.5 transition-colors"
                  title="Copy full address"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Price */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">MIND Price:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">${MIND_PRICE_USD} USD</span>
            </div>

            <button
              onClick={() => onOpenBuy(500)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5" />
              Buy More MIND
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'buy', label: 'Presale Terminal', icon: Zap },
            { id: 'staking', label: 'MindStake Vault (28% APY)', icon: Coins },
            { id: 'referrals', label: 'Referral Rewards (+15%)', icon: Users },
            { id: 'history', label: 'Transaction Activity', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. TOP METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total MIND Balance */}
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Available Balance
              </span>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatNumber(user.balanceMIND)} <span className="text-cyan-400 text-sm">MIND</span>
            </p>
            <p className="text-xs text-emerald-400 font-mono mt-1 font-bold">
              ≈ {formatUSD(user.balanceMIND * MIND_PRICE_USD)} USD
            </p>
          </div>

          {/* Card 2: Total Invested USD */}
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Deposited
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatUSD(user.totalDepositedUSD)}
            </p>
            <p className="text-xs text-emerald-400 font-mono mt-1 font-bold">
              USDT (BEP-20) + Bonus
            </p>
          </div>

          {/* Card 3: Staked Balance */}
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-teal-500/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Staked in Vault
              </span>
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatNumber(stakedBalance)} <span className="text-teal-400 text-sm">MIND</span>
            </p>
            <p className="text-xs text-emerald-400 font-mono mt-1 font-bold">
              28% APY Earning
            </p>
          </div>

          {/* Card 4: Referral Earnings */}
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Referral Commission
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {user.referralsCount} <span className="text-amber-400 text-sm">Users</span>
            </p>
            <p className="text-xs text-amber-400 font-mono mt-1 font-bold">
              +{formatUSD(user.referralEarningsUSD)} Earned
            </p>
          </div>
        </div>

        {/* 2. REFERRAL PROGRAM QUICK BANNER */}
        <div className="bg-gradient-to-r from-cyan-900/40 via-slate-900 to-emerald-950/40 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 text-[10px] font-extrabold uppercase tracking-wider font-mono">
                +15% Instant USDT Commission
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Share Your MindChain Referral Link
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Earn an immediate 15% bonus in USDT for every contributor who buys MIND Coin using your EVM affiliate link.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <div className="w-full sm:w-80 bg-slate-950/90 border border-slate-700 px-3 py-2 rounded-xl text-xs font-mono text-cyan-300 truncate">
              {referralLink}
            </div>
            <button
              onClick={handleCopyReferral}
              className="w-full sm:w-auto px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              {copiedRef ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              {copiedRef ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* 3. DYNAMIC TAB CONTENT */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Quick Actions & Presale Widget */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Quick Account Actions</h3>
                  <span className="text-xs font-mono text-slate-400">EVM L1 Native</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => onOpenBuy(500)}
                    className="p-4 bg-slate-900/90 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Zap className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300">Buy More MIND</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Fixed $0.41 Presale</p>
                  </button>

                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300">Withdraw MIND</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">To external EVM wallet</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('staking')}
                    className="p-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Coins className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-white group-hover:text-teal-300">Stake for 28% APY</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Compound passive yield</p>
                  </button>
                </div>
              </div>

              {/* Presale Buy Terminal Widget inside Dashboard */}
              <PresaleCalculator onProceedToPay={(amt) => onOpenBuy(amt)} />
            </div>

            {/* Right: Recent Activity Table */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-5 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Recent Activity
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {transactions.length} Records
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[500px]">
                  {transactions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 font-mono">
                      No activity recorded yet.
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="py-3 px-2 hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                            {tx.type === 'buy' && <Zap className="w-4 h-4 text-cyan-400" />}
                            {tx.type === 'referral' && <Users className="w-4 h-4 text-amber-400" />}
                            {tx.type === 'staking_reward' && <Coins className="w-4 h-4 text-emerald-400" />}
                            {tx.type === 'withdraw' && <ArrowUpRight className="w-4 h-4 text-rose-400" />}
                          </div>

                          <div>
                            <p className="text-xs font-bold text-white capitalize flex items-center gap-1.5">
                              {tx.type.replace('_', ' ')}
                              <span className="text-[10px] text-slate-500 font-mono font-normal">
                                • {tx.timestamp}
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                              {truncateAddress(tx.txHash, 6, 4)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-xs font-mono font-bold ${tx.type === 'withdraw' ? 'text-rose-400' : 'text-cyan-300'}`}>
                            {tx.type === 'withdraw' ? '-' : '+'}{formatNumber(tx.amountMIND)} MIND
                          </p>
                          <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. BUY TERMINAL TAB */}
        {activeTab === 'buy' && (
          <div className="max-w-2xl mx-auto">
            <PresaleCalculator onProceedToPay={(amt) => onOpenBuy(amt)} />
          </div>
        )}

        {/* 5. STAKING VAULT TAB */}
        {activeTab === 'staking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  MindStake Pool v2
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Stake MIND & Earn 28% Fixed APY</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Lock your MIND tokens to secure the Layer-1 PoS-BFT validator consensus and receive automatic compounding rewards.
                </p>
              </div>

              <form onSubmit={handleStakeMIND} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Amount to Stake
                    </span>
                    <span className="font-mono text-slate-400">
                      Available: <strong className="text-cyan-400">{formatNumber(user.balanceMIND)} MIND</strong>
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white font-mono text-base font-bold focus:border-cyan-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setStakeAmount(user.balanceMIND.toString())}
                      className="absolute right-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-mono text-cyan-400 font-bold border border-slate-700"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Duration selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Locking Period & Reward Multiplier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { days: 30, apy: '18% APY' },
                      { days: 90, apy: '28% APY' },
                      { days: 180, apy: '36% APY' },
                    ].map((plan) => (
                      <button
                        key={plan.days}
                        type="button"
                        onClick={() => setStakingDays(plan.days)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          stakingDays === plan.days
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <p className="text-xs font-bold">{plan.days} Days</p>
                        <p className="text-[10px] font-mono text-emerald-400 mt-0.5">{plan.apy}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reward calculation breakdown */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Yield Return:</span>
                    <span className="text-emerald-400 font-bold">+{formatNumber(calculateAPYReward())} MIND</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Unlock Date:</span>
                    <span className="text-slate-200">
                      {new Date(Date.now() + stakingDays * 24 * 3600 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={user.balanceMIND <= 0}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 disabled:opacity-50 text-slate-950 font-black rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Deposit to Staking Vault
                </button>
              </form>
            </div>

            {/* Staking stats card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Global Staking Statistics
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Total Value Locked (TVL):</span>
                    <span className="text-white font-bold">$18.9M USD</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Total MIND Staked:</span>
                    <span className="text-cyan-400 font-bold">46,240,100 MIND</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Validator Nodes:</span>
                    <span className="text-emerald-400 font-bold">164 Active</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Reward Distribution:</span>
                    <span className="text-slate-300">Every 0.8s Block</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. REFERRALS TAB */}
        {activeTab === 'referrals' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">MindChain Affiliate Program</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Invite fellow Web3 investors, friends, and community members to join the MindChain Layer-1 presale. Every time a buyer uses your link, you instantly receive a 15% commission paid out in BEP20 USDT or MIND.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Referrals</p>
                  <p className="text-2xl font-black text-white font-mono mt-1">{user.referralsCount}</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Earned Bonus</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {formatUSD(user.referralEarningsUSD)}
                  </p>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Commission Rate</p>
                  <p className="text-2xl font-black text-cyan-400 font-mono mt-1">15.00%</p>
                </div>
              </div>

              {/* Referral link box */}
              <div className="pt-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Your Unique Referral Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs font-mono text-cyan-300 outline-none select-all"
                  />
                  <button
                    onClick={handleCopyReferral}
                    className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. FULL TRANSACTION HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Complete Transaction Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">MIND Amount</th>
                    <th className="pb-3 px-3">USD Value</th>
                    <th className="pb-3 px-3">Transaction Hash</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-white capitalize">{tx.type.replace('_', ' ')}</td>
                      <td className="py-3 px-3 text-cyan-400 font-bold">{formatNumber(tx.amountMIND)} MIND</td>
                      <td className="py-3 px-3 text-slate-300">{formatUSD(tx.amountUSD)}</td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-[150px]">
                        {truncateAddress(tx.txHash, 8, 6)}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{tx.timestamp}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#1e293b] border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl text-white space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Withdraw MIND
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {withdrawError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Recipient EVM Address
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs font-mono text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Amount (MIND)
                  </label>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Available: {formatNumber(user.balanceMIND)} MIND
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="50.00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-sm font-mono text-white font-bold outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(user.balanceMIND.toString())}
                    className="absolute right-2.5 px-2 py-0.5 bg-slate-800 text-cyan-400 text-xs font-mono rounded border border-slate-700"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Network Gas:</span>
                  <span className="text-emerald-400">&lt; 0.0001 MIND</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Arrival:</span>
                  <span className="text-slate-200">~0.8 seconds (Instant)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-900 text-cyan-300">
                  <span>Destination:</span>
                  <span>Personal EVM / mindchain.info</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-300/90 font-mono">
                💡 <strong>Tip:</strong> Once withdrawn to your address, you can freely transfer, trade, or sell your MIND anytime on the main network at{' '}
                <a href="https://mindchain.info" target="_blank" rel="noreferrer" className="underline font-bold text-white hover:text-cyan-200">
                  mindchain.info
                </a>.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black rounded-xl uppercase text-xs tracking-wider shadow-lg transition-all"
              >
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION DETAILS MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#1e293b] border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl text-white space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white capitalize">
                {selectedTx.type.replace('_', ' ')} Details
              </h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-cyan-400 font-bold">{formatNumber(selectedTx.amountMIND)} MIND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">USD Value:</span>
                  <span className="text-white">{formatUSD(selectedTx.amountUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-slate-300">{selectedTx.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">{selectedTx.status}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  On-Chain Transaction Hash
                </label>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-cyan-300 break-all select-all">
                  {selectedTx.txHash}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
