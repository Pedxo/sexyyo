import {
    ArrowRight,
  } from 'lucide-react'
  
  import Button from '../ui/Button'
  
  import errorIcon from '../../assets/icons/email_expired.svg';
  
  interface ExpiredEmailProps {
    onNewLink: () => void
    onDifferentEmail?: () => void
    loading?: boolean
  }
  
  function ExpiredEmail({
    onNewLink,
    onDifferentEmail,
    loading = false,
  }: ExpiredEmailProps) {
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
            h-[280px] w-[448px]  bg-white 
            shadow-[0px_8px_24px_-8px_rgba(8,12,9,0.12)]
            max-w-full
            md:mt-14
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
              flex
              flex-col
              items-center
              max-w-[448px]
              rounded-[28px]
              border
              border-[#E2E6E2]
              bg-white
              p-8
              shadow-[0px_8px_24px_-8px_#080C091F]
              lg:h-[280px]
            "
          >
            {/* Icon */}
  
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
              "
            >
              <img
                src={errorIcon}
                alt=""
                className="
                  md:h-11
                  md:w-11
                  h-10
                  w-10
                "
              />
            </div>
  
            {/* Title */}
  
            <h3
              className="
                md:mt-4
                mt-6
                md:text-[20px]
                text-[18px]
                font-semibold
                leading-tight
                tracking-[-0.03em]
                text-[#080C09]
              "
            >
              This link has expired
            </h3>
  
            {/* Description */}
  
            <p
              className="
                md:mt-2
                mt-4
                text-[13px]
                text-center
                leading-5
                text-[#6E736E]
              "
            >
              Verification links are valid for 30 minutes.
              Request a fresh one and we'll email it right
              away.
            </p>
  
            {/* New link */}
  
            <Button
              type="button"
              variant="modal"
              onClick={onNewLink}
              loading={loading}
              loadingText="Sending..."
              className="
                md:mt-3
                mt-6
                md:h-[44px]
                h-[38px]
                w-[188.56px]
                md:text-[13px]
                text-[11px]
                font-semibold
              "
            >
              Send a new link
  
              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </Button>
  
            {/* Different email */}
  
            <button
              type="button"
              onClick={onDifferentEmail}
              className="
                md:mt-2
                mt-6
                block
                w-full
                text-center
                md:text-[11px]
                text[8px]
                font-normal
                text-[#6E736E]
                transition-colors
                hover:text-[#005F21]
                mb-10
              "
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default ExpiredEmail