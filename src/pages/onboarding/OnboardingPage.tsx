import type { OnboardingItem } from '../../constants/onboarding'

import OnboardingContent from '../../components/onboarding/OnboardingContent'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import OnboardingImage from '../../components/onboarding/OnboardingImage'

interface OnboardingPageProps {
  item: OnboardingItem
  currentStep: number
  onContinue: () => void
  onSkip: () => void
  onSignIn: () => void
}

function OnboardingPage({
  item,
  currentStep,
  onContinue,
  onSkip,
  onSignIn,
}: OnboardingPageProps) {
  return (
    <main
      className="
        min-h-screen
        bg-white
      "
    >
      {/* =====================================================
          DESKTOP ONBOARDING
          ===================================================== */}

      <div
        className="
          hidden
          h-screen
          min-h-screen
          w-full
          items-start
          gap-8
          overflow-y-auto
          bg-[#f6f8f5]
          pl-8
          lg:flex
        "
      >
        {/* ===================================================
            LEFT IMAGE SECTION
            =================================================== */}

        <div
          className="
            h-[calc(100vh-64px)]
            w-[52.6%]
            shrink-0
            pt-8
          "
        >
          <OnboardingImage
            item={item}
            onSkip={onSkip}
          />
        </div>

        {/* ===================================================
            RIGHT CONTENT SECTION

            IMPORTANT:
            This is FULL viewport height.

            It is no longer constrained by the image.
            =================================================== */}

        <section
          className="
            flex
            h-screen
            min-h-screen
            min-w-0
            flex-1
            flex-col
            bg-white
            px-8
            pb-8
            pt-8
            lg:h-screen
            lg:min-h-screen
            lg:px-[64px]
            xl:px-[64px]
          "
        >
          {/* Desktop step counter */}
          <OnboardingHeader
            currentStep={currentStep}
            totalSteps={3}
            onSkip={onSkip}
            onSignIn={onSignIn}
          />

          {/* Desktop content */}
          <OnboardingContent
            item={item}
            currentStep={currentStep}
            totalSteps={3}
            onContinue={onContinue}
          />
        </section>
      </div>

      {/* =====================================================
          MOBILE ONBOARDING
          ===================================================== */}

      <div
        className="
          flex
          min-h-screen
          w-full
          flex-col
          bg-white
          px-[39px]
          pb-7
          pt-[17px]
          lg:hidden
        "
      >
        {/* Mobile logo + Skip */}
        <OnboardingHeader
          currentStep={currentStep}
          totalSteps={3}
          onSkip={onSkip}
          onSignIn={onSignIn}
        />

        {/* ===========================
            MOBILE IMAGE
            =========================== */}

        <div
          className="
            mt-[25px]
            h-[449px]
            w-full
            shrink-0
            overflow-hidden
            rounded-[27px]
          "
        >
          <img
            src={item.image}
            alt=""
            className="
              h-full
              w-full
              object-cover
              object-center
            "
          />
        </div>

        {/* Mobile content */}
        <OnboardingContent
          item={item}
          currentStep={currentStep}
          totalSteps={3}
          onContinue={onContinue}
        />
      </div>
    </main>
  )
}

export default OnboardingPage