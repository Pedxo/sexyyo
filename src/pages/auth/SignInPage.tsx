import {useEffect, useState} from 'react'

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  Phone,
} from 'lucide-react'

import {useNavigate} from 'react-router'

import Logo from '../../components/ui/Logo'
import Button from '../../components/ui/Button'

import AuthInput from '../../components/auth/AuthInput'
import PasswordInput from '../../components/auth/PasswordInput'
import SocialButton from '../../components/auth/SocialButton'
import AccountLockModal from './AccountLockModal'
import EmailIcon from "../../assets/icons/email.svg";
import googleIcon from '../../assets/icons/Google_icon.svg'
import githubIcon from '../../assets/icons/GitIcon_darkBG.svg';
import ValidationMessage from '../../components/auth/ValidationMessage';
import stampBadge from "../../assets/icons/stamp_2.svg";
import { useAuthStore } from '../../store/auth.store'

/*
  =============================================================
  SIGN-IN PAGE
  =============================================================

  Temporary frontend authentication behavior:

  - Empty fields -> red input borders.
  - Wrong non-empty credentials -> validation message.
  - Third failed attempt -> temporary account lock.
  - Lock duration -> 04:20.
  - Correct backend authentication should replace the
    temporary credential section in handleSubmit().
*/

function SignInPage() {
  const navigate = useNavigate()

  /*
    =========================================================
    FORM STATE
    =========================================================
  */

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(false)

  /*
    =========================================================
    VALIDATION STATE
    =========================================================
  */

  const [submitted, setSubmitted] = useState(false)
  const [wrongPassword, setWrongPassword] = useState(false)

  // store
  const lockedUntil = useAuthStore((state) => state.lockedUntil,)
  const signIn = useAuthStore((state) => state.signIn,)
  const unlockAccount = useAuthStore((state) => state.unlockAccount,)
  const failedAttempts = useAuthStore((state) => state.failedAttempts,)
  
  
  const [showLockModal, setShowLockModal] = useState(false)
  

  /*
    =========================================================
    MOBILE LOGIN TAB
    =========================================================
  */

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')

  /*
    =========================================================
    FIELD VALIDATION
    =========================================================
  */

  const emailIsInvalid = submitted && !email.trim()
  const passwordIsInvalid = submitted && !password
  const attemptsLeft = Math.max(
    0,
    3 - failedAttempts,
  )

  /*
    =========================================================
    SIGN IN
    =========================================================
  */

    const handleSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault()
    
      setSubmitted(true)
      setWrongPassword(false)
    
      /*
        =======================================================
        EMPTY EMAIL
        =======================================================
      */
    
      if (!email.trim()) {
        return
      }
    
      /*
        =======================================================
        EMPTY PASSWORD
        =======================================================
      */
    
      if (!password) {
        return
      }
    
      /*
        =======================================================
        LOADING
        =======================================================
      */
    
      setLoading(true)
    
      await new Promise((resolve) =>
        setTimeout(resolve, 900),
      )
    
      /*
        =======================================================
        SIGN IN
        =======================================================
      */
    
      const result = signIn(
        email.trim(),
        password,
        keepSignedIn,
      )
    
      setLoading(false)
    
      /*
        =======================================================
        ACCOUNT LOCKED
        =======================================================
    
        The third wrong password causes the store to set:
    
          failedAttempts = 3
          lockedUntil = future timestamp
    
        The store also returns:
    
          reason = "locked"
      */
    
      if (result.reason === 'locked') {
        setWrongPassword(false)
        setShowLockModal(true)
    
        return
      }
    
      /*
        =======================================================
        WRONG PASSWORD
        =======================================================
    
        Store values:
    
          failedAttempts = 1
          3 - 1 = 2 attempts left
    
          failedAttempts = 2
          3 - 2 = 1 attempt left
      */
    
      if (
        result.reason ===
        'invalid_credentials'
      ) {
        setWrongPassword(true)
    
        return
      }
    
      /*
        =======================================================
        EMAIL NOT VERIFIED
        =======================================================
      */
    
      if (
        result.reason ===
        'not_verified'
      ) {
        setWrongPassword(true)
    
        return
      }
    
      /*
        =======================================================
        SUCCESS
        =======================================================
      */
    
      if (result.success) {
        setWrongPassword(false)
        setSubmitted(false)
    
        navigate('/dashboard')
      }
    }

  /*
    =========================================================
    ACCOUNT UNLOCKED
    =========================================================

    Called by AccountLockModal when the 04:20 timer ends.
  */

    const handleUnlock = () => {
      unlockAccount()
    
      setShowLockModal(false)
      setWrongPassword(false)
      setSubmitted(false)
    }

  /*
    =========================================================
    RESET PASSWORD
    =========================================================
  */

  const handleResetPassword = () => {
    navigate('/forgot-password')
  }

  /*
    =========================================================
    MOBILE TAB
    =========================================================
  */

  const handleLoginMethodChange = (
    method: 'email' | 'phone',
  ) => {
    setLoginMethod(method)

    /*
      Clear validation when switching methods.
    */

    setSubmitted(false)
    setWrongPassword(false)
  }

  /*
    =========================================================
    KEEP ME SIGNED IN
    =========================================================
  */

  const handleKeepSignedIn = () => {
    setKeepSignedIn(
      (current) => !current,
    )
  }

  useEffect(() => {
    if (
      lockedUntil !== null &&
      lockedUntil > Date.now()
    ) {
      setShowLockModal(true)
  
      return
    }
  
    if (
      lockedUntil === null ||
      lockedUntil <= Date.now()
    ) {
      setShowLockModal(false)
    }
  }, [lockedUntil])

  /*
    =========================================================
    MAIN
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
            w-1/2
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
              Welcome{' '}

              <span
                className="
                  italic
                  text-[#3BCA60]
                "
              >
                back.
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
              Your multi-currency wallet is a tap away.
              Send in <br /> seconds, pay for Pedxo services
              from balance, keep the <br /> receipts.
            </p>
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
            relative
            flex
            min-h-screen
            flex-1
            flex-col
            px-10
            py-10
            xl:px-20
          "
        >
          {/* =================================================
              HEADER
              ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="
                inline-flex
                items-center
                gap-1.5
                text-[14px]
                text-[#6E736E]
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
                navigate('/create-account')
              }
              className="
                text-[14px]
                text-[#6E736E]
              "
            >
              Create account
            </button>
          </div>

          {/* =================================================
              FORM AREA
              ================================================= */}

          <div
            className="
              mx-auto
              mt-10
              w-full
              max-w-[448px]
            "
          >
            {/* =================================================
                HEADING
                ================================================= */}

            <h2
              className="
                md:text-[36px]
                text-[20px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
              "
            >
              Sign in to{' '}

              <span
                className="
                  font-inter-tight
                  italic
                  bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                  bg-clip-text
                  text-transparent
                "
              >
                Pedxo Pay
              </span>
            </h2>

            <p
              className="
                mt-3
                text-[14px]
                text-[#6E736E]
              "
            >
              Use your registered email and password.
            </p>

            {/* =================================================
                EVERYTHING BELOW DISAPPEARS WHEN LOCKED
                ================================================= */}

            {!showLockModal && (
              <>

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
                {/* =================================================
                    FORM
                    ================================================= */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7"
                >
                  {/* =================================================
                      EMAIL
                      ================================================= */}

                  <div
                    className={
                      emailIsInvalid
                        ? `
                          [&_input]:!border-[#E62C2C]
                          [&_input]:focus:!border-[#E62C2C]
                        `
                        : ''
                    }
                  >
                    <AuthInput
                      label="Email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(event) => {
                        const value = event.target.value
                      
                        setEmail(value)
                      
                        if (value.trim()) {
                          setSubmitted(false)
                        }
                      
                        setWrongPassword(false)
                      }}
                    />
                  </div>

                  {/* =================================================
                      PASSWORD
                      ================================================= */}

                  <div
                    className={`
                      mt-4

                      ${
                        passwordIsInvalid
                          ? `
                            [&_input]:!border-[#E62C2C]
                            [&_input]:focus:!border-[#E62C2C]
                          `
                          : ''
                      }
                    `}
                  >
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(value) => {
                        setPassword(value)

                        if (value) {
                          setSubmitted(false)
                        }

                        setWrongPassword(false)
                      }}
                    />
                  </div>

                  {/* =================================================
                      KEEP SIGNED IN + FORGOT PASSWORD
                      ================================================= */}

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <label
                      className="
                        inline-flex
                        cursor-pointer
                        items-center
                        gap-2
                      "
                    >
                      <input
                        type="checkbox"
                        checked={keepSignedIn}
                        onChange={
                          handleKeepSignedIn
                        }
                        className="sr-only"
                      />

                      <span
                        className={`
                          flex
                          h-[17px]
                          w-[17px]
                          items-center
                          justify-center
                          rounded-[4px]
                          border
                          transition-all
                          ${
                            keepSignedIn
                              ? `
                                border-pedxo-green
                                bg-pedxo-green
                                text-white
                              `
                              : `
                                border-[#C8CEC8]
                                bg-pedxo-green
                              `
                          }
                        `}
                      >
                        {keepSignedIn && (
                          <Check
                            size={12}
                            strokeWidth={2.5}
                          />
                        )}
                      </span>

                      <span
                        className="
                          text-[12px]
                          text-[#6E736E]
                        "
                      >
                        Keep me signed in
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          '/forgot-password',
                        )
                      }
                      className="
                        text-[12px]
                        font-medium
                        text-[#1CA045]
                      "
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* =================================================
                      WRONG PASSWORD VALIDATION
                      ================================================= */}

                    {wrongPassword && (
                    <div className="mt-4">
                      <ValidationMessage
                        title="Wrong password"
                        message={`The password you entered is incorrect. ${attemptsLeft} attempt${
                          attemptsLeft === 1 ? '' : 's'
                        } left before your account is temporarily locked.`}
                      />
                    </div>
                  )}

                  {/* =================================================
                      SIGN IN BUTTON
                      ================================================= */}

                  <Button
                    type="submit"
                    variant="modal"
                    loading={loading}
                    loadingText="Signing in..."
                    className="
                      mt-5
                      h-[52px]
                      w-full
                      text-[14px]
                      font-semibold
                    "
                  >
                    Sign in

                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                    />
                  </Button>
                </form>
                {/* =============================
                    Security
                    ============================== */}
                    <p className="mt-2 flex items-center justify-center gap-2 text-[#6E736E] text-[12px]">
                    <img src={stampBadge} alt="badge" className="h-4 w-4"/>
                    Protected by 2FA on new devices
                    </p>


                {/* =================================================
                    DIVIDER
                    ================================================= */}

                <div
                  className="
                    my-6
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div className="h-px flex-1 bg-[#E2E6E2]" />

                  <span
                    className="
                      text-[11px]
                      text-[#6E736E]
                    "
                  >
                    OR CONTINUE WITH
                  </span>

                  <div className="h-px flex-1 bg-[#E2E6E2]" />
                </div>

                {/* =================================================
                    GOOGLE
                    ================================================= */}

                <SocialButton
                  icon={googleIcon}
                >
                  Continue with Google
                </SocialButton>

                {/* =================================================
                    GITHUB
                    ================================================= */}

                <div className="mt-3">
                  <SocialButton
                    icon={githubIcon}
                    dark
                  >
                    Continue with GitHub
                  </SocialButton>
                </div>

                {/* =================================================
                    CREATE ACCOUNT
                    ================================================= */}

                <p
                  className="
                    mt-6
                    text-center
                    text-[12px]
                    text-[#6E736E]
                  "
                >
                  Don't have an account?{' '}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/create-account',
                      )
                    }
                    className="
                      font-semibold
                      text-[#1CA045]
                    "
                  >
                    Create account
                  </button>
                </p>
              </>
            )}
          </div>

          {/* =====================================================
              ACCOUNT LOCK MODAL
              ===================================================== */}

          {showLockModal && (
            <AccountLockModal
              onResetPassword={
                handleResetPassword
              }
              onUnlock={handleUnlock}
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
          px-6
          pb-6
          pt-5
          lg:hidden
        "
      >
        {/* =================================================
            MOBILE HEADER
            ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              inline-flex
              items-center
              gap-1.5
              text-[12px]
              text-[#6E736E]
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
              navigate('/create-account')
            }
            className="
              text-[12px]
              text-[#6E736E]
            "
          >
            Create account
          </button>
        </div>

        {/* =================================================
            MOBILE CONTENT
            ================================================= */}

        <div className="mt-10">
          <h1
            className="
              text-[30px]
              font-semibold
              leading-[1.05]
              tracking-[-0.045em]
            "
          >
            Sign in to{' '}

            <span
              className="
                font-inter-tight
                italic
                bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                bg-clip-text
                text-transparent
              "
            >
              Pedxo Pay
            </span>
          </h1>

          <p
            className="
              mt-3
              text-[13px]
              leading-5
              text-[#6E736E]
            "
          >
            Use your registered email and password.
          </p>

          {/* =================================================
              MOBILE CONTENT HIDDEN WHEN LOCKED
              ================================================= */}

          {!showLockModal && (
            <>
              {/* =================================================
                  EMAIL / PHONE TAB
                  ================================================= */}

              <div
                className="
                  mt-7
                  w-full
                  max-w-[342px]
                  rounded-full
                  border
                  border-[#E2E6E2]
                  bg-[#F0F3EF]
                  p-1
                "
              >
                <div
                  className="
                    flex
                    h-[46px]
                    w-full
                    items-center
                    rounded-full
                  "
                >
                  {/* EMAIL */}

                  <button
                    type="button"
                    onClick={() =>
                      handleLoginMethodChange(
                        'email',
                      )
                    }
                    className={`
                      flex
                      h-full
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      text-[12px]
                      font-medium
                      transition-all

                      ${
                        loginMethod === 'email'
                          ? `
                            bg-white
                            text-[#080C09]
                            shadow-sm
                          `
                          : `
                            text-[#6E736E]
                          `
                      }
                    `}
                  >
                    <Mail
                      size={15}
                      strokeWidth={1.8}
                    />

                    Email
                  </button>

                  {/* PHONE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleLoginMethodChange(
                        'phone',
                      )
                    }
                    className={`
                      flex
                      h-full
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      text-[12px]
                      font-medium
                      transition-all

                      ${
                        loginMethod === 'phone'
                          ? `
                            bg-white
                            text-[#080C09]
                            shadow-sm
                          `
                          : `
                            text-[#6E736E]
                          `
                      }
                    `}
                  >
                    <Phone
                      size={15}
                      strokeWidth={1.8}
                    />

                    Phone
                  </button>
                </div>
              </div>

              {/* =================================================
                  FORM
                  ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="mt-7"
              >
                {/* EMAIL */}

                <div
                  className={
                    emailIsInvalid
                      ? `
                        [&_input]:!border-[#E62C2C]
                        [&_input]:focus:!border-[#E62C2C]
                      `
                      : ''
                  }
                >
                  <AuthInput
                    label="Email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => {
                      const value = event.target.value
                    
                      setEmail(value)
                    
                      if (value.trim()) {
                        setSubmitted(false)
                      }
                    
                      setWrongPassword(false)
                    }}
                  />
                </div>

                {/* PASSWORD */}

                <div
                  className={`
                    mt-4

                    ${
                      passwordIsInvalid
                        ? `
                          [&_input]:!border-[#E62C2C]
                          [&_input]:focus:!border-[#E62C2C]
                        `
                        : ''
                    }
                  `}
                >
                  <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(value) => {
                      setPassword(value)

                      if (value) {
                        setSubmitted(false)
                      }

                      setWrongPassword(false)
                    }}
                  />
                </div>

                {/* =================================================
                    KEEP SIGNED IN + FORGOT PASSWORD
                    ================================================= */}

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                  "
                >
                  <label
                    className="
                      inline-flex
                      cursor-pointer
                      items-center
                      gap-2
                    "
                  >
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={
                        handleKeepSignedIn
                      }
                      className="sr-only"
                    />

                    <span
                      className={`
                        flex
                        h-[17px]
                        w-[17px]
                        items-center
                        justify-center
                        rounded-[4px]
                        border
                        transition-all

                        ${
                          keepSignedIn
                            ? `
                              border-pedxo-green
                              bg-pedxo-green
                              text-white
                            `
                            : `
                              border-[#C8CEC8]
                              bg-pedxo-green
                            `
                        }
                      `}
                    >
                      {keepSignedIn && (
                        <Check
                          size={12}
                          strokeWidth={2.5}
                        />
                      )}
                    </span>

                    <span
                      className="
                        md:text-[12px]
                        text-[11px]
                        text-[#6E736E]
                      "
                    >
                      Keep me signed in
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/forgot-password',
                      )
                    }
                    className="
                      md:text-[12px]
                      text-[10px]
                      font-semibold
                      text-[#1CA045]
                    "
                  >
                    Forgot password?
                  </button>
                </div>

                {/* =================================================
                    WRONG PASSWORD VALIDATION
                    ================================================= */}

                  {wrongPassword && (
                    <div className="mt-4">
                      <ValidationMessage
                        title="Wrong password"
                        message={`The password you entered is incorrect. ${attemptsLeft} attempt${
                          attemptsLeft === 1 ? '' : 's'
                        } left before your account is temporarily locked.`}
                      />
                    </div>
                  )}

                {/* =================================================
                    SIGN IN
                    ================================================= */}

                <Button
                  type="submit"
                  variant="modal"
                  loading={loading}
                  loadingText="Signing in..."
                  className="
                    mt-5
                    h-[52px]
                    w-full
                    text-[14px]
                    font-semibold
                  "
                >
                  Sign in

                  <ArrowRight
                    size={17}
                    strokeWidth={1.8}
                  />
                </Button>
              </form>

              {/* =============================
                Security
                ============================== */}
               <p className="mt-2 flex items-center justify-center gap-2 text-[#6E736E] text-[12px]">
                <img src={stampBadge} alt="badge" className="h-4 w-4"/>
                 Protected by 2FA on new devices
                </p>

              {/* =================================================
                  DIVIDER
                  ================================================= */}

              <div
                className="
                  my-6
                  flex
                  items-center
                  gap-4
                "
              >
                <div className="h-px flex-1 bg-[#E2E6E2]" />

                <span
                  className="
                    text-[11px]
                    text-[#6E736E]
                  "
                >
                  OR CONTINUE WITH
                </span>

                <div className="h-px flex-1 bg-[#E2E6E2]" />
              </div>

              {/* =================================================
                  GOOGLE
                  ================================================= */}

              <SocialButton
                icon={googleIcon}
              >
                Continue with Google
              </SocialButton>

              {/* =================================================
                  GITHUB
                  ================================================= */}

              <div className="mt-3">
                <SocialButton
                  icon={githubIcon}
                  dark
                >
                  Continue with GitHub
                </SocialButton>
              </div>

              {/* =================================================
                  CREATE ACCOUNT
                  ================================================= */}

              <p
                className="
                  mt-6
                  text-center
                  text-[12px]
                  text-[#6E736E]
                "
              >
                Don't have an account?{' '}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/create-account',
                    )
                  }
                  className="
                    font-semibold
                    text-[#1CA045]
                  "
                >
                  Create account
                </button>
              </p>
            </>
          )}
        </div>

        {/* =================================================
            MOBILE ACCOUNT LOCK MODAL
            ================================================= */}

        {showLockModal && (
          <AccountLockModal
            onResetPassword={
              handleResetPassword
            }
            onUnlock={handleUnlock}
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
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/20
        "
      >
        <Check
          size={12}
          strokeWidth={2.5}
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

export default SignInPage
