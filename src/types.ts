export interface UserAccount {
  address: string;
  pin?: string;
  balanceMIND: number;
  totalDepositedUSD: number;
  referralsCount: number;
  referralEarningsUSD: number;
  referralCode: string;
  joinedDate: string;
}

export type TransactionType = 'buy' | 'referral' | 'staking_reward' | 'withdraw';
export type TransactionStatus = 'completed' | 'pending' | 'processing';

export interface Transaction {
  id: string;
  type: TransactionType;
  amountMIND: number;
  amountUSD: number;
  txHash: string;
  timestamp: string;
  status: TransactionStatus;
  note?: string;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmountUSD: number;
  description?: string;
}

export interface PaymentInvoice {
  invoiceId: string;
  usdAmount: number; // Final payable amount (e.g. $97)
  originalUsdAmount: number; // Original buy value (e.g. $100)
  coupon?: AppliedCoupon | null;
  mindAmount: number;
  bonusPercent: number;
  bonusMind: number;
  totalMind: number;
  depositAddress: string;
  network: string;
  token: string;
  status: 'awaiting_deposit' | 'confirming' | 'confirmed';
  confirmations: number;
  requiredConfirmations: number;
  createdAt: number;
  expiresAt: number;
}

export interface EcosystemItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  stats: string;
  badge: string;
  status: 'Live' | 'Mainnet' | 'Beta' | 'Q3 2026';
}
