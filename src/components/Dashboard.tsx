import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { UserAccount, Transaction, AppliedCoupon, ReferralRecord, TransactionType } from '../types';
import {
  MIND_PRICE_USD,
  INITIAL_REFERRALS,
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
  ArrowUpRight,
  Layers,
  Clock,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  MapPin,
  Phone,
  Lock,
  Save,
  Hash,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface DashboardProps {
  user: UserAccount;
  transactions: Transaction[];
  onOpenBuy: (amount?: number, coupon?: AppliedCoupon | null) => void;
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
  const location = useLocation();
  const navigate = useNavigate();

  // Clipboard states
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedTxHash, setCopiedTxHash] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState(user.address);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Sync withdraw address when user changes
  useEffect(() => {
    setWithdrawAddress(user.address);
  }, [user.address]);

  // ==============================
  // 1. TRANSACTION HISTORY FILTERS & PAGINATION
  // ==============================
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | TransactionType>('all');
  const [txStatusFilter, setTxStatusFilter] = useState<string>('all');
  const [txCurrentPage, setTxCurrentPage] = useState(1);
  const txPerPage = 6;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (txTypeFilter !== 'all' && tx.type !== txTypeFilter) {
        return false;
      }
      if (txStatusFilter !== 'all' && tx.status !== txStatusFilter) {
        return false;
      }
      if (txSearchQuery.trim()) {
        const query = txSearchQuery.trim().toLowerCase();
        const orderIdMatch = tx.orderId?.toLowerCase().includes(query);
        const hashMatch = tx.txHash?.toLowerCase().includes(query);
        const noteMatch = tx.note?.toLowerCase().includes(query);
        const typeMatch = tx.type?.toLowerCase().includes(query);
        if (!orderIdMatch && !hashMatch && !noteMatch && !typeMatch) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, txTypeFilter, txStatusFilter, txSearchQuery]);

  const totalTxPages = Math.max(1, Math.ceil(filteredTransactions.length / txPerPage));
  const paginatedTransactions = useMemo(() => {
    const startIndex = (txCurrentPage - 1) * txPerPage;
    return filteredTransactions.slice(startIndex, startIndex + txPerPage);
  }, [filteredTransactions, txCurrentPage, txPerPage]);

  const handleTxPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalTxPages) {
      setTxCurrentPage(newPage);
    }
  };

  // ==============================
  // 2. REFERRALS LIST & PAGINATION
  // ==============================
  const [referralsList] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [refSearchQuery, setRefSearchQuery] = useState('');
  const [refCurrentPage, setRefCurrentPage] = useState(1);
  const refPerPage = 4;

  const filteredReferrals = useMemo(() => {
    if (!refSearchQuery.trim()) return referralsList;
    const query = refSearchQuery.trim().toLowerCase();
    return referralsList.filter(
      (ref) =>
        ref.orderId.toLowerCase().includes(query) ||
        ref.referredUserAddress.toLowerCase().includes(query) ||
        (ref.referredUserName && ref.referredUserName.toLowerCase().includes(query))
    );
  }, [referralsList, refSearchQuery]);

  const totalRefPages = Math.max(1, Math.ceil(filteredReferrals.length / refPerPage));
  const paginatedReferrals = useMemo(() => {
    const startIndex = (refCurrentPage - 1) * refPerPage;
    return filteredReferrals.slice(startIndex, startIndex + refPerPage);
  }, [filteredReferrals, refCurrentPage, refPerPage]);

  const handleRefPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalRefPages) {
      setRefCurrentPage(newPage);
    }
  };

  const totalRefMIND = user.referralEarningsMIND || referralsList.reduce((acc, curr) => acc + curr.bonusEarnedMIND, 0);

  // ==============================
  // 3. PROFILE FORM STATE
  // ==============================
  const [profileName, setProfileName] = useState(user.name || 'Alexander Wright');
  const [profileEmail, setProfileEmail] = useState(user.email || 'alexander.wright@mindchain.io');
  const [profileAddress, setProfileAddress] = useState(
    user.physicalAddress || '742 Evergreen Terrace, Suite 400, Austin, TX 78701, United States'
  );
  const [profilePhone, setProfilePhone] = useState(user.phone || '+1 (512) 555-0198');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Keep state updated if user prop updates
  useEffect(() => {
    if (user.name) setProfileName(user.name);
    if (user.email) setProfileEmail(user.email);
    if (user.physicalAddress) setProfileAddress(user.physicalAddress);
    if (user.phone) setProfilePhone(user.phone);
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    setTimeout(() => {
      const updated: UserAccount = {
        ...user,
        name: profileName.trim(),
        email: profileEmail.trim(),
        physicalAddress: profileAddress.trim(),
        phone: profilePhone.trim(),
      };
      onUpdateUser(updated);
      setIsSavingProfile(false);
      onShowToast('Profile Updated Successfully', 'Your account details have been securely saved.', 'success');
    }, 600);
  };

  // Referral link
  const referralLink = `https://mindchain.info/ref?id=${user.address.toLowerCase()}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    onShowToast('Referral Link Copied', referralLink, 'success');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(user.address);
    setCopiedAddr(true);
    onShowToast('Wallet Address Copied', user.address, 'info');
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCopyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTxHash(true);
    onShowToast('Transaction Hash Copied', hash, 'info');
    setTimeout(() => setCopiedTxHash(false), 2000);
  };

  // Withdraw submit
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

    const generatedOrderId = `MND-WTH-${Math.floor(100000 + Math.random() * 900000)}`;
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      orderId: generatedOrderId,
      type: 'withdraw',
      amountMIND: num,
      amountUSD: num * MIND_PRICE_USD,
      txHash: generateTxHash(),
      timestamp: 'Just now',
      status: 'processing',
      note: `Withdrawal to ${truncateAddress(withdrawAddress)}`,
    };
    onAddTransaction(tx);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    onShowToast(
      'Withdrawal Initiated',
      `Dispatched ${formatNumber(num)} MIND [${generatedOrderId}] to ${truncateAddress(withdrawAddress)}`,
      'info'
    );
  };

  // Determine current active subroute
  const currentPath = location.pathname;
  const isOverview = currentPath === '/dashboard' || currentPath === '/dashboard/';
  const isBuy = currentPath.startsWith('/dashboard/buy');
  const isReferrals = currentPath.startsWith('/dashboard/referrals');
  const isHistory = currentPath.startsWith('/dashboard/history');
  const isProfile = currentPath.startsWith('/dashboard/profile');

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
                  {user.name ? `${user.name} • EVM Account` : 'Connected EVM Address'}
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
                  className="text-slate-400 hover:text-cyan-400 p-0.5 transition-colors cursor-pointer"
                  title="Copy full address"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">MIND Price:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">${MIND_PRICE_USD} USD</span>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Withdraw
            </button>

            <button
              onClick={() => onOpenBuy(100)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5" />
              Buy MIND
            </button>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `p-2 rounded-xl border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`
              }
              title="Profile Settings"
            >
              <User className="w-4 h-4" />
            </NavLink>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs with True React Router Links */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { to: '/dashboard', label: 'Dashboard Overview', icon: Layers, end: true },
            { to: '/dashboard/buy', label: 'Presale Terminal', icon: Zap, end: false },
            { to: '/dashboard/referrals', label: 'Referral Rewards (+15% MIND)', icon: Users, end: false },
            { to: '/dashboard/history', label: `Transaction History (${transactions.length})`, icon: Clock, end: false },
            { to: '/dashboard/profile', label: 'Profile Settings', icon: User, end: false },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </NavLink>
            );
          })}
        </div>

        {/* 1. TOP METRICS ROW & REFERRAL BANNER: ONLY ON /dashboard (Overview) */}
        {isOverview && (
          <div className="space-y-6">
            {/* Top 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Total Available MIND Balance */}
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
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-emerald-400 font-mono font-bold">
                    ≈ {formatUSD(user.balanceMIND * MIND_PRICE_USD)} USD
                  </p>
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer underline"
                  >
                    Withdraw <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
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
                  USDT (BEP-20) + Bonus Credited
                </p>
              </div>

              {/* Card 3: Referral Earnings in MIND */}
              <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Referral Bonus Earned
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {formatNumber(totalRefMIND)} <span className="text-amber-400 text-sm">MIND</span>
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-amber-400 font-mono font-bold">
                    ≈ {formatUSD(totalRefMIND * MIND_PRICE_USD)} USD ({user.referralsCount} Invites)
                  </p>
                  <NavLink
                    to="/dashboard/referrals"
                    className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer underline"
                  >
                    View List <ChevronRight className="w-3 h-3" />
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Referral Quick Share Banner */}
            <div className="bg-gradient-to-r from-cyan-900/40 via-slate-900 to-amber-950/30 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    +15% Instant MIND Coin Bonus
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  Share Your Affiliate Link & Earn Free MIND Coins
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Earn an immediate 15% bonus in MIND Coins for every contributor who purchases MIND through your referral link.
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
          </div>
        )}

        {/* 2. DYNAMIC ROUTE-DRIVEN CONTENT */}

        {/* SUBROUTE 1: /dashboard (OVERVIEW) */}
        {isOverview && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Presale Buy Terminal Widget */}
            <div className="lg:col-span-7 space-y-6">
              <PresaleCalculator isLoggedIn={true} onProceedToPay={(amt, coupon) => onOpenBuy(amt, coupon)} />
            </div>

            {/* Right: Recent Activity Table with Order ID */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-5 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Recent Activity
                    </h3>
                  </div>
                  <NavLink
                    to="/dashboard/history"
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    View All ({transactions.length}) <ChevronRight className="w-3 h-3" />
                  </NavLink>
                </div>

                <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[500px]">
                  {transactions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 font-mono">
                      No activity recorded yet.
                    </div>
                  ) : (
                    transactions.slice(0, 5).map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="py-3 px-2 hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                            {tx.type === 'buy' && <Zap className="w-4 h-4 text-cyan-400" />}
                            {tx.type === 'referral' && <Users className="w-4 h-4 text-amber-400" />}
                            {tx.type === 'withdraw' && <ArrowUpRight className="w-4 h-4 text-rose-400" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white capitalize">
                                {tx.type.replace('_', ' ')}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {tx.orderId || 'ORD-N/A'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {tx.timestamp} • {truncateAddress(tx.txHash, 6, 4)}
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

        {/* SUBROUTE 2: /dashboard/buy (PRESALE TERMINAL) */}
        {isBuy && (
          <div className="max-w-2xl mx-auto py-2">
            <PresaleCalculator isLoggedIn={true} onProceedToPay={(amt, coupon) => onOpenBuy(amt, coupon)} />
          </div>
        )}

        {/* SUBROUTE 3: /dashboard/referrals (REFERRAL REWARDS) */}
        {isReferrals && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Top Stats Overview */}
            <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white">MindChain Affiliate & Referral Program</h3>
                    <p className="text-xs text-slate-400">
                      Earn a 15% instant commission rewarded directly in MIND Coins for every contributor who participates.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-mono font-bold">
                  Reward Currency: MIND Coin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Referrals</p>
                  <p className="text-2xl font-black text-white font-mono mt-1">{user.referralsCount} Users</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Active Investors</p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Bonus Earned</p>
                  <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                    +{formatNumber(totalRefMIND)} <span className="text-sm">MIND</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    ≈ {formatUSD(totalRefMIND * MIND_PRICE_USD)} USD Value
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Commission Rate</p>
                  <p className="text-2xl font-black text-cyan-400 font-mono mt-1">15.00%</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Instant Payout in MIND</p>
                </div>
              </div>

              {/* Referral link copy box */}
              <div className="pt-2">
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
                    className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Paginated Referral Records Table */}
            <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    Referred Investors List ({filteredReferrals.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comprehensive audit of all investors referred with real-time MIND Coin distributions.
                  </p>
                </div>

                {/* Search in Referral List */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={refSearchQuery}
                    onChange={(e) => {
                      setRefSearchQuery(e.target.value);
                      setRefCurrentPage(1);
                    }}
                    placeholder="Search Order ID, Name..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 bg-slate-900/50">
                    <tr>
                      <th className="py-2.5 px-3">Order / Ref ID</th>
                      <th className="py-2.5 px-3">Referred Investor</th>
                      <th className="py-2.5 px-3">Joined Date</th>
                      <th className="py-2.5 px-3">Deposit Amount</th>
                      <th className="py-2.5 px-3 text-amber-400">Bonus in MIND (+15%)</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {paginatedReferrals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          No referral records found matching your search.
                        </td>
                      </tr>
                    ) : (
                      paginatedReferrals.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold text-[11px]">
                              {ref.orderId}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-white font-bold">{ref.referredUserName || 'Anonymous Web3 User'}</p>
                            <p className="text-[10px] text-slate-400">{truncateAddress(ref.referredUserAddress, 8, 6)}</p>
                          </td>
                          <td className="py-3 px-3 text-slate-300">{ref.joinedDate}</td>
                          <td className="py-3 px-3 text-white font-bold">{formatUSD(ref.depositUSD)}</td>
                          <td className="py-3 px-3 font-bold text-amber-400">
                            +{formatNumber(ref.bonusEarnedMIND)} MIND
                            <span className="block text-[10px] text-emerald-400 font-normal">
                              ≈ {formatUSD(ref.bonusEarnedMIND * MIND_PRICE_USD)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              {ref.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Referral Pagination Controls */}
              {totalRefPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">
                    Showing {(refCurrentPage - 1) * refPerPage + 1} to{' '}
                    {Math.min(refCurrentPage * refPerPage, filteredReferrals.length)} of {filteredReferrals.length} referrals
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRefPageChange(refCurrentPage - 1)}
                      disabled={refCurrentPage === 1}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>

                    {Array.from({ length: totalRefPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handleRefPageChange(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          refCurrentPage === pageNum
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => handleRefPageChange(refCurrentPage + 1)}
                      disabled={refCurrentPage === totalRefPages}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBROUTE 4: /dashboard/history (TRANSACTIONS) */}
        {isHistory && (
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Header & Filter Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Transaction History & Order Records
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filter, search by Order ID, and review all your presale contributions, referral rewards, and withdrawals.
                </p>
              </div>

              {/* Filters Container */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search by Order ID / Hash */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={txSearchQuery}
                    onChange={(e) => {
                      setTxSearchQuery(e.target.value);
                      setTxCurrentPage(1);
                    }}
                    placeholder="Search Order ID, Hash..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Filter by Type */}
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl p-1 text-xs">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'buy', label: 'Buy' },
                    { id: 'referral', label: 'Referral' },
                    { id: 'withdraw', label: 'Withdraw' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setTxTypeFilter(filter.id as any);
                        setTxCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                        txTypeFilter === filter.id
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Filter by Status */}
                <select
                  value={txStatusFilter}
                  onChange={(e) => {
                    setTxStatusFilter(e.target.value);
                    setTxCurrentPage(1);
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs font-mono text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Transactions Table with Order ID */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 bg-slate-900/50">
                  <tr>
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">MIND Amount</th>
                    <th className="py-3 px-3">USD Value</th>
                    <th className="py-3 px-3">Transaction Hash</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-500 font-mono">
                        No transactions found matching your selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold group-hover:border-cyan-500/50 transition-colors">
                            {tx.orderId || 'MND-ORD-N/A'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-white capitalize">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.type === 'buy'
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : tx.type === 'referral'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {tx.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className={`py-3.5 px-3 font-bold ${tx.type === 'withdraw' ? 'text-rose-400' : 'text-cyan-400'}`}>
                          {tx.type === 'withdraw' ? '-' : '+'}{formatNumber(tx.amountMIND)} MIND
                        </td>
                        <td className="py-3.5 px-3 text-slate-300">{formatUSD(tx.amountUSD)}</td>
                        <td className="py-3.5 px-3 text-slate-400 truncate max-w-[140px]">
                          {truncateAddress(tx.txHash, 8, 6)}
                        </td>
                        <td className="py-3.5 px-3 text-slate-400">{tx.timestamp}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              tx.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalTxPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                <span className="text-slate-400">
                  Showing {(txCurrentPage - 1) * txPerPage + 1} to{' '}
                  {Math.min(txCurrentPage * txPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTxPageChange(txCurrentPage - 1)}
                    disabled={txCurrentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  {Array.from({ length: totalTxPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handleTxPageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        txCurrentPage === pageNum
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handleTxPageChange(txCurrentPage + 1)}
                    disabled={txCurrentPage === totalTxPages}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBROUTE 5: /dashboard/profile (PROFILE SETTINGS) */}
        {isProfile && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#1e293b]/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    Profile & Account Settings
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your investor identity, email notifications, contact details, and physical address.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  {profileName.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>

              {/* Wallet Lock Notification */}
              <div className="p-4 bg-slate-900/90 border border-cyan-500/30 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    Immutable EVM Wallet Address
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                      Locked / Read-Only
                    </span>
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    For cryptographic security and on-chain verification integrity, the registered EVM wallet address is permanently bound to this account. You may freely update your name, email address, phone, and delivery address anytime.
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-5">
                {/* 1. Wallet Address (Locked / Disabled) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Registered EVM Wallet Address (Immutable)
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">Cannot be changed</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={user.address}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-3 pr-20 text-xs font-mono text-slate-400 cursor-not-allowed select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="absolute right-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-bold rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAddr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                </div>

                {/* 2. Full Name & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      Full Name / Investor Alias
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Alexander Wright"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Physical Address & Phone */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      Physical / Mailing Address
                    </label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="Street, Suite, City, State, ZIP, Country"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      Phone / Telegram Contact
                    </label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSavingProfile ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Profile Details
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* 3. TRANSACTION DETAILS MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">Order Details</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Order ID:</span>
                <span className="text-cyan-300 font-bold">{selectedTx.orderId || 'MND-ORD-N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Type:</span>
                <span className="text-white font-bold capitalize">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">MIND Coins:</span>
                <span className="text-cyan-400 font-bold">{formatNumber(selectedTx.amountMIND)} MIND</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">USD Value:</span>
                <span className="text-emerald-400 font-bold">{formatUSD(selectedTx.amountUSD)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{selectedTx.timestamp}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{selectedTx.status}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">On-Chain Transaction Hash:</span>
                <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-300 truncate text-[11px] select-all">{selectedTx.txHash}</span>
                  <button
                    onClick={() => handleCopyTxHash(selectedTx.txHash)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg cursor-pointer shrink-0"
                    title="Copy Hash"
                  >
                    {copiedTxHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 4. WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Withdraw MIND Coins</h3>
              </div>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawError(null);
                }}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Destination EVM Address</label>
                <input
                  type="text"
                  required
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 font-mono text-cyan-300 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-bold">Withdraw Amount (MIND)</label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Available: <strong className="text-cyan-400">{formatNumber(user.balanceMIND)} MIND</strong>
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="any"
                    required
                    min="50"
                    max={user.balanceMIND}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min. 50 MIND"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl p-2.5 font-mono text-white outline-none pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(user.balanceMIND.toString())}
                    className="absolute right-2 text-[10px] font-mono font-bold px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {withdrawError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-[11px]">
                  {withdrawError}
                </div>
              )}

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Network Gas Fee:</span>
                  <span className="text-emerald-400 font-bold">0.0001 MIND (Subsidized)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dispatch Target:</span>
                  <span className="text-cyan-300">MindChain Mainnet</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawError(null);
                  }}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={user.balanceMIND < 50}
                  className="w-1/2 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold rounded-xl disabled:opacity-40 cursor-pointer"
                >
                  Confirm Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
