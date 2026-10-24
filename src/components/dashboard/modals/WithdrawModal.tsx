import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  X,
  Building2,
  Coins,
  Clock,
  ChevronDown,
} from 'lucide-react'
import { api, type ApiAccount } from '../../../services/api'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const BANKS_BY_CURRENCY: Record<string, string[]> = {
  NGN: [
    'Providus Bank',
    'Guaranty Trust Bank (GTBank)',
    'Zenith Bank',
    'Access Bank',
    'First Bank of Nigeria',
    'Kuda Bank',
  ],
  USD: [
    'Lead Bank (ACH / Fedwire)',
    'JPMorgan Chase',
    'Bank of America',
    'Wells Fargo',
    'Citibank',
  ],
  GBP: [
    'Barclays Bank (Faster Payments)',
    'HSBC UK',
    'NatWest',
    'Revolut UK',
    'Monzo Bank',
  ],
  EUR: [
    'BNP Paribas (SEPA)',
    'Deutsche Bank',
    'Santander',
    'N26',
    'Société Générale',
  ],
}

const CRYPTO_NETWORKS = [
  { id: 'solana', name: 'Solana (SPL)', fee: '0.0005 SOL (~$0.08)', time: '~5 seconds' },
  { id: 'ethereum', name: 'Ethereum (ERC-20)', fee: '0.0012 ETH (~$3.50)', time: '~2 minutes' },
  { id: 'polygon', name: 'Polygon (PoS)', fee: '0.01 POL (~$0.01)', time: '~15 seconds' },
]

export default function WithdrawModal({ isOpen, onClose, onSuccess }: WithdrawModalProps) {
  const [method, setMethod] = useState<'bank' | 'crypto'>('bank')
  const [currency, setCurrency] = useState('USD')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [cryptoNetwork, setCryptoNetwork] = useState('solana')
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [amount, setAmount] = useState('')

  const [step, setStep] = useState<'FORM' | 'PIN' | 'SUCCESS'>('FORM')
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', ''])
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<any | null>(null)
  const [wallets, setWallets] = useState<ApiAccount[]>([])

  useEffect(() => {
    if (isOpen) {
      api.getBalances()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setWallets(data)
        })
        .catch(() => {})
    }
  }, [isOpen])

  useEffect(() => {
    if (method === 'crypto') {
      if (currency !== 'USDT' && currency !== 'USDC') {
        setCurrency('USDT')
      }
    } else {
      if (currency === 'USDT' || currency === 'USDC') {
        setCurrency('USD')
      }
      const banks = BANKS_BY_CURRENCY[currency] || BANKS_BY_CURRENCY.USD
      setBankName(banks[0])
    }
  }, [method, currency])

  if (!isOpen) return null

  const activeAccount = wallets.find((w) => w.currency.toUpperCase() === currency.toUpperCase())
  const availableBalance = activeAccount ? activeAccount.balance : (currency === 'NGN' ? 4620500.55 : 12480.32)

  const handlePercentageClick = (pct: number) => {
    setAmount((availableBalance * pct).toFixed(2))
  }

  const handlePinChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const newDigits = [...pinDigits]
    newDigits[index] = val.slice(-1)
    setPinDigits(newDigits)
    setError(null)

    if (val && index < 5) {
      pinInputRefs.current[index + 1]?.focus()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus()
    }
  }

  const handleContinueToPin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid withdrawal amount.')
      return
    }
    if (num > availableBalance) {
      setError(`Insufficient balance. Maximum available: ${availableBalance.toFixed(2)} ${currency}`)
      return
    }

    if (method === 'bank') {
      if (!accountNumber.trim()) {
        setError('Please enter your destination bank account number.')
        return
      }
    } else {
      if (!cryptoAddress.trim()) {
        setError('Please enter your destination crypto wallet address.')
        return
      }
    }

    setStep('PIN')
  }

  const handleExecuteWithdrawal = async () => {
    setError(null)
    setLoading(true)

    const num = parseFloat(amount)
    const fullPin = pinDigits.join('')

    try {
      const res = await api.withdraw({
        currency,
        amount: num,
        destination_type: method,
        destination_account: method === 'bank' ? accountNumber.trim() : cryptoAddress.trim(),
        bank_name: method === 'bank' ? bankName : undefined,
        crypto_network: method === 'crypto' ? cryptoNetwork : undefined,
        narration: `Withdrawal payout to ${method === 'bank' ? bankName : cryptoNetwork}`,
        pin: fullPin || undefined,
      })

      setReceipt({
        ...res,
        date: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      setStep('SUCCESS')
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('FORM')
    setAmount('')
    setAccountNumber('')
    setCryptoAddress('')
    setPinDigits(['', '', '', '', '', ''])
    setError(null)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-lg rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#8A8F8A] hover:bg-[#F0F2F0] hover:text-[#080C09] transition"
        >
          <X size={18} />
        </button>

        {step === 'SUCCESS' && receipt ? (
          /* STEP 3: SUCCESS */
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7ED] text-[#1CA045] mb-4">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="text-xl font-bold text-[#080C09]">Withdrawal Submitted</h3>
            <p className="mt-1 text-xs text-[#6E736E]">
              Your payout request has been queued and is processing via automated rails.
            </p>

            <div className="my-6 rounded-2xl border border-[#E2E6E2] bg-[#FAFBF9] p-4 text-xs text-left divide-y divide-[#F0F2F0] space-y-2.5">
              <div className="flex justify-between py-1">
                <span className="text-[#8A8F8A]">Amount</span>
                <span className="font-bold text-[#080C09]">
                  {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8A8F8A]">Destination</span>
                <span className="font-semibold text-[#080C09]">{receipt.destination}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8A8F8A]">Estimated Delivery</span>
                <span className="font-semibold text-[#1CA045] flex items-center gap-1">
                  <Clock size={13} />
                  <span>5–15 minutes</span>
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8A8F8A]">Payout Reference</span>
                <span className="font-mono text-[11px] font-semibold text-[#080C09]">
                  {receipt.reference}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8A8F8A]">Remaining Balance</span>
                <span className="font-semibold text-[#080C09]">
                  {receipt.new_balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 rounded-full border border-[#E2E6E2] bg-white py-3 text-xs font-semibold text-[#080C09] hover:bg-[#F5F6F3] transition"
              >
                New Withdrawal
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-full bg-[#080C09] py-3 text-xs font-semibold text-white hover:bg-black transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : step === 'PIN' ? (
          /* STEP 2: PIN */
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#080C09] flex items-center gap-2">
                <Lock size={18} className="text-[#1CA045]" />
                <span>Authorise Withdrawal</span>
              </h3>
              <p className="mt-1 text-xs text-[#6E736E]">
                Enter your 6-digit transaction PIN to confirm payout of{' '}
                <strong className="text-[#080C09]">
                  {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                </strong>
                .
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="my-6">
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="flex-1 rounded-full border border-[#E2E6E2] bg-white py-3 text-xs font-semibold text-[#080C09] hover:bg-[#F5F6F3] transition"
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleExecuteWithdrawal}
                className="flex-1 rounded-full bg-[#1CA045] py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#005F21] transition"
              >
                {loading ? 'Authorising...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: FORM */
          <div>
            <div className="mb-5">
              <h3 className="text-xl font-bold text-[#080C09]">
                Withdraw Funds
              </h3>
              <p className="mt-0.5 text-xs text-[#6E736E]">
                Send money out of your Pedxo wallet to your bank account or external crypto wallet.
              </p>
            </div>

            {/* Method Tabs */}
            <div className="mb-5 flex rounded-full bg-[#FAFBF9] border border-[#E2E6E2] p-1">
              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition ${
                  method === 'bank'
                    ? 'bg-white text-[#080C09] shadow-sm'
                    : 'text-[#6E736E] hover:text-[#080C09]'
                }`}
              >
                <Building2 size={14} />
                <span>Bank Account</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('crypto')}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition ${
                  method === 'crypto'
                    ? 'bg-white text-[#080C09] shadow-sm'
                    : 'text-[#6E736E] hover:text-[#080C09]'
                }`}
              >
                <Coins size={14} />
                <span>Crypto Wallet</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleContinueToPin} className="space-y-4">
              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  Source Wallet
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(method === 'crypto' ? ['USDT', 'USDC'] : ['USD', 'NGN', 'GBP', 'EUR']).map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setCurrency(cur)}
                      className={`rounded-xl border py-2 text-center text-xs font-bold transition ${
                        currency === cur
                          ? 'border-[#1CA045] bg-[#E8F7ED] text-[#1CA045] ring-1 ring-[#1CA045]'
                          : 'border-[#E2E6E2] bg-white text-[#6E736E] hover:bg-[#FAFBF9]'
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-[#6E736E]">
                  <span>Available:</span>
                  <span className="font-bold text-[#080C09]">
                    {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currency}
                  </span>
                </div>
              </div>

              {method === 'bank' ? (
                <>
                  {/* Bank Select */}
                  <div>
                    <label className="block text-xs font-semibold text-[#080C09] mb-1">
                      Destination Bank
                    </label>
                    <div className="relative">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2.5 text-xs font-medium text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white"
                      >
                        {(BANKS_BY_CURRENCY[currency] || BANKS_BY_CURRENCY.USD).map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-3 text-[#8A8F8A] pointer-events-none" />
                    </div>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#080C09] mb-1">
                      Account Number / IBAN
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 10-digit account or IBAN"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2 text-xs text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white"
                    />
                  </div>

                  {/* Account Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#080C09] mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Clarissa Adeleke"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2 text-xs text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Network Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#080C09] mb-1">
                      Destination Network
                    </label>
                    <div className="space-y-2">
                      {CRYPTO_NETWORKS.map((net) => (
                        <div
                          key={net.id}
                          onClick={() => setCryptoNetwork(net.id)}
                          className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                            cryptoNetwork === net.id
                              ? 'border-[#1CA045] bg-[#E8F7ED]/50 ring-1 ring-[#1CA045]'
                              : 'border-[#E2E6E2] bg-white hover:bg-[#FAFBF9]'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-[#080C09]">{net.name}</p>
                            <p className="text-[10px] text-[#6E736E]">Fee: {net.fee}</p>
                          </div>
                          <span className="text-[11px] font-medium text-[#1CA045]">{net.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[#080C09] mb-1">
                      Destination {currency} Wallet Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paste your recipient address"
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2 text-xs font-mono text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white"
                    />
                  </div>
                </>
              )}

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] pl-4 pr-16 py-2.5 text-sm font-bold text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-semibold text-[#8A8F8A]">
                    {currency}
                  </span>
                </div>

                <div className="mt-2 flex gap-2">
                  {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentageClick(pct)}
                      className="flex-1 rounded-lg border border-[#E2E6E2] bg-[#FAFBF9] py-1 text-[11px] font-semibold text-[#6E736E] hover:border-[#1CA045] hover:text-[#1CA045] transition"
                    >
                      {pct === 1.0 ? 'MAX' : `${pct * 100}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1CA045] py-3.5 text-xs font-semibold text-white shadow-md hover:bg-[#005F21] active:scale-[0.99] transition"
              >
                <span>Continue to Authorisation</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
