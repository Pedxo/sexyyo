import type { OnboardingItem } from '../../constants/onboarding'
import Logo from '../ui/Logo'


interface OnboardingImageProps {
  item: OnboardingItem
  onSkip: () => void
}

function OnboardingImage({
  item,
  onSkip,
}: OnboardingImageProps) {
  return (
    <div
      className="
        relative
        h-[calc(100vh-64px)]
        min-h-[750px]
        w-full
        overflow-hidden
        rounded-[24px]
        lg:rounded-[24px]
      "
    >
      {/* =====================================================
          MAIN ONBOARDING IMAGE
          ===================================================== */}

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

      {/* ============================
          DARK IMAGE OVERLAY
          ========================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/5
        "
      />

      {/* =====================================================
          DESKTOP TOP ROW
          
          Logo badge and Skip are now on the SAME horizontal
          line and positioned using justify-between.
          ===================================================== */}

      <div
        className="
          absolute
          left-7
          right-7
          top-7
          hidden
          items-center
          justify-between
          lg:flex
        "
      >
        {/* =========================
            PEDXO PAY LOGO BADGE
            ========================= */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-black/20
            px-3
            py-2
            backdrop-blur-md
          "
        >
          {/* Logo background */}
          <div
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-white/20
            "
          >
            <Logo
              onboarding
              showText={false}
            />
          </div>

          {/* Pedxo Pay text */}
          <span
            className="
              text-[12px]
              font-medium
              tracking-[-0.01em]
              text-white
            "
          >
            Pedxo Pay
          </span>
        </div>

        {/* ========================
            DESKTOP SKIP
            ======================== */}

        <button
          type="button"
          onClick={onSkip}
          className="
            text-[11px]
            font-normal
            text-white
            rounded-full
            h-8
            w-16
            transition-colors
            duration-200
            hover:text-[#6f7571]
            bg-white/20
          "
        >
          Skip
        </button>
      </div>

      {/* =====================================================
          DESKTOP BOTTOM INFORMATION CARD
          ===================================================== */}

      <div
        className="
          absolute
          bottom-7
          left-7
          right-7
          hidden
          items-center
          gap-3
          rounded-[22px]
          bg-white/95
          px-4
          py-4
          backdrop-blur-md
          lg:flex
        "
      >
        <span
          className="
            shrink-0
            text-[15px]
            font-medium
            text-white
          "
        >
          <img
            src={item.badgeIcon}
            alt="onboarding pay"
            className="h-10 w-10"
          />
        </span>

        <div>
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#767c78]
            "
          >
            {item.walletLabel}
          </p>

          <p
            className="
              mt-1
              text-[12px]
              font-medium
              tracking-[-0.01em]
              text-pedxo-text
            "
          >
            {item.walletCurrencies}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingImage