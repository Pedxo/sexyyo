import type { CurrencyCode } from '../constants/currencies'

export type DashboardNavItem =
  | 'Dashboard'
  | 'Wallets'
  | 'Transactions'
  | 'Payouts'
  | 'Settings'

export type ActivityStatus =
  | 'completed'
  | 'pending'
  | 'failed'

export interface WalletBalance {
  currency: CurrencyCode
  balance: number
  ledgerBalance: number
  pendingBalance: number
  monthlyChange: number
}

export interface DashboardActivity {
  id: string
  type:
    | 'deposit'
    | 'transfer'
    | 'service'
    | 'bill'
  title: string
  description: string
  amount: number
  currency: CurrencyCode
  status: ActivityStatus
  dateLabel: string
  icon:
    | 'deposit'
    | 'transfer'
}

export interface QuickAction {
  id:
    | 'deposit'
    | 'transfer'
    | 'bills'
    | 'withdraw'

  title: string
  description: string
  icon:
    | 'deposit'
    | 'transfer'
    | 'bills'
    | 'withdraw'
}