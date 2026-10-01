import type {
    QuickAction,
  } from '../../types/dashboard'
  
  import DashboardIcon from './DashboardIcon'
  
  interface QuickActionCardProps {
    action: QuickAction
    onClick: () => void
  }
  
  function QuickActionCard({
    action,
    onClick,
  }: QuickActionCardProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          flex
          min-h-[122px]
          flex-col
          items-start
          rounded-[26px]
          border
          border-[#E2E6E2]
          bg-white
          p-4
          text-left
          transition-all
          hover:-translate-y-0.5
          hover:border-[#1CA045]
          hover:shadow-[0px_8px_24px_-12px_#080C091F]
        "
      >
        <span
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#20B653]
            text-white
          "
        >
          <DashboardIcon
            name={action.icon}
            size={40}
            strokeWidth={1.7}
          />
        </span>
  
        <span
          className="
            mt-3
            text-[14px]
            font-semibold
            text-[#080C09]
          "
        >
          {action.title}
        </span>
  
        <span
          className="
            mt-0.5
            text-[11px]
            text-[#6E736E]
          "
        >
          {action.description}
        </span>
      </button>
    )
  }
  
  export default QuickActionCard