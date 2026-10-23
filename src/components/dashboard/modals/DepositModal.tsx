import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useDashboardStore } from '../../../store/dashboard.store'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DepositDetail {
  label: string
  value: string
}

function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [hideBank, setHideBank] = useState(false)
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)
  const selectedCurrency = useDashboardStore((state) => state.selectedCurrency)

  if (!isOpen) return null

  const getDepositDetails = (): { title: string; data: DepositDetail[] } => {
    switch (selectedCurrency) {
      case 'NGN':
        return {
          title: 'Transfer Nigerian Naira (NGN) into this account',
          data: [
            { label: 'Bank Name', value: hideBank ? '******' : 'Providus Bank' },
            { label: 'Account Name', value: 'Pedxo Technologies' },
            { label: 'Account Number', value: '1100234567' },
            { label: 'Account Type', value: 'Corporate' },
          ],
        }
      case 'GBP':
        return {
          title: 'Transfer British Pounds (GBP) into this account',
          data: [
            { label: 'Bank Name', value: hideBank ? '******' : 'Barclays Bank UK' },
            { label: 'Account Name', value: 'Pedxo Technologies UK' },
            { label: 'Sort Code', value: '20-04-15' },
            { label: 'Account Number', value: '73829104' },
          ],
        }
      case 'EUR':
        return {
          title: 'Transfer Euro (EUR) into this account',
          data: [
            { label: 'Bank Name', value: hideBank ? '******' : 'BNP Paribas' },
            { label: 'Account Name', value: 'Pedxo Technologies Europe' },
            { label: 'IBAN', value: 'FR7630006000011234567890189' },
            { label: 'BIC / SWIFT', value: 'BNPAFR2X' },
          ],
        }
      case 'USD':
      default:
        return {
          title: 'Transfer USD into this account to deposit',
          data: [
            { label: 'Bank Name', value: hideBank ? '******' : 'Lead Bank' },
            { label: 'Account Name', value: 'Victor Chukwuma' },
            { label: 'Account Number', value: '210328641937' },
            { label: 'Wire Routing', value: '101019644' },
            { label: 'ACH Routing', value: '101019644' },
            { label: 'Account Type', value: 'Checking' },
            { label: 'Bank Address', value: '1801 Main St., Kansas City, MO 64108' },
          ],
        }
    }
  }

  const { title, data } = getDepositDetails()

  const copyToClipboard = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLabel(label)
      setTimeout(() => setCopiedLabel(null), 1800)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/80 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            {selectedCurrency} Deposit Details
          </h3>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-700">
            {selectedCurrency}
          </span>
        </div>

        <p className="mb-3 text-xs text-gray-500">{title}</p>

        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50/50 p-2"
            >
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-400">{item.label}</span>
                <span className="text-xs font-semibold text-gray-800">{item.value}</span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(item.label, item.value)}
                className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-gray-500 hover:bg-gray-200 hover:text-black transition"
                aria-label={`Copy ${item.label}`}
              >
                {copiedLabel === item.label ? (
                  <Check size={14} className="text-emerald-600" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setHideBank((value) => !value)}
            className="mt-1 text-left text-[11px] text-blue-600 hover:underline"
          >
            {hideBank ? 'Show bank name' : 'Hide bank name'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-gray-900 py-2.5 text-xs font-medium text-white transition hover:bg-black"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default DepositModal
