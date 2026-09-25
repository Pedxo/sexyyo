import {
    ArrowRight,
  } from 'lucide-react'
  
  import Button from '../ui/Button';
  import {useNavigate} from 'react-router'
  
  import errorIcon from '../../assets/icons/email_expired.svg'
  
  interface ExpiredResetPasswordModalProps {
    onNewLink: () => void
    loading?: boolean
  }
  
  function ExpiredResetPasswordModal({
    onNewLink,
    loading = false,
  }: ExpiredResetPasswordModalProps) {
      const navigate = useNavigate();

    const handleSignLink = () => {
        navigate("/sign-in");
    }
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
        aria-labelledby="expired-reset-password-title"
      >
        <div
          className="
            flex
            md:h-[280px]
            h-[58%]
            w-[448px]
            max-w-full
            flex-col
            rounded-[28px]
            border
            border-pedxo-border
            bg-white
            shadow-[0px_8px_24px_-8px_rgba(8,12,9,0.12)]
            md:mr-10
            sm:mr-30
            md:mt-28
            mt-36
          "
        >
          <div
            className="
              pointer-events-auto
              flex
              h-full
              w-full
              max-w-[448px]
              flex-col
              items-center
              rounded-[28px]
              border
              border-[#E2E6E2]
              bg-white
              p-8
              shadow-[0px_8px_24px_-8px_#080C091F]
            "
          >
            {/* =================================================
                ICON
                ================================================= */}
  
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
                  h-10
                  w-10
                  md:h-11
                  md:w-11
                "
              />
            </div>
  
            {/* =================================================
                TITLE
                ================================================= */}
  
            <h3
              id="expired-reset-password-title"
              className="
                mt-6
                text-[18px]
                font-semibold
                leading-tight
                tracking-[-0.03em]
                text-[#080C09]
                md:mt-4
                md:text-[20px]
              "
            >
              This reset link has expired
            </h3>
  
            {/* =================================================
                DESCRIPTION
                ================================================= */}
  
            <p
              className="
                mt-4
                text-center
                md:text-[13px]
                text-[12px]
                leading-5
                text-[#6E736E]
                md:mt-2
              "
            >
              For your security, reset links and codes last 30 minutes.
              Request a new one to continue.
            </p>
  
            {/* =================================================
                REQUEST NEW LINK
                ================================================= */}
  
            <Button
              type="button"
              variant="modal"
              onClick={onNewLink}
              loading={loading}
              loadingText="Sending..."
              className="
                mt-6
                h-[38px]
                w-[226px]
                text-[10px]
                font-semibold
                md:mt-3
                md:h-[44px]
                md:text-[12px]
              "
            >
              Request a new link
  
              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </Button>

            <span 
            onClick={handleSignLink}
            className="
            text-[#6E736E] 
            md:text-[14px] 
            mt-2
            text-[12px]
            cursor-pointer
            ">
              Back to sign in
            </span>
          </div>
        </div>
      </div>
    )
  }
  
  export default ExpiredResetPasswordModal