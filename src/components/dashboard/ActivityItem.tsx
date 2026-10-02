import {
    currencies,
    formatCurrency,
  } from '../../constants/currencies'
  
  import type {
    DashboardActivity,
  } from '../../types/dashboard'
  
  import DashboardIcon from './DashboardIcon'
  
  interface ActivityItemProps {
    activity: DashboardActivity
  }
  
  function ActivityItem({
    activity,
  }: ActivityItemProps) {
    const isDeposit =
      activity.type === 'deposit'
  
    const amount =
      formatCurrency(
        activity.amount,
        activity.currency,
      )
  
    const statusStyles = {
      completed:
        'border-[#9EDDB1] text-[#006B28]',
      pending:
        'border-[#C8CCC8] text-[#6E736E]',
      failed:
        'border-[#FF9B9B] text-[#FF5555]',
    }
  
    return (
      <div
        className="
          flex
          items-center
          gap-3
          py-3
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              isDeposit
                ? 'bg-[#DEF1E0]'
                : 'bg-[#F0F2F0]'
            }
          `}
        >
          <DashboardIcon
            name={
              isDeposit
                ? 'arrow-down-left'
                : 'arrow-up-right'
            }
            size={17}
            strokeWidth={1.7}
            color={
              isDeposit
                ? '#003311'
                : '#080C09'
            }
          />
        </div>
  
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="
                truncate
                text-[13px]
                font-semibold
                text-[#080C09]
              "
            >
              {activity.title}
            </span>
  
            <span
              className={`
                shrink-0
                rounded-full
                border
                px-2
                py-0.5
                text-[9px]
                font-medium
                uppercase
                tracking-[0.1em]
                ${statusStyles[activity.status]}
              `}
            >
              {activity.status}
            </span>
          </div>
  
          <p
            className="
              mt-0.5
              truncate
              text-[11px]
              text-[#6E736E]
            "
          >
            {activity.description}
          </p>
        </div>
  
        <div className="shrink-0 text-right">
          <p
            className={`
              text-[13px]
              font-semibold
              ${
                isDeposit
                  ? 'text-[#006B28]'
                  : 'text-[#080C09]'
              }
            `}
          >
            {isDeposit
              ? `+${amount}`
              : `−${amount}`}
          </p>
  
          <p
            className="
              mt-0.5
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-[#6E736E]
            "
          >
            {currencies[
              activity.currency
            ].code}
          </p>
        </div>
      </div>
    )
  }
  
  export default ActivityItem