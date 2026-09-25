import {
    useEffect,
    useRef,
    useState,
  } from 'react'
  
  import {
    ArrowLeft,
    ArrowRight,
    Check,
  } from 'lucide-react'
  
  import {
    useLocation,
    useNavigate,
  } from 'react-router'
  
  import Logo from '../../components/ui/Logo'
  import Button from '../../components/ui/Button'
  import ValidationMessage from '../../components/auth/ValidationMessage'
  
  import EmailVerified from '../../components/auth/EmailVerified'
  import ExpiredEmail from '../../components/auth/ExpiredEmail'
  
  import verifyEmailIcon from '../../assets/icons/verifyEmail_icon.svg'
  import stampBadge from '../../assets/icons/stamp_2.svg'
  import resendIcon from '../../assets/icons/resend_icon.svg'
  import { useAuthStore } from '../../store/auth.store'
  
  interface LocationState {
    email?: string
    expired?: boolean
  }
  
  
  function OTPVerifyEmailPage() {
    const navigate = useNavigate()
    const location = useLocation()

    const verifyEmailOtp = useAuthStore(
      (state) => state.verifyEmailOtp,
    )
    
    const resendEmailOtp = useAuthStore(
      (state) => state.resendEmailOtp,
    )
  
    const state = location.state as LocationState | null
    const email = state?.email || 'you@company.com'
    const [otp, setOtp] = useState([
      '',
      '',
      '',
      '',
      '',
      '',
    ])
  
    const [activeIndex, setActiveIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showVerifiedModal, setShowVerifiedModal] = useState(false)
    const [showExpiredModal, setShowExpiredModal] = useState(Boolean(state?.expired),)

    /*
    =================================================
    RESEND OTP COUNTDOWN
    ===============================================

    34 -> 33 -> 32 -> ... -> 1 -> 0

    At 0 the "Resend email" button becomes clickable.
    */
    const [resendSeconds, setResendSeconds] = useState(34)
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])

    /*
  ===============================================
  RESEND OTP COUNTDOWN
  ===============================================

  Starts automatically when the OTP page renders.
*/
useEffect(() => {
    if (resendSeconds <= 0) {
      return
    }
  
    const timer = window.setInterval(() => {
      setResendSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer)
  
          return 0
        }
  
        return previous - 1
      })
    }, 1000)
  
    return () => {
      window.clearInterval(timer)
    }
  }, [resendSeconds])
  
    
    const showVerificationContent =
      !showVerifiedModal &&
      !showExpiredModal
  
    /*
      =========================================================
      FOCUS FIRST INPUT
      =========================================================
    */
  
    useEffect(() => {
      /*
        Do not focus an OTP input while a modal is open.
      */
  
      if (!showVerificationContent) {
        return
      }
  
      inputRefs.current[0]?.focus()
    }, [showVerificationContent])
  
    /*
      =========================================================
      OTP CHANGE
      =========================================================
    */
  
    const handleOtpChange = (
      index: number,
      value: string,
    ) => {
      /*
        Only allow numbers.
      */
  
      const numericValue =
        value.replace(/\D/g, '')
  
      if (!numericValue) {
        const updated = [...otp]
  
        updated[index] = ''
  
        setOtp(updated)
  
        return
      }
  
      /*
        Handle pasted/multiple digits.
      */
  
      const digits = numericValue.slice(0, 6)
      const updated = [...otp]
  
      digits
        .split('')
        .forEach((digit, offset) => {
          const targetIndex =
            index + offset
  
          if (targetIndex < 6) {
            updated[targetIndex] = digit
          }
        })
  
      setOtp(updated)
  
      const nextIndex = Math.min(
        index + digits.length,
        5,
      )
  
      setActiveIndex(nextIndex)
  
      inputRefs.current[nextIndex]?.focus()
    }
  
    /*
      =========================================================
      KEYBOARD HANDLING
      =========================================================
    */
  
    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (
        event.key === 'Backspace' &&
        !otp[index] &&
        index > 0
      ) {
        const previousIndex =
          index - 1
  
        const updated = [...otp]
  
        updated[previousIndex] = ''
  
        setOtp(updated)
  
        setActiveIndex(previousIndex)
  
        inputRefs.current[
          previousIndex
        ]?.focus()
      }
  
      if (
        event.key === 'ArrowLeft' &&
        index > 0
      ) {
        const previousIndex =
          index - 1
  
        setActiveIndex(previousIndex)
  
        inputRefs.current[
          previousIndex
        ]?.focus()
      }
  
      if (
        event.key === 'ArrowRight' &&
        index < 5
      ) {
        const nextIndex =
          index + 1
  
        setActiveIndex(nextIndex)
  
        inputRefs.current[
          nextIndex
        ]?.focus()
      }
    }
  
    /*
      =========================================================
      PASTE
      =========================================================
    */
  
    const handlePaste = (
      event: React.ClipboardEvent<HTMLInputElement>,
    ) => {
      event.preventDefault()
  
      const pasted =
        event.clipboardData
          .getData('text')
          .replace(/\D/g, '')
          .slice(0, 6)
  
      if (!pasted) {
        return
      }
  
      const updated = [
        '',
        '',
        '',
        '',
        '',
        '',
      ]
  
      pasted
        .split('')
        .forEach((digit, index) => {
          updated[index] = digit
        })
  
      setOtp(updated)
  
      const nextIndex =
        Math.min(
          pasted.length,
          5,
        )
  
      setActiveIndex(nextIndex)
  
      inputRefs.current[
        nextIndex
      ]?.focus()
    }
  
    /*
      ==================================
      VERIFY OTP
      ==================================
    */
  
/*
  ==================================
  VERIFY OTP
  ==================================
*/

const handleVerify = async () => {
  setError('')

  const enteredOtp = otp.join('')

  /*
    =======================================================
    OTP LENGTH VALIDATION
    =======================================================
  */

  if (enteredOtp.length !== 6) {
    return
  }

  /*
    Make sure the other modal is closed before
    starting a new verification attempt.
  */

  setShowExpiredModal(false)
  setShowVerifiedModal(false)

  setLoading(true)

  /*
    Temporary delay to show the spinner.

    Keep this because it is part of the existing
    frontend UI behavior.
  */

  await new Promise((resolve) =>
    setTimeout(resolve, 1200),
  )

  /*
    =======================================================
    VERIFY THROUGH ZUSTAND
    =======================================================

    auth.store.ts is now responsible for checking
    whether the OTP is correct.

    The page does NOT know the actual OTP.
  */

  const verified = verifyEmailOtp(enteredOtp)

  setLoading(false)

  /*
    =======================================================
    INVALID / EXPIRED OTP
    =======================================================
  */

  if (!verified) {
    setShowExpiredModal(true)

    return
  }

  /*
    =======================================================
    CORRECT OTP
    =======================================================

    The store has already changed:

      emailVerified: true

    and:

      user.emailVerified: true

    The existing EmailVerified modal remains
    responsible for the next step.
  */

  setShowVerifiedModal(true)
}
  
    /*
      =========================================================
      BACK
      =========================================================
    */
  
    const handleBack = () => {
      navigate('/create-account')
    }
  
    /*
      =========================================================
      SEND NEW LINK
      =========================================================
    */
  
    const handleNewLink = async () => {
      /*
        Connect your resend-email API here later.
  
        For now we return to Create Account.
      */
  
      setShowExpiredModal(false)
  
      navigate('/create-account')
    }

 
//RESEND OTP

const handleResendOtp = async () => {
  /*
    Prevent accidental clicks while the countdown is active.
  */

  if (resendSeconds > 0) {
    return
  }

  /*
    =======================================================
    RESEND OTP THROUGH ZUSTAND
    =======================================================

    auth.store.ts will generate/reset the mock OTP.

    For the current mock store, the OTP is:

      123456

    The page does not need to know that.
  */

  resendEmailOtp()

  /*
    =======================================================
    RESET COUNTDOWN
    =======================================================

    The UI will now display:

      Resend in 34s
  */

  setResendSeconds(34)

  /*
    =======================================================
    CLEAR PREVIOUS OTP
    =======================================================
  */

  setOtp([
    '',
    '',
    '',
    '',
    '',
    '',
  ])

  /*
    =======================================================
    CLEAR VALIDATION
    =======================================================
  */

  setError('')

  /*
    =======================================================
    CLOSE EXPIRED MODAL
    =======================================================
  */

  setShowExpiredModal(false)

  /*
    =======================================================
    START FROM FIRST INPUT
    =======================================================
  */

  setActiveIndex(0)

  /*
    =======================================================
    FOCUS FIRST INPUT
    =======================================================
  */

  inputRefs.current[0]?.focus()

  /*
    =======================================================
    FUTURE BACKEND
    =======================================================

  */
}
  
    /*
      ==================================
      DIFFERENT EMAIL
      ==================================
    */
  
    const handleDifferentEmail = () => {
      setShowExpiredModal(false)
  
      navigate('/create-account')
    }
  
    /*
      =========================================================
      CONTINUE AFTER VERIFICATION
      =========================================================
    */
  
    const handleContinue = () => {
      /*
        Change this destination when your dashboard/auth
        route is ready.
      */
  
      navigate('/create-transaction-pin')
    }
  
    /*
      =========================================================
      OTP COMPLETE
      =========================================================
    */
  
    const isComplete =
      otp.every(
        (digit) =>
          digit.length === 1,
      )
  
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
                One check.{' '}
  
                <span className="italic text-[#3bca60]">
                  Then <br /> you're in.
                </span>
              </h1>
  
              <p
                className="
                  mt-5
                  text-[14px]
                  text-white/75
                "
              >
                Verifying your email keeps your balances safe and <br />
                unlocks funding across NGN, USD, GBP, EUR, USDT and <br />
                USDC.
              </p>
  
              <div className="mt-10 space-y-4 text-white/85">
                <Benefit>
                  Links expire in 30 minutes for your safety
                </Benefit>
  
                <Benefit>
                  Resend any time — old links stop working
                </Benefit>
  
                <Benefit>
                  Verified accounts unlock wallet funding
                </Benefit>
              </div>
            </div>
  
            <p
              className="
                text-[12px]
                leading-5
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
                onClick={() =>
                  navigate('/sign-in')
                }
                className="
                  text-[14px]
                  text-pedxo-gray
                "
              >
                Sign in
              </button>
            </div>
  
            {/* Main */}
  
            <div
              className="
                mx-auto
                mt-12
                w-full
                max-w-[448px]
              "
            >
              {/* =================================================
                  HEADING
  
                  This remains visible when either modal opens.
                  ================================================= */}
  
              <h2
                className="
                  text-[36px]
                  font-semibold
                  leading-tight
                  tracking-[-0.04em]
                "
              >
                Verify your{' '}
  
                <span
                  className="
                    bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                    bg-clip-text
                    text-transparent
                    font-inter-tight
                    italic
                  "
                >
                  email
                </span>
              </h2>
             {/* =================
              Subtitle
              =================== */}
              <p
                className="
                  mt-2
                  text-[14px]
                  text-pedxo-gray
                  whitespace-normal
                  lg:whitespace-nowrap
                "
              >
                We sent a 6-digit code and a magic link
                to {email}.
              </p>
  
              {/* =================================================
                  VERIFICATION CONTENT
                  ================================================= */}
  
              {showVerificationContent && (
                <>
                  {/* Inbox information */}
  
                  <div
                    className="
                      mt-7
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      shadow
                      bg-[#ffffff]
                      p-4
                    "
                  >
                    <img
                      src={verifyEmailIcon}
                      alt="email"
                      className="h-8 w-8"
                    />
  
                    <div>
                      <h3
                        className="
                          text-[13px]
                          font-semibold
                          text-[#080C09]
                        "
                      >
                        Check your inbox
                      </h3>
  
                      <p
                        className="
                          mt-1
                          text-[12px]
                          leading-5
                          text-[#6E736E]
                        "
                      >
                        Tap the link in the email, or enter
                        the code below. Don't forget to look
                        in spam.
                      </p>
                    </div>
                  </div>
  
                  {/* Verification label */}
  
                  <p
                    className="
                      mt-7
                      text-[13px]
                      font-medium
                      text-[#080C09CC]
                    "
                  >
                    Verification code
                  </p>
  
                  {/* OTP */}
  
                  <div className="mt-3 flex gap-2">
                    {otp.map((digit, index) => {
                      const isActive =
                        activeIndex === index
  
                      const hasValue =
                        digit.length > 0
  
                      return (
                        <input
                          key={index}
                          ref={(element) => {
                            inputRefs.current[
                              index
                            ] = element
                          }}
                          value={digit}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          aria-label={`Verification digit ${
                            index + 1
                          }`}
                          onFocus={() =>
                            setActiveIndex(index)
                          }
                          onChange={(event) =>
                            handleOtpChange(
                              index,
                              event.target.value,
                            )
                          }
                          onKeyDown={(event) =>
                            handleKeyDown(
                              index,
                              event,
                            )
                          }
                          onPaste={handlePaste}
                          className={`
                            h-[56px]
                            w-[68px]
                            rounded-[24px]
                            border
                            bg-[#FFFFFF01]
                            text-center
                            text-[20px]
                            font-semibold
                            text-[#080C09]
                            outline-none
                            transition-all
  
                            ${
                              isActive || hasValue
                                ? `
                                  border-pedxo-green
                                  shadow-[0px_0px_0px_4px_#1CA0451F]
                                `
                                : `
                                  border-[#E2E6E2]
                                `
                            }
                          `}
                        />
                      )
                    })}
                  </div>
  
                  {/* Validation */}
  
                  {error && (
                    <div className="mt-4">
                      <ValidationMessage
                        message={error}
                      />
                    </div>
                  )}
  
                  {/* Verify */}
  
                  <Button
                    type="button"
                    variant="modal"
                    disabled={!isComplete}
                    onClick={handleVerify}
                    loading={loading}
                    loadingText="Verifying..."
                    className="
                      mt-6
                      h-[52px]
                      w-full
                      text-[14px]
                      font-semibold
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      disabled:shadow-none
                    "
                  >
                    Verify email
  
                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                    />
                  </Button>
  
                {/* Resend OTP*/}

                <button
                    type="button"
                    disabled={resendSeconds > 0}
                    onClick={handleResendOtp}
                    className={`
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        text-[12px]
                        font-bold
                        transition-colors
                        duration-200

                        ${
                        resendSeconds > 0
                            ? 'cursor-not-allowed text-[#6E736E]'
                            : 'cursor-pointer text-pedxo-green hover:text-pedxo-green-dark'
                        }
                    `}
                    >
                    <img
                        src={resendIcon}
                        alt=""
                        className={`
                        h-4
                        w-4
                        transition-opacity
                        duration-200
                        ${
                            resendSeconds > 0
                            ? 'opacity-70'
                            : 'opacity-100'
                        }
                        `}
                    />

                    {resendSeconds > 0
                        ? `Resend in ${resendSeconds}s`
                        : 'Resend email'}
                    </button>  
                    {/* Expiry */}
    
                    <p
                        className="
                        mt-4
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
  
                    Links expire after 30 minutes.
                  </p>
                </>
              )}
            </div>
  
            {/* =================================================
                VERIFIED MODAL
                ================================================= */}
  
            {showVerifiedModal && (
              <EmailVerified
                email={email}
                onContinue={handleContinue}
              />
            )}
  
            {/* =================================================
                EXPIRED MODAL
                ================================================= */}
  
            {showExpiredModal && (
              <ExpiredEmail
                onNewLink={handleNewLink}
                onDifferentEmail={
                  handleDifferentEmail
                }
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
              onClick={() =>
                navigate('/sign-in')
              }
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
                text-[30px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
              "
            >
              Verify your{' '}
  
              <span
                className="
                  bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                  bg-clip-text
                  text-transparent
                  font-inter-tight
                  italic
                "
              >
                email
              </span>
            </h1>
            {/* =================
              Subtitle
              =================== */}
            <p
              className="
                mt-3
                md:text-[13px]
                text-[12px]
                leading-5
                text-pedxo-gray
              "
            >
              We sent a 6-digit code and a magic link
              to {email}.
            </p>
          </div>
  
          {/* =================================================
              MOBILE VERIFICATION CONTENT
              ================================================= */}
  
          {showVerificationContent && (
            <>
              {/* Inbox */}
  
              <div
                className="
                  mt-7
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  shadow
                  bg-[#ffffff]
                  p-4
                "
              >
                <img
                  src={verifyEmailIcon}
                  alt="verify icon"
                  className="h-8 w-8"
                />
  
                <div>
                  <h3
                    className="
                      text-[13px]
                      font-semibold
                      text-[#080C09]
                    "
                  >
                    Check your inbox
                  </h3>
  
                  <p
                    className="
                      mt-1
                      md:text-[12px]
                      text-[10px]
                      leading-5
                      text-[#6E736E]
                    "
                  >
                    Tap the link in the email, or enter
                    the code <br />below. Don't forget to look
                    in spam.
                  </p>
                </div>
              </div>
  
              {/* Label */}
  
              <p
                className="
                  mt-7
                  text-[13px]
                  font-medium
                  text-[#080C09CC]
                "
              >
                Verification code
              </p>
  
              {/* OTP */}
  
              <div className="mt-3 flex md:justify-between gap-1">
                {otp.map((digit, index) => {
                  const isActive =
                    activeIndex === index
  
                  const hasValue =
                    digit.length > 0
  
                  return (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[
                          index
                        ] = element
                      }}
                      value={digit}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`Verification digit ${
                        index + 1
                      }`}
                      onFocus={() =>
                        setActiveIndex(index)
                      }
                      onChange={(event) =>
                        handleOtpChange(
                          index,
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(
                          index,
                          event,
                        )
                      }
                      onPaste={handlePaste}
                      className={`
                        md:h-[56px]
                        md:w-[68px]
                        h-[48px]
                        w-[44px]
                        max-w-[15vw]
                        rounded-[24px]
                        border
                        bg-[#FFFFFF01]
                        text-center
                        md:text-[18px]
                        text-[14px]
                        font-semibold
                        text-[#080C09]
                        outline-none
                        transition-all
  
                        ${
                          isActive || hasValue
                            ? `
                              border-pedxo-green
                              shadow-[0px_0px_0px_4px_#1CA0451F]
                            `
                            : `
                              border-[#E2E6E2]
                            `
                        }
                      `}
                    />
                  )
                })}
              </div>
  
              {/* Validation */}
  
              {error && (
                <div className="mt-4">
                  <ValidationMessage
                    message={error}
                  />
                </div>
              )}
  
              {/* Verify */}
  
              <Button
                type="button"
                variant="modal"
                disabled={!isComplete}
                onClick={handleVerify}
                loading={loading}
                loadingText="Verifying..."
                className="
                  mt-6
                  md:h-[52px]
                  md:w-[448px]
                  h-[48px]
                  w-[282px]
                  text-[14px]
                  font-semibold
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  disabled:shadow-none
                "
              >
                Verify email
  
                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </Button>
  
              {/* Resend OTP*/}

            <button
                type="button"
                disabled={resendSeconds > 0}
                onClick={handleResendOtp}
                className={`
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    text-[12px]
                    font-bold
                    transition-colors
                    duration-200

                    ${
                    resendSeconds > 0
                        ? 'cursor-not-allowed text-[#6E736E]'
                        : 'cursor-pointer text-pedxo-green hover:text-pedxo-green-dark'
                    }
                `}
                >
                <img
                    src={resendIcon}
                    alt=""
                    className={`
                    h-4
                    w-4
                    transition-opacity
                    duration-200
                    ${
                        resendSeconds > 0
                        ? 'opacity-70'
                        : 'opacity-100'
                    }
                    `}
                />

            {resendSeconds > 0
                ? `Resend in ${resendSeconds}s`
                : 'Resend email'}
            </button>
  
              {/* Expiry */}
  
              <p
                className="
                  mt-4
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
                  alt="stamp"
                  className="h-4 w-4"
                />
  
                Links expire after 30 minutes.
              </p>
            </>
          )}
  
          {/* =================================================
              VERIFIED MODAL
              ================================================= */}
  
          {showVerifiedModal && (
            <EmailVerified
              email={email}
              onContinue={handleContinue}
            />
          )}
  
          {/* =================================================
              EXPIRED MODAL
              ================================================= */}
  
          {showExpiredModal && (
            <ExpiredEmail
              onNewLink={handleNewLink}
              onDifferentEmail={
                handleDifferentEmail
              }
            />
          )}
        </section>
      </main>
    )
  }
  
  /*
    =============================================================
    LEFT-SIDE BENEFIT
    =============================================================
  */
  
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
  
  export default OTPVerifyEmailPage