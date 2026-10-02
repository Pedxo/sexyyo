import {
    useEffect,
  } from 'react'
  
  import BalanceCard from '../../components/dashboard/BalanceCard'
  import DashboardLoader from '../../components/dashboard/DashboardLoader'
  import QuickActions from '../../components/dashboard/QuickActions'
  import RecentActivity from '../../components/dashboard/RecentActivity'
  
  import {
    useDashboardStore,
  } from '../../store/dashboard.store'
  
  /*
  =========================================================
  DASHBOARD PAGE
  =========================================================
  */
  function DashboardPage() {
    const isLoading =
      useDashboardStore(
        (state) => state.isLoading,
      )
  
    const startLoading =
      useDashboardStore(
        (state) => state.startLoading,
      )
  
    const finishLoading =
      useDashboardStore(
        (state) => state.finishLoading,
      )
  
    /*
  =========================================================
  DASHBOARD INITIAL LOADING
  =========================================================
  */
    useEffect(() => {
      startLoading()
  
      const timer =
        window.setTimeout(() => {
          finishLoading()
        }, 700)
  
      return () => {
        window.clearTimeout(timer)
      }
    }, [
      startLoading,
      finishLoading,
    ])
  
    /*
  =========================================================
  LOADING STATE
  =========================================================
  */
    if (isLoading) {
      return <DashboardLoader />
    }
  
    return (
      <div
        className="
          dashboard-page
          min-h-[calc(100vh-134px)]
          px-5
          py-6
          pb-10
          lg:px-8
          lg:py-6
          lg:pb-10
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-[1128px]
            mb-20
            grid-cols-1
            items-start
            gap-5
            xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]
          "
        >
          {/* =================================================
              LEFT COLUMN
              ================================================= */}
          <div className="min-w-0">
            <BalanceCard />
  
            <QuickActions />
          </div>
  
          {/* =================================================
              RIGHT COLUMN
              ================================================= */}
          <RecentActivity />
        </div>
      </div>
    )
  }
  
  export default DashboardPage