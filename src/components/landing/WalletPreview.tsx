import {
    ArrowDownLeft,
    ArrowUpRight,
    Send,
  } from 'lucide-react';
  import inboxIcon from "../../assets/icons/inbox_icon.svg";
  import pedxoServiceIcon from "../../assets/icons/pedxo_service.svg"
  
  interface BalanceBoxProps {
    currency: string
    symbol: string
    amount: string
    available?: boolean
    accent?: boolean
  }
  
  function BalanceBox({
    currency,
    symbol,
    amount,
    available,
    accent = false,
  }: BalanceBoxProps) {
    return (
      <div
        className={`
          relative
          min-h-[104px]
          rounded-[12px]
          border
          p-4
          ${
            accent
              ? 'border-[#1CA045] bg-[#DEF1E0]'
              : 'border-[#e2e6e2] bg-[#f0f3ef]'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div
            className={`
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              text-[8px]
              font-semibold
              ${
                accent
                  ? 'bg-pedxo-green text-white text-[11px]'
                  : 'bg-[#ffffff] text-[#3d4541] text-[11px]'
              }
            `}
          >
            {symbol}
          </div>
  
          <span className="text-[10px] font-medium text-[#6f7672] font-bold">
            {currency}
          </span>
        </div>
  
        <p className="mt-4 text-[14px] font-semibold text-[#2a312e] font-bold">
          {amount}
        </p>
  
        {available && (
          <p className="mt-1 text-[10px] text-[#6e736e]">
            Available
          </p>
        )}
      </div>
    )
  }
  
  function Action({
    icon,
    label,
  }: {
    icon: React.ReactNode
    label: string
  }) {
    return (
      <button
        className="
          flex
          flex-col
          items-center
          gap-2
          text-[#3f4743]
        "
      >
        <span
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#121816]
            text-white
          "
        >
          {icon}
        </span>
  
        <span className="text-[11px] font-bold">
          {label}
        </span>
      </button>
    )
  }
  
  function WalletPreview() {
    return (
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[470px]
          rounded-[18px]
          border
          border-[#e2e6e2]
          bg-[#f8f9f7]
          p-4
          shadow-[0_30px_55px_rgba(33,52,42,0.13)]
          sm:p-5
        "
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#6e736e] font-bold">
              Total available balance
            </p>
  
            <h2 className="mt-1 text-[36px] font-semibold tracking-[-0.04em] text-pedxo-text">
              $18,506.<span className="text-[#6e736e]">42</span>
            </h2>
          </div>
  
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[#e9ece9]
            "
          >
            <span className="text-[14px] text-[#4b544f]">
            <img
              src={inboxIcon}
              alt="Pedxo inbox"
              className="h-16 w-16"
            />
            </span>
          </div>
        </div>
  
        <div className="mt-4 h-px w-full bg-[#e0e4e0]" />
  
        <div className="grid grid-cols-2 gap-2 pt-4">
          <BalanceBox
            currency="USD"
            symbol="$"
            amount="$12,480.32"
            available
            accent
          />
  
          <BalanceBox
            currency="NGN"
            symbol="₦"
            amount="₦4,620,500"
            available
          />
  
          <BalanceBox
            currency="USDT"
            symbol="₮"
            amount="₮8,450.00"
            available
          />
  
          <BalanceBox
            currency="EUR"
            symbol="€"
            amount="€3,120.90"
            available
          />
        </div>
  
        <div className="mt-5 grid grid-cols-3 border-t border-[#e1e5e1] pt-5">
          <Action
            label="Add money"
            icon={<ArrowDownLeft size={16} />}
          />
  
          <Action
            label="Transfer"
            icon={<Send size={16} />}
          />
  
          <Action
            label="Withdraw"
            icon={<ArrowUpRight size={16} />}
          />
        </div>
  
        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            rounded-[10px]
            bg-[#e9ece9]
            px-3
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                bg-[#f8faf8]
                text-pedxo-green
              "
            >
             <img src={pedxoServiceIcon} alt="pedxo service"/>
            </div>
  
            <div>
              <p className="text-[11px] font-bold text-[#323936]">
                Pedxo service
              </p>
  
              <p className="mt-0.5 text-[10px] text-[#777e79]">
                Competed momemts ago
              </p>
            </div>
          </div>
  
          <p className="text-[12px] font-bold text-[#303733]">
            − $120.00
          </p>
        </div>
      </div>
    )
  }
  
  export default WalletPreview