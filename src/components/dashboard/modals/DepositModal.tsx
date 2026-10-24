import { useState, useEffect } from 'react'
import {
  Copy,
  Check,
  X,
  Search,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Maximize2,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useDashboardStore } from '../../../store/dashboard.store'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalStep = 'select_wallet' | 'deposit_details' | 'instructions' | 'enlarged_qr'

interface CurrencyItem {
  code: string
  name: string
  flagOrIcon: string
  balance: string
  status: 'active' | 'restricted'
  isCrypto: boolean
}

const CURRENCIES: CurrencyItem[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    flagOrIcon: '🇳🇬',
    balance: '₦4,620,500.55 available',
    status: 'active',
    isCrypto: false,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    flagOrIcon: '🇺🇸',
    balance: '$12,480.32 available',
    status: 'active',
    isCrypto: false,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    flagOrIcon: '🇬🇧',
    balance: '£0.00 available',
    status: 'active',
    isCrypto: false,
  },
  {
    code: 'EUR',
    name: 'Euro',
    flagOrIcon: '🇪🇺',
    balance: '€0.00 available',
    status: 'restricted',
    isCrypto: false,
  },
  {
    code: 'USDT',
    name: 'Tether',
    flagOrIcon: '🪙',
    balance: '₮8,450.00 available',
    status: 'active',
    isCrypto: true,
  },
  {
    code: 'USDC',
    name: 'USD Coin',
    flagOrIcon: '🪙',
    balance: '◎1,500.00 available',
    status: 'active',
    isCrypto: true,
  },
]

interface NetworkOption {
  id: string
  name: string
  subtitle: string
  address: string
  confirmations: string
  minDeposit: string
}

const CRYPTO_NETWORKS: Record<string, NetworkOption[]> = {
  USDC: [
    {
      id: 'solana',
      name: 'Solana (SPL)',
      subtitle: 'Fastest · near-zero fees',
      address: '8gTvA2pXqL7mR4Ynd5KcB1WfZ9hJ3sQeU6xD0bNvP2kR',
      confirmations: '32 blocks',
      minDeposit: '◎10.00',
    },
    {
      id: 'ethereum',
      name: 'Ethereum (ERC-20)',
      subtitle: 'Higher gas fees',
      address: '0xB39D7c1F84aE205e6C9d3b7A1052fE84cD60B729',
      confirmations: '12 blocks',
      minDeposit: '◎10.00',
    },
    {
      id: 'polygon',
      name: 'Polygon (PoS)',
      subtitle: 'Low fees',
      address: '0x4Ae8B2c7D91f3056aE7bC1d840f9E25A6b31D0C7',
      confirmations: '128 blocks',
      minDeposit: '◎10.00',
    },
  ],
  USDT: [
    {
      id: 'tron',
      name: 'Tron (TRC-20)',
      subtitle: 'Fast · low fees',
      address: 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KcbqSE',
      confirmations: '20 blocks',
      minDeposit: '₮10.00',
    },
    {
      id: 'ethereum',
      name: 'Ethereum (ERC-20)',
      subtitle: 'Higher gas fees',
      address: '0xB39D7c1F84aE205e6C9d3b7A1052fE84cD60B729',
      confirmations: '12 blocks',
      minDeposit: '₮10.00',
    },
    {
      id: 'polygon',
      name: 'Polygon (PoS)',
      subtitle: 'Low fees',
      address: '0x4Ae8B2c7D91f3056aE7bC1d840f9E25A6b31D0C7',
      confirmations: '128 blocks',
      minDeposit: '₮10.00',
    },
  ],
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const selectedDashboardCurrency = useDashboardStore((state) => state.selectedCurrency)
  const [step, setStep] = useState<ModalStep>('select_wallet')
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>(CURRENCIES[1]) // Default USD
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1793) // 29:53 in seconds
  const [showToast, setShowToast] = useState(false)
  const [depositNotified, setDepositNotified] = useState(false)

  // Sync with dashboard currency on open
  useEffect(() => {
    if (isOpen) {
      const found = CURRENCIES.find((c) => c.code === selectedDashboardCurrency)
      if (found) {
        setSelectedCurrency(found)
        // If user is already on a specific wallet, start on deposit details
        setStep('deposit_details')
      } else {
        setStep('select_wallet')
      }
      setSelectedNetworkIndex(0)
      setDepositNotified(false)
    }
  }, [isOpen, selectedDashboardCurrency])

  // Countdown timer for address validity
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 1800))
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (!isOpen) return null

  const networks = CRYPTO_NETWORKS[selectedCurrency.code] || CRYPTO_NETWORKS['USDC']
  const currentNetwork = networks[selectedNetworkIndex] || networks[0]

  const copyAddress = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setShowToast(true)
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setShowToast(false), 3000)
    } catch (e) {
      console.error(e)
    }
  }

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 font-inter-tight backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-[24px] bg-white shadow-2xl transition-all">
        {/* Toast Notification */}
        {showToast && (
          <div className="absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-2">
            <Check size={14} className="text-emerald-400" />
            <span>Address copied to clipboard!</span>
          </div>
        )}

        {/* =====================================================
            VIEW 1: WALLET SELECTION ("Which wallet are you funding?")
            ===================================================== */}
        {step === 'select_wallet' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold text-gray-500">Wallet home</span>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 tracking-tight sm:text-2xl">
              Which wallet are you funding?
            </h2>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Each currency has its own dedicated account or address — funds only credit the wallet you pick.
            </p>

            {/* Search */}
            <div className="relative mt-4">
              <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currency (e.g. USDT, Naira)"
                className="w-full rounded-xl border border-gray-200 bg-[#F5F6F3] py-2.5 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-black focus:bg-white focus:outline-none transition"
              />
            </div>

            {/* Currency List */}
            <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto pr-1">
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  disabled={currency.status === 'restricted'}
                  onClick={() => {
                    setSelectedCurrency(currency)
                    setSelectedNetworkIndex(0)
                    setStep('deposit_details')
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                    currency.status === 'restricted'
                      ? 'cursor-not-allowed opacity-50 border-gray-100 bg-gray-50'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currency.flagOrIcon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{currency.code}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            currency.status === 'active'
                              ? 'bg-[#E0EFE3] text-[#166534]'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {currency.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">{currency.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">{currency.balance}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-5 text-[11px] text-gray-400">
              Your deposit details stay available from Wallet home until they expire or are regenerated.
            </p>
          </div>
        )}

        {/* =====================================================
            VIEW 2: DEPOSIT DETAILS (Crypto QR & Network / Fiat Bank)
            ===================================================== */}
        {step === 'deposit_details' && (
          <div className="p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <button
                onClick={() => setStep('select_wallet')}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition"
              >
                <ArrowLeft size={15} />
                <span>Change wallet</span>
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Header */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCurrency.flagOrIcon}</span>
                <h3 className="text-xl font-bold text-gray-900">
                  Receive {selectedCurrency.code}
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {selectedCurrency.isCrypto
                  ? 'Send only the selected asset on the selected network.'
                  : `Transfer into this verified account to credit your ${selectedCurrency.code} balance.`}
              </p>
            </div>

            {/* CRYPTO WORKFLOW */}
            {selectedCurrency.isCrypto ? (
              <>
                {/* Network Selection Tabs */}
                <div className="mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Network
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {networks.map((net, idx) => (
                      <button
                        key={net.id}
                        onClick={() => setSelectedNetworkIndex(idx)}
                        className={`rounded-xl border p-2.5 text-left transition ${
                          selectedNetworkIndex === idx
                            ? 'border-black bg-black text-white shadow-sm'
                            : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 text-gray-800'
                        }`}
                      >
                        <p className="text-xs font-bold truncate">{net.name}</p>
                        <p
                          className={`text-[10px] truncate mt-0.5 ${
                            selectedNetworkIndex === idx ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {net.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* QR Code */}
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-[#F5F6F3] p-4 text-center">
                  <button
                    onClick={() => setStep('enlarged_qr')}
                    className="group relative rounded-xl bg-white p-3 shadow-md transition hover:scale-105 active:scale-95"
                    title="Tap to enlarge"
                  >
                    <QRCodeSVG
                      value={currentNetwork.address}
                      size={150}
                      level="H"
                      includeMargin={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl text-white">
                      <Maximize2 size={24} />
                    </div>
                  </button>
                  <p className="mt-2 text-[10px] font-medium text-gray-400">
                    Tap the QR code to enlarge
                  </p>
                </div>

                {/* Address Box */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">
                    {selectedCurrency.code} address · {currentNetwork.name}
                  </p>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F5F6F3] p-2.5">
                    <span className="font-mono text-xs font-bold text-gray-900 truncate mr-2 select-all">
                      {currentNetwork.address}
                    </span>
                    <button
                      onClick={() => copyAddress(currentNetwork.address)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Parameters Breakdown */}
                <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/50 text-xs">
                  <div className="flex justify-between p-2.5">
                    <span className="text-gray-400">Network</span>
                    <span className="font-semibold text-gray-800">{currentNetwork.name}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-gray-400">Required confirmations</span>
                    <span className="font-semibold text-gray-800">
                      {currentNetwork.confirmations}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-gray-400">Minimum deposit</span>
                    <span className="font-semibold text-gray-800">{currentNetwork.minDeposit}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-gray-400">Credited</span>
                    <span className="font-semibold text-gray-800">
                      After required confirmations (~1 – 10 min)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock size={13} />
                      <span>Address valid for</span>
                      <span className="font-mono font-bold text-gray-900">
                        {formatTimer(timeLeft)}
                      </span>
                    </div>
                    <button
                      onClick={() => setTimeLeft(1800)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      <RefreshCw size={11} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Warning Callout */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Send only on the selected network</span>
                    <p className="mt-0.5 text-[11px] text-amber-800 leading-normal">
                      Funds sent on any other network, or any other asset, may be permanently lost.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* FIAT WORKFLOW (USD, NGN, GBP, EUR) */
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-gray-100 bg-[#F5F6F3] p-4 text-xs space-y-2.5">
                  {selectedCurrency.code === 'USD' && (
                    <>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Bank Name</span>
                        <span className="font-semibold text-gray-900">Lead Bank</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Account Name</span>
                        <span className="font-semibold text-gray-900">Victor Chukwuma</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">210328641937</span>
                          <button
                            onClick={() => copyAddress('210328641937')}
                            className="rounded p-1 hover:bg-gray-200"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">ACH / Wire Routing</span>
                        <span className="font-mono font-semibold text-gray-900">101019644</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bank Address</span>
                        <span className="text-right text-[11px] text-gray-700">
                          1801 Main St., Kansas City, MO 64108
                        </span>
                      </div>
                    </>
                  )}

                  {selectedCurrency.code === 'NGN' && (
                    <>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Bank Name</span>
                        <span className="font-semibold text-gray-900">Providus Bank</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Account Name</span>
                        <span className="font-semibold text-gray-900">Pedxo Technologies</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">1100234567</span>
                          <button
                            onClick={() => copyAddress('1100234567')}
                            className="rounded p-1 hover:bg-gray-200"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Account Type</span>
                        <span className="font-semibold text-gray-900">Corporate</span>
                      </div>
                    </>
                  )}

                  {selectedCurrency.code === 'GBP' && (
                    <>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Bank Name</span>
                        <span className="font-semibold text-gray-900">Barclays Bank UK</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Account Name</span>
                        <span className="font-semibold text-gray-900">Pedxo Technologies UK</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Sort Code</span>
                        <span className="font-mono font-bold text-gray-900">20-04-15</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Account Number</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">73829104</span>
                          <button
                            onClick={() => copyAddress('73829104')}
                            className="rounded p-1 hover:bg-gray-200"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCurrency.code === 'EUR' && (
                    <>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Bank Name</span>
                        <span className="font-semibold text-gray-900">BNP Paribas</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-gray-500">Account Name</span>
                        <span className="font-semibold text-gray-900">Pedxo Technologies Europe</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">IBAN</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900 truncate">
                            FR7630006000011234567890189
                          </span>
                          <button
                            onClick={() => copyAddress('FR7630006000011234567890189')}
                            className="rounded p-1 hover:bg-gray-200"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="rounded-xl border border-emerald-100 bg-[#E0EFE3]/40 p-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck size={15} className="text-emerald-700" />
                    <span>Instant Credit After Transfer Confirmation</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-emerald-800">
                    Once funds are received in this account, your wallet balance will automatically update.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 space-y-2">
              <button
                onClick={() => setStep('instructions')}
                className="w-full rounded-xl bg-pedxo-black py-3 text-xs font-semibold text-white transition hover:bg-black"
              >
                I understand, show instructions
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-black transition"
              >
                Close, I'll copy later
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            VIEW 3: STEP-BY-STEP INSTRUCTIONS ("How to complete your deposit")
            ===================================================== */}
        {step === 'instructions' && (
          <div className="p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <button
                onClick={() => setStep('deposit_details')}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition"
              >
                <ArrowLeft size={15} />
                <span>Deposit details</span>
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-900">
                How to complete your {selectedCurrency.code} deposit
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Supported: Exchange withdrawal · Self-custody wallet · Direct Bank Transfer
              </p>
            </div>

            {/* 5 Steps */}
            <div className="mt-5 space-y-3">
              {[
                "Open the exchange, bank app, or self-custody wallet you're sending from.",
                selectedCurrency.isCrypto
                  ? `Choose the exact network shown in your deposit details (${currentNetwork.name}).`
                  : 'Enter the exact account details provided on the previous screen.',
                selectedCurrency.isCrypto
                  ? 'Paste the address — never type it by hand — and verify the first and last 4 characters.'
                  : 'Verify the recipient name matches Pedxo Technologies / Lead Bank.',
                selectedCurrency.isCrypto
                  ? 'Send at least ◎10.00. Smaller amounts cannot be credited automatically.'
                  : 'Complete the transfer and save your payment receipt.',
                'Wait for confirmation. Your Pedxo Pay balance will be credited automatically.',
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pt-0.5">{text}</p>
                </div>
              ))}
            </div>

            {/* Terms & Badges */}
            <div className="mt-5 space-y-2 rounded-xl border border-gray-100 bg-[#F5F6F3] p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Minimum deposit</span>
                <span className="font-semibold text-gray-900">
                  {selectedCurrency.isCrypto ? currentNetwork.minDeposit : '$10.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expected credit time</span>
                <span className="font-semibold text-gray-900">
                  After required confirmations (~1 – 10 min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tier 2 cap</span>
                <span className="font-semibold text-gray-900">USD 25,000 per deposit</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 space-y-2 text-[10px] text-gray-400 leading-normal">
              <p>
                <strong>Processing disclaimer:</strong> Credit times depend on your bank, our payment
                providers and — for crypto — network congestion. Delays outside these windows are
                flagged automatically and reviewed.
              </p>
              <p>
                <strong>Compliance notice:</strong> We only accept deposits from accounts and wallets you
                control. Third-party or unverified sources are returned or held for review as required by
                law.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="mt-5 space-y-2">
              <button
                disabled={depositNotified}
                onClick={() => {
                  setDepositNotified(true)
                  setTimeout(() => {
                    onClose()
                  }, 1200)
                }}
                className={`w-full rounded-xl py-3 text-xs font-semibold text-white transition ${
                  depositNotified
                    ? 'bg-emerald-600'
                    : 'bg-pedxo-black hover:bg-black'
                }`}
              >
                {depositNotified ? "✓ We've noted your deposit!" : "I've sent the deposit"}
              </button>
              <button
                onClick={() => setStep('select_wallet')}
                className="w-full py-2 text-xs font-medium text-gray-500 hover:text-black transition"
              >
                Change currency
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            VIEW 4: ENLARGED QR CODE LIGHTBOX
            ===================================================== */}
        {step === 'enlarged_qr' && (
          <div className="p-7 text-center">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setStep('deposit_details')}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <h3 className="text-base font-bold text-gray-900">
              {selectedCurrency.code} address
            </h3>
            <p className="text-xs text-gray-500 mb-4">{currentNetwork.name}</p>

            <div className="mx-auto flex w-fit items-center justify-center rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
              <QRCodeSVG
                value={currentNetwork.address}
                size={230}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="mt-4 font-mono text-xs font-bold text-gray-800 break-all px-4">
              {currentNetwork.address}
            </p>

            <button
              onClick={() => copyAddress(currentNetwork.address)}
              className="mt-5 w-full rounded-xl bg-pedxo-black py-3 text-xs font-semibold text-white hover:bg-black transition"
            >
              {copied ? '✓ Copied!' : 'Copy Address'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
