import { useState } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'

import { useNavigate } from 'react-router'

import Logo from '../../components/ui/Logo'
import Button from '../../components/ui/Button'

import PasswordInput from '../../components/auth/PasswordInput'
import ValidationMessage from '../../components/auth/ValidationMessage'

import stampBadge from '../../assets/icons/stamp_2.svg';
import { useAuthStore } from '../../store/auth.store'

/*
  =============================================================
  CREATE PASSCODE PAGE
  =============================================================

  FLOW:

  Create Account
        ↓
  OTP Verification
        ↓
  Create Passcode
        ↓
  Create Transaction PIN

  This page is intentionally separate from SignInPage.

  It does NOT contain:
  - Account lock modal
  - Email / Phone tabs
  - Keep me signed in
  - Forgot password
  - Social login
  - Email field

  The user only needs to create and confirm their passcode.
*/

function CreatePassCode() {
  const navigate = useNavigate()
  const createPassCode = useAuthStore(
    (state) => state.createPassCode,
  )

  /*
    =========================================================
    FORM STATE
    =========================================================
  */

  const [passCode, setPassCode] = useState('')
  const [confirmPassCode, setConfirmPassCode] = useState('')

  const [loading, setLoading] = useState(false)

  /*
    =========================================================
    VALIDATION STATE
    =========================================================
  */

  const [submitted, setSubmitted] = useState(false)
  const [passCodeMismatch, setPassCodeMismatch] = useState(false)

  /*
    =========================================================
    FIELD VALIDATION
    =========================================================
  */

  const passCodeIsInvalid = submitted && !passCode.trim()
  const confirmPassCodeIsInvalid = submitted && !confirmPassCode.trim()

  /*
    =========================================================
    HANDLE SUBMIT
    =========================================================

    Temporary frontend success flow.

    When the backend is connected, replace the temporary
    timeout with the actual API request.
  */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setSubmitted(true)
    setPassCodeMismatch(false)

    /*
      -------------------------------------------------------
      EMPTY PASSCODE
      -------------------------------------------------------
    */

    if (!passCode.trim()) {
      return
    }

    /*
      -------------------------------------------------------
      EMPTY CONFIRM PASSCODE
      -------------------------------------------------------
    */

    if (!confirmPassCode.trim()) {
      return
    }

    /*
      -------------------------------------------------------
      PASSCODE MISMATCH
      -------------------------------------------------------
    */

    if (passCode !== confirmPassCode) {
      setPassCodeMismatch(true)
      return
    }

    /*
      -------------------------------------------------------
      TEMPORARY SUBMIT / LOADING STATE
      -------------------------------------------------------
    */

    setLoading(true)

    await new Promise((resolve) =>
      setTimeout(resolve, 900),
    )

  /*
    Store the successfully validated passcode.
  */
   createPassCode(passCode)

    setLoading(false)

    /*
      -------------------------------------------------------
      SUCCESS
      -------------------------------------------------------

      Continue to transaction PIN creation.
    */

    // navigate('/sign-in')
    navigate('/create-transaction-pin')
  }

  /*
    =========================================================
    PASSCODE CHANGE
    =========================================================
  */

  const handlePassCodeChange = (
    value: string,
  ) => {
    setPassCode(value)

    /*
      Remove the empty-field validation once the user
      starts typing.
    */

    if (value.trim()) {
      setSubmitted(false)
    }

    /*
      Remove mismatch validation while editing.
    */

    setPassCodeMismatch(false)
  }

  /*
    =========================================================
    CONFIRM PASSCODE CHANGE
    =========================================================
  */

  const handleConfirmPassCodeChange = (
    value: string,
  ) => {
    setConfirmPassCode(value)

    /*
      Remove the empty-field validation once the user
      starts typing.
    */

    if (value.trim()) {
      setSubmitted(false)
    }

    /*
      Remove mismatch validation while editing.
    */

    setPassCodeMismatch(false)
  }

  /*
    =====================
    MAIN
    =====================
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

          {/* LOGO */}

          <Logo
            light
            showText
            size="md"
          />

          {/* MAIN LEFT CONTENT */}

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
              Your key to{' '}

              <span
                className="
                  italic
                  text-[#3BCA60]
                "
              >
                every balance.
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
              Your passcode signs you in. Your transaction
              PIN authorises money movement — two separate
              layers, by design.
            </p>

            {/* BENEFITS */}

            <div
              className="
                mt-10
                space-y-4
              "
            >
              <Benefit>
                Never reused from another app
              </Benefit>

              <Benefit>
                Stored hashed — we can never read it
              </Benefit>

              <Benefit>
                Change it any time from Settings
              </Benefit>
            </div>
          </div>

          {/* FOOTER */}

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

            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                inline-flex
                items-center
                gap-1.5
                text-[14px]
                text-[#6E736E]
                transition-colors
                hover:text-[#080C09]
              "
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.5}
              />

              Back
            </button>

            {/* SIGN IN */}

            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="
                text-[14px]
                text-[#6E736E]
                transition-colors
                hover:text-[#080C09]
              "
            >
              Sign in
            </button>
          </div>

          {/* =================================================
              FORM AREA
              ================================================= */}

          <div
            className="
              mx-auto
              mt-20
              w-full
              max-w-[448px]
            "
          >

            {/* =================================================
                HEADING
                ================================================= */}

            <h2
              className="
                text-[36px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
              "
            >
              Create your{' '}

              <span
                className="
                  font-inter-tight
                  italic
                  bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                  bg-clip-text
                  text-transparent
                "
              >
                passcode
              </span>
            </h2>

            <p
              className="
                mt-3
                text-[14px]
                leading-5
                text-[#6E736E]
              "
            >
              This is what you'll use to sign in to Pedxo Pay.
            </p>

            {/* =================================================
                FORM
                ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >

              {/* =================================================
                  PASSCODE
                  ================================================= */}

              <div
                className={
                  passCodeIsInvalid
                    ? `
                      [&_input]:!border-[#E62C2C]
                      [&_input:focus]:!border-[#E62C2C]
                    `
                    : ''
                }
              >
                <PasswordInput
                  label="Passcode"
                  placeholder="Create a strong passcode"
                  value={passCode}
                  onChange={handlePassCodeChange}
                  showPasswordHint={false}
                />
              </div>

              {/* =================================================
                  CONFIRM PASSCODE
                  ================================================= */}

              <div
                className={`
                  mt-4

                  ${
                    confirmPassCodeIsInvalid
                      ? `
                        [&_input]:!border-[#E62C2C]
                        [&_input:focus]:!border-[#E62C2C]
                      `
                      : ''
                  }
                `}
              >
                <PasswordInput
                  label="Confirm passcode"
                  placeholder="Re-enter your passcode"
                  value={confirmPassCode}
                  onChange={
                    handleConfirmPassCodeChange
                  }
                  showPasswordHint={false}
                />
              </div>

              {/* =================================================
                  VALIDATION MESSAGE
                  ================================================= */}

              {passCodeMismatch && (
                <div className="mt-4">
                  <ValidationMessage
                    title="Passcode doesn't meet requirements"
                    message="Still needed: at least 8 characters, upper and lower case letters, at least one number, at least one symbol."
                  />
                </div>
              )}

              {/* =================================================
                  CREATE PASSCODE BUTTON
                  ================================================= */}

              <Button
                type="submit"
                variant="modal"
                loading={loading}
                loadingText="Creating passcode..."
                className="
                  mt-5
                  h-[52px]
                  w-full
                  text-[14px]
                  font-semibold
                "
              >
                Set passcode

                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </Button>
            </form>

            {/* =================================================
                SECURITY MESSAGE
                ================================================= */}

            <p
              className="
                mt-3
                flex
                items-center
                justify-center
                gap-2
                text-[12px]
                text-[#6E736E]
              "
            >
              <img
                src={stampBadge}
                alt=""
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0
                "
              />

             256-bit encryption · never stored in plain text
            </p>
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

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex
              items-center
              gap-1.5
              text-[13px]
              text-[#6E736E]
            "
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.5}
            />

            Back
          </button>

          {/* SIGN IN */}

          <button
            type="button"
            onClick={() => navigate('/sign-in')}
            className="
              text-[13px]
              text-[#6E736E]
            "
          >
            Sign in
          </button>
        </div>

        {/* =================================================
            MOBILE CONTENT
            ================================================= */}

        <div
          className="
            mt-12
            w-full
          "
        >

          {/* HEADING */}

          <h1
            className="
              text-[30px]
              font-semibold
              leading-[1.05]
              tracking-[-0.045em]
            "
          >
            Create your{' '}

            <span
              className="
                font-inter-tight
                italic
                bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                bg-clip-text
                text-transparent
              "
            >
              passcode
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
            This is what you'll use to sign in to
            Pedxo Pay.
          </p>

          {/* =================================================
              MOBILE FORM
              ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >

            {/* PASSCODE */}

            <div
              className={
                passCodeIsInvalid
                  ? `
                    [&_input]:!border-[#E62C2C]
                    [&_input:focus]:!border-[#E62C2C]
                  `
                  : ''
              }
            >
              <PasswordInput
                label="Passcode"
                placeholder="Create a strong passcode"
                value={passCode}
                onChange={handlePassCodeChange}
                showPasswordHint={false}
              />
            </div>

            {/* CONFIRM PASSCODE */}

            <div
              className={`
                mt-4

                ${
                  confirmPassCodeIsInvalid
                    ? `
                      [&_input]:!border-[#E62C2C]
                      [&_input:focus]:!border-[#E62C2C]
                    `
                    : ''
                }
              `}
            >
              <PasswordInput
                label="Confirm passcode"
                placeholder="Re-enter your passcode"
                value={confirmPassCode}
                onChange={
                  handleConfirmPassCodeChange
                }
                showPasswordHint={false}
              />
            </div>

            {/* VALIDATION */}

            {passCodeMismatch && (
              <div className="mt-4">
                <ValidationMessage
                  title="Passcode doesn't meet requirements."
                  message="Still needed: at least 8 characters, upper and lower case letters, at least one number, at least one symbol."
                />
              </div>
            )}

            {/* CREATE BUTTON */}

            <Button
              type="submit"
              variant="modal"
              loading={loading}
              loadingText="Creating passcode..."
              className="
                mt-5
                h-[52px]
                w-full
                text-[14px]
                font-semibold
              "
            >
              Set passcode

              <ArrowRight
                size={17}
                strokeWidth={1.8}
              />
            </Button>
          </form>

          {/* =================================================
              SECURITY MESSAGE
              ================================================= */}

          <p
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-2
              text-center
              text-[11px]
              text-[#6E736E]
            "
          >
            <img
              src={stampBadge}
              alt=""
              aria-hidden="true"
              className="
                h-4
                w-4
                shrink-0
              "
            />

            256-bit encryption · never stored in plain text
          </p>
        </div>
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

export default CreatePassCode