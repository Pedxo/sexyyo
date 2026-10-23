import { useState, useEffect } from 'react'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  Copy,
  Check,
} from 'lucide-react'
import DepositModal from '../../components/dashboard/modals/DepositModal'
import TransferModal from '../../components/dashboard/modals/TransferModal'
import WithdrawModal from '../../components/dashboard/modals/WithdrawModal'
import { api, type ApiAccount } from '../../services/api'
import { useDashboardStore } from '../../store/dashboard.store'

interface WalletCardData {
  currency: string
  name: string
  symbol: string
  flag: string
  isCrypto?: boolean
  accountNumber: string
  bankName: string
  routingOrSort: string
  defaultBalance: number
}

const WALLETS_DATA: WalletCardData[] = [
  {
    currency: 'USD',
    name: 'US Dollar Wallet',
    symbol: '$',
    flag: '🇺🇸',
    accountNumber: '9920184712',
    bankName: 'Lead Bank',
    routingOrSort: 'Routing: 101000187',
    defaultBalance: 12480.32,
  },
  {
    currency: 'NGN',
    name: 'Nigerian Naira Wallet',
    symbol: '₦',
    flag: '🇳🇬',
    accountNumber: '8821049182',
    bankName: 'Providus Bank',
    routingOrSort: 'NUBAN Code: 101',
    defaultBalance: 4620500.55,
  },
  {
    currency: 'GBP',
    name: 'British Pound Wallet',
    symbol: '£',
    flag: '🇬🇧',
    accountNumber: '44819028',
    bankName: 'Barclays Bank UK',
    routingOrSort: 'Sort Code: 20-04-15',
    defaultBalance: 520.0,
  },
  {
    currency: 'EUR',
    name: 'Euro Wallet',
    symbol: '€',
    flag: '🇪🇺',
    accountNumber: 'FR76 3000 4000 1234 5678 901',
    bankName: 'BNP Paribas',
    routingOrSort: 'BIC / SWIFT: BNPAFR2X',
    defaultBalance: 310.0,
  },
  {
    currency: 'USDT',
    name: 'Tether Stablecoin',
    symbol: '₮',
    flag: '🪙',
    isCrypto: true,
    accountNumber: '7xKXtg...9yWz',
    bankName: 'Solana SPL Rail',
    routingOrSort: 'Contract: Es9vMFrz... (USDT)',
    defaultBalance: 8450.0,
  },
  {
    currency: 'USDC',
    name: 'USD Coin Stablecoin',
    symbol: '◎',
    flag: '🪙',
    isCrypto: true,
    accountNumber: 'EPjFWd...YxLp',
    bankName: 'Solana / Ethereum Rail',
    routingOrSort: 'Contract: EPjFWdd5... (USDC)',
    defaultBalance: 1500.0,
  },
]

export default function WalletsPage() {
  const [wallets, setWallets] = useState<ApiAccount[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Modals
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const setSelectedCurrency = useDashboardStore((state) => state.setSelectedCurrency)

  const loadBalances = async () => {
    try {
      const data = await api.getBalances()
      if (Array.isArray(data) && data.length > 0) setWallets(data)
    } catch {}
  }

  useEffect(() => {
    loadBalances()
  }, [])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openDeposit = (cur: string) => {
    setSelectedCurrency(cur as any)
    setShowDepositModal(true)
  }

  const openTransfer = (cur: string) => {
    setSelectedCurrency(cur as any)
    setShowTransferModal(true)
  }

  const openWithdraw = (cur: string) => {
    setSelectedCurrency(cur as any)
    setShowWithdrawModal(true)
  }

  return (
    <div className="dashboard-page min-h-full px-4 py-5 sm:px-6 lg:px-8 lg:py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080C09]">
            My Wallets & Accounts
          </h1>
          <p className="mt-1 text-xs text-[#6E736E]">
            Direct multi-currency custody accounts, virtual bank details, and crypto rails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openDeposit('USD')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1CA045] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#005F21] transition"
          >
            <ArrowDownLeft size={14} />
            <span>Fund Wallet</span>
          </button>
          <button
            onClick={() => openTransfer('USD')}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E6E2] bg-white px-4 py-2 text-xs font-semibold text-[#080C09] hover:bg-[#F5F6F3] transition"
          >
            <ArrowLeftRight size={14} />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Wallets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WALLETS_DATA.map((w) => {
          const remoteAccount = wallets.find((a) => a.currency.toUpperCase() === w.currency.toUpperCase())
          const balance = remoteAccount ? remoteAccount.balance : w.defaultBalance
          const accNum = remoteAccount?.account_number || w.accountNumber

          return (
            <div
              key={w.currency}
              className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 shadow-[0px_8px_24px_-8px_#080C091F] flex flex-col justify-between transition hover:shadow-lg"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{w.flag}</span>
                    <div>
                      <h3 className="text-sm font-bold text-[#080C09]">{w.name}</h3>
                      <p className="text-[11px] text-[#6E736E]">{w.bankName}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#FAFBF9] border border-[#E2E6E2] px-2.5 py-0.5 text-[10px] font-bold text-[#080C09]">
                    {w.currency}
                  </span>
                </div>

                {/* Balance */}
                <div className="mt-5 border-y border-[#F0F2F0] py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8F8A]">
                    Available Balance
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#080C09]">
                    {w.symbol}
                    {balance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                {/* Account Details Box */}
                <div className="mt-4 rounded-xl bg-[#FAFBF9] border border-[#E2E6E2] p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8A8F8A]">
                      {w.isCrypto ? 'Deposit Address' : 'Account Number'}
                    </span>
                    <button
                      onClick={() => handleCopy(w.currency, accNum)}
                      className="flex items-center gap-1 font-mono font-bold text-[#080C09] hover:text-[#1CA045]"
                    >
                      <span className="truncate max-w-[130px]">{accNum}</span>
                      {copiedId === w.currency ? (
                        <Check size={12} className="text-[#1CA045]" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6E736E]">
                    <span>{w.routingOrSort}</span>
                    <span className="font-semibold text-[#1CA045]">Active</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={() => openDeposit(w.currency)}
                  className="rounded-full bg-[#1CA045] py-2 text-center text-xs font-semibold text-white hover:bg-[#005F21] transition"
                >
                  Fund
                </button>
                <button
                  onClick={() => openTransfer(w.currency)}
                  className="rounded-full border border-[#E2E6E2] bg-white py-2 text-center text-xs font-semibold text-[#080C09] hover:bg-[#FAFBF9] transition"
                >
                  Send
                </button>
                <button
                  onClick={() => openWithdraw(w.currency)}
                  className="rounded-full border border-[#E2E6E2] bg-white py-2 text-center text-xs font-semibold text-[#080C09] hover:bg-[#FAFBF9] transition"
                >
                  Withdraw
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false)
          loadBalances()
        }}
      />
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false)
          loadBalances()
        }}
      />
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false)
          loadBalances()
        }}
      />
    </div>
  )
}
