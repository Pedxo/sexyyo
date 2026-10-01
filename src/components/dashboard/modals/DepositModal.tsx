import { useState } from 'react'
import { Copy } from 'lucide-react'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DepositDetail {
  label: string
  value: string
}

function DepositModal({
  isOpen,
  onClose,
}: DepositModalProps) {
  const [hideBank, setHideBank] = useState(false)

  if (!isOpen) return null

  const data: DepositDetail[] = [
    {
      label: 'Account Name',
      value: 'Victor Chukwuma',
    },
    {
      label: 'Account Number',
      value: '210328641937',
    },
    {
      label: 'Wire Routing',
      value: '101019644',
    },
    {
      label: 'ACH Routing',
      value: '101019644',
    },
    {
      label: 'Account Type',
      value: 'Checking',
    },
    {
      label: 'Bank Address',
      value: '1801 Main St., Kansas City, MO 64108',
    },
    {
      label: 'Bank Name',
      value: hideBank ? '******' : 'Lead Bank',
    },
  ]

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/80 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-3 shadow-lg">
        <h3 className="mb-2 text-sm font-semibold">
          Copy and transfer into this Account to deposit
        </h3>

        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">
                  {item.label}
                </span>

                <span className="text-xs font-semibold">
                  {item.value}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  copyToClipboard(item.value)
                }
                className="text-gray-500 hover:text-black"
                aria-label={`Copy ${item.label}`}
              >
                <Copy size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setHideBank((value) => !value)}
            className="text-left text-[11px] text-blue-600"
          >
            {hideBank
              ? 'Show bank name'
              : 'Hide bank name'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2 text-xs font-medium text-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default DepositModal