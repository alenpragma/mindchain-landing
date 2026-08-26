import React, { useState } from 'react';
import { UserAccount } from '../types';
import {
  generateRandomEVMAddress,
  isValidEVMAddress,
  DEMO_USER_ADDRESS,
  INITIAL_USER,
} from '../utils/crypto';
import {
  Wallet,
  KeyRound,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [address, setAddress] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateAddress = () => {
    const newAddr = generateRandomEVMAddress();
    setAddress(newAddr);
    setError(null);
  };

  const handleQuickDemo = () => {
    onSuccess(INITIAL_USER);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      setError('Please enter your EVM Wallet Address');
      return;
    }

    if (!isValidEVMAddress(trimmedAddress)) {
      setError('Invalid EVM address format. Must start with 0x and be 42 characters.');
      return;
    }

    if (!pin || pin.length < 4) {
      setError('Please enter a 4-8 digit Secret PIN for session protection.');
      return;
    }

    // Lookup existing account in localStorage or create new
    try {
      const storedUsersRaw = localStorage.getItem('mindchain_users');
      const users: Record<string, UserAccount> = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : {};

      const lowerAddr = trimmedAddress.toLowerCase();

      if (mode === 'login') {
        if (users[lowerAddr]) {
          if (users[lowerAddr].pin && users[lowerAddr].pin !== pin) {
            setError('Incorrect PIN for this EVM address.');
            return;
          }
          onSuccess(users[lowerAddr]);
          onClose();
          return;
        } else {
          // If demo address or first login with no saved pass, authenticate and create session
          const newUser: UserAccount = {
            address: trimmedAddress,
            pin,
            balanceMIND: lowerAddr === DEMO_USER_ADDRESS.toLowerCase() ? 3896.25 : 0,
            totalDepositedUSD: lowerAddr === DEMO_USER_ADDRESS.toLowerCase() ? 1575.0 : 0,
            referralsCount: 0,
            referralEarningsUSD: 0,
            referralCode: `MIND-${trimmedAddress.substring(2, 7).toUpperCase()}`,
            joinedDate: 'August 2026',
          };
          users[lowerAddr] = newUser;
          localStorage.setItem('mindchain_users', JSON.stringify(users));
          onSuccess(newUser);
          onClose();
          return;
        }
      } else {
        // Signup
        const newUser: UserAccount = {
          address: trimmedAddress,
          pin,
          balanceMIND: 0,
          totalDepositedUSD: 0,
          referralsCount: 0,
          referralEarningsUSD: 0,
          referralCode: `MIND-${trimmedAddress.substring(2, 7).toUpperCase()}`,
          joinedDate: 'August 2026',
        };
        users[lowerAddr] = newUser;
        localStorage.setItem('mindchain_users', JSON.stringify(users));
        onSuccess(newUser);
        onClose();
      }
    } catch (err) {
      // Fallback
      const fallbackUser: UserAccount = {
        address: trimmedAddress,
        pin,
        balanceMIND: 0,
        totalDepositedUSD: 0,
        referralsCount: 0,
        referralEarningsUSD: 0,
        referralCode: `MIND-${trimmedAddress.substring(2, 7).toUpperCase()}`,
        joinedDate: 'August 2026',
      };
      onSuccess(fallbackUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1e293b] border border-slate-700/90 max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative text-white">
        {/* Top Gradient Bar */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {mode === 'login' ? 'Connect EVM Account' : 'Create MindChain ID'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'login'
                  ? 'Access your presale allocations and dashboard'
                  : 'No seed phrases needed. Protected by your PIN.'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Signup
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EVM Address Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  EVM Wallet Address
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAddress}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate
                </button>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x71C4B82390a42617C6418E66271c6f140689Af3d"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono placeholder-slate-600 focus:border-cyan-400 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Secret PIN Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Secret PIN / Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">4-8 Digits</span>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={12}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 px-3.5 pr-10 text-xs text-white font-mono placeholder-slate-600 focus:border-cyan-400 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Referral Code (only in signup mode) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. MIND-71C4B"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono placeholder-slate-600 focus:border-cyan-400 outline-none transition-colors uppercase"
                />
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <UserCheck className="w-4 h-4" />
              {mode === 'login' ? 'Authenticate & Enter' : 'Complete Registration'}
            </button>
          </form>

          {/* Quick Demo Login Preset */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 text-center mb-2.5">
              Want to test without typing?
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800/90 text-cyan-300 font-bold rounded-xl text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              One-Click Demo Connect (0x71C...89A)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
