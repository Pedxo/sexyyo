import {
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
} from 'lucide-react'

import {
  useLocation,
  useNavigate,
} from 'react-router'

import Logo from '../../components/ui/Logo'
import Button from '../../components/ui/Button'
import PasswordInput from '../../components/auth/PasswordInput'
import ValidationMessage from '../../components/auth/ValidationMessage'
import UpdatePasswordModal from '../../components/auth/UpdatePasswordModal'
import ExpiredResetPasswordModal from '../../components/auth/ExpiredResetPasswordModal'
import OTP from '../../components/auth/otp'

import stampBadge from '../../assets/icons/stamp_2.svg'
import { useAuthStore } from '../../store/auth.store'


function ResetNewPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const verifyResetOtp = useAuthStore(
    (state) => state.verifyResetOtp,
  )
  
  const resetPassword = useAuthStore(
    (state) => state.resetPassword,
  )

  const email = location.state?.email || ''

  /*
    =========================================================
    FORM STATE
    =========================================================
  */

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ])

  const [password, setPassword] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showExpiredModal, setShowExpiredModal] = useState(false)
  const [error, setError] = useState('')

  /*
    =========================================================
    PASSWORD VALIDATION
    =========================================================
  */

  const hasMinimumLength =
    password.length >= 8

  const hasUpperAndLower =
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password)

  const hasNumber =
    /\d/.test(password)

  const hasSymbol =
    /[^A-Za-z0-9]/.test(password)

  const passwordIsValid =
    hasMinimumLength &&
    hasUpperAndLower &&
    hasNumber &&
    hasSymbol

  const otpIsComplete =
    otp.every(
      (digit) => digit.length === 1,
    )

  /*
    =========================================================
    OTP VALUE
    =========================================================

    Converts:

      ['1', '2', '3', '4', '5', '6']

    into:

      '123456'
  */

  const enteredOtp = otp.join('')


  /*
    =========================================================
    SUBMIT
    =========================================================
  */

    const handleSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault()
    
      setSubmitted(true)
      setError('')
    
      /*
        =======================================================
        STEP 1 — VALIDATE OTP COMPLETION
        =======================================================
      */
    
      if (!otpIsComplete) {
        setError(
          'Enter the 6-digit code we sent you.',
        )
    
        return
      }
    
      /*
        =======================================================
        STEP 2 — VERIFY OTP THROUGH AUTH STORE
        =======================================================
    
        The page does NOT know what the correct OTP is.
    
        auth.store.ts handles:
        - resetOtp
        - resetEmail
        - resetOtpVerified
        - OTP verification
      */
    
      const otpVerified =
        verifyResetOtp(enteredOtp)
    
      /*
        =======================================================
        WRONG / EXPIRED OTP
        =======================================================
    
        Any complete OTP that the store rejects will
        display the existing ExpiredResetPasswordModal.
    
        No UI change.
        No route change.
      */
    
      if (!otpVerified) {
        setShowExpiredModal(true)
    
        return
      }
    
      /*
        =======================================================
        STEP 3 — VALIDATE NEW PASSWORD
        =======================================================
      */
    
      if (!password.trim()) {
        setError(
          'Create a new password to continue.',
        )
    
        return
      }
    
      if (!passwordIsValid) {
        setError(
          'Your new password does not meet all the requirements.',
        )
    
        return
      }
    
      /*
        =======================================================
        STEP 4 — VALIDATE PASSWORD CONFIRMATION
        =======================================================
      */
    
      if (!confirmPassword.trim()) {
        setError(
          'Confirm your new password to continue.',
        )
    
        return
      }
    
      if (
        password !==
        confirmPassword
      ) {
        setError(
          'The passwords you entered do not match.',
        )
    
        return
      }
    
      /*
        =======================================================
        STEP 5 — UPDATE PASSWORD
        =======================================================
    
        The OTP has already been verified by auth.store.ts.
    
        resetPassword() will:
        - verify resetOtpVerified
        - verify resetEmail matches the account
        - update accountPassword
        - invalidate resetOtpVerified
        - sign the user out
      */
    
      setLoading(true)
    
      await new Promise((resolve) =>
        setTimeout(resolve, 900),
      )
    
      const passwordReset =
        resetPassword(password)
    
      setLoading(false)
    
      /*
        =======================================================
        PASSWORD RESET FAILED
        =======================================================
    
        This normally means the reset session is no longer
        valid or the email does not match the account.
      */
    
      if (!passwordReset) {
        setError(
          'Your reset session is no longer valid. Please request a new reset link.',
        )
    
        return
      }
    
      /*
        =======================================================
        SUCCESS
        =======================================================
    
        Keep the existing UpdatePasswordModal.
      */
    
      setShowSuccessModal(true)
    }

  /*
    =========================================================
    PASSWORD CHANGE
    =========================================================
  */

  const handlePasswordChange = (
    value: string,
  ) => {
    setPassword(value)
    setError('')
  }

  const handleConfirmPasswordChange = (
    value: string,
  ) => {
    setConfirmPassword(value)
    setError('')
  }

  /*
    =========================================================
    OTP CHANGE
    =========================================================
  */

  const handleOtpChange = (
    value: string[],
  ) => {
    setOtp(value)

    /*
      Clear previous validation message
      when the user changes the OTP.
    */
    setError('')

    /*
      If the user had previously triggered
      the expired modal and starts entering
      a new code, close the modal.
    */
    if (showExpiredModal) {
      setShowExpiredModal(false)
    }
  }

  /*
    =========================================================
    NAVIGATION
    =========================================================
  */

  const handleSignIn = () => {
    navigate('/sign-in')
  }

  const handleBack = () => {
    navigate(-1)
  }

  /*
    =========================================================
    REQUEST NEW RESET LINK
    =========================================================

    Sends the user back to Forgot Password.

    We also preserve the email in navigation state
    so the Forgot Password page can use it if you
    decide to pre-fill the email field.
  */

  const handleRequestNewLink = () => {
    navigate(
      '/forgot-password',
      {
        state: {
          email,
        },
      },
    )
  }

  /*
    =========================================================
    PAGE
    =========================================================
  */

  return (
    <main className="min-h-screen bg-white">

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
            LEFT SIDE
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
            xl:px-12
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
              New password.
              <br />

              <span
                className="
                  italic
                  text-[#3BCA60]
                "
              >
                Same wallet.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-[450px]
                text-[14px]
                leading-5
                text-white/75
              "
            >
              Choose something strong and unique.
              Your password protects every balance
              and every transfer on Pedxo Pay.
            </p>

            <div
              className="
                mt-10
                space-y-4
              "
            >
              <Benefit>
                Minimum 8 characters, mixed case recommended
              </Benefit>

              <Benefit>
                Reset codes are single-use
              </Benefit>

              <Benefit>
                All other sessions sign out after a reset
              </Benefit>
            </div>
          </div>

          <p
            className="
              text-[12px]
              tracking-[0.28em]
              text-white/60
            "
          >
            SECURED · REGULATED · MULTI-CURRENCY
          </p>
        </div>

        {/* ===================================================
            RIGHT SIDE
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
          <Header
            onBack={handleBack}
            onSignIn={handleSignIn}
          />

          <div
            className="
              mx-auto
              mt-14
              w-full
              max-w-[448px]
            "
          >
            <PageHeading />

            {!showSuccessModal &&
              !showExpiredModal && (
                <ResetForm
                  otp={otp}
                  submitted={submitted}
                  password={password}
                  confirmPassword={confirmPassword}
                  error={error}
                  loading={loading}
                  passwordIsValid={
                    passwordIsValid
                  }
                  hasMinimumLength={
                    hasMinimumLength
                  }
                  hasUpperAndLower={
                    hasUpperAndLower
                  }
                  hasNumber={hasNumber}
                  hasSymbol={hasSymbol}
                  onOtpChange={
                    handleOtpChange
                  }
                  onPasswordChange={
                    handlePasswordChange
                  }
                  onConfirmPasswordChange={
                    handleConfirmPasswordChange
                  }
                  onSubmit={handleSubmit}
                />
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
          px-6
          pb-8
          pt-5
          lg:hidden
        "
      >
        <Header
          onBack={handleBack}
          onSignIn={handleSignIn}
        />

        <div className="mt-12">
          <PageHeading />

          {!showSuccessModal &&
            !showExpiredModal && (
              <ResetForm
                otp={otp}
                submitted={submitted}
                password={password}
                confirmPassword={confirmPassword}
                error={error}
                loading={loading}
                passwordIsValid={
                  passwordIsValid
                }
                hasMinimumLength={
                  hasMinimumLength
                }
                hasUpperAndLower={
                  hasUpperAndLower
                }
                hasNumber={hasNumber}
                hasSymbol={hasSymbol}
                onOtpChange={
                  handleOtpChange
                }
                onPasswordChange={
                  handlePasswordChange
                }
                onConfirmPasswordChange={
                  handleConfirmPasswordChange
                }
                onSubmit={handleSubmit}
              />
            )}
        </div>
      </section>

      {/* =====================================================
          UPDATE PASSWORD MODAL
          ===================================================== */}

      {showSuccessModal && (
        <UpdatePasswordModal
          onSignIn={handleSignIn}
        />
      )}

      {/* =====================================================
          EXPIRED RESET CODE MODAL
          ===================================================== */}

      {showExpiredModal && (
        <ExpiredResetPasswordModal
          onNewLink={handleRequestNewLink}
        />
      )}
    </main>
  )
}

/* ===========================================================
   HEADER
   =========================================================== */

function Header({
  onBack,
  onSignIn,
}: {
  onBack: () => void
  onSignIn: () => void
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
      "
    >
      <button
        type="button"
        onClick={onBack}
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
        onClick={onSignIn}
        className="
          text-[14px]
          text-pedxo-gray
          transition-colors
          hover:text-pedxo-black
        "
      >
        Sign in
      </button>
    </div>
  )
}

/* ===========================================================
   PAGE HEADING
   =========================================================== */

function PageHeading() {
  return (
    <>
      <h2
        className="
          md:text-[36px]
          text-[26px]
          font-semibold
          leading-[1.05]
          tracking-[-0.045em]
        "
      >
        Set a new{' '}

        <span
          className="
            font-inter-tight
            italic
            bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
            bg-clip-text
            text-transparent
          "
        >
          password
        </span>
      </h2>

      <p
        className="
          mt-3
          md:text-[14px]
          text-[12px]
          leading-5
          text-pedxo-gray
          md:text-[14px]
        "
      >
        Enter the code from your email, then choose
        a new password.
      </p>
    </>
  )
}

/* ===========================================================
   RESET FORM
   =========================================================== */

interface ResetFormProps {
  otp: string[]

  submitted: boolean

  password: string

  confirmPassword: string

  error: string

  loading: boolean

  passwordIsValid: boolean

  hasMinimumLength: boolean

  hasUpperAndLower: boolean

  hasNumber: boolean

  hasSymbol: boolean

  onOtpChange: (
    value: string[],
  ) => void

  onPasswordChange: (
    value: string,
  ) => void

  onConfirmPasswordChange: (
    value: string,
  ) => void

  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
  ) => void
}

function ResetForm({
  otp,
  submitted,
  password,
  confirmPassword,
  error,
  loading,
  passwordIsValid,
  hasMinimumLength,
  hasUpperAndLower,
  hasNumber,
  hasSymbol,
  onOtpChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetFormProps) {
  /*
    =========================================================
    FIELD ERROR STATES
    =========================================================
  */

  const otpInvalid =
    submitted &&
    !otp.every(Boolean)

  const passwordInvalid =
    submitted &&
    (!password.trim() ||
      !passwordIsValid)

  const confirmInvalid =
    submitted &&
    !confirmPassword.trim()

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8"
    >

      {/* ===================================================
          RESET CODE
          =================================================== */}

      <label
        className="
          mb-2
          block
          text-[12px]
          font-medium
          text-pedxo-black
        "
      >
        Reset code
      </label>

      <OTP
        value={otp}
        onChange={onOtpChange}
        error={otpInvalid}
        ariaLabelPrefix="Reset code digit"
        containerClassName="
          mt-3
          gap-1
          md:gap-2
        "
        inputClassName="
          h-[40px]
          w-[50px]
          text-[20px]

          md:h-[56px]
          md:w-[68px]
        "
      />

      {/* ===================================================
          NEW PASSWORD
          =================================================== */}

      <div
        className={`
          mt-6

          ${
            passwordInvalid
              ? `
                [&_input]:!border-[#E62C2C]
                [&_input:focus]:!border-[#E62C2C]
              `
              : ''
          }
        `}
      >
        <PasswordInput
          label="New password"
          placeholder="Create a strong password"
          value={password}
          onChange={
            onPasswordChange
          }
          showPasswordHint={true}
        />
      </div>

      {/* ===================================================
          CONFIRM PASSWORD
          =================================================== */}

      <div
        className={`
          mt-4

          ${
            confirmInvalid
              ? `
                [&_input]:!border-[#E62C2C]
                [&_input:focus]:!border-[#E62C2C]
              `
              : ''
          }
        `}
      >
        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={
            onConfirmPasswordChange
          }
          showPasswordHint={false}
        />
      </div>

      {/* ===================================================
          PASSWORD REQUIREMENTS
          =================================================== */}

      <div
        className="
          mt-4
          rounded-[24px]
          border
          border-[#E2E6E2]
          px-4
          py-4
        "
      >
        <div className="space-y-2">
          <PasswordRequirement
            valid={hasMinimumLength}
          >
            At least 8 characters
          </PasswordRequirement>

          <PasswordRequirement
            valid={hasUpperAndLower}
          >
            Upper and lower case letters
          </PasswordRequirement>

          <PasswordRequirement
            valid={hasNumber}
          >
            At least one number
          </PasswordRequirement>

          <PasswordRequirement
            valid={hasSymbol}
          >
            At least one symbol
          </PasswordRequirement>
        </div>
      </div>

      {/* ===================================================
          VALIDATION MESSAGE
          =================================================== */}

      {error && (
        <div className="mt-4">
          <ValidationMessage
            title="We couldn't reset that"
            message={error}
          />
        </div>
      )}

      {/* ===================================================
          UPDATE PASSWORD
          =================================================== */}

      <Button
        type="submit"
        variant="modal"
        loading={loading}
        loadingText="Updating password..."
        className="
          mt-5
          h-[52px]
          w-full
          text-[14px]
          font-semibold
        "
      >
        Update password

        <ArrowRight
          size={17}
          strokeWidth={1.8}
        />
      </Button>

      {/* ===================================================
          SECURITY
          =================================================== */}

      <p
        className="
          mt-5
          flex
          items-center
          justify-center
          gap-2
          text-[11px]
          text-pedxo-gray
        "
      >
        <img
          src={stampBadge}
          alt=""
          aria-hidden="true"
          className="h-4 w-4"
        />

        Resetting signs out every other device
      </p>
    </form>
  )
}

/* ===========================================================
   PASSWORD REQUIREMENT
   =========================================================== */

function PasswordRequirement({
  valid,
  children,
}: {
  valid: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >
      {valid ? (
        <span
          className="
            flex
            h-4
            w-4
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-pedxo-green
            text-white
          "
        >
          <Check
            size={10}
            strokeWidth={2.5}
          />
        </span>
      ) : (
        <Circle
          size={16}
          strokeWidth={1.5}
          className="
            shrink-0
            fill-[#E2E6E2]
            text-[#E2E6E2]
          "
        />
      )}

      <span
        className={`
          text-[11px]

          ${
            valid
              ? 'text-pedxo-green'
              : 'text-pedxo-gray'
          }
        `}
      >
        {children}
      </span>
    </div>
  )
}

/* ===========================================================
   LEFT-SIDE BENEFIT
   =========================================================== */

function Benefit({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
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

export default ResetNewPassword