import React, { useState, useEffect } from 'react';
import { UserAccount, Transaction, PaymentInvoice, AppliedCoupon } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_USER } from './utils/crypto';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EcosystemGrid } from './components/EcosystemGrid';
import { TrustAndSpecs } from './components/TrustAndSpecs';
import { AuthModal } from './components/AuthModal';
import { InvoiceModal } from './components/InvoiceModal';
import { Dashboard } from './components/Dashboard';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // App state
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('mindchain_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
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
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
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
    // If not logged in, login with the demo account or generate one
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

    // Switch to dashboard
    setCurrentView('dashboard');
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans bg-grid-pattern relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Top Navigation */}
      <Navbar
        user={user}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAuth={handleOpenAuth}
        onOpenBuy={() => handleOpenBuyFlow(100)}
        onLogout={handleLogout}
        onCopyAddress={(addr) => addToast('Address Copied', addr, 'info')}
      />

      {/* Dynamic View Display */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          {/* Hero Section with Bonus Calculator */}
          <Hero
            isLoggedIn={!!user}
            onBuyClick={(amount, coupon) => handleOpenBuyFlow(amount, coupon)}
            onExploreClick={() => {
              document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Ecosystem Grid (CEX, DEX, DeFi, Wallet, Explorer, Academy) */}
          <EcosystemGrid onSelectAction={() => handleOpenBuyFlow(100)} />

          {/* Comparison Matrix & Tokenomics */}
          <TrustAndSpecs />
        </main>
      ) : user ? (
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
        // Fallback if view is dashboard but no user
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-slate-400 mb-4">Please connect your EVM session to view your dashboard.</p>
          <button
            onClick={() => handleOpenAuth('login')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black rounded-xl"
          >
            Connect EVM Session
          </button>
        </div>
      )}

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
