import DashboardIcon from './DashboardIcon'
import { useDashboardStore } from '../../store/dashboard.store'

function DashboardSearch() {
  const searchQuery =
    useDashboardStore(
      (state) => state.searchQuery,
    )

  const setSearchQuery =
    useDashboardStore(
      (state) => state.setSearchQuery,
    )

  return (
    <div
      className="
        flex
        h-[39px]
        w-full
        md:max-w-[215px]
        items-center
        gap-2
        rounded-full
        border
        border-[#E2E6E2]
        bg-white
        px-3.5
      "
    >
      <DashboardIcon
        name="search"
        size={16}
        strokeWidth={1.7}
        color="#6E736E"
      />

      <input
        value={searchQuery}
        onChange={(event) =>
          setSearchQuery(
            event.target.value,
          )
        }
        placeholder="Search transactions"
        className="
          min-w-0
          flex-1
          bg-transparent
          md:text-[12px]
          text-[10px]
          text-[#080C09]
          outline-none
          placeholder:text-[#6E736E]
          md:placeholder:text-[12px]
          placeholder:text-[11px]
        "
      />
    </div>
  )
}

export default DashboardSearch