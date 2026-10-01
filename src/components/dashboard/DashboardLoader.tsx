function DashboardLoader() {
    return (
      <div
        className="
          fixed
          inset-0
          z-[100]
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#FDFEFC]
        "
      >
        <div
          className="
            h-16
            w-16
            animate-spin
            rounded-full
            border-[5px]
            border-[#1CA045]/15
            border-t-[#1CA045]
          "
          aria-label="Loading dashboard"
          role="status"
        />
      </div>
    )
  }
  
  export default DashboardLoader