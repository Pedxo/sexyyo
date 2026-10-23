import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { LockKeyhole, ArrowLeft, CheckCircle2, AlertCircle, Wallet, ArrowRight } from 'lucide-react'
import Logo from '../../components/ui/Logo'
import DepositModal from '../../components/dashboard/modals/DepositModal'
import { api, type ApiAccount } from '../../services/api'
import { useDashboardStore } from '../../store/dashboard.store'

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const amountParam = parseFloat(searchParams.get('amount') || '120')
  const currencyParam = (searchParams.get('currency') || 'USD').toUpperCase()
  const orderIdParam = searchParams.get('order_id') || `PED-${Date.now().toString().slice(-6)}`
  const returnUrlParam = searchParams.get('return_url') || ''

  const [amount] = useState(isNaN(amountParam) ? 120 : amountParam)
  const [currency] = useState(currencyParam)
  const [orderId] = useState(orderIdParam)

  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingBalance, setFetchingBalance] = useState(true)
  const [wallet, setWallet] = useState<ApiAccount | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null)
  const [showDepositModal, setShowDepositModal] = useState(false)

  const setSelectedCurrency = useDashboardStore((state) => state.setSelectedCurrency)

  useEffect(() => {
    setSelectedCurrency(currency as any)
  }, [currency, setSelectedCurrency])

  const loadBalance = async () => {
    setFetchingBalance(true)
    setError(null)
    try {
      const balances = await api.getBalances()
      const matching = balances.find((b) => b.currency.toUpperCase() === currency.toUpperCase())
      if (matching) {
        setWallet(matching)
      } else {
        setWallet({
          id: 0,
          account_number: 'N/A',
          account_name: 'My Wallet',
          currency,
          symbol: currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$',
          balance: 0,
        })
      }
    } catch (err: any) {
      console.warn('Could not fetch remote balance:', err)
      // Fallback display if not logged into backend yet
      setWallet({
        id: 0,
        account_number: 'N/A',
        account_name: 'My Wallet',
        currency,
        symbol: currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$',
        balance: 0,
      })
    } finally {
      setFetchingBalance(false)
    }
  }

  useEffect(() => {
    loadBalance()
  }, [currency])

  const currentBalance = wallet ? wallet.balance : 0
  const isInsufficient = currentBalance < amount

  const handlePay = async () => {
    setError(null)
    setLoading(true)

    try {
      const res = await api.checkout({
        amount,
        currency,
        order_id: orderId,
        narration: `Marketplace checkout payment for #${orderId}`,
        pin: pin || undefined,
      })

      setSuccessReceipt(res)
      if (wallet) {
        setWallet({
          ...wallet,
          balance: res.new_balance,
        })
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please verify your balance and PIN.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6F3] font-inter-tight text-[#141A15] flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-[#E1E4DE] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <div className="h-4 w-[1px] bg-gray-300" />
            <Logo />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Secured by</span>
            <span className="text-xs font-bold text-pedxo-green">Pedxo Pay</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md">
          {successReceipt ? (
            /* Success Screen */
            <div className="rounded-2xl bg-white p-8 shadow-xl text-center border border-[#E1E4DE]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-5">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="mt-1 text-xs text-gray-500">
                Your payment of {wallet?.symbol || '$'}{amount.toFixed(2)} {currency} has been confirmed.
              </p>

              <div className="my-6 rounded-xl bg-gray-50 p-4 text-left text-xs space-y-2.5 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID</span>
                  <span className="font-semibold text-gray-800">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Ref</span>
                  <span className="font-mono font-semibold text-gray-800">{successReceipt.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Remaining Balance</span>
                  <span className="font-semibold text-emerald-700">
                    {wallet?.symbol || '$'}{successReceipt.new_balance.toFixed(2)} {currency}
                  </span>
                </div>
              </div>

              {returnUrlParam ? (
                <a
                  href={returnUrlParam}
                  className="block w-full rounded-xl bg-pedxo-black py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Return to Marketplace
                </a>
              ) : (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full rounded-xl bg-pedxo-black py-3 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          ) : (
            /* Checkout Box */
            <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl border border-[#E1E4DE]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Order Checkout
                  </p>
                  <h3 className="text-base font-bold text-gray-900">Marketplace Service</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  #{orderId}
                </span>
              </div>

              {/* Order Breakdown */}
              <div className="my-6 space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Service Total</span>
                  <span className="font-bold text-gray-900">
                    {wallet?.symbol || '$'}{amount.toFixed(2)} {currency}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pay From</span>
                  <span className="font-semibold text-gray-800">{currency} Wallet</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Wallet Balance</span>
                  <span className={`font-semibold ${isInsufficient ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {fetchingBalance
                      ? 'Checking balance...'
                      : `${wallet?.symbol || '$'}${currentBalance.toFixed(2)} ${currency}`}
                  </span>
                </div>
              </div>

              {/* Insufficient Funds Alert */}
              {isInsufficient && !fetchingBalance && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-bold">Insufficient Balance</p>
                      <p className="mt-0.5 text-amber-700 leading-relaxed">
                        You need at least {wallet?.symbol || '$'}{amount.toFixed(2)} {currency} to complete this checkout. Please fund your wallet.
                      </p>
                      <button
                        onClick={() => setShowDepositModal(true)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700"
                      >
                        <Wallet size={13} />
                        <span>Fund {currency} Wallet</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
                  {error}
                </div>
              )}

              {/* PIN Confirmation */}
              {!isInsufficient && (
                <div className="mb-6 space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Transaction PIN (if set)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Enter 4 or 6-digit PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono tracking-widest focus:border-black focus:bg-white focus:outline-none transition"
                    />
                    <LockKeyhole size={16} className="absolute right-3.5 top-3 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  disabled={loading || isInsufficient || fetchingBalance}
                  onClick={handlePay}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition ${
                    isInsufficient || loading || fetchingBalance
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-pedxo-black hover:bg-black active:scale-[0.99]'
                  }`}
                >
                  {loading ? (
                    'Processing payment...'
                  ) : (
                    <>
                      <span>Pay {wallet?.symbol || '$'}{amount.toFixed(2)} {currency}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {isInsufficient && (
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    View Bank Deposit Details
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E1E4DE] bg-white px-6 py-4 text-center text-xs text-gray-400">
        © 2026 Pedxo Technologies. All rights reserved.
      </footer>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false)
          loadBalance()
        }}
      />
    </div>
  )
}
