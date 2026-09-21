import type { OnboardingItem } from '../../constants/onboarding'
import OnboardingPagination from './OnboardingPagination';
import badgeStamp from "../../assets/icons/stamp_2.svg";
import { Check, ArrowRight } from 'lucide-react'

interface OnboardingContentProps {
  item: OnboardingItem
  currentStep: number
  totalSteps: number
  onContinue: () => void
}

function OnboardingContent({
  item,
  currentStep,
  totalSteps,
  onContinue,
}: OnboardingContentProps) {

    const buttonLabel = currentStep === 3 ? 'Get Started' : 'Continue'
  return (
    <div
      className="
        flex
        min-h-0
        flex-1
        flex-col
      "
    >
      {/* Desktop content */}
      <div className="hidden flex-1 flex-col lg:flex">
        {/* Badge */}
        <div
          className="
            mt-[58px]
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-[#e1e4e1]
            bg-[#f6f8f5]
            px-3
            py-[6px]
          "
        >
          <span className="h-[6px] w-[6px] rounded-full bg-pedxo-green" />

          <span
            className="
              text-[10px]
              font-medium
              text-[#424945]
              font-inter-tight
            "
          >
            {item.eyebrow}
          </span>
        </div>

        {/* Heading */}
        <h1
          className="
            mt-7
            max-w-[590px]
            text-[60px]
            font-medium
            leading-[1.01]
            tracking-[-0.055em]
            text-black
          "
        >
          {item.titleStart}{' '}
          <span className="italic font-inter-tight text-pedxo-green">
            {item.titleHighlight}
          </span>
        </h1>

        {/* Description */}
        <p
          className="
            mt-8
            max-w-[500px]
            text-[17px]
            font-normal
            leading-[1.65]
            text-[#6e736e]
          "
        >
          {item.description}
        </p>

        {/* Checklist */}
        <div className="mt-8 space-y-4 mb-20">
          {item.checklist.map((text) => (
            <div
              key={text}
              className="flex items-center gap-3"
            >
              <span
                className="
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#e4f3e7]
                  text-[12px]
                  font-bold
                  text-pedxo-green
                "
              >
                <Check
                  size={14}
                  strokeWidth={2}
                  className="text-pedxo-green"
                />
              </span>

              <span
                className="
                  text-[14px]
                  font-medium
                  text-[#1e231e]
                "
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop bottom controls */}
        <div className="mt-auto pb-[92px]">
          <OnboardingPagination
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-pedxo-green">
                <img src={badgeStamp} alt="badge stamp" className="w-4 h-4"/>
              </span>

              <span
                className="
                  text-[11px]
                  text-[#7a807c]
                "
              >
                Bank-grade security · KYC-tiered limits
              </span>
            </div>

            <button
              type="button"
              onClick={onContinue}
              className="
                flex
                h-[45px]
                min-w-[134px]
                items-center
                justify-center
                gap-3
                rounded-full
                bg-pedxo-green
                px-5
                text-[12px]
                font-semibold
                text-white
                shadow-[0_8px_18px_rgba(35,138,72,0.14)]
                transition-all
                duration-200
                hover:bg-pedxo-green-dark
              "
            >
              {buttonLabel}

              <span className="text-[18px] leading-none">
              <ArrowRight size={13} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile content */}
      <div className="flex flex-1 flex-col lg:hidden">
        {/* Badge intentionally hidden on mobile */}

        <h1
          className="
            mt-8
            text-[27px]
            font-semibold
            leading-[1.08]
            tracking-[-0.045em]
            text-black
          "
        >
          {item.titleStart}{' '}
          <span className="italic text-pedxo-green font-inter-tight">
            {item.titleHighlight}
          </span>
        </h1>

        <p
          className="
            mt-5
            text-[14px]
            font-normal
            leading-[1.5]
            text-[#777d79]
          "
        >
          {item.description}
        </p>

        {/* Mobile pagination */}
        <div className="mt-6">
          <OnboardingPagination
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </div>

        {/* Mobile Continue */}
        <button
          type="button"
          onClick={onContinue}
          className="
            mt-8
            flex
            h-[52px]
            w-full
            items-center
            justify-center
            gap-3
            rounded-full
            bg-[#050a07]
            px-5
            text-[13px]
            font-semibold
            text-white
            transition-all
            duration-200
            active:scale-[0.99]
          "
        >
          {buttonLabel}

          <span className="text-[18px] leading-none">
          <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  )
}

export default OnboardingContent