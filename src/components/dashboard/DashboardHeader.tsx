import DashboardIcon from './DashboardIcon'
import DashboardSearch from './DashboardSearch'
import CurrencySelector from './CurrencySelector'

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header
      className="
        min-h-[134px]
        border-b
        border-[#E2E6E2]
        bg-[#FDFEFC]
        md:px-5
        px-4
        py-5
        lg:px-8
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[#E2E6E2]
              bg-white
              lg:hidden
            "
            aria-label="Open dashboard menu"
          >
            <DashboardIcon
              name="menu"
              size={18}
              color="#080C09"
            />
          </button>

          <div>
            <h1
              className="
                md:text-[20px]
                text-[16px]
                font-semibold
                leading-none
                tracking-[-0.03em]
              "
            >
              Wallet home
            </h1>

            <p
              className="
                mt-1.5
                md:text-[12px]
                text-[9px]
                text-[#6E736E]
              "
            >
              Welcome back, Clarissa —
              here's your money today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <DashboardSearch />
          </div>

          <button
            type="button"
            className="
              flex
              md:h-10
              md:w-10
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[#E2E6E2]
              bg-white
            "
            aria-label="Notifications"
          >
            <DashboardIcon
              name="bell"
              size={17}
              color="#080C09"
            />

            <span
              className="
                absolute
                ml-3
                mt-[-13px]
                h-1.5
                w-1.5
                rounded-full
                bg-[#1CA045]
              "
            />
          </button>

          <div
            className="
              flex
              md:h-10
              md:w-10
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[#DEF1E0]
              md:text-[13px]
              text-[10px]
              font-semibold
              text-[#003311]
            "
          >
            CA
          </div>
        </div>
      </div>

      <div
        className="
          mt-4
          flex
          items-center
          justify-end
          gap-2
        "
      >
        <button
          type="button"
          className="
            inline-flex
            h-[40px]
            items-center
            gap-2
            rounded-full
            border
            border-[#E2E6E2]
            bg-white
            px-4
            text-[12px]
            font-medium
          "
        >
          <DashboardIcon
            name="refresh"
            size={15}
            strokeWidth={1.7}
          />

          Refresh
        </button>

        <CurrencySelector />
      </div>

      <div className="mt-3 md:hidden">
        <DashboardSearch />
      </div>
    </header>
  )
}

export default DashboardHeader