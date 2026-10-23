import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router'
import {
  CheckCircle2,
  AlertCircle,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Printer,
  Lock,
  Fingerprint,
} from 'lucide-react'
import Logo from '../../components/ui/Logo'
import DepositModal from '../../components/dashboard/modals/DepositModal'
import WithdrawModal from '../../components/dashboard/modals/WithdrawModal'
import { api, type ApiAccount } from '../../services/api'

interface CurrencyOption {
  code: string
  name: string
  flag: string
  symbol: string
  rateToUsd: number
  isCrypto?: boolean
  disabled?: boolean
  statusBadge?: string
  fallbackBalance: number
}

const CURRENCIES: CurrencyOption[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    flag: '🇳🇬',
    symbol: '₦',
    rateToUsd: 1486.2,
    statusBadge: 'FX applies',
    fallbackBalance: 4620500.55,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    flag: '🇺🇸',
    symbol: '$',
    rateToUsd: 1.0,
    statusBadge: 'Recommended',
    fallbackBalance: 12480.32,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    flag: '🇬🇧',
    symbol: '£',
    rateToUsd: 0.7874,
    statusBadge: 'FX applies',
    fallbackBalance: 0.0,
  },
  {
    code: 'EUR',
    name: 'Euro',
    flag: '🇪🇺',
    symbol: '€',
    rateToUsd: 0.9255,
    disabled: true,
    statusBadge: 'Wallet temporarily unavailable — compliance hold',
    fallbackBalance: 0.0,
  },
  {
    code: 'USDT',
    name: 'Tether',
    flag: '🪙',
    symbol: '₮',
    rateToUsd: 1.0,
    isCrypto: true,
    statusBadge: 'FX applies',
    fallbackBalance: 8450.0,
  },
  {
    code: 'USDC',
    name: 'USD Coin',
    flag: '🪙',
    symbol: '◎',
    rateToUsd: 1.0,
    isCrypto: true,
    statusBadge: 'FX applies',
    fallbackBalance: 1500.0,
  },
]

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Base Order Parameters (Figma default is $1,064.25 total due: Subtotal $1,100, Discount -$110, VAT $74.25)
  const amountParam = parseFloat(searchParams.get('amount') || '1064.25')
  const orderIdParam = searchParams.get('order_id') || 'PDX-ORD-58217'
  const invoiceParam = searchParams.get('invoice') || 'INV-2026-0842'
  const serviceParam = searchParams.get('service') || 'Pedxo Talent Cloud'
  const returnUrlParam = searchParams.get('return_url') || ''

  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('USD')
  const [activeView, setActiveView] = useState<'AUTHORIZE' | 'CURRENCY_SELECTOR' | 'RECEIPT'>('AUTHORIZE')
  
  // PIN handling (6 digits)
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', ''])
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<ApiAccount[]>([])
  const [fetchingBalance, setFetchingBalance] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null)
  const [pinAttemptsLeft, setPinAttemptsLeft] = useState<number | null>(null)

  // Modals
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const selectedCurrency = CURRENCIES.find((c) => c.code === selectedCurrencyCode) || CURRENCIES[1]

  // Calculate order breakdown based on selected currency
  // Base USD: Subtotal $1,100, Discount $110, VAT $74.25, Total $1,064.25
  const baseUsdSubtotal = 1100.0
  const baseUsdDiscount = 110.0
  const baseUsdVat = 74.25
  const baseUsdTotal = amountParam || 1064.25

  const fxRate = selectedCurrency.rateToUsd
  const orderSubtotal = baseUsdSubtotal * fxRate
  const orderDiscount = baseUsdDiscount * fxRate
  const orderVat = baseUsdVat * fxRate
  const orderTotalDue = baseUsdTotal * fxRate

  // Live balance from backend or Figma default
  const activeAccount = wallets.find((w) => w.currency.toUpperCase() === selectedCurrencyCode.toUpperCase())
  const availableBalance = activeAccount ? activeAccount.balance : selectedCurrency.fallbackBalance
  const balanceRemaining = availableBalance - orderTotalDue
  const isInsufficient = balanceRemaining < 0

  const loadWallets = async () => {
    setFetchingBalance(true)
    try {
      const data = await api.getBalances()
      if (Array.isArray(data) && data.length > 0) {
        setWallets(data)
      }
    } catch (err) {
      console.warn('Could not load remote wallets, using default balances:', err)
    } finally {
      setFetchingBalance(false)
    }
  }

  useEffect(() => {
    loadWallets()
  }, [])

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...pinDigits]
    newDigits[index] = value.slice(-1)
    setPinDigits(newDigits)
    setError(null)

    // Auto-advance
    if (value && index < 5) {
      pinInputRefs.current[index + 1]?.focus()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus()
    }
  }

  const fullPin = pinDigits.join('')

  const handleAuthorizePayment = async () => {
    setError(null)
    setLoading(true)

    try {
      // If currency is crypto (USDT/USDC), settle against USD pool in backend
      const settlementCurrency = selectedCurrency.isCrypto ? 'USD' : selectedCurrencyCode
      const settlementAmount = selectedCurrency.isCrypto ? baseUsdTotal : orderTotalDue

      const res = await api.checkout({
        amount: settlementAmount,
        currency: settlementCurrency,
        order_id: orderIdParam,
        narration: `Payment for ${serviceParam} · ${invoiceParam}`,
        pin: fullPin || undefined,
      })

      setSuccessReceipt({
        ...res,
        invoice: invoiceParam,
        service: serviceParam,
        date: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      setActiveView('RECEIPT')
      loadWallets()
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('pin')) {
        setPinAttemptsLeft((prev) => (prev === null ? 2 : Math.max(0, prev - 1)))
        setError("That PIN doesn't match the one on this account.")
      } else {
        setError(err.message || 'Payment failed. Please verify your balance and credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6F3] font-inter-tight text-[#141A15] flex flex-col justify-between">
      {/* 1. Global Navigation Bar matching Figma Top Bar */}
      <header className="border-b border-[#E1E4DE] bg-white px-4 md:px-8 py-3.5 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium text-[#6E736E]">
              <Link to="/dashboard" className="hover:text-[#080C09] transition">
                Dashboard
              </Link>
              <Link to="/dashboard/transactions" className="hover:text-[#080C09] transition">
                Transactions
              </Link>
              <Link to="/dashboard/wallets" className="hover:text-[#080C09] transition">
                Wallets
              </Link>
              <Link to="/dashboard/payouts" className="hover:text-[#080C09] transition">
                Payouts
              </Link>
              <Link to="/dashboard/settings" className="hover:text-[#080C09] transition">
                Settings
              </Link>
            </nav>
          </div>

          <div className="hidden lg:block text-xs text-[#8A8F8A] max-w-sm truncate text-center">
            Fund once. Pay for everything Pedxo from a single multi-currency balance.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDepositModal(true)}
              className="hidden sm:inline-flex items-center rounded-full bg-[#1CA045] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#005F21] transition"
            >
              Add money
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="hidden sm:inline-flex items-center rounded-full border border-[#E2E6E2] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#080C09] hover:bg-[#F5F6F3] transition"
            >
              Withdraw
            </button>

            {/* User Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#141A15] text-[11px] font-bold text-white shadow-sm">
              CA
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Page Container */}
      <main className="flex-1 px-4 py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-5xl">
          {/* Header Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1CA045]">
              <ShieldCheck size={16} />
              <span>Pedxo checkout</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-[#080C09]">
              Pay for Pedxo goods & services
            </h1>
            <p className="mt-1 text-xs md:text-sm text-[#6E736E] max-w-2xl leading-relaxed">
              Settle any Pedxo order straight from your wallet balance — one currency, one PIN, instant fulfilment.
            </p>
          </div>

          {/* 3. Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Payment Authorisation / Currency Switcher / Receipt */}
            <div className="lg:col-span-7 space-y-6">
              {activeView === 'RECEIPT' && successReceipt ? (
                /* Mode C: Receipt */
                <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7ED] text-[#1CA045] mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h2 className="text-center text-xl md:text-2xl font-bold text-[#080C09]">
                    Payment Complete & Settled
                  </h2>
                  <p className="mt-1 text-center text-xs text-[#6E736E]">
                    Your payment to {serviceParam} has been verified and settled instantly.
                  </p>

                  <div className="my-6 divide-y divide-[#F0F2F0] rounded-2xl border border-[#E2E6E2] bg-[#FAFBF9] p-4 text-xs space-y-2.5">
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8F8A]">Order ID</span>
                      <span className="font-semibold text-[#080C09]">{orderIdParam}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8F8A]">Invoice</span>
                      <span className="font-semibold text-[#080C09]">{invoiceParam}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8F8A]">Service</span>
                      <span className="font-semibold text-[#080C09]">{serviceParam}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8F8A]">Amount Paid</span>
                      <span className="font-bold text-[#080C09]">
                        {selectedCurrency.symbol}
                        {orderTotalDue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        {selectedCurrencyCode}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8F8A]">Payment Reference</span>
                      <span className="font-mono text-[11px] font-semibold text-[#080C09]">
                        {successReceipt.reference}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8A8F8A]">Remaining Balance</span>
                      <span className="font-semibold text-[#1CA045]">
                        {selectedCurrency.symbol}
                        {successReceipt.new_balance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        {selectedCurrencyCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E6E2] bg-white py-3 text-xs font-semibold text-[#080C09] hover:bg-[#F5F6F3] transition"
                    >
                      <Printer size={15} />
                      <span>Print receipt</span>
                    </button>
                    {returnUrlParam ? (
                      <a
                        href={returnUrlParam}
                        className="flex-1 inline-flex items-center justify-center rounded-full bg-[#080C09] py-3 text-xs font-semibold text-white hover:bg-black transition"
                      >
                        Return to marketplace
                      </a>
                    ) : (
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 inline-flex items-center justify-center rounded-full bg-[#080C09] py-3 text-xs font-semibold text-white hover:bg-black transition"
                      >
                        Go to dashboard
                      </button>
                    )}
                  </div>
                </div>
              ) : activeView === 'CURRENCY_SELECTOR' ? (
                /* Mode B: Currency Switcher matching Figma 68:3460 */
                <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F]">
                  <div className="flex items-center justify-between border-b border-[#F0F2F0] pb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#080C09]">
                        Select the wallet currency to pay from
                      </h3>
                      <p className="mt-1 text-xs text-[#6E736E] max-w-lg">
                        Pedxo Pay debits a single currency per payment. Balances that need conversion are quoted at the live rate; multi-currency draw arrives in a later phase.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveView('AUTHORIZE')}
                      className="rounded-full border border-[#E2E6E2] px-3 py-1 text-xs font-medium text-[#6E736E] hover:text-[#080C09]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {CURRENCIES.map((currency) => {
                      const isSelected = currency.code === selectedCurrencyCode
                      const walletAcc = wallets.find((w) => w.currency.toUpperCase() === currency.code.toUpperCase())
                      const bal = walletAcc ? walletAcc.balance : currency.fallbackBalance
                      const convDue = baseUsdTotal * currency.rateToUsd
                      const isShort = bal < convDue
                      const remaining = bal - convDue

                      return (
                        <div
                          key={currency.code}
                          onClick={() => {
                            if (!currency.disabled) {
                              setSelectedCurrencyCode(currency.code)
                              setActiveView('AUTHORIZE')
                            }
                          }}
                          className={`rounded-2xl border p-4 transition cursor-pointer ${
                            currency.disabled
                              ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                              : isSelected
                              ? 'border-[#1CA045] bg-[#F7FCF8] shadow-sm ring-1 ring-[#1CA045]'
                              : 'border-[#E2E6E2] bg-white hover:border-[#1CA045]/50 hover:bg-[#FAFBF9]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{currency.flag}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-[#080C09]">{currency.code}</span>
                                  {currency.statusBadge && (
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        currency.statusBadge === 'Recommended'
                                          ? 'bg-[#E8F7ED] text-[#1CA045]'
                                          : currency.disabled
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      {currency.statusBadge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#6E736E] mt-0.5">
                                  {currency.symbol}
                                  {bal.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{' '}
                                  available · {currency.name}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-bold text-sm text-[#080C09]">
                                {currency.symbol}
                                {convDue.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                              <p
                                className={`text-[11px] font-medium mt-0.5 ${
                                  isShort ? 'text-rose-600' : 'text-[#1CA045]'
                                }`}
                              >
                                {isShort
                                  ? `Short ${currency.symbol}${Math.abs(remaining).toFixed(2)}`
                                  : `${currency.symbol}${remaining.toFixed(2)} left`}
                              </p>
                            </div>
                          </div>

                          {currency.rateToUsd !== 1.0 && !currency.disabled && (
                            <div className="mt-2 text-[10px] text-[#8A8F8A] border-t border-[#F0F2F0] pt-2">
                              Rate: 1 USD = {currency.rateToUsd} {currency.code}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* Mode A: Authorise Payment matching Figma 68:3260 / 68:4023 / 68:4222 */
                <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F]">
                  <div className="border-b border-[#F0F2F0] pb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6E736E]">
                      Authorise payment
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#080C09]">
                        {selectedCurrency.symbol}
                        {orderTotalDue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-sm font-semibold text-[#6E736E]">
                        {selectedCurrencyCode}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6E736E]">
                      to {serviceParam} · {invoiceParam}
                    </p>

                    {/* Badges */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAFBF9] border border-[#E2E6E2] px-3 py-1 text-xs font-medium text-[#080C09]">
                        <span>{selectedCurrency.flag}</span>
                        <span>{selectedCurrency.code} wallet</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F7ED] border border-[#B2E3C0] px-3 py-1 text-xs font-semibold text-[#1CA045]">
                        <Fingerprint size={13} />
                        <span>Biometrics available</span>
                      </span>
                    </div>
                  </div>

                  {/* Insufficient Funds Callout if balance too low */}
                  {isInsufficient && (
                    <div className="my-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-bold">Insufficient {selectedCurrencyCode} Balance</p>
                          <p className="mt-0.5 text-amber-700 leading-relaxed">
                            You need {selectedCurrency.symbol}{Math.abs(balanceRemaining).toFixed(2)} more to complete this payment.
                          </p>
                          <button
                            onClick={() => setShowDepositModal(true)}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1CA045] px-4 py-2 text-xs font-semibold text-white hover:bg-[#005F21] transition"
                          >
                            <Wallet size={14} />
                            <span>Fund {selectedCurrencyCode} wallet now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error / Wrong PIN Banner from Figma 68:4222 */}
                  {error && (
                    <div className="my-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle size={17} className="shrink-0 text-rose-600 mt-0.5" />
                        <div>
                          <p className="font-bold">{error}</p>
                          {pinAttemptsLeft !== null && (
                            <p className="mt-0.5 text-rose-600 font-medium">
                              {pinAttemptsLeft} attempts left before your wallet locks.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6-Digit PIN Entry */}
                  {!isInsufficient && (
                    <div className="my-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#080C09] flex items-center gap-1.5">
                          <Lock size={13} />
                          <span>Enter 6-digit transaction PIN</span>
                        </label>
                        <span className="text-[11px] text-[#8A8F8A]">
                          Secured with end-to-end encryption
                        </span>
                      </div>

                      <div className="flex justify-between gap-2 max-w-sm">
                        {pinDigits.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => {
                              pinInputRefs.current[i] = el
                            }}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handlePinChange(i, e.target.value)}
                            onKeyDown={(e) => handlePinKeyDown(i, e)}
                            className="h-12 w-12 rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] text-center text-lg font-bold text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white focus:ring-2 focus:ring-[#1CA045]/20"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      disabled={loading || isInsufficient || fetchingBalance}
                      onClick={handleAuthorizePayment}
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white transition ${
                        isInsufficient || loading || fetchingBalance
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-[#080C09] hover:bg-black active:scale-[0.99] shadow-md'
                      }`}
                    >
                      {loading ? (
                        'Authorising payment...'
                      ) : (
                        <>
                          <span>
                            Pay {selectedCurrency.symbol}
                            {orderTotalDue.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-[#6E736E] hover:text-[#080C09] transition"
                      >
                        Forgot PIN?
                      </Link>
                      <button
                        onClick={() => navigate(-1)}
                        className="font-medium text-[#8A8F8A] hover:text-[#080C09] transition"
                      >
                        Cancel payment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Order Breakdown + Security Notice */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Summary & Amount Due Card */}
              <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F]">
                <div className="flex items-center justify-between border-b border-[#F0F2F0] pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#6E736E]">
                    Amount due
                  </h3>
                  <span className="rounded-full bg-[#FAFBF9] border border-[#E2E6E2] px-2.5 py-0.5 text-xs font-semibold text-[#080C09]">
                    {selectedCurrencyCode}
                  </span>
                </div>

                <div className="my-5 divide-y divide-[#F0F2F0] text-xs space-y-3">
                  <div className="flex justify-between pt-1">
                    <span className="text-[#6E736E]">Subtotal</span>
                    <span className="font-semibold text-[#080C09]">
                      {selectedCurrency.symbol}
                      {orderSubtotal.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-[#6E736E]">Discount · PEDXO10</span>
                    <span className="font-semibold text-[#1CA045]">
                      − {selectedCurrency.symbol}
                      {orderDiscount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-[#6E736E]">VAT (7.5%)</span>
                    <span className="font-semibold text-[#080C09]">
                      {selectedCurrency.symbol}
                      {orderVat.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 text-sm font-bold text-[#080C09]">
                    <span>Total due</span>
                    <span>
                      {selectedCurrency.symbol}
                      {orderTotalDue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Pedxo Wallet Selector Box */}
                <div className="rounded-2xl border border-[#E2E6E2] bg-[#FAFBF9] p-4">
                  <p className="text-[11px] font-semibold text-[#8A8F8A] uppercase tracking-wider">
                    Pedxo Wallet
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedCurrency.flag}</span>
                      <div>
                        <p className="text-xs font-bold text-[#080C09]">
                          {selectedCurrency.code} · {selectedCurrency.symbol}
                          {availableBalance.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          available
                        </p>
                        <p className="text-[10px] text-[#6E736E]">
                          {selectedCurrency.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('CURRENCY_SELECTOR')}
                      className="rounded-full border border-[#E2E6E2] bg-white px-3 py-1 text-xs font-semibold text-[#1CA045] hover:bg-[#E8F7ED] transition"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* How this payment is secured Card (Figma 5 bullets) */}
              <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 shadow-[0px_8px_24px_-8px_#080C091F]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#080C09] flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#1CA045]" />
                  <span>How this payment is secured</span>
                </h4>

                <ul className="mt-4 space-y-3 text-xs text-[#6E736E] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1CA045] shrink-0" />
                    <span>Balance is checked and reserved before authorisation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1CA045] shrink-0" />
                    <span>Every debit needs your 6-digit transaction PIN or biometrics.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1CA045] shrink-0" />
                    <span>Duplicate invoice payments are blocked automatically.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1CA045] shrink-0" />
                    <span>Pedxo is notified the instant funds clear, so fulfilment starts immediately.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1CA045] shrink-0" />
                    <span>A receipt is generated for every completed payment.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Global Footer */}
      <footer className="border-t border-[#E1E4DE] bg-white px-4 md:px-8 py-5 text-center text-xs text-[#8A8F8A]">
        © 2026 Pedxo Technologies Limited. All rights reserved. Pedxo Pay is licensed and regulated.
      </footer>

      {/* Deposit & Withdraw Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false)
          loadWallets()
        }}
      />
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false)
          loadWallets()
        }}
      />
    </div>
  )
}
