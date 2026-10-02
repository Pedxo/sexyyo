import { NavLink } from 'react-router'

import Logo from '../ui/Logo'

import DashboardIcon, {
  type IconName,
} from './DashboardIcon'

interface DashboardSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

/*
=========================================================
SIDEBAR NAVIGATION
=========================================================

The navigation items use real application routes so the
sidebar remains functional when the user clicks them.
=========================================================
*/
const navigation: {
  label: string
  path: string
  icon: IconName
  end?: boolean
}[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    end: true,
  },
  {
    label: 'Wallets',
    path: '/dashboard/wallets',
    icon: 'wallet',
  },
  {
    label: 'Transactions',
    path: '/dashboard/transactions',
    icon: 'transactions',
  },
  {
    label: 'Payouts',
    path: '/dashboard/payouts',
    icon: 'payouts',
  },
  {
    label: 'Settings',
    path: '/dashboard/settings',
    icon: 'settings',
  },
]

function DashboardSidebar({
  mobileOpen = false,
  onClose,
}: DashboardSidebarProps) {
  /*
  =========================================================
  SHARED SIDEBAR CONTENT
  =========================================================

  The same content is used on desktop and mobile.
  This prevents the two versions from drifting visually.
  =========================================================
  */
  const navigationContent = (
    <>
      {/* =================================================
          LOGO
          ================================================= */}
      <div className="shrink-0 px-5 pt-7">
        <Logo
          showText
          size="dashboard"
        />
      </div>

      {/* =================================================
          NAVIGATION
          ================================================= */}
      <nav className="mt-9 min-h-screen flex-1 px-5">
        <div className="space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `
                  flex
                  h-[45px]
                  w-full
                  items-center
                  gap-3
                  rounded-full
                  px-4
                  text-left
                  text-[14px]
                  transition-colors

                  ${
                    isActive
                      ? 'bg-[#DEF1E0] text-[#003311]'
                      : 'text-[#6E736E] hover:bg-[#F2F6F2]'
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {/* =================================================
                      SIDEBAR SVG ICON

                      Active:
                      #003311

                      Inactive:
                      #6E736E
                      ================================================= */}
                  <DashboardIcon
                    name={item.icon}
                    size={18}
                    color={
                      isActive
                        ? '#003311'
                        : '#6E736E'
                    }
                    strokeWidth={1.6}
                  />

                  {/* Sidebar label */}
                  <span
                    className={
                      isActive
                        ? 'font-medium'
                        : 'font-normal'
                    }
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* =================================================
      FUND ONCE CARD
      ================================================= */}
    <div className="mt-auto shrink-0 px-4 pb-6 sm:px-5 sm:pb-8">
      <div
        className="
          relative
          overflow-hidden
          rounded-[24px]
          bg-[radial-gradient(93.4%_120.84%_at_30%_20%,#3BCA60_0%,#005F21_70%)]
          px-4
          py-4
          text-white

          lg:rounded-[28px]
          lg:px-5
          lg:py-5
        "
      >
        {/* =================================================
            FUND ONCE TITLE
            ================================================= */}
        <h3
          className="
            relative
            text-[13px]
            font-semibold
            leading-none

            lg:text-[14px]
          "
        >
          Fund once.
        </h3>

        {/* =================================================
            FUND ONCE DESCRIPTION
            ================================================= */}
        <p
          className="
            relative
            mt-1
            max-w-[145px]
            text-[11px]
            leading-[15px]
            text-white/75

            lg:max-w-[155px]
            lg:text-[12px]
            lg:leading-[17px]
          "
        >
          Pay for everything Pedxo from a single multi-currency
          balance.
        </p>

        {/* =================================================
            ADD MONEY BUTTON
            ================================================= */}
        <button
          type="button"
          className="
            relative
            mt-3
            inline-flex
            h-[29px]
            items-center
            gap-1.5
            rounded-full
            bg-white/15
            px-3
            text-[9px]
            font-medium
            leading-none
            text-white
            transition-colors
            hover:bg-white/20

            lg:mt-4
            lg:h-[33px]
            lg:gap-2
            lg:px-4
            lg:text-[12px]
          "
        >
          <span
            className="
              text-[12px]
              leading-none

              lg:text-[15px]
            "
          >
            +
          </span>

          <span className="whitespace-nowrap">
            Add money
          </span>
        </button>
      </div>
    </div>
    </>
  )

  return (
    <>
      {/* =================================================
          DESKTOP SIDEBAR
          ================================================= */}
      <aside
        className="
          hidden
          min-h-screen
          w-[248px]
          shrink-0
          flex-col
          border-r
          border-[#E2E6E2]
          bg-[#FBFCFA]
          lg:flex
        "
      >
        {navigationContent}
      </aside>

      {/* =================================================
          MOBILE OVERLAY
          ================================================= */}
      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-[80]
            bg-[#080C09]/25
            lg:hidden
          "
          onClick={onClose}
        />
      )}

      {/* =================================================
          MOBILE SIDEBAR
          ================================================= */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-[90]
          flex
          min-h-screen
          w-[200px]
          flex-col
          border-r
          border-[#E2E6E2]
          bg-[#FBFCFA]
          shadow-[8px_0_30px_-20px_#080C0940]
          transition-transform
          duration-200
          lg:hidden

          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {navigationContent}
      </aside>
    </>
  )
}

export default DashboardSidebar