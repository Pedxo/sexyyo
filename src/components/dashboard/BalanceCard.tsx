import type { WalletBalance } from '../../types/dashboard'

import {
  dashboardCurrencies,
  formatCurrency,
} from '../../constants/currencies'

import {
  useDashboardStore,
} from '../../store/dashboard.store'

import DashboardIcon from './DashboardIcon'

import CurrencyBalanceCard, {
  EmptyCurrencyBalanceCard,
} from './CurrencyBalanceCard'


/*
=========================================================
CREATE EMPTY BALANCE
=========================================================

Used when one of the dashboard currencies does not
currently have a balance returned by the API.
*/
function createEmptyBalance(
  currency: typeof dashboardCurrencies[number],
): WalletBalance {
  return {
    currency,
    balance: 0,
    ledgerBalance: 0,
    pendingBalance: 0,
    monthlyChange: 0,
  }
}


function BalanceCard() {
  const selectedCurrency = useDashboardStore((state) => state.selectedCurrency,)
  const balances = useDashboardStore((state) => state.balances,)
  const isBalanceVisible = useDashboardStore((state) => state.isBalanceVisible,)

//   const emptyWalletCurrency =
//     useDashboardStore(
//       (state) =>
//         state.emptyWalletCurrency,
//     )

  const setSelectedCurrency = useDashboardStore((state) => state.setSelectedCurrency,)
  const setEmptyWalletCurrency = useDashboardStore( (state) => state.setEmptyWalletCurrency,)
  const toggleBalanceVisibility = useDashboardStore((state) => state.toggleBalanceVisibility,)


  /*
  =========================================================
  SELECTED BALANCE
  =========================================================

  If the API/Zustand currently has that currency,
  use its real balance.

  Otherwise create a temporary zero balance so the
  BalanceCard never disappears.
  */
  const selectedBalance: WalletBalance =
    balances.find(
      (item) =>
        item.currency ===
        selectedCurrency,
    ) ??
    ({
      currency: selectedCurrency,
      balance: 0,
      ledgerBalance: 0,
      pendingBalance: 0,
      monthlyChange: 0,
    } as WalletBalance)


  /*
  =========================================================
  DASHBOARD CURRENCY CARDS
  =========================================================
  */
  const displayBalances =
    dashboardCurrencies.map(
      (currency) =>
        balances.find(
          (item) =>
            item.currency ===
            currency,
        ) ??
        createEmptyBalance(
          currency,
        ),
    )


  /*
  =========================================================
  MASKED BALANCE
  =========================================================
  */
  const maskedBalance =
    '••••••••'


  /*
  =========================================================
  CURRENCY CARD CLICK
  =========================================================
  */
  const handleCurrencyClick = (
    currency: typeof selectedCurrency,
    balance: number,
  ) => {
    setSelectedCurrency(
      currency,
    )

    if (balance === 0) {
      setEmptyWalletCurrency(
        currency,
      )
    }
  }


  /*
  =========================================================
  EMPTY WALLET STATE
  =========================================================

  Any currency with a zero balance should show the
  EmptyCurrencyBalanceCard.

  */
  const shouldShowEmptyWallet =
    selectedBalance.balance === 0


  return (
    <section
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-[#E2E5E2]
        bg-white
        shadow-[0px_8px_24px_-8px_#080C091F]
        px-4
        py-4
      "
    >
      <div className="p-6 sm:p-6">

        {/* =================================================
            BALANCE HEADER
            ================================================= */}

        <div className="flex items-start justify-between gap-4">

          <div>

            <p
              className="
                md:text-[11px]
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-[#6E736E]
              "
            >
              {selectedCurrency}{' '}
              available balance
            </p>


            <div className="mt-1 flex items-center gap-3">

              <h2
                className="
                  md:text-[42px]
                  text-[20px]
                  font-semibold
                  leading-none
                  tracking-[-0.055em]
                  sm:text-[48px]
                "
              >
                {isBalanceVisible
                  ? formatCurrency(
                      selectedBalance.balance,
                      selectedCurrency,
                    )
                  : maskedBalance}
              </h2>


              <button
                type="button"
                onClick={
                  toggleBalanceVisibility
                }
                aria-label={
                  isBalanceVisible
                    ? 'Hide balance'
                    : 'Show balance'
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E2E6E2]
                  text-[#6E736E]
                "
              >
                <DashboardIcon
                  name={
                    isBalanceVisible
                      ? 'eye-off'
                      : 'eye'
                  }
                  size={17}
                  strokeWidth={1.5}
                />
              </button>

            </div>


            <p
              className="
                mt-2
                md:text-[12px]
                text-[9px]
                text-[#6E736E]
              "
            >
              Ledger{' '}
              {isBalanceVisible
                ? formatCurrency(
                    selectedBalance.ledgerBalance,
                    selectedCurrency,
                  )
                : maskedBalance}{' '}
              · Pending{' '}
              {isBalanceVisible
                ? formatCurrency(
                    selectedBalance.pendingBalance,
                    selectedCurrency,
                  )
                : maskedBalance}{' '}
              ·{' '}

              <span className="text-[#006B28]">
                +{selectedBalance.monthlyChange}%
                this month
              </span>
            </p>

          </div>


          <div
            className="
              hidden
              rounded-full
              border
              border-[#E2E6E2]
              px-3
              py-1.5
              md:text-[10px]
              text-[8px]
              font-medium
              tracking-[0.15em]
              text-[#6E736E]
              sm:block
            "
          >
            ≈ $28,661 TOTAL
          </div>

        </div>


        {/* =================================================
            EMPTY WALLET
            ================================================= */}

        {shouldShowEmptyWallet && (
          <div className="mt-5">

            <EmptyCurrencyBalanceCard
              currency={
                selectedCurrency
              }
              onFund={() => {
                console.log(
                  `Fund ${selectedCurrency} wallet`,
                )
              }}
            />

          </div>
        )}


        {/* =================================================
            CURRENCY BALANCE SELECTORS
            =================================================

        */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-3
          "
        >

          {displayBalances.map(
            (wallet) => (
              <CurrencyBalanceCard
                key={
                  wallet.currency
                }
                currency={
                  wallet.currency
                }
                balance={
                  wallet.balance
                }
                active={
                  selectedCurrency ===
                  wallet.currency
                }
                onClick={() =>
                  handleCurrencyClick(
                    wallet.currency,
                    wallet.balance,
                  )
                }
              />
            ),
          )}

        </div>

      </div>
    </section>
  )
}


export default BalanceCard