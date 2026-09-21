import {ArrowRight} from 'lucide-react';
import Button from '../ui/Button';

interface VerifyEmailProps {
    email: string
    icon: string
    loading?: boolean
    onVerify: () => void
}

function VerifyEmail({email, icon, loading, onVerify,}: VerifyEmailProps){

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
      aria-labelledby="verify-email-title"
    >
            <div 
                className="flex h-[280px] w-[448px] bg-white 
                shadow-[0px_8px_24px_-8px_rgba(8,12,9,0.12)]
                max-w-full
                flex-col
                rounded-[28px]
                border
                border-pedxo-border
                border-t
                border-t-pedxo-border
                md:mt-16
                mt-18
                md:mr-10
                md:p-8
                px-4
                py-8
                items-center
                "
                >
                {/*icon*/}
                <img src={icon} alt="verify email" className="h-11 w-11 object-contain shrink-0"/>

                 {/* Content */}
                 <div className="mt-4 text-center">
                    <h2 
                    id="verify-email-title"
                    className="text-[20px] font-semibold md:leading-tight tracking-[-0.025em] text-pedxo-black mt-4">
                     Account created
                    </h2>
                    <p
                    className="
                    mt-2
                    md:text-[13px]
                    text-[12px]
                    md:leading-5
                    text-pedxo-gray
                    mb-2
                    "
                     >
                    We've sent a verification link to{' '}
                    <span
                    className="
                        break-words
                        text-pedxo-gray
                        [overflow-wrap:anywhere]
                    "
                    >
                    {email}.
                    </span>{' '}
                    Confirm it to unlock your wallet.
                    </p>
                 </div>

                  {/* Button */}

                  <Button
                   type="button"
                   variant="modal"
                   onClick={onVerify}
                   loading={loading}
                   loadingText="Verifying..."
                   className="
                   mt-auto 
                   h-[48px]
                   w-[158px]
                   md:text-[13px]
                   text-[11px]
                   ">
                      Verify Email
                      <ArrowRight
                        size={17}
                        strokeWidth={1.8}
                    />
                  </Button>
            </div>
        </div>
    )
}

export default VerifyEmail;