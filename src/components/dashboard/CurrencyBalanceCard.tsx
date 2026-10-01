import type {
  CurrencyCode,
} from '../../constants/currencies'

import {
  currencies,
  formatCurrency,
} from '../../constants/currencies'

import CountryFlag from './CountryFlag'
import DashboardIcon from './DashboardIcon'

interface CurrencyBalanceCardProps {
  currency: CurrencyCode
  balance: number
  active: boolean
  onClick: () => void
}

/*
=========================================================
CURRENCY BALANCE CARD
=========================================================
*/

function CurrencyBalanceCard({
  currency,
  balance,
  active,
  onClick,
}: CurrencyBalanceCardProps) {
  const definition =
    currencies[currency]

  if (!definition) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-w-0
        flex-1
        flex-col
        items-start
        justify-between
        rounded-[24px]
        border
        px-4
        py-4
        text-left
        transition-colors
        ${
          active
            ? 'border-[#1CA045] bg-[#DEF1E080]'
            : 'border-[#E2E6E2] bg-white hover:border-[#1CA045]'
        }
      `}
    >
      {/* =================================================
          COUNTRY FLAG + CURRENCY CODE
          ================================================= */}

      <span
        className="
          flex
          items-center
          gap-2
          text-[12px]
          font-medium
          text-[#6E736E]
        "
      >
        <CountryFlag
          countryCode={
            definition.countryCode
          }
          countryName={
            definition.countryName
          }
          className="
            h-[11px]
            w-[16px]
          "
        />

        <span>
          {currency}
        </span>
      </span>

      {/* =================================================
          BALANCE
          ================================================= */}

      <span
        className="
          mt-3
          text-[14px]
          font-semibold
          tracking-[-0.025em]
          text-[#080C09]
          sm:text-[16px]
          md:text-[18px]
        "
      >
        {formatCurrency(
          balance,
          currency,
        )}
      </span>
    </button>
  )
}

/*
=========================================================
EMPTY CURRENCY BALANCE CARD
=========================================================
*/

interface EmptyCurrencyBalanceCardProps {
  currency: CurrencyCode
  onFund: () => void
}

export function EmptyCurrencyBalanceCard({
  currency,
  onFund,
}: EmptyCurrencyBalanceCardProps) {
  const definition =
    currencies[currency]

  if (!definition) {
    return null
  }

  return (
    <div
      className="
        rounded-[24px]
        bg-[#EFF1EE66]
        px-5
        py-5
        shadow
        sm:px-6
        sm:py-6
      "
    >
      {/* =================================================
          WALLET ICON
          ================================================= */}

      <div className="text-[#003311]">
        <DashboardIcon
          name="wallet"
          size={25}
          color="#003311"
          strokeWidth={1.5}
        />
      </div>

      {/* =================================================
          EMPTY WALLET TITLE
          ================================================= */}

      <h3
        className="
          mt-3
          text-[10px]
          font-semibold
          tracking-[-0.02em]
          text-[#080C09]
          sm:text-[12px]
          md:text-[15px]
        "
      >
        Your {currency} wallet
        has no funds yet
      </h3>

      {/* =================================================
          EMPTY WALLET DESCRIPTION
          ================================================= */}

      <p
        className="
          mt-1
          max-w-[560px]
          text-[10px]
          leading-[16px]
          text-[#6E736E]
          sm:text-[11px]
          sm:leading-[17px]
          md:text-[12px]
          md:leading-[18px]
        "
      >
        Fund it once and pay
        for Pedxo talent,
        subscriptions and bills
        instantly.
      </p>

      {/* =================================================
          FUND WALLET BUTTON
          ================================================= */}

      <button
        type="button"
        onClick={onFund}
        className="
          mt-4
          inline-flex
          h-[32px]
          items-center
          gap-1.5
          rounded-full
          bg-[linear-gradient(135deg,#1CA045_0%,#3BCA60_100%)]
          px-3
          text-[9px]
          font-medium
          leading-none
          text-white
          shadow-[0_10px_20px_rgba(28,160,69,0.16)]
          transition-all
          hover:brightness-[1.03]

          sm:h-[34px]
          sm:gap-2
          sm:px-3.5
          sm:text-[10px]

          md:h-[38px]
          md:px-4
          md:text-[12px]
        "
      >
        <span className="whitespace-nowrap">
          Fund {currency} wallet
        </span>

        {/* 
          Use a fixed size here because DashboardIcon
          receives its size as an inline value.
        */}
        <DashboardIcon
          name="arrow-right"
          size={12}
          color="#FFFFFF"
          strokeWidth={1.8}
        />
      </button>
    </div>
  )
}

export default CurrencyBalanceCard