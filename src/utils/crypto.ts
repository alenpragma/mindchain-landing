import { Transaction, UserAccount, AppliedCoupon, ReferralRecord } from '../types';

export const MIND_PRICE_USD = 0.41;
export const DEFAULT_DEPOSIT_ADDRESS = '0x8f3c7A91b61E2eB254FeB2dF31086C98A2cE748B';
export const DEMO_USER_ADDRESS = '0x71C4B82390a42617C6418E66271c6f140689Af3d';

export interface CouponConfig {
  code: string;
  discountPercent: number;
  description: string;
}

export const ACTIVE_COUPONS: Record<string, CouponConfig> = {
  MIND3: {
    code: 'MIND3',
    discountPercent: 3,
    description: '3% Special Community Discount',
  },
  SAVE3: {
    code: 'SAVE3',
    discountPercent: 3,
    description: '3% Instant Presale Discount',
  },
  WELCOME3: {
    code: 'WELCOME3',
    discountPercent: 3,
    description: '3% Early Adopter Welcome Discount',
  },
  CRYPTO3: {
    code: 'CRYPTO3',
    discountPercent: 3,
    description: '3% Web3 Community Discount',
  },
  MIND5: {
    code: 'MIND5',
    discountPercent: 5,
    description: '5% VIP Exclusive Discount',
  },
};

export function validateCoupon(code: string, buyUsdAmount: number): AppliedCoupon | null {
  if (!code || typeof code !== 'string') return null;
  const normalized = code.trim().toUpperCase();
  const found = ACTIVE_COUPONS[normalized];
  if (!found) return null;

  const safeUsd = Math.max(0, buyUsdAmount);
  const discountAmountUSD = Number(((safeUsd * found.discountPercent) / 100).toFixed(2));

  return {
    code: found.code,
    discountPercent: found.discountPercent,
    discountAmountUSD,
    description: found.description,
  };
}

export function truncateAddress(address: string, startLen = 6, endLen = 4): string {
  if (!address || address.length <= startLen + endLen) return address || '';
  return `${address.substring(0, startLen)}...${address.substring(address.length - endLen)}`;
}

export function isValidEVMAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export function generateRandomEVMAddress(): string {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return addr;
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

export function calculateMindAmount(usdAmount: number): {
  baseMind: number;
  bonusPercent: number;
  bonusMind: number;
  totalMind: number;
} {
  const safeUsd = isNaN(usdAmount) || usdAmount < 0 ? 0 : usdAmount;
  const baseMind = safeUsd / MIND_PRICE_USD;

  let bonusPercent = 0;
  if (safeUsd >= 5000) {
    bonusPercent = 15;
  } else if (safeUsd >= 1000) {
    bonusPercent = 10;
  } else if (safeUsd >= 500) {
    bonusPercent = 5;
  }

  const bonusMind = (baseMind * bonusPercent) / 100;
  const totalMind = baseMind + bonusMind;

  return {
    baseMind: Number(baseMind.toFixed(2)),
    bonusPercent,
    bonusMind: Number(bonusMind.toFixed(2)),
    totalMind: Number(totalMind.toFixed(2)),
  };
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(amount: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    orderId: 'MND-ORD-984210',
    type: 'buy',
    amountMIND: 2439.02,
    amountUSD: 1000.0,
    txHash: '0x3e18a9fc819d45e998144bbd982390a42617c6418e66271c6f140689af3d11b2',
    timestamp: '10 mins ago',
    status: 'completed',
    note: 'Presale Stage 1 (USDT BEP20 - MIND3 Applied)',
  },
  {
    id: 'tx-2',
    orderId: 'MND-ORD-871402',
    type: 'buy',
    amountMIND: 1219.51,
    amountUSD: 500.0,
    txHash: '0x99a415b3c4f74d01b6e8284561726a457e5d848bc981297e68bc56b3ca12ff89',
    timestamp: '2 hours ago',
    status: 'completed',
    note: 'Presale Stage 1 (USDT BEP20)',
  },
  {
    id: 'tx-3',
    orderId: 'MND-REF-716493',
    type: 'referral',
    amountMIND: 182.92,
    amountUSD: 75.0,
    txHash: '0x629abef1983419bbcd0811e9a385f7c39029a7384be89190ab747120aefbc021',
    timestamp: '1 day ago',
    status: 'completed',
    note: '15% Referral Bonus in MIND from 0x4B2...901E',
  },
  {
    id: 'tx-4',
    orderId: 'MND-REF-652190',
    type: 'referral',
    amountMIND: 365.85,
    amountUSD: 150.0,
    txHash: '0x8f20a91e5c2b0174e9271648a0918c5e91827401928046182903847192804618',
    timestamp: '2 days ago',
    status: 'completed',
    note: '15% Referral Bonus in MIND from 0x9A3...4F12',
  },
  {
    id: 'tx-5',
    orderId: 'MND-WTH-551029',
    type: 'withdraw',
    amountMIND: 500.0,
    amountUSD: 205.0,
    txHash: '0x447192837bc901a827461937402618490a6f830182649b819280461829038471',
    timestamp: '3 days ago',
    status: 'completed',
    note: 'Withdrawal to EVM External Wallet',
  },
  {
    id: 'tx-6',
    orderId: 'MND-ORD-420914',
    type: 'buy',
    amountMIND: 609.75,
    amountUSD: 250.0,
    txHash: '0x12a839cf94e019385b2716401947285901827361928475910283746192837461',
    timestamp: '5 days ago',
    status: 'completed',
    note: 'Presale Stage 1 (USDT BEP20)',
  },
  {
    id: 'tx-7',
    orderId: 'MND-REF-319044',
    type: 'referral',
    amountMIND: 48.78,
    amountUSD: 20.0,
    txHash: '0x77c9284102948571029384756102938475610293847561029384756102938475',
    timestamp: '1 week ago',
    status: 'completed',
    note: '15% Referral Bonus in MIND from 0x3E8...11BC',
  },
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-1',
    orderId: 'REF-ORD-98210',
    referredUserAddress: '0x4B2C98192A091E2847561029384756102938901E',
    referredUserName: 'Farhan Ahmed',
    joinedDate: 'Aug 30, 2026',
    depositUSD: 500,
    bonusEarnedMIND: 182.93, // 15% of $500 = $75 / 0.41 = 182.93 MIND
    status: 'Completed',
  },
  {
    id: 'ref-2',
    orderId: 'REF-ORD-97451',
    referredUserAddress: '0x9A3B5F1283746192847591028374619284F12984',
    referredUserName: 'Shakil Mahmud',
    joinedDate: 'Aug 29, 2026',
    depositUSD: 1000,
    bonusEarnedMIND: 365.85, // 15% of $1000 = $150 / 0.41 = 365.85 MIND
    status: 'Completed',
  },
  {
    id: 'ref-3',
    orderId: 'REF-ORD-96102',
    referredUserAddress: '0x3E811BC2837461029384756102938475611BC490',
    referredUserName: 'Tariqul Islam',
    joinedDate: 'Aug 28, 2026',
    depositUSD: 250,
    bonusEarnedMIND: 91.46,
    status: 'Completed',
  },
  {
    id: 'ref-4',
    orderId: 'REF-ORD-94281',
    referredUserAddress: '0x88F1029384756102938475610293847561029384',
    referredUserName: 'Nazmul Hassan',
    joinedDate: 'Aug 25, 2026',
    depositUSD: 100,
    bonusEarnedMIND: 36.59,
    status: 'Completed',
  },
  {
    id: 'ref-5',
    orderId: 'REF-ORD-92109',
    referredUserAddress: '0x1C49028374619284756102938475610293847561',
    referredUserName: 'Tanvir Hossain',
    joinedDate: 'Aug 22, 2026',
    depositUSD: 500,
    bonusEarnedMIND: 182.93,
    status: 'Completed',
  },
  {
    id: 'ref-6',
    orderId: 'REF-ORD-90812',
    referredUserAddress: '0x5D29384756102938475610293847561029384756',
    referredUserName: 'Mahmudul Hasan',
    joinedDate: 'Aug 19, 2026',
    depositUSD: 200,
    bonusEarnedMIND: 73.17,
    status: 'Completed',
  },
  {
    id: 'ref-7',
    orderId: 'REF-ORD-88710',
    referredUserAddress: '0x7E10293847561029384756102938475610293847',
    referredUserName: 'Imran Khan',
    joinedDate: 'Aug 15, 2026',
    depositUSD: 1500,
    bonusEarnedMIND: 548.78,
    status: 'Completed',
  },
  {
    id: 'ref-8',
    orderId: 'REF-ORD-86501',
    referredUserAddress: '0x2A93847561029384756102938475610293847561',
    referredUserName: 'Rashed Chowdhury',
    joinedDate: 'Aug 10, 2026',
    depositUSD: 300,
    bonusEarnedMIND: 109.76,
    status: 'Completed',
  },
];

export const INITIAL_USER: UserAccount = {
  address: DEMO_USER_ADDRESS,
  pin: '1234',
  name: 'Arif Hossain',
  email: 'helloedulife@gmail.com',
  physicalAddress: 'Gulshan-2, Dhaka 1212, Bangladesh',
  phone: '+880 1712-345678',
  balanceMIND: 5432.80,
  totalDepositedUSD: 1750.0,
  referralsCount: 8,
  referralEarningsMIND: 1591.47, // 15% Bonus in MIND Coins
  referralEarningsUSD: 652.50,
  referralCode: 'MIND-71C4B',
  joinedDate: 'August 2026',
};
