import { ArrowRight, Check } from 'lucide-react'

import Button from '../ui/Button'
import sendEmail from '../../assets/icons/sendEmail.svg'

interface UpdatePasswordModalProps {
  onSignIn: () => void
}

function UpdatePasswordModal({
  onSignIn,
}: UpdatePasswordModalProps) {
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
      aria-labelledby="password-updated-title"
    >
      <div
        className="
          flex
          md:h-[300px]
          h-[60%] 
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
          sm:mr-30
          mt-32
          md:mt-20
        "
      >
        {/* Success icon */}

        <span
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-pedxo-soft-green
          "
        >
          <img src={sendEmail} alt="update email" className="md:h-11 md:w-11 h-8 w-8"/>
        </span>

        {/* Content */}

        <div className="mt-4 text-center">
          <h2
            id="password-updated-title"
            className="
              text-[20px]
              font-semibold
              leading-tight
              tracking-[-0.025em]
              text-pedxo-black
            "
          >
            Password updated
          </h2>

          <p
            className="
              mt-2
              max-w-[360px]
              text-[11px]
              sm:text-[12px]
              leading-5
              text-pedxo-gray
              md:text-[13px]
            "
          >
            You're all set. Sign in with your new password to get back
            to your wallet.
          </p>
        </div>

        {/* Sign in */}

        <Button
          type="button"
          variant="modal"
          onClick={onSignIn}
          className="
            md:mt-auto
            mt-6
            h-[48px]
            w-[160px]
            text-[11px]
            md:text-[13px]
          "
        >
          Go to sign in

          <ArrowRight
            size={17}
            strokeWidth={1.8}
          />
        </Button>
      </div>
    </div>
  )
}

export default UpdatePasswordModal