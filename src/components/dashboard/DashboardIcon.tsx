import {
    ArrowDownLeft,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Banknote,
    Bell,
    ChevronDown,
    Eye,
    EyeOff,
    Grid2X2,
    Landmark,
    Menu,
    Plus,
    Receipt,
    RefreshCw,
    Search,
    Settings,
    Wallet,
    WalletCards,
    X,
  } from 'lucide-react'
  
  import transferIcon from '../../assets/icons/transfer.svg'
  import payBillIcon from '../../assets/icons/pay_bill.svg'
  import withdrawIcon from '../../assets/icons/withdraw.svg'
  import plusIcon from '../../assets/icons/plus.svg'
  
  /*
  =========================================================
  DASHBOARD ICON NAMES
  =========================================================
  */
  
  export type IconName =
    | 'dashboard'
    | 'wallet'
    | 'transactions'
    | 'payouts'
    | 'settings'
    | 'bell'
    | 'search'
    | 'refresh'
    | 'chevron-down'
    | 'deposit'
    | 'transfer'
    | 'bills'
    | 'withdraw'
    | 'eye'
    | 'eye-off'
    | 'arrow-left'
    | 'arrow-right'
    | 'arrow-up-right'
    | 'arrow-down-left'
    | 'banknote'
    | 'plus'
    | 'menu'
    | 'close'
  
  interface DashboardIconProps {
    name: IconName
    size?: number
    className?: string
    strokeWidth?: number
    color?: string
  }
  
  /*
  =========================================================
  DIRECT SVG ICONS
  =========================================================
  
  These are imported directly instead of using
  import.meta.glob().
  
  This means Vite only resolves files that actually exist.
  */
  
  const directSvgIcons: Partial<Record<IconName, string>> = {
    /*
      Deposit:
    */
    deposit: plusIcon,
  
    transfer: transferIcon,
    bills: payBillIcon,
    withdraw: withdrawIcon,
  }
  
  /*
  =========================================================
  LUCIDE FALLBACK ICONS
  =========================================================
  
  These are only used when a direct SVG is not defined.
  */
  
  const fallbackIcons = {
    dashboard: Grid2X2,
    wallet: WalletCards,
    transactions: Receipt,
    payouts: Landmark,
    settings: Settings,
  
    bell: Bell,
    search: Search,
    refresh: RefreshCw,
    'chevron-down': ChevronDown,
  
    deposit: Plus,
    transfer: ArrowUpRight,
    bills: Banknote,
    withdraw: Wallet,
  
    eye: Eye,
    'eye-off': EyeOff,
  
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'arrow-up-right': ArrowUpRight,
    'arrow-down-left': ArrowDownLeft,
  
    banknote: Banknote,
    plus: Plus,
  
    menu: Menu,
    close: X,
  }
  
  /*
  =========================================================
  DASHBOARD ICON
  =========================================================
  */
  
  function DashboardIcon({
    name,
    size = 18,
    className = '',
    strokeWidth = 1.7,
    color = 'currentColor',
  }: DashboardIconProps) {
    const svgUrl = directSvgIcons[name]
  
    /*
    =======================================================
    DOWNLOADED SVG
    =======================================================
  
    */
  
    if (svgUrl) {
      return (
        <img
          src={svgUrl}
          alt=""
          aria-hidden="true"
          width={size}
          height={size}
          className={`shrink-0 object-contain ${className}`}
          style={{
            width: size,
            height: size,
            /*
              The SVG itself controls its color.
  
              color is intentionally not applied here because
              <img> cannot recolor an external SVG reliably.
            */
          }}
        />
      )
    }
  
    /*
    =======================================================
    LUCIDE FALLBACK
    =======================================================
    */
  
    const Icon = fallbackIcons[name]
  
    return (
      <Icon
        size={size}
        strokeWidth={strokeWidth}
        className={className}
        color={color}
        aria-hidden="true"
      />
    )
  }
  
  export default DashboardIcon