import { useState } from 'react'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

function WithdrawModal({
  isOpen,
  onClose,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState('')
  const [accountNumber, setAccountNumber] =
    useState('')

  if (!isOpen) return null

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleWithdraw = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    console.log('Withdraw:', {
      amount,
      accountNumber,
    })

    /*
      Connect your withdrawal API here later.
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
            Withdraw Money
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Withdraw money to your bank account.
          </p>
        </div>

        <form
          onSubmit={handleWithdraw}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-xs text-gray-500">
              Bank Account
            </label>

            <input
              type="text"
              value={accountNumber}
              onChange={(event) =>
                setAccountNumber(event.target.value)
              }
              placeholder="Enter account number"
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
            Continue Withdrawal
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

export default WithdrawModal