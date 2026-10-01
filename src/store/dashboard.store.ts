import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  DashboardActivity,
  WalletBalance,
} from '../types/dashboard'

import type { CurrencyCode } from '../constants/currencies'

interface DashboardStore {
  displayName: string

  selectedCurrency: CurrencyCode

  balances: WalletBalance[]

  activities: DashboardActivity[]

  searchQuery: string

  isBalanceVisible: boolean

  isLoading: boolean

  emptyWalletCurrency: CurrencyCode | null

  setSelectedCurrency: (
    currency: CurrencyCode,
  ) => void

  toggleBalanceVisibility: () => void

  setSearchQuery: (
    query: string,
  ) => void

  setEmptyWalletCurrency: (
    currency: CurrencyCode | null,
  ) => void

  startLoading: () => void

  finishLoading: () => void

  getBalance: (
    currency: CurrencyCode,
  ) => WalletBalance | undefined
}

export const useDashboardStore =
  create<DashboardStore>()(
    persist(
      (set, get) => ({
        displayName: 'Clarissa',

        selectedCurrency: 'NGN',

        isBalanceVisible: true,

        isLoading: true,

        searchQuery: '',

        emptyWalletCurrency: null,

        balances: [
          {
            currency: 'NGN',
            balance: 4620500.55,
            ledgerBalance: 4820500.55,
            pendingBalance: 200000,
            monthlyChange: 2.4,
          },

          {
            currency: 'USD',
            balance: 12480.32,
            ledgerBalance: 12480.32,
            pendingBalance: 0,
            monthlyChange: 1.1,
          },

          {
            currency: 'GBP',
            balance: 0,
            ledgerBalance: 0,
            pendingBalance: 0,
            monthlyChange: 0,
          },
        ],

        activities: [
          {
            id: 'activity-1',
            type: 'deposit',
            title: 'Deposit',
            description:
              'GTBank ••4021 · Today · 09:42',
            amount: 750000,
            currency: 'NGN',
            status: 'completed',
            dateLabel: 'Today · 09:42',
            icon: 'deposit',
          },

          {
            id: 'activity-2',
            type: 'service',
            title: 'Pedxo service',
            description:
              'Pedxo Talent — Aug payroll · Today · 08:15',
            amount: 2400,
            currency: 'USD',
            status: 'pending',
            dateLabel: 'Today · 08:15',
            icon: 'transfer',
          },

          {
            id: 'activity-3',
            type: 'transfer',
            title: 'Transfer',
            description:
              'Amara Okoye · Yesterday · 18:03',
            amount: 120000,
            currency: 'NGN',
            status: 'completed',
            dateLabel: 'Yesterday · 18:03',
            icon: 'transfer',
          },

          {
            id: 'activity-4',
            type: 'bill',
            title: 'Bill payment',
            description:
              'Ikeja Electric · Yesterday · 11:20',
            amount: 48500,
            currency: 'NGN',
            status: 'failed',
            dateLabel: 'Yesterday · 11:20',
            icon: 'transfer',
          },

          {
            id: 'activity-5',
            type: 'deposit',
            title: 'Deposit',
            description:
              'GTBank ••4021 · Monday · 14:21',
            amount: 300000,
            currency: 'NGN',
            status: 'completed',
            dateLabel: 'Monday · 14:21',
            icon: 'deposit',
          },

          {
            id: 'activity-6',
            type: 'transfer',
            title: 'Transfer',
            description:
              'Michael Ade · Monday · 10:04',
            amount: 35000,
            currency: 'NGN',
            status: 'completed',
            dateLabel: 'Monday · 10:04',
            icon: 'transfer',
          },
        ],

        setSelectedCurrency: (
          currency,
        ) => {
          set({
            selectedCurrency: currency,
            emptyWalletCurrency: null,
          })
        },

        toggleBalanceVisibility: () => {
          set((state) => ({
            isBalanceVisible:
              !state.isBalanceVisible,
          }))
        },

        setSearchQuery: (
          query,
        ) => {
          set({
            searchQuery: query,
          })
        },

        setEmptyWalletCurrency: (
          currency,
        ) => {
          set({
            emptyWalletCurrency: currency,
          })
        },

        startLoading: () => {
          set({
            isLoading: true,
          })
        },

        finishLoading: () => {
          set({
            isLoading: false,
          })
        },

        getBalance: (
          currency,
        ) => {
          return get().balances.find(
            (item) =>
              item.currency === currency,
          )
        },
      }),

      {
        name: 'pedxo-dashboard-storage',

        partialize: (state) => ({
          selectedCurrency:
            state.selectedCurrency,

          isBalanceVisible:
            state.isBalanceVisible,

          balances: state.balances,
        }),
      },
    ),
  )