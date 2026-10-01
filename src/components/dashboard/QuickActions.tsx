import { useState } from 'react'

import type {
  QuickAction,
} from '../../types/dashboard'

import QuickActionCard from './QuickActionCard'

import DepositModal from './modals/DepositModal'
import TransferModal from './modals/TransferModal'
import PayBillsModal from './modals/PayBillsModal'
import WithdrawModal from './modals/WithdrawModal'

const actions: QuickAction[] = [
  {
    id: 'deposit',
    title: 'Deposit',
    description: 'Fund your wallet',
    icon: 'deposit',
  },
  {
    id: 'transfer',
    title: 'Transfer',
    description: 'Send money out',
    icon: 'transfer',
  },
//   {
//     id: 'bills',
//     title: 'Pay Bills',
//     description: 'Utilities & Pedxo',
//     icon: 'bills',
//   },
//   {
//     id: 'withdraw',
//     title: 'Withdraw',
//     description: 'To your bank',
//     icon: 'withdraw',
//   },
]

type ModalType =
  | 'deposit'
  | 'transfer'
  | 'bills'
  | 'withdraw'
  | null

function QuickActions() {
  const [activeModal, setActiveModal] =
    useState<ModalType>(null)

  const handleAction = (
    id: QuickAction['id'],
  ) => {
    /*
      Instead of navigating to another dashboard page,
      open the appropriate modal.
    */

    switch (id) {
      case 'deposit':
        setActiveModal('deposit')
        break

      case 'transfer':
        setActiveModal('transfer')
        break

      case 'bills':
        setActiveModal('bills')
        break

      case 'withdraw':
        setActiveModal('withdraw')
        break

      default:
        break
    }
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <>
      <section className="mt-6">
        <div>
          <h2
            className="
              text-[16px]
              font-semibold
              tracking-[-0.025em]
            "
          >
            Quick actions
          </h2>

          <p
            className="
              mt-1
              text-[12px]
              text-[#6E736E]
            "
          >
            One tap to move money in, out or across Pedxo
          </p>
        </div>

        <div
          className="
            mt-3
            grid
            grid-cols-2
            gap-3
            xl:grid-cols-4
          "
        >
          {actions.map((action) => (
            <QuickActionCard
              key={action.id}
              action={action}
              onClick={() =>
                handleAction(action.id)
              }
            />
          ))}
        </div>
      </section>

      {/* =================================================
          DEPOSIT MODAL
          ================================================= */}

      <DepositModal
        isOpen={activeModal === 'deposit'}
        onClose={closeModal}
      />

      {/* =================================================
          TRANSFER MODAL
          ================================================= */}

      <TransferModal
        isOpen={activeModal === 'transfer'}
        onClose={closeModal}
      />

      {/* =================================================
          PAY BILLS MODAL
          ================================================= */}

      <PayBillsModal
        isOpen={activeModal === 'bills'}
        onClose={closeModal}
      />

      {/* =================================================
          WITHDRAW MODAL
          ================================================= */}

      <WithdrawModal
        isOpen={activeModal === 'withdraw'}
        onClose={closeModal}
      />
    </>
  )
}

export default QuickActions