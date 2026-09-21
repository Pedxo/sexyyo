interface OnboardingPaginationProps {
    currentStep: number
    totalSteps: number
  }
  
  function OnboardingPagination({
    currentStep,
    totalSteps,
  }: OnboardingPaginationProps) {
    return (
      <div className="flex items-center gap-[7px]">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const active = index + 1 === currentStep
  
          return (
            <span
              key={index}
              className={`
                block
                h-[6px]
                rounded-full
                transition-all
                duration-200
                ${
                  active
                    ? 'w-[31px] bg-pedxo-green'
                    : 'w-[9px] bg-[#e0e4e1]'
                }
              `}
            />
          )
        })}
      </div>
    )
  }
  
  export default OnboardingPagination