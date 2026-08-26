import { Transaction, UserAccount } from '../types';

export const MIND_PRICE_USD = 0.41;
export const DEFAULT_DEPOSIT_ADDRESS = '0x8f3c7A91b61E2eB254FeB2dF31086C98A2cE748B';
export const DEMO_USER_ADDRESS = '0x71C4B82390a42617C6418E66271c6f140689Af3d';

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
    type: 'buy',
    amountMIND: 2439.02,
    amountUSD: 1000.0,
    txHash: '0x3e18a9fc819d45e998144bbd982390a42617c6418e66271c6f140689af3d11b2',
    timestamp: '10 mins ago',
    status: 'completed',
    note: 'Presale Stage 1 (USDT BEP20)',
  },
  {
    id: 'tx-2',
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
    type: 'referral',
    amountMIND: 182.92,
    amountUSD: 75.0,
    txHash: '0x629abef1983419bbcd0811e9a385f7c39029a7384be89190ab747120aefbc021',
    timestamp: '1 day ago',
    status: 'completed',
    note: 'Tier-1 Referral Bonus from 0x4B2...901E',
  },
  {
    id: 'tx-4',
    type: 'staking_reward',
    amountMIND: 54.8,
    amountUSD: 22.46,
    txHash: '0x447192837bc901a827461937402618490a6f830182649b819280461829038471',
    timestamp: '2 days ago',
    status: 'completed',
    note: 'MindStake Vault APY Yield',
  },
];

export const INITIAL_USER: UserAccount = {
  address: DEMO_USER_ADDRESS,
  pin: '1234',
  balanceMIND: 3896.25,
  totalDepositedUSD: 1575.0,
  referralsCount: 6,
  referralEarningsUSD: 245.0,
  referralCode: 'MIND-71C4B',
  joinedDate: 'August 2026',
};
