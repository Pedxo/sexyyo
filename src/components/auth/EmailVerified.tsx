import {
    ArrowRight,
  } from 'lucide-react'
  
  import Button from '../ui/Button'
  
  import sendEmail from '../../assets/icons/sendEmail.svg'
  
  interface EmailVerifiedProps {
    email: string
    onContinue: () => void
    loading?: boolean
  }
  
  function EmailVerified({
    onContinue,
    loading = false,
  }: EmailVerifiedProps) {
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
      >
        <div
          className="
            flex
            h-[280px] w-[448px] bg-white 
            shadow-[0px_8px_24px_-8px_rgba(8,12,9,0.12)]
            max-w-full
            md:mt-12
            mt-30
            md:mr-10
            flex-col
            rounded-[28px]
            border
            border-pedxo-border
            border-t
            border-t-pedxo-border
          "
        >
          <div
            className="
              pointer-events-auto
              w-full
              max-w-[448px]
              rounded-[28px]
              border
              border-[#E2E6E2]
              bg-white
              flex
              flex-col
              items-center
              p-8
              shadow-[0px_8px_24px_-8px_#080C091F]
              lg:h-[280px]
            "
          >
            {/* Icon */}
  
            <div
              className="
                flex
                h-16
                w-16
                flex-col
                items-center
                justify-center
              "
            >
              <img
                src={sendEmail}
                alt=""
                className="
                  h-11 
                  w-11 
                  object-contain 
                  shrink-0
                "
              />
            </div>
  
            {/* Title */}
  
            <h3
              className="
                mt-4
                text-[20px]
                font-semibold
                leading-tight
                tracking-[-0.03em]
                text-[#080C09]
              "
            >
              Email verified
            </h3>
  
            {/* Description */}
  
            <p
              className="
                mt-2
                md:text-[14px]
                text-[12px]
                leading-5
                text-[#6E736E]
                text-center
              "
            >
              Your address is confirmed. Set your transaction PIN to
             start moving money.
            </p>
  
            {/* Continue */}
  
            <Button
              type="button"
              variant="modal"
              onClick={onContinue}
              loading={loading}
              loadingText="Continuing..."
              className="
                mt-5
                h-[48px]
                w-[133.44px]
                text-[13px]
                font-semibold
              "
            >
              Continue
  
              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  export default EmailVerified