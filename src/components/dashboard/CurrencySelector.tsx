import {
    useState,
  } from 'react'
  
  import {
    currencySelectorOptions,
    currencies,
  } from '../../constants/currencies'
  
  import {
    useDashboardStore,
  } from '../../store/dashboard.store'
  
  import CountryFlag from './CountryFlag'
  import DashboardIcon from './DashboardIcon'
  
  function CurrencyOptionIcon({
    currencyCode,
    countryCode,
    countryName,
    icon,
    isCrypto,
  }: {
    currencyCode: string
    countryCode: string | null
    countryName: string
    icon?: string
    isCrypto: boolean
  }) {
    /*
    =========================================================
    CRYPTO WITH DOWNLOADED SVG
    =========================================================
    */
  
    if (icon) {
      return (
        <img
          src={icon}
          alt={currencyCode}
          className="
            h-[16px]
            w-[16px]
            shrink-0
            object-contain
          "
        />
      )
    }
  
    /*
    =========================================================
    CRYPTO WITHOUT DOWNLOADED SVG
    =========================================================
  
    Do not pretend crypto has a country flag.
    */
  
    if (isCrypto) {
      return (
        <span
          className="
            flex
            h-[16px]
            min-w-[16px]
            shrink-0
            items-center
            justify-center
            text-[8px]
            font-semibold
            text-[#003311]
          "
        >
          {currencyCode.slice(
            0,
            3,
          )}
        </span>
      )
    }
  
    /*
    =========================================================
    FIAT COUNTRY FLAG
    =========================================================
    */
  
    if (countryCode) {
      return (
        <CountryFlag
          countryCode={
            countryCode
          }
          countryName={
            countryName
          }
          className="
            h-[11px]
            w-[16px]
          "
        />
      )
    }
  
    return null
  }
  
  function CurrencySelector() {
    const [
      open,
      setOpen,
    ] = useState(false)
  
    const selectedCurrency =
      useDashboardStore(
        (state) =>
          state.selectedCurrency,
      )
  
    const setSelectedCurrency =
      useDashboardStore(
        (state) =>
          state.setSelectedCurrency,
      )
  
    const selected =
      currencies[
        selectedCurrency
      ]
  
    const selectedOption =
      currencySelectorOptions.find(
        (item) =>
          item.currencyCode ===
          selectedCurrency,
      )
  
    if (!selected) {
      return null
    }
  
    return (
      <div className="relative">
        {/* =================================================
            CURRENT CURRENCY BUTTON
            ================================================= */}
  
        <button
          type="button"
          onClick={() =>
            setOpen(
              (value) => !value,
            )
          }
          className="
            inline-flex
            h-[40px]
            min-w-[116px]
            items-center
            justify-between
            gap-3
            rounded-full
            border
            border-[#E2E6E2]
            bg-white
            px-4
            text-[13px]
            font-medium
            text-[#080C09]
          "
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span
            className="
              flex
              items-center
              gap-2
            "
          >
            <CurrencyOptionIcon
              currencyCode={
                selectedCurrency
              }
              countryCode={
                selectedOption?.countryCode ??
                selected.countryCode
              }
              countryName={
                selectedOption?.countryName ??
                selected.countryName
              }
              icon={
                selectedOption?.icon ??
                selected.icon
              }
              isCrypto={
                selected.isCrypto
              }
            />
  
            <span>
              {selected.code}
            </span>
          </span>
  
          <DashboardIcon
            name="chevron-down"
            size={15}
            strokeWidth={1.7}
            className="text-[#6E736E]"
          />
        </button>
  
        {/* =================================================
            DROPDOWN
            ================================================= */}
  
        {open && (
          <div
            className="
              absolute
              right-0
              top-[48px]
              z-50
              max-h-[420px]
              w-[210px]
              overflow-y-auto
              overflow-x-hidden
              rounded-[18px]
              border
              border-[#E2E6E2]
              bg-white
              p-1.5
              shadow-[0px_12px_32px_-12px_#080C0930]
            "
            role="listbox"
          >
            {currencySelectorOptions.map(
              (item) => {
                const active =
                  item.currencyCode ===
                  selectedCurrency
  
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={
                      active
                    }
                    onClick={() => {
                      setSelectedCurrency(
                        item.currencyCode,
                      )
  
                      setOpen(false)
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-[12px]
                      px-3
                      py-2.5
                      text-left
                      text-[13px]
  
                      ${
                        active
                          ? 'bg-[#DEF1E0] text-[#003311]'
                          : 'text-[#6E736E] hover:bg-[#F7F9F7]'
                      }
                    `}
                  >
                    <CurrencyOptionIcon
                      currencyCode={
                        item.currencyCode
                      }
                      countryCode={
                        item.countryCode
                      }
                      countryName={
                        item.countryName
                      }
                      icon={
                        item.icon
                      }
                      isCrypto={
                        item.isCrypto
                      }
                    />
  
                    <span
                      className="
                        font-medium
                        text-[#080C09]
                      "
                    >
                      {
                        item.currencyCode
                      }
                    </span>
  
                    <span
                      className="
                        ml-auto
                        max-w-[95px]
                        truncate
                        text-[10px]
                        text-[#6E736E]
                      "
                      title={
                        item.isCrypto
                          ? item.currencyName
                          : item.countryName
                      }
                    >
                      {
                        item.isCrypto
                          ? item.currencyName
                          : item.countryName
                      }
                    </span>
                  </button>
                )
              },
            )}
          </div>
        )}
      </div>
    )
  }
  
  export default CurrencySelector