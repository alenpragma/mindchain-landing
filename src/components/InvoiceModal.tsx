import React, { useState, useEffect, useRef } from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { PaymentInvoice, Transaction, AppliedCoupon } from '../types';
import {
  DEFAULT_DEPOSIT_ADDRESS,
  MIND_PRICE_USD,
  calculateMindAmount,
  formatNumber,
  formatUSD,
  generateTxHash,
} from '../utils/crypto';
import {
  Copy,
  Check,
  Clock,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
  X,
  ArrowRight,
  Sparkles,
  Tag,
} from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  usdAmount: number;
  coupon?: AppliedCoupon | null;
  onClose: () => void;
  onPaymentSuccess: (invoice: PaymentInvoice, tx: Transaction) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  usdAmount,
  coupon = null,
  onClose,
  onPaymentSuccess,
}) => {
  const [invoice, setInvoice] = useState<PaymentInvoice | null>(null);
  const [step, setStep] = useState<'awaiting_deposit' | 'confirming' | 'confirmed'>('awaiting_deposit');
  const [confirmations, setConfirmations] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);
  const [simulatedTxHash, setSimulatedTxHash] = useState<string>('');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize invoice on open
  useEffect(() => {
    if (isOpen && usdAmount > 0) {
      const calc = calculateMindAmount(usdAmount);
      const originalUsd = usdAmount;
      let finalPayable = usdAmount;
      let activeCoupon = coupon ? { ...coupon } : null;

      if (activeCoupon) {
        const discountVal = Number(((usdAmount * activeCoupon.discountPercent) / 100).toFixed(2));
        finalPayable = Math.max(0, Number((usdAmount - discountVal).toFixed(2)));
        activeCoupon.discountAmountUSD = discountVal;
      }

      const generatedInvoice: PaymentInvoice = {
        invoiceId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        usdAmount: finalPayable,
        originalUsdAmount: originalUsd,
        coupon: activeCoupon,
        mindAmount: calc.baseMind,
        bonusPercent: calc.bonusPercent,
        bonusMind: calc.bonusMind,
        totalMind: calc.totalMind,
        depositAddress: DEFAULT_DEPOSIT_ADDRESS,
        network: 'BNB Smart Chain (BEP20)',
        token: 'USDT',
        status: 'awaiting_deposit',
        confirmations: 0,
        requiredConfirmations: 3,
        createdAt: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000,
      };

      setInvoice(generatedInvoice);
      setStep('awaiting_deposit');
      setConfirmations(0);
      setTimeLeft(900);
      setRedirectCountdown(3);
      setSimulatedTxHash(generateTxHash());
    }
  }, [isOpen, usdAmount, coupon]);

  // Invoice expiration timer
  useEffect(() => {
    if (!isOpen || step === 'confirmed') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, step]);

  // Handle step progression
  const handleSimulatePayment = () => {
    if (!invoice) return;

    setStep('confirming');
    setConfirmations(1);

    // Progression 1 -> 2 -> 3 confirmations
    setTimeout(() => {
      setConfirmations(2);
    }, 1200);

    setTimeout(() => {
      setConfirmations(3);
      setStep('confirmed');

      const couponNote = invoice.coupon
        ? ` • Coupon: ${invoice.coupon.code} -${invoice.coupon.discountPercent}%`
        : '';

      const completedTx: Transaction = {
        id: `tx-${Date.now()}`,
        orderId: invoice.invoiceId,
        type: 'buy',
        amountMIND: invoice.totalMind,
        amountUSD: invoice.usdAmount,
        txHash: simulatedTxHash || generateTxHash(),
        timestamp: 'Just now',
        status: 'completed',
        note: `Platform Bonus Buy (${invoice.usdAmount} USDT BEP-20${couponNote})`,
      };

      // Redirect countdown
      let count = 3;
      const countInterval = setInterval(() => {
        count -= 1;
        setRedirectCountdown(count);
        if (count <= 0) {
          clearInterval(countInterval);
          onPaymentSuccess(invoice, completedTx);
          onClose();
        }
      }, 1000);
    }, 2500);
  };

  const handleManualImmediateRedirect = () => {
    if (!invoice) return;
    const couponNote = invoice.coupon
      ? ` • Coupon: ${invoice.coupon.code} -${invoice.coupon.discountPercent}%`
      : '';

    const completedTx: Transaction = {
      id: `tx-${Date.now()}`,
      orderId: invoice.invoiceId,
      type: 'buy',
      amountMIND: invoice.totalMind,
      amountUSD: invoice.usdAmount,
      txHash: simulatedTxHash || generateTxHash(),
      timestamp: 'Just now',
      status: 'completed',
      note: `Platform Bonus Buy (${invoice.usdAmount} USDT BEP-20${couponNote})`,
    };
    onPaymentSuccess(invoice, completedTx);
    onClose();
  };

  const handleCopyAddress = () => {
    if (invoice?.depositAddress) {
      navigator.clipboard.writeText(invoice.depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !invoice) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1e293b] border border-slate-700/90 max-w-xl w-full max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden relative text-white my-auto">
        {/* Top Gradient Highlight */}
        <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shrink-0"></div>

        {/* Close Button (disabled while confirming) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-7 space-y-5 sm:space-y-6 overflow-y-auto">
          {/* Header & Status Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4 pr-8 sm:pr-0">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {invoice.invoiceId}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  BEP20 USDT
                </span>
                {invoice.coupon && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                    <Tag className="w-3 h-3" />
                    {invoice.coupon.code} (-{invoice.coupon.discountPercent}%)
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Automated Payment Invoice
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400">Expires:</span>
              <span className="text-amber-400 font-bold">{formattedTime}</span>
            </div>
          </div>

          {/* DYNAMIC PAYMENT SIMULATOR / STATUS BANNER */}
          <div className="rounded-2xl p-4 border transition-all duration-300 bg-slate-900/90 border-slate-800">
            {step === 'awaiting_deposit' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Step 1: Awaiting BEP20 USDT Deposit...
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Send exactly{' '}
                      <strong className="text-emerald-400 text-xs">
                        {formatUSD(invoice.usdAmount)} USDT
                      </strong>{' '}
                      to the address below
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold hidden sm:inline">
                    LISTENING
                  </span>
                </div>
              </div>
            )}

            {step === 'confirming' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Step 2: Block Confirmation in progress ({confirmations}/3 confirmations)...
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Deposit detected on BNB Smart Chain. Finalizing block consensus...
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {Math.round((confirmations / 3) * 100)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(confirmations / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {step === 'confirmed' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Step 3: Payment Confirmed!
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Credited <strong className="text-white">{formatNumber(invoice.totalMind)} MIND</strong> to your wallet.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleManualImmediateRedirect}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  View Dashboard ({redirectCountdown}s)
                </button>
              </div>
            )}
          </div>

          {/* QR Code & Payment Address Display */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* QR Code Container */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <QRCodeDisplay value={invoice.depositAddress} size={150} />
              <span className="text-[10px] text-slate-400 font-mono mt-2">
                Scan with Binance / Trust / Metamask
              </span>
            </div>

            {/* Address & Deposit Summary */}
            <div className="sm:col-span-7 space-y-3.5">
              {/* Deposit Address Box */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  BEP20 USDT Deposit Address
                </label>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-700/80 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-cyan-300 break-all select-all font-medium">
                    {invoice.depositAddress}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Buy Value (USD):</span>
                  <span className="text-white font-bold">{formatUSD(invoice.originalUsdAmount)}</span>
                </div>

                {invoice.coupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Coupon ({invoice.coupon.code}):
                    </span>
                    <span className="font-bold">
                      -{formatUSD(invoice.coupon.discountAmountUSD)} (-{invoice.coupon.discountPercent}%)
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-200 font-bold">Exact Deposit Amount:</span>
                  <span className="text-emerald-400 font-extrabold">{formatUSD(invoice.usdAmount)} USDT</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Accepted Network:</span>
                  <span className="text-emerald-400 font-bold">BNB Smart Chain (BEP-20)</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Fixed Rate:</span>
                  <span className="text-cyan-400">1 MIND = ${MIND_PRICE_USD}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-200 font-bold">Total MIND Credited:</span>
                  <span className="text-cyan-300 font-black text-sm">
                    {formatNumber(invoice.totalMind)} MIND
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Action */}
          <div className="pt-2">
            {step === 'awaiting_deposit' && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  Simulate Instant BEP20 Payment Deposit ({formatUSD(invoice.usdAmount)} USDT)
                </button>
                <p className="text-[10px] text-slate-400 text-center font-mono">
                  Clicking simulates real-time blockchain node deposit & 3-block confirmation
                </p>
              </div>
            )}

            {step === 'confirmed' && (
              <button
                type="button"
                onClick={handleManualImmediateRedirect}
                className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-xl uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Go to User Dashboard Now <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Notice Note */}
          <div className="flex items-center gap-2.5 p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/25 text-[11px] text-slate-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Send only <strong className="text-emerald-400">USDT on BEP-20 (BSC)</strong>. Tokens are credited instantly with bonus and can be withdrawn or sold anytime on <strong className="text-white">mindchain.info</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
