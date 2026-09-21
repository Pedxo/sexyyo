export type CurrencyCode =
  | 'NGN'
  | 'USD'
  | 'GBP'
  | 'EUR'
  | 'USDT'
  | 'USDC'

export interface WalletBalance {
  currency: CurrencyCode
  symbol: string
  amount: string
  available: boolean
}

export interface CurrencyItem {
  code: CurrencyCode
  symbol?: string
  icon?: string
}

export interface FeatureItem {
  number: string
  label: string
  title: string
  description: string
}