import { ArrowRight } from 'lucide-react'

import Button from '../ui/Button'

interface ResetPasswordModalProps {
  icon: string
  onOpenResetScreen: () => void
  onTryDifferentAddress: () => void
  loading?: boolean
}

function ResetPasswordModal({
  icon,
  onOpenResetScreen,
  onTryDifferentAddress,
  loading = false,
}: ResetPasswordModalProps) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-end
        px-5
        sm:px-8
        lg:pr-[6vw]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-title"
    >
      <div
        className="
          flex
          h-[320px]
          w-[448px]
          max-w-full
          flex-col
          items-center
          rounded-[28px]
          border
          border-pedxo-border
          bg-white
          px-4
          py-8
          shadow-[0px_8px_24px_-8px_rgba(8,12,9,0.12)]
          md:mr-10
          md:mt-24
          mt-20
        "
      >
        {/* Icon */}
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="
            md:h-11
            md:w-11
            h-8
            w-8
            shrink-0
            object-contain
          "
        />

        {/* Content */}
        <div className="mt-4 text-center">
          <h2
            id="reset-password-title"
            className="
              mt-2
              md:text-[20px]
              text-[16px]
              font-semibold
              leading-tight
              tracking-[-0.025em]
              text-pedxo-black
            "
          >
            Reset instructions sent
          </h2>

          <p
            className="
              mt-2
              max-w-[370px]
              md:text-[12px]
              text-[11px]
              leading-5
              text-pedxo-gray
              md:text-[13px]
            "
          >
            If an account matches that address, a reset
            link is on its way. It expires in 30 minutes.
          </p>
        </div>

        {/* Open reset screen */}
        <Button
          type="button"
          variant="modal"
          onClick={onOpenResetScreen}
          loading={loading}
          loadingText="Opening..."
          className="
            mt-auto
            h-[48px]
            w-[220px]
            text-[10px]
            md:text-[12px]
          "
        >
          Open reset screen

          <ArrowRight
            size={17}
            strokeWidth={1.8}
          />
        </Button>

        {/* Try another email */}
        <button
          type="button"
          onClick={onTryDifferentAddress}
          className="
            mt-2
            text-[10px]
            text-pedxo-gray
            transition-colors
            hover:text-pedxo-green
            md:text-[12px]
          "
        >
          Try a different address
        </button>
      </div>
    </div>
  )
}

export default ResetPasswordModal