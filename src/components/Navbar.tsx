import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserAccount } from '../types';
import { MIND_PRICE_USD, truncateAddress } from '../utils/crypto';
import {
  Layers,
  Wallet,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  HelpCircle,
  BarChart3,
  User,
} from 'lucide-react';

interface NavbarProps {
  user: UserAccount | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenBuy: () => void;
  onLogout: () => void;
  onCopyAddress?: (addr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenBuy,
  onLogout,
  onCopyAddress,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      setCopied(true);
      if (onCopyAddress) onCopyAddress(user.address);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDashboardActive = location.pathname.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0f172a]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo Link to Home */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300 transform group-hover:scale-105 border border-cyan-300/30">
            <span className="text-slate-950 font-black text-xl tracking-tighter">M</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                MindChain
              </span>
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                L1
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1 hidden sm:block">
              EVM LAYER-1
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-slate-300">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors py-1 hover:text-cyan-400 cursor-pointer ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/presale"
            className={({ isActive }) =>
              `transition-colors py-1 hover:text-cyan-400 cursor-pointer flex items-center gap-1 ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`
            }
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Presale
          </NavLink>

          <NavLink
            to="/ecosystem"
            className={({ isActive }) =>
              `transition-colors py-1 hover:text-cyan-400 cursor-pointer ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`
            }
          >
            Ecosystem
          </NavLink>

          <NavLink
            to="/tokenomics"
            className={({ isActive }) =>
              `transition-colors py-1 hover:text-cyan-400 cursor-pointer ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`
            }
          >
            L1 Comparison
          </NavLink>

          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `transition-colors py-1 hover:text-cyan-400 cursor-pointer flex items-center gap-1.5 ${
                  isActive || isDashboardActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                }`
              }
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Right Section: Price Badge & Auth Actions */}
        <div className="flex items-center gap-3">
          {/* Live Price Badge */}
          <div className="bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full flex items-center gap-2 shadow-inner">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
              MIND:
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              ${MIND_PRICE_USD.toFixed(2)} USD
            </span>
          </div>

          {/* User Auth Buttons / State */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isDashboardActive
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>My Dashboard</span>
              </Link>

              <div
                onClick={handleCopy}
                title="Click to copy address"
                className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-600 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span className="text-xs font-mono text-cyan-300 font-medium">
                  {truncateAddress(user.address)}
                </span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                )}
              </div>

              <button
                onClick={onLogout}
                title="Disconnect EVM Session"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 text-slate-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Connect
              </button>
              <button
                onClick={onOpenBuy}
                className="relative group overflow-hidden rounded-xl p-px font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 transition-all"></span>
                <span className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-[11px] bg-slate-950 text-cyan-300 transition-colors group-hover:bg-transparent group-hover:text-slate-950 font-extrabold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  Buy MIND
                </span>
              </button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0b1120]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/presale"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3.5 py-2.5 rounded-xl text-cyan-300 font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              Presale Terminal
            </Link>
            <Link
              to="/ecosystem"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Ecosystem Products
            </Link>
            <Link
              to="/tokenomics"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              L1 Comparison & Specs
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left px-3.5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                My Dashboard
              </Link>
            )}
          </div>

          {!user ? (
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-slate-800/90 hover:bg-slate-700 rounded-xl text-center text-xs font-bold text-white border border-slate-700 transition-colors cursor-pointer"
              >
                Connect EVM Wallet
              </button>
              <button
                onClick={() => {
                  onOpenBuy();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-xl text-center text-xs font-black text-slate-950 uppercase tracking-wider shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Buy MIND (USDT BEP-20)
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-1">
              <div className="font-mono text-xs text-cyan-300 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                {truncateAddress(user.address)}
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
