import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { UserAccount, Transaction, PaymentInvoice, AppliedCoupon } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_USER } from './utils/crypto';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { Dashboard } from './components/Dashboard';

import { HomePage } from './pages/HomePage';
import { PresalePage } from './pages/PresalePage';
import { EcosystemPage } from './pages/EcosystemPage';
import { TokenomicsPage } from './pages/TokenomicsPage';
import { Lock, Wallet, Zap, ShieldCheck } from 'lucide-react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // App state
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('mindchain_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('mindchain_txs');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedBuyAmount, setSelectedBuyAmount] = useState<number>(100);
  const [selectedCoupon, setSelectedCoupon] = useState<AppliedCoupon | null>(null);

  const [pendingBuyAmount, setPendingBuyAmount] = useState<number | null>(null);
  const [pendingCoupon, setPendingCoupon] = useState<AppliedCoupon | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('mindchain_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mindchain_active_user');
    }
  }, [user]);

  // Sync transactions to localStorage
  useEffect(() => {
    localStorage.setItem('mindchain_txs', JSON.stringify(transactions));
  }, [transactions]);

  // Handlers
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser: UserAccount) => {
    setUser(authenticatedUser);
    addToast(
      'Session Connected',
      `Authenticated with EVM ID: ${authenticatedUser.address.substring(0, 6)}...${authenticatedUser.address.substring(38)}`,
      'success'
    );

    // If user initiated a buy before logging in, proceed to invoice modal
    if (pendingBuyAmount) {
      setSelectedBuyAmount(pendingBuyAmount);
      setSelectedCoupon(pendingCoupon);
      setIsInvoiceOpen(true);
      setPendingBuyAmount(null);
      setPendingCoupon(null);
    } else {
      // If current page is not already under /dashboard, navigate to /dashboard
      if (!location.pathname.startsWith('/dashboard')) {
        navigate('/dashboard');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
    addToast('Disconnected', 'Your EVM session has been cleared.', 'info');
  };

  const handleOpenBuyFlow = (amount?: number, coupon?: AppliedCoupon | null) => {
    const finalAmount = amount || 100;
    const finalCoupon = coupon || null;

    // Strict Gate: Must sign up or log in first before accessing payment invoice
    if (!user) {
      setPendingBuyAmount(finalAmount);
      setPendingCoupon(finalCoupon);
      setAuthMode('signup');
      setIsAuthOpen(true);
      addToast(
        'Authentication Required',
        'Please create an account or sign in to purchase MIND with exclusive bonus benefits.',
        'info'
      );
      return;
    }

    setSelectedBuyAmount(finalAmount);
    setSelectedCoupon(finalCoupon);
    setIsInvoiceOpen(true);
  };

  const handlePaymentSuccess = (invoice: PaymentInvoice, completedTx: Transaction) => {
    let targetUser = user;
    if (!targetUser) {
      targetUser = {
        ...INITIAL_USER,
        balanceMIND: invoice.totalMind,
        totalDepositedUSD: invoice.usdAmount,
      };
      setUser(targetUser);
    } else {
      targetUser = {
        ...targetUser,
        balanceMIND: targetUser.balanceMIND + invoice.totalMind,
        totalDepositedUSD: targetUser.totalDepositedUSD + invoice.usdAmount,
      };
      setUser(targetUser);
    }

    // Add transaction to history
    setTransactions((prev) => [completedTx, ...prev]);

    addToast(
      'Payment Confirmed!',
      `Successfully credited ${invoice.totalMind.toFixed(2)} MIND to your wallet`,
      'success'
    );

    // Switch to dashboard history or overview
    navigate('/dashboard/history');
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans bg-grid-pattern relative selection:bg-cyan-500/30 selection:text-cyan-200">
      <ScrollToTop />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Top Navigation */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenBuy={() => handleOpenBuyFlow(100)}
        onLogout={handleLogout}
        onCopyAddress={(addr) => addToast('Address Copied', addr, 'info')}
      />

      {/* Dynamic View Routing */}
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* Landing / Home Page */}
          <Route
            path="/"
            element={<HomePage isLoggedIn={!!user} onOpenBuyFlow={handleOpenBuyFlow} />}
          />
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* Dedicated Presale Page */}
          <Route
            path="/presale"
            element={<PresalePage isLoggedIn={!!user} onOpenBuyFlow={handleOpenBuyFlow} />}
          />

          {/* Ecosystem Page */}
          <Route
            path="/ecosystem"
            element={<EcosystemPage onOpenBuyFlow={handleOpenBuyFlow} />}
          />

          {/* Tokenomics & Comparison Page */}
          <Route path="/tokenomics" element={<TokenomicsPage />} />
          <Route path="/specs" element={<Navigate to="/tokenomics" replace />} />

          {/* Dashboard and Subroutes */}
          <Route
            path="/dashboard/*"
            element={
              user ? (
                <Dashboard
                  user={user}
                  transactions={transactions}
                  onOpenBuy={(amount, coupon) => handleOpenBuyFlow(amount, coupon)}
                  onLogout={handleLogout}
                  onUpdateUser={(updated) => setUser(updated)}
                  onAddTransaction={handleAddTransaction}
                  onShowToast={addToast}
                />
              ) : (
                /* Gated Unauthenticated Dashboard Fallback */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-12">
                  <div className="max-w-md w-full bg-[#1e293b]/70 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-white">Dashboard Access Locked</h2>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Connect your Web3 EVM wallet session or sign in to access your portfolio balance, referral commissions, and order records.
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <button
                        onClick={() => handleOpenAuth('login')}
                        className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                      >
                        <Wallet className="w-4 h-4" />
                        Connect EVM Session
                      </button>
                      <button
                        onClick={() => handleOpenAuth('signup')}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Create New Account
                      </button>
                    </div>
                  </div>
                </div>
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />

      {/* EVM Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Automated Payment Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        usdAmount={selectedBuyAmount}
        coupon={selectedCoupon}
        onClose={() => setIsInvoiceOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
