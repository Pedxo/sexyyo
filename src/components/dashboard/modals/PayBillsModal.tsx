import { useState } from 'react'

interface PayBillsModalProps {
  isOpen: boolean
  onClose: () => void
}

function PayBillsModal({
  isOpen,
  onClose,
}: PayBillsModalProps) {
  const [billType, setBillType] = useState('')
  const [customerNumber, setCustomerNumber] =
    useState('')
  const [amount, setAmount] = useState('')

  if (!isOpen) return null

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handlePayBill = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    console.log('Pay bill:', {
      billType,
      customerNumber,
      amount,
    })

    /*
      Connect your bills API here later.
    */
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/80 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
        <div className="mb-5">
          <h3 className="text-sm font-semibold">
            Pay Bills
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Pay utilities and other services.
          </p>
        </div>

        <form
          onSubmit={handlePayBill}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Bill Type
            </label>

            <select
              value={billType}
              onChange={(event) =>
                setBillType(event.target.value)
              }
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#1CA045]"
            >
              <option value="">
                Select bill type
              </option>
              <option value="electricity">
                Electricity
              </option>
              <option value="internet">
                Internet
              </option>
              <option value="cable">
                Cable TV
              </option>
              <option value="water">
                Water
              </option>
              <option value="other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Customer / Meter Number
            </label>

            <input
              type="text"
              value={customerNumber}
              onChange={(event) =>
                setCustomerNumber(event.target.value)
              }
              placeholder="Enter customer number"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#1CA045]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Amount
            </label>

            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="Enter amount"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#1CA045]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-[#1CA045] py-2.5 text-xs font-medium text-white hover:bg-[#005F21]"
          >
            Continue Payment
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-gray-500"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  )
}

export default PayBillsModal