import {
    Outlet,
  } from 'react-router'
  
  import {
    useState,
  } from 'react'
  
  import DashboardHeader from './DashboardHeader'
  import DashboardSidebar from './DashboardSidebar'
  
  function DashboardLayout() {
    const [
      mobileMenuOpen,
      setMobileMenuOpen,
    ] = useState(false)
  
    return (
      <div
        className="
          flex
          min-h-screen
          bg-[#FDFEFC]
          font-inter
          text-[#080C09]
        "
      >
        <DashboardSidebar
          mobileOpen={
            mobileMenuOpen
          }
          onClose={() =>
            setMobileMenuOpen(false)
          }
        />
  
        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
          "
        >
          <DashboardHeader
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />
  
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    )
  }
  
  export default DashboardLayout