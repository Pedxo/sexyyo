import { useState } from 'react'
import { useNavigate } from 'react-router'

import {
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'

import Logo from '../../components/ui/Logo'
import Button from '../../components/ui/Button'
import AuthInput from '../../components/auth/AuthInput'
import ValidationMessage from '../../components/auth/ValidationMessage'
import ResetPasswordModal from '../../components/auth/ResetPasswordModal'

import EmailIcon from '../../assets/icons/email.svg'
import stampBadge from '../../assets/icons/stamp_2.svg'
import resetPasswordIcon from '../../assets/icons/sendEmail.svg';
import { useAuthStore } from '../../store/auth.store'

interface ForgotPasswordPageProps {
  onBack?: () => void
  onSignIn?: () => void
}

function ForgotPasswordPage({
  onBack,
  onSignIn,
}: ForgotPasswordPageProps) {
  const navigate = useNavigate()
  const forgotPassword = useAuthStore(
    (state) => state.forgotPassword,
  )

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [error, setError] = useState('')

  /*
    =========================================================
    SEND RESET INSTRUCTIONS
    =========================================================
  */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
  
    setError('')
  
    if (!email.trim()) {
      setError('Enter your email address.')
      return
    }
  
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      setError('Enter a valid email address.')
      return
    }
  
    /*
      Store the email and generate the mock
      reset OTP.
  
      The page still owns validation.
    */
    forgotPassword(email.trim())
  
    setLoading(true)
  
    await new Promise((resolve) =>
      setTimeout(resolve, 900),
    )
  
    setLoading(false)
  
    setShowResetModal(true)
  }

  /*
    =========================================================
    OPEN RESET SCREEN
    =========================================================
  */

  const handleOpenResetScreen = () => {
    navigate('/reset-new-password', {
      state: {
        email: email.trim(),
      },
    })
  }

  /*
    =========================================================
    TRY A DIFFERENT ADDRESS
    =========================================================
  */

  const handleTryDifferentAddress = () => {
    setShowResetModal(false)
    setError('')
  }

  /*
    =========================================================
    BACK
    =========================================================
  */

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    navigate(-1)
  }

  /*
    =========================================================
    SIGN IN
    =========================================================
  */

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn()
      return
    }

    navigate('/sign-in')
  }

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          DESKTOP
          ===================================================== */}

      <section className="hidden min-h-screen lg:flex">
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
              my-auto
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
              Locked out?{' '}

              <span className="italic text-[#3BCA60]">
                Not for <br />
                long.
              </span>
            </h1>

            <p
              className="
                mt-5
                text-[14px]
                leading-5
                text-white/75
              "
            >
              We'll send a single-use reset link — or an
              OTP if you prefer SMS — so you can get
              straight back to your wallet.
            </p>

            <div className="mt-10 space-y-4">
              <Benefit>
                Reset links are single-use and expire in
                30 minutes
              </Benefit>

              <Benefit>
                Your balances stay untouched during a reset
              </Benefit>

              <Benefit>
                We never ask for your PIN over email or SMS
              </Benefit>
            </div>
          </div>

          <p
            className="
              text-[12px]
              font-normal
              leading-5
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
              onClick={handleBack}
              className="
                inline-flex
                items-center
                gap-1.5
                text-[14px]
                text-pedxo-gray
                transition-colors
                hover:text-pedxo-black
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
              onClick={handleSignIn}
              className="
                text-[14px]
                font-normal
                text-pedxo-gray
                transition-colors
                hover:text-pedxo-black
              "
            >
              Sign in
            </button>
          </div>

          {/* Main content */}

          <div
            className="
              mx-auto
              mt-12
              w-full
              max-w-[440px]
            "
          >
            {/* Title remains visible when modal opens */}

            <h2
              className="
                text-[36px]
                font-semibold
                leading-tight
                tracking-[-0.04em]
              "
            >
              Forgot your{' '}

              <span
                className="
                  italic
                  bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                  bg-clip-text
                  text-transparent
                "
              >
                password?
              </span>
            </h2>

            <p
              className="
                mt-2
                text-[14px]
                font-normal
                text-pedxo-gray
              "
            >
              Tell us where to send your reset
              instructions.
            </p>

            {/* =================================================
                FORM
                HIDDEN WHEN RESET MODAL OPENS
                ================================================= */}

            {!showResetModal && (
              <>
                {/* Email option */}

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
                    <img
                      src={EmailIcon}
                      alt=""
                      className="h-4 w-4"
                    />

                    <span>
                      Enter your pedxo account Email address
                    </span>
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <AuthInput
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)

                      if (event.target.value.trim()) {
                        setError('')
                      }
                    }}
                    placeholder="you@company.com"
                    helperText="We'll send a verification link."
                  />

                  {error && (
                    <div className="mt-4">
                      <ValidationMessage
                        title="Check that again"
                        message={error}
                      />
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    loading={loading}
                    loadingText="Sending instructions..."
                    className="
                      h-[52px]
                      w-full
                      text-[14px]
                    "
                  >
                    Send reset instructions

                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                    />
                  </Button>

                  <SecurityText />

                  <RememberedIt onSignIn={handleSignIn} />
                </div>
              </>
            )}
          </div>
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
            onClick={handleBack}
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
            onClick={handleSignIn}
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
              text-[20px]
              font-semibold
              leading-[1.05]
              tracking-[-0.045em]
            "
          >
            Forgot your{' '}

            <span
              className="
                italic
                bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                bg-clip-text
                text-transparent
              "
            >
              password?
            </span>
          </h1>

          <p
            className="
              mt-2
              text-[12px]
              text-pedxo-gray
              md:text-[14px]
            "
          >
            Tell us where to send your reset instructions.
          </p>
        </div>

        {/* =================================================
            MOBILE FORM
            ================================================= */}

        {!showResetModal && (
          <>
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
                  px-2
                  text-[12px]
                  font-medium
                  shadow-sm
                  whitespace-nowrap
                "
              >
                <img
                  src={EmailIcon}
                  alt=""
                  className="h-3 w-3"
                />

                <span>
                  Enter your pedxo account Email address
                </span>
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <AuthInput
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)

                  if (event.target.value.trim()) {
                    setError('')
                  }
                }}
                placeholder="you@company.com"
                helperText="We'll send a verification link."
                className="text-[11px]"
              />

              {error && (
                <div className="mt-4">
                  <ValidationMessage
                    title="Check that again"
                    message={error}
                  />
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmit}
                loading={loading}
                loadingText="Sending instructions..."
                className="
                  h-[52px]
                  w-full
                  text-[14px]
                "
              >
                Send reset instructions

                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </Button>

              <SecurityText />

              <RememberedIt onSignIn={handleSignIn} />
            </div>
          </>
        )}
      </section>

      {/* =====================================================
          RESET PASSWORD MODAL
          ===================================================== */}

      {showResetModal && (
        <ResetPasswordModal
          icon={resetPasswordIcon}
          onOpenResetScreen={handleOpenResetScreen}
          onTryDifferentAddress={
            handleTryDifferentAddress
          }
          loading={false}
        />
      )}
    </main>
  )
}

/* ===========================================================
   SECURITY TEXT
   =========================================================== */

function SecurityText() {
  return (
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
      <img
        src={stampBadge}
        alt=""
        className="h-4 w-4"
      />

      We never reveal whether an account exists
    </p>
  )
}

/* ===========================================================
   REMEMBERED PASSWORD
   =========================================================== */

function RememberedIt({
  onSignIn,
}: {
  onSignIn: () => void
}) {
  return (
    <p
      className="
        pt-1
        text-center
        text-[14px]
        text-pedxo-gray
      "
    >
      Remembered it?{' '}

      <button
        type="button"
        onClick={onSignIn}
        className="text-pedxo-green"
      >
        Sign in
      </button>
    </p>
  )
}

/* ===========================================================
   BENEFIT
   =========================================================== */

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

export default ForgotPasswordPage