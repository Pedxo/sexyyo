import { useState} from 'react'
import { useNavigate, useLocation } from 'react-router';


import {
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'

import Logo from '../../components/ui/Logo'
import Button from '../../components/ui/Button'
import AuthInput from '../../components/auth/AuthInput'
import PasswordInput from '../../components/auth/PasswordInput'
import SocialButton from '../../components/auth/SocialButton'
import ValidationMessage from '../../components/auth/ValidationMessage'

import googleIcon from '../../assets/icons/Google_icon.svg'
//import githubIcon from '../../assets/icons/GitIcon_whiteBG.svg'
import githubIcon from '../../assets/icons/GitIcon_darkBG.svg';
import EmailIcon from "../../assets/icons/email.svg";
import stampBadge from "../../assets/icons/stamp_2.svg"
import VerifyEmail from '../../components/auth/VerifyEmail';
import verifyEmailIcon from "../../assets/icons/sendEmail.svg";

interface CreateAccountPageProps {
  onBack?: () => void
  onSignIn?: () => void
}

function CreateAccountPage({
  onBack,
  onSignIn,
}: CreateAccountPageProps) {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false)



  /*
    =========================================================
    CREATE ACCOUNT VALIDATION
    =========================================================
  */

    const handleSubmit = () => {
      setError('')
  
      if (!email.trim()) {
        setError(
          'Enter your email to continue.',
        )
        return
      }
  
      if (!password.trim()) {
        setError(
          'Enter your password to continue.',
        )
        return
      }
  
      if (password.length < 8) {
        setError(
          'Your password must be at least 8 characters.',
        )
        return
      }
  
      if (!acceptedTerms) {
        setError(
          'Please accept the Terms & Privacy Policy to continue.',
        )
        return
      }
  
      /*
        Validation passed.
  
        Instead of displaying the old loading state here,
        open the Verify Email modal.
      */
  
      setShowVerifyModal(true)
    }
  
    /*
      =========================================================
      VERIFY EMAIL MODAL -> OTP PAGE
      =========================================================
    */
  
    const handleVerifyEmail = async () => {
      setLoading(true)
  
      /*
        Backend/API registration will eventually happen here.
  
        The delay currently allows the spinner to be visible.
      */
  
      await new Promise((resolve) =>
        setTimeout(resolve, 1000),
      )
  
      setLoading(false)
  
      /*
        Pass the user's email to the OTP page.
      */
  
      navigate('/otp-verify-email', {
        state: {
          email: email.trim(),
        },
      })
    }
  
    /*
      =========================================================
      CLOSE MODAL
      =========================================================
    */
  
    // const handleModalBack = () => {
    //   setShowVerifyModal(false)
    // }

  return (
    <main
      className="
        min-h-screen
        bg-white
      "
    >
      {/* =====================================================
          DESKTOP
          ===================================================== */}

      <section
        className="
          hidden
          min-h-screen
          lg:flex
        "
      >
        {/* ===================================================
            LEFT GREEN SECTION
            =================================================== */}

        <div
          className="
            flex
            w-[50%]
            flex-col
            bg-[radial-gradient(126.55%_96.03%_at_30%_20%,#3BCA60_0%,#005F21_70%)]
            px-6
            py-10
            text-white
            xl:px-10
          "
        >
          <Logo
            light
            showText
            size="md"
          />

          <div
            className="
              mt-auto
              mb-auto
              max-w-[490px]
            "
          >
            <h1
              className="
                text-[48px]
                font-medium
                leading-[1.02]
                tracking-[-0.055em]
              "
            >
              Fund once.{' '}

              <span className="italic text-[#3bca60]">
              Pay everywhere.
              </span>
            </h1>

            <p
              className="
                mt-5
                text-[14px]
                text-white/75
              "
            >
              Open a multi-currency wallet in minutes. NGN, USD, GBP, <br />
              EUR, USDT and USDC — one balance for every Pedxo <br />
              service.
            </p>

            {/* Benefits */}

            <div className="mt-10 space-y-4">
              <Benefit>
                Instant Pedxo → Pedxo transfers, zero fees
              </Benefit>

              <Benefit>
                Bank-grade security with KYC-tiered limits
              </Benefit>

              <Benefit>
               Full statements and receipted history
              </Benefit>
            </div>
          </div>

          <p
            className="
              text-[12px]
              leading-5
              font-normal
              text-white/60
            "
          >
           SECURED · REGULATED · MULTI-CURRENCY
          </p>
        </div>

        {/* ===================================================
            RIGHT FORM SECTION
            =================================================== */}

        <div
          className="
            flex
            min-h-screen
            flex-1
            flex-col
            px-10
            py-10
            xl:px-20
          "
        >
          {/* Header */}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="
                inline-flex
                items-center
                gap-1.5
                text-[14px]
                text-pedxo-gray
              "
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.5}
              />

              Back
            </button>

            <button
              type="button"
              onClick={onSignIn}
              className="
                text-[14px]
                text-pedxo-gray
                font-normal
              "
            >
              Sign in
            </button>
          </div>

          {/* Form */}

          <div
            className="
              mx-auto
              mt-12
              w-full
              max-w-[440px]
            "
          >
            <h2
              className="
                text-[36px]
                font-semibold
                leading-tight
                tracking-[-0.04em]
              "
            >
              Create your{' '}

              <span className="
              bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
              bg-clip-text
              text-transparent
              italic">
                account
              </span>
            </h2>

            <p
              className="
                mt-2
                text-[14px]
                text-pedxo-gray
                font-normal
              "
            >
              Verify once, transact forever.
            </p>

            {/* ==========================
            DESKTOP FORM
            HIDDEN WHEN MODAL OPENS
          ============================ */}

          {!showVerifyModal && (<>
            {/* Email sign-up button */}

            <div
              className="
                mt-8
                rounded-full
                border
                border-pedxo-border
                bg-[#f7f9f7]
                p-1
              "
            >
              <button
                type="button"
                className="
                  flex
                  h-[44px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-white
                  text-[14px]
                  font-medium
                  shadow-sm
                "
              >
                <img src={EmailIcon} alt="email"/>

                <span>Sign up with your pedxo account Email</span>
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <AuthInput
                label="Email address"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@company.com"
                helperText="We'll send a verification link."
              />

              <PasswordInput
                value={password}
                onChange={setPassword}
              />

              {/* Terms */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-start
                  gap-3
                  text-[12px]
                  leading-5
                  text-[#454b47]
                "
              >
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(
                      event.target.checked,
                    )
                  }
                  className="
                    mt-0.5
                    h-4
                    w-4
                    accent-pedxo-green
                  "
                />

                <span>
                  I agree to Pedxo's{' '}
                  <u>Terms & Privacy Policy</u>.
                  KYC verification is required to
                  fund your wallet.
                </span>
              </label>

              {/* Validation */}

              {error && (
                <ValidationMessage
                  message={error}
                />
              )}

              {/* Create */}

              <Button
                type="button"
                onClick={handleSubmit}
                loading={loading}
                className="
                  h-[52px]
                  w-full
                  text-[14px]
                "
              >
                Create account

                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </Button>

              {/* Security */}

              <p
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-[12px]
                  text-pedxo-gray
                "
              >
                
                <img src={stampBadge} alt="stamp badge" className="h-4 w-4"/>

                256-bit encryption · KYC-tiered
                limits
              </p>

              <SocialButton icon={googleIcon}>
                Continue with Google
              </SocialButton>

              <SocialButton
                icon={githubIcon}
                dark
              >
                Continue with Github
              </SocialButton>

              <p
                className="
                  pt-1
                  text-center
                  text-[14px]
                  text-pedxo-gray
                "
              >
                Already have an account?{' '}

                <button
                  type="button"
                  onClick={onSignIn}
                  className="text-pedxo-green"
                >
                  Sign in
                </button>
              </p>
            </div>
            </>)}
          </div>
          {/* Verify Email modal */}

          {showVerifyModal && (
            <VerifyEmail
              email={email}
              icon={verifyEmailIcon}
              onVerify={handleVerifyEmail}
              loading={loading}
            />
          )}
        </div>
      </section>

      {/* =====================================================
          MOBILE
          ===================================================== */}

      <section
        className="
          flex
          min-h-screen
          flex-col
          px-10
          pb-6
          pt-5
          lg:hidden
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="
              inline-flex
              items-center
              gap-1.5
              text-[13px]
              text-pedxo-gray
            "
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.5}
            />

            Back
          </button>

          <button
            type="button"
            onClick={onSignIn}
            className="
              text-[13px]
              text-pedxo-gray
            "
          >
            Sign in
          </button>
        </div>

        {/* Heading */}

        <div className="mt-12">
          <h1
            className="
              md:text-[30px]
              text-[20px]
              font-semibold
              leading-[1.05]
              tracking-[-0.045em]
            "
          >
            Create your{' '}

            <span className="
              bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
              bg-clip-text
              text-transparent
              italic">
                account
              </span>
          </h1>

          <p
            className="
              mt-2
              md:text-[14px]
              text-[12px]
              text-pedxo-gray
            "
          >
            Verify once, transact forever.
          </p>
        </div>

        
        {/* ==========================
            MOBILE FORM
            HIDDEN WHEN MODAL OPENS
          ============================ */}
        {!showVerifyModal && (
        <>

        {/* Email sign-up */}
        <div
          className="
            mt-8
            rounded-full
            border
            border-pedxo-border
            bg-[#f7f9f7]
            p-1
          "
        >
          <button
            type="button"
            className="
              flex
              h-[44px]
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-full
              bg-white
              text-[12px]
              font-medium
              shadow-sm
              whitespace-nowrap
              px-2
            "
          >
            <img src={EmailIcon} alt="email" className="w-3 h-3"/>

            <span className="text-[12px]">Sign up with your pedxo account Email</span>
          </button>
        </div>

        {/* Form */}

        <div className="mt-5 space-y-5">
          <AuthInput
            label="Email address"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@company.com"
            helperText="We'll send a verification link."
            className="text-[11px]"
          />

          <PasswordInput
            value={password}
            onChange={setPassword}
          />

          {/* Terms */}

          <label
            className="
              flex
              cursor-pointer
              items-start
              gap-3
              text-[12px]
              leading-5
              text-[#454b47]
            "
          >
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) =>
                setAcceptedTerms(
                  event.target.checked,
                )
              }
              className="
                mt-0.5
                h-4
                w-4
                shrink-0
                accent-pedxo-green
                text-[12px]
              "
            />

            <span>
              I agree to Pedxo's{' '}
              <u>Terms & Privacy Policy</u>. KYC
              verification is required to fund your
              wallet.
            </span>
          </label>

          {/* Validation */}

          {error && (
            <ValidationMessage
              message={error}
            />
          )}

          {/* Create account */}

          <Button
            type="button"
            onClick={handleSubmit}
            loading={loading}
            className="
              h-[52px]
              w-full
              text-[14px]
            "
          >
            Create account

            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </Button>

          {/* Security */}

          <p
            className="
              flex
              items-center
              justify-center
              gap-2
              text-[12px]
              text-pedxo-gray
            "
          >
            <img src={stampBadge} alt="stamp badge" className="h-4 w-4"/>

            256-bit encryption · KYC-tiered limits
          </p>

          {/* Social */}

          <SocialButton icon={googleIcon}>
            Continue with Google
          </SocialButton>

          <SocialButton
            icon={githubIcon}
            dark
          >
            Continue with Github
          </SocialButton>

          <p
            className="
              pb-2
              pt-1
              text-center
              text-[14px]
              text-pedxo-gray
            "
          >
            Already have an account?{' '}

            <button
              type="button"
              onClick={onSignIn}
              className="text-pedxo-green"
            >
              Sign in
            </button>
          </p>
        </div>
        </>
        )}
      </section>
      {/* Verify Email modal */}

      {showVerifyModal && (
        <VerifyEmail
          email={email}
          icon={verifyEmailIcon}
          onVerify={handleVerifyEmail}
          loading={loading}
          />
        )}
     </main>
     )
    }

function Benefit({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/15
        "
      >
        <Check
          size={14}
          strokeWidth={2}
        />
      </span>

      <span
        className="
          text-[14px]
          text-white/90
        "
      >
        {children}
      </span>
    </div>
  )
}

export default CreateAccountPage