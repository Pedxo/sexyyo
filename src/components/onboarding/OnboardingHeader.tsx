import Logo from '../ui/Logo'

interface OnboardingHeaderProps {
  currentStep: number
  totalSteps: number
  onSkip: () => void
  onSignIn: () => void
}

function OnboardingHeader({
  currentStep,
  totalSteps,
  onSkip,
  onSignIn,
}: OnboardingHeaderProps) {
  return (
    <>
      {/* Mobile Header */}
      <header className="flex items-center justify-between lg:hidden">
        <Logo />

        <button
          type="button"
          onClick={onSkip}
          className="
            text-[10px]
            font-normal
            text-[#6f7571]
            transition-colors
            hover:text-pedxo-text
          "
        >
          Skip
        </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden mt-10 items-center justify-between lg:flex">
        <div
          className="
            flex
            items-center
            gap-[10px]
            text-[11px]
            tracking-[0.2em]
            text-[#767b78]
          "
        >
          <span className="text-pedxo-text font-semibold">
            {String(currentStep).padStart(2, '0')}
          </span>

          <span className="h-px w-8 bg-[#dedfdd]" />

          <span>OF</span>

          <span>{String(totalSteps).padStart(2, '0')}</span>
        </div>

        <button
          type="button"
          onClick={onSignIn}
          className="
            text-[12px]
            font-normal
            text-[#686e6b]
            transition-colors
            hover:text-pedxo-text
          "
        >
          Sign in
        </button>
      </header>
    </>
  )
}

export default OnboardingHeader