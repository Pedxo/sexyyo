import { create } from 'zustand'

import type {
  CurrencyCode,
  WalletBalance,
} from '../types'

interface WalletState {
  balances: WalletBalance[]

  selectedCurrency: CurrencyCode

  setSelectedCurrency: (
    currency: CurrencyCode,
  ) => void

  setBalances: (
    balances: WalletBalance[],
  ) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  selectedCurrency: 'USD',

  balances: [
    {
      currency: 'USD',
      symbol: '$',
      amount: '$12,480.32',
      available: true,
    },
    {
      currency: 'NGN',
      symbol: '₦',
      amount: '₦4,620,500',
      available: true,
    },
    {
      currency: 'USDT',
      symbol: '₮',
      amount: '₮8,450.00',
      available: true,
    },
    {
      currency: 'EUR',
      symbol: '€',
      amount: '€3,120.90',
      available: true,
    },
  ],

  setSelectedCurrency: (currency) => {
    set({
      selectedCurrency: currency,
    })
  },

  setBalances: (balances) => {
    set({
      balances,
    })
  },
}))