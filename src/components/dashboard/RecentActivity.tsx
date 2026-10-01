import {
    useMemo,
    useState,
  } from 'react'
  
  import {
    useNavigate,
  } from 'react-router'
  
  import {
    useDashboardStore,
  } from '../../store/dashboard.store'
  
  import ActivityItem from './ActivityItem'
  
  /*
    =========================================================
    RECENT ACTIVITY
    =========================================================
  */
  function RecentActivity() {
    const navigate =
      useNavigate()
  
    const activities =
      useDashboardStore(
        (state) => state.activities,
      )
  
    const searchQuery =
      useDashboardStore(
        (state) => state.searchQuery,
      )
  
    const [
      showAll,
      setShowAll,
    ] = useState(false)
  
    /*
      =======================================================
      FILTER ACTIVITY
      =======================================================
    */
    const filteredActivities =
      useMemo(() => {
        const query =
          searchQuery
            .trim()
            .toLowerCase()
  
        if (!query) {
          return activities
        }
  
        return activities.filter(
          (activity) =>
            activity.title
              .toLowerCase()
              .includes(query) ||
            activity.description
              .toLowerCase()
              .includes(query) ||
            activity.currency
              .toLowerCase()
              .includes(query),
        )
      }, [
        activities,
        searchQuery,
      ])
  
    /*
      =======================================================
      VISIBLE ACTIVITIES
      =======================================================
    */
    const visibleActivities =
      showAll
        ? filteredActivities
        : filteredActivities.slice(
            0,
            4,
          )
  
    return (
      <section
        className="
          flex
          h-full
          min-h-[465px]
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-[#E2E6E2]
          bg-white
          shadow-[0px_8px_24px_-8px_#080C091F]
        "
      >
        {/* =================================================
            HEADER
            ================================================= */}
        <div className="px-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2
                className="
                  text-[16px]
                  font-semibold
                  tracking-[-0.025em]
                "
              >
                Recent activity
              </h2>
  
              <p
                className="
                  mt-0.5
                  text-[12px]
                  text-[#6E736E]
                "
              >
                6 events in the last 7 days
              </p>
            </div>
  
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/dashboard/transactions',
                )
              }
              className="
                rounded-full
                border
                border-[#E2E6E2]
                px-4
                py-2
                text-[11px]
                font-medium
                text-[#080C09]
              "
            >
              View all
            </button>
          </div>
        </div>
  
        {/* =================================================
            ACTIVITY LIST
  
            flex-1 makes the list absorb available vertical
            space so the footer remains at the bottom.
            ================================================= */}
        <div
          className="
            mt-4
            flex-1
            divide-y
            divide-[#F0F2F0]
            px-6
          "
        >
          {visibleActivities.length >
          0 ? (
            visibleActivities.map(
              (activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                />
              ),
            )
          ) : (
            <div
              className="
                py-10
                text-center
                text-[12px]
                text-[#6E736E]
              "
            >
              No transactions found.
            </div>
          )}
        </div>
  
        {/* =================================================
            FOOTER
            ================================================= */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            pb-6
            pt-4
          "
        >
          <button
            type="button"
            onClick={() =>
              setShowAll(
                (value) => !value,
              )
            }
            className="
              rounded-full
              border
              border-[#E2E6E2]
              px-4
              py-2
              text-[11px]
              font-medium
            "
          >
            {showAll
              ? 'Show less'
              : 'Load more'}
          </button>
  
          <span
            className="
              text-[10px]
              text-[#8A8F8A]
            "
          >
            Preview feed error
          </span>
        </div>
      </section>
    )
  }
  
  export default RecentActivity