import {
    ArrowRight,
  } from 'lucide-react'
  
  import Button from '../../components/ui/Button'
  import verifyEmailIcon from '../../assets/icons/verifyEmail_icon.svg'
  
  
  interface CreatePINSuccessModalProps {
    onContinue: () => void
  }
  
  
  function CreatePINSuccessModal({
    onContinue,
  }: CreatePINSuccessModalProps) {
    return (
      <div
        className="
          fixed
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          px-5
          sm:px-8
          lg:left-1/2
          lg:justify-center
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-pin-success-title"
      >
        <div
          className="
            flex
            h-[280px]
            w-[448px]
            max-w-full
            flex-col
            md:mt-44
            mt-40
            items-center
            rounded-[28px]
            border
            border-pedxo-border
            bg-white
            p-8
            shadow-[0px_8px_24px_-8px_rgba(8,12,9,0.12)]
          "
        >
          {/* =================================================
              ICON
              ================================================= */}
  
          <img
            src={verifyEmailIcon}
            alt=""
            className="
              h-11
              w-11
              shrink-0
              object-contain
            "
          />
  
  
          {/* =================================================
              CONTENT
              ================================================= */}
  
          <div className="mt-4 text-center">
            <h2
              id="create-pin-success-title"
              className="
                text-[20px]
                font-semibold
                leading-tight
                tracking-[-0.025em]
                text-[#080C09]
              "
            >
              Transaction PIN set
            </h2>
  
            <p
              className="
                mt-2
                text-[13px]
                leading-5
                text-[#6E736E]
              "
            >
              Your wallet is ready. Use this PIN to approve transfers,
              payments and withdrawals.
            </p>
          </div>
  
  
          {/* =================================================
              BUTTON
              ================================================= */}
  
          <Button
            type="button"
            variant="modal"
            onClick={onContinue}
            className="
              mt-auto
              md:h-[48px]
              md:w-[180px]
              h-[40px]
              w-[175px]
              md:text-[13px]
              text-[11px]
              font-semibold
            "
          >
            Go to Sign in
  
            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </Button>
        </div>
      </div>
    )
  }
  
  
  export default CreatePINSuccessModal