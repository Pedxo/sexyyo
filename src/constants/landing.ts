import type { CurrencyItem, FeatureItem } from '../types/index';
import usdcIcon from '../assets/icons/usdcIcon.svg';

export const currencies: CurrencyItem[] = [
  {
    code: 'NGN',
    symbol: '₦',
  },
  {
    code: 'USD',
    symbol: '$',
  },
  {
    code: 'GBP',
    symbol: '£',
  },
  {
    code: 'EUR',
    symbol: '€',
  },
  {
    code: 'USDT',
    symbol: '₮',
  },
  {
    code: 'USDC',
    icon: usdcIcon,
  },
]

export const balanceFeatures: FeatureItem[] = [
  {
    number: '01',
    label: 'FUND',
    title: 'Money in, your way.',
    description:
      'Add money through bank transfer, card, USDT or USDC. Your available balance stays clear across every wallet.',
  },
  {
    number: '02',
    label: 'MOVE',
    title: 'Send it in seconds.',
    description:
      'Transfer to another Pedxo user instantly, save trusted recipients, and follow every movement from one ledger.',
  },
  {
    number: '03',
    label: 'PAY',
    title: 'Checkout without the card ritual.',
    description:
      'Choose an available wallet at Pedxo checkout, confirm with your PIN, and receive a traceable payment record.',
  },
]