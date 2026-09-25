import {
    useEffect,
    useRef,
    useState,
  } from 'react'
  
  import {
    ArrowLeft,
    ArrowRight,
    Check,
    Delete,
    ShieldCheck,
  } from 'lucide-react'
  
  import {
    useLocation,
    useNavigate,
  } from 'react-router'
  
  import Logo from '../../components/ui/Logo'
  import Button from '../../components/ui/Button'
  import CreatePINSuccessModal from './CreatePINSuccessModal'
  import { useAuthStore } from '../../store/auth.store'
  import stampBadge from '../../assets/icons/stamp_2.svg'
import ValidationMessage from '../../components/auth/ValidationMessage'
  
  
  interface LocationState {
    pinCreated?: boolean
  }
  
  
  /*
    =============================================================
    PIN LENGTH
    =============================================================
  */
  
  const PIN_LENGTH = 6
  
  
  /*
    =============================================================
    CREATE TRANSACTION PIN
    =============================================================
  */
  
  function CreateTransactionPIN() {
    const navigate = useNavigate()
    const location = useLocation()
    const createTransactionPin = useAuthStore((state) => state.createTransactionPin,)
  
    const state = location.state as LocationState | null
  
  
    /*
      ===========================================================
      PIN STATE
      ===========================================================
    */
  
    const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''),)
    const [activeIndex, setActiveIndex] = useState(0)
    const [error, setError] = useState('')
  
  
    /*
      ===========================================================
      SUCCESS MODAL
      ===========================================================
    
      The modal intentionally belongs to this page.
  
      ConfirmPIN navigates back to this page with:
  
      {
        pinCreated: true
      }
  
      We then render CreatePINSuccessModal here.
    */
  
    const [showSuccessModal, setShowSuccessModal] = useState(Boolean(state?.pinCreated),)
  
  
    /*
      ===========================================================
      DESKTOP INPUT REFERENCES
      ===========================================================
    
      Physical keyboard support is maintained for desktop.
  
      On mobile, users use the custom keypad instead.
    */
  
    const inputRefs =
      useRef<Array<HTMLInputElement | null>>([])
  
  
    /*
      ===========================================================
      FOCUS FIRST INPUT
      ===========================================================
    */
  
    useEffect(() => {
      if (showSuccessModal) {
        return
      }
  
      /*
        Desktop only.
  
        The CSS hides these inputs on mobile, so this does
        not interfere with the custom mobile keypad.
      */
  
      if (window.innerWidth >= 1024) {
        inputRefs.current[0]?.focus()
      }
    }, [showSuccessModal])
  
  
    /*
      ===========================================================
      PIN COMPLETE
      ===========================================================
    */
  
    const isComplete =
      pin.every(
        (digit) => digit.length === 1,
      )
  
  
    /*
      ===========================================================
      ADD DIGIT
      ===========================================================
    */
  
    const addDigit = (digit: string) => {
      if (showSuccessModal) {
        return
      }
  
      if (activeIndex >= PIN_LENGTH) {
        return
      }
  
      if (!/^\d$/.test(digit)) {
        return
      }
  
      const updated = [...pin]
  
      updated[activeIndex] = digit
  
      setPin(updated)
      setError('')
  
      const nextIndex =
        Math.min(
          activeIndex + 1,
          PIN_LENGTH - 1,
        )
  
      setActiveIndex(nextIndex)
  
      /*
        Desktop input focus.
      */
  
      inputRefs.current[nextIndex]?.focus()
    }
  
  
    /*
      ===========================================================
      DELETE DIGIT
      ===========================================================
    */
  
    const deleteDigit = () => {
      if (showSuccessModal) {
        return
      }
  
      /*
        If the current position is already empty,
        move backward first.
      */
  
      if (
        !pin[activeIndex] &&
        activeIndex > 0
      ) {
        const previousIndex =
          activeIndex - 1
  
        const updated = [...pin]
  
        updated[previousIndex] = ''
  
        setPin(updated)
        setActiveIndex(previousIndex)
  
        inputRefs.current[
          previousIndex
        ]?.focus()
  
        return
      }
  
      /*
        Delete the current digit.
      */
  
      const updated = [...pin]
  
      updated[activeIndex] = ''
  
      setPin(updated)
  
      setError('')
  
      inputRefs.current[
        activeIndex
      ]?.focus()
    }
  
  
    /*
      ===========================================================
      DESKTOP INPUT CHANGE
      ===========================================================
    */
  
    const handleInputChange = (
      index: number,
      value: string,
    ) => {
      const numericValue =
        value.replace(/\D/g, '')
  
      if (!numericValue) {
        const updated = [...pin]
  
        updated[index] = ''
  
        setPin(updated)
  
        return
      }
  
      /*
        Only use the first digit for a single field.
      */
  
      const digit =
        numericValue.charAt(0)
  
      const updated = [...pin]
  
      updated[index] = digit
  
      setPin(updated)
      setError('')
  
      const nextIndex =
        Math.min(
          index + 1,
          PIN_LENGTH - 1,
        )
  
      setActiveIndex(nextIndex)
  
      inputRefs.current[nextIndex]?.focus()
    }
  
  
    /*
      ===========================================================
      KEYBOARD HANDLING
      ===========================================================
    */
  
    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (
        event.key === 'Backspace'
      ) {
        event.preventDefault()
  
        if (
          !pin[index] &&
          index > 0
        ) {
          const previousIndex =
            index - 1
  
          const updated = [...pin]
  
          updated[previousIndex] = ''
  
          setPin(updated)
  
          setActiveIndex(
            previousIndex,
          )
  
          inputRefs.current[
            previousIndex
          ]?.focus()
  
          return
        }
  
        const updated = [...pin]
  
        updated[index] = ''
  
        setPin(updated)
  
        return
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
        index < PIN_LENGTH - 1
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
  ===========================================================
  CONTINUE
  ===========================================================

  The PIN is stored in Zustand first.

  The PIN UI uses an array:

    ['1', '2', '3', '4', '5', '6']

  auth.store.ts expects a string:

    '123456'

  Therefore we convert the array with:

    pin.join('')

  The existing router state is also preserved so the
  current ConfirmPIN flow is not changed.
*/

const handleContinue = () => {
  setError('')

  /*
    =========================================================
    VALIDATE PIN
    =========================================================
  */

  if (!isComplete) {
    setError(
      'Please enter all 6 digits of your PIN.',
    )

    return
  }

  /*
    =========================================================
    CONVERT PIN ARRAY TO STRING
    =========================================================

    Example:

      ['1', '2', '3', '4', '5', '6']

    becomes:

      '123456'
  */

  const transactionPin = pin.join('')

  /*
    =========================================================
    STORE PIN IN ZUSTAND
    =========================================================

      createTransactionPin(pin: string)
  */

  createTransactionPin(transactionPin)

  navigate(
    '/confirm-pin',
    {
      state: {
        pin,
      },
    },
  )
}
  
  
    /*
      ===========================================================
      BACK
      ===========================================================
    */
  
    const handleBack = () => {
      navigate(-1)
    }
  
  
    /*
      ===========================================================
      SUCCESS MODAL → SIGN IN
      ===========================================================
    */
  
    const handleGoToSignIn = () => {
      setShowSuccessModal(false)
  
      navigate('/sign-in')
    }
  
  
    /*
      ===========================================================
      RENDER
      ===========================================================
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
              LEFT
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
                Authorise with{' '}
  
                <span
                  className="
                    italic
                    text-[#3BCA60]
                  "
                >
                  six
                  <br />
                  digits.
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
                Your transaction PIN approves every
                transfer, payment and withdrawal —
                separate from the passcode you sign in
                with.
              </p>
  
              <div
                className="
                  mt-9
                  space-y-4
                  text-white/90
                "
              >
                <Benefit>
                  Required for every money-movement action
                </Benefit>
  
                <Benefit>
                  Never share it — Pedxo will never ask for it
                </Benefit>
  
                <Benefit>
                  Change it any time from Settings
                </Benefit>
              </div>
            </div>
  
            <p
              className="
                text-[12px]
                leading-5
                tracking-[0.28em]
                text-white/60
              "
            >
              SECURED · REGULATED · MULTI-CURRENCY
            </p>
          </div>
  
  
          {/* ===================================================
              RIGHT
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
            {/* Header */}
  
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <button
                type="button"
                onClick={handleBack}
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
                  navigate('/sign-in')
                }
                className="
                  text-[14px]
                  text-[#6E736E]
                "
              >
                Sign in
              </button>
            </div>
  
  
            {/* Main */}
  
            <div
              className="
                mx-auto
                mt-18
                w-full
                max-w-[448px]
              "
            >
              {/* Heading */}
  
              <h2
                className="
                  text-[36px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.045em]
                "
              >
                Create your transaction <br />
  
                <span
                  className="
                    font-inter-tight
                    italic
                    bg-[linear-gradient(108.05deg,#1CA045_0%,#3BCA60_100%)]
                    bg-clip-text
                    text-transparent
                  "
                >
                  PIN
                </span>
              </h2>
  
  
              {/* Subtitle */}
  
              <p
                className="
                  mt-3
                  text-[14px]
                  text-[#6E736E]
                "
              >
                Choose 6 digits you'll use to approve
                money movement.
              </p>
  
  
              {/* =================================================
                  PIN CONTENT
  
                  Hidden when success modal opens.
                  ================================================= */}
  
              {!showSuccessModal && (
                <>
                  {/* PIN INPUTS */}
  
                  <div
                    className="
                      mt-8
                      hidden
                      gap-2
                      lg:flex
                    "
                  >
                    {pin.map(
                      (digit, index) => {
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
                            value={
                              hasValue
                                ? '•'
                                : ''
                            }
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            aria-label={`PIN digit ${
                              index + 1
                            }`}
                            onFocus={() =>
                              setActiveIndex(
                                index,
                              )
                            }
                            onChange={(
                              event,
                            ) =>
                              handleInputChange(
                                index,
                                event.target
                                  .value,
                              )
                            }
                            onKeyDown={(
                              event,
                            ) =>
                              handleKeyDown(
                                index,
                                event,
                              )
                            }
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
                                isActive ||
                                hasValue
                                  ? `
                                    border-[#1CA045]
                                    shadow-[0px_0px_0px_4px_#1CA0451F]
                                  `
                                  : `
                                    border-[#E2E6E2]
                                  `
                              }
                            `}
                          />
                        )
                      },
                    )}
                  </div>
  
  
                  {/* Error */}
  
                  {error && (
                    <div className="mt-4">
                      <ValidationMessage
                        message={error}
                      />
                    </div>
                  )}
  
  
                  {/* Continue */}
  
                  <Button
                    type="button"
                    variant="modal"
                    disabled={!isComplete}
                    onClick={handleContinue}
                    className="
                      mt-7
                      h-[52px]
                      w-full
                      text-[14px]
                      font-semibold
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      disabled:shadow-none
                    "
                  >
                    Continue
  
                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                    />
                  </Button>
  
  
                  {/* Security */}
  
                  <p
                    className="
                      mt-5
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
                      className="h-4 w-4"
                    />
  
                    Encrypted end-to-end · never
                    shown again
                  </p>
                </>
              )}
            </div>
  
  
            {/* =================================================
                SUCCESS MODAL
  
                IMPORTANT:
                This modal is rendered by CreateTransactionPIN,
                NOT ConfirmPIN.
                ================================================= */}
  
            {showSuccessModal && (
              <CreatePINSuccessModal
                onContinue={handleGoToSignIn}
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
          {/* Header */}
  
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <button
              type="button"
              onClick={handleBack}
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
  
            <button
              type="button"
              onClick={() =>
                navigate('/sign-in')
              }
              className="
                text-[13px]
                text-[#6E736E]
              "
            >
              Sign in
            </button>
          </div>
  
  
          {/* Main */}
  
          <div
            className="
              mt-10
              w-full
            "
          >
            {/* Heading */}
  
            <h1
              className="
                text-[25px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
              "
            >
              Create your transaction{' '}
  
              <span
                className="
                  block
                  font-inter-tight
                  italic
                  text-[#1CA045]
                "
              >
                PIN
              </span>
            </h1>
  
  
            {/* Subtitle */}
  
            <p
              className="
                mt-3
                max-w-[330px]
                text-[14px]
                leading-5
                text-[#6E736E]
              "
            >
              Choose 6 digits you'll use to approve
              money movement.
            </p>
  
  
            {/* =================================================
                MOBILE PIN CONTENT
                ================================================= */}
  
            {!showSuccessModal && (
              <>
                {/* =================================================
                    MOBILE PIN INDICATORS
  
                    These are display-only.
  
                    The actual PIN entry is performed through the
                    custom keypad below.
                    ================================================= */}
  
                <div
                  className="
                    mt-8
                    grid
                    grid-cols-6
                    gap-2
                  "
                >
                  {pin.map(
                    (digit, index) => {
                      const isActive =
                        activeIndex === index
  
                      const hasValue =
                        digit.length > 0
  
                      return (
                        <div
                          key={index}
                          className={`
                            aspect-square
                            w-full
                            max-w-[51px]
                            rounded-full
                            border
                            bg-[#FFFFFF01]
                            flex
                            items-center
                            justify-center
                            text-[20px]
                            font-semibold
                            text-[#080C09]
                            transition-all
  
                            ${
                              isActive ||
                              hasValue
                                ? `
                                  border-[#1CA045]
                                  shadow-[0px_0px_0px_4px_#1CA0451F]
                                `
                                : `
                                  border-[#E2E6E2]
                                `
                            }
                          `}
                        >
                          {hasValue
                            ? '•'
                            : ''}
                        </div>
                      )
                    },
                  )}
                </div>
  
  
                {/* Error */}
  
                {error && (
                  <div className="mt-4">
                    <ValidationMessage
                      message={error}
                    />
                  </div>
                )}
  
  
                {/* =================================================
                    CUSTOM NUMERIC KEYPAD
                    ================================================= */}
  
                <div
                  className="
                    mx-auto
                    mt-5
                    grid
                    w-full
                    max-w-[342px]
                    grid-cols-3
                    gap-[10px]
                  "
                >
                  {/* 1 */}
  
                  <PinKey
                    value="1"
                    onClick={() =>
                      addDigit('1')
                    }
                  />
  
                  {/* 2 */}
  
                  <PinKey
                    value="2"
                    onClick={() =>
                      addDigit('2')
                    }
                  />
  
                  {/* 3 */}
  
                  <PinKey
                    value="3"
                    onClick={() =>
                      addDigit('3')
                    }
                  />
  
                  {/* 4 */}
  
                  <PinKey
                    value="4"
                    onClick={() =>
                      addDigit('4')
                    }
                  />
  
                  {/* 5 */}
  
                  <PinKey
                    value="5"
                    onClick={() =>
                      addDigit('5')
                    }
                  />
  
                  {/* 6 */}
  
                  <PinKey
                    value="6"
                    onClick={() =>
                      addDigit('6')
                    }
                  />
  
                  {/* 7 */}
  
                  <PinKey
                    value="7"
                    onClick={() =>
                      addDigit('7')
                    }
                  />
  
                  {/* 8 */}
  
                  <PinKey
                    value="8"
                    onClick={() =>
                      addDigit('8')
                    }
                  />
  
                  {/* 9 */}
  
                  <PinKey
                    value="9"
                    onClick={() =>
                      addDigit('9')
                    }
                  />
  
  
                  {/* Empty */}
  
                  <div
                    aria-hidden="true"
                    className="h-[56px]"
                  />
  
  
                  {/* 0 */}
  
                  <PinKey
                    value="0"
                    onClick={() =>
                      addDigit('0')
                    }
                  />
  
  
                  {/* Delete */}
  
                  <button
                    type="button"
                    aria-label="Delete PIN digit"
                    onClick={
                      deleteDigit
                    }
                    className="
                      flex
                      h-[56px]
                      w-full
                      items-center
                      justify-center
                      rounded-[28px]
                      border
                      border-[#E2E6E2]
                      bg-white
                      text-[#080C09]
                      transition-all
                      active:scale-[0.98]
                    "
                  >
                    <Delete
                      size={22}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
  
  
                {/* Continue */}
  
                <Button
                  type="button"
                  variant="modal"
                  disabled={!isComplete}
                  onClick={handleContinue}
                  className="
                    mt-7
                    h-[52px]
                    w-full
                    text-[14px]
                    font-semibold
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:shadow-none
                  "
                >
                  Continue
  
                  <ArrowRight
                    size={17}
                    strokeWidth={1.8}
                  />
                </Button>
  
  
                {/* Security */}
  
                <p
                  className="
                    mt-5
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
                    className="h-4 w-4"
                  />
  
                  Encrypted end-to-end · never
                  shown again
                </p>
              </>
            )}
          </div>
  
  
          {/* =================================================
              SUCCESS MODAL
  
              Still rendered by CreateTransactionPIN.
              ================================================= */}
  
          {showSuccessModal && (
            <CreatePINSuccessModal
              onContinue={handleGoToSignIn}
            />
          )}
        </section>
      </main>
    )
  }
  
  
  /*
    =============================================================
    CUSTOM MOBILE PIN BUTTON
    =============================================================
  */
  
  interface PinKeyProps {
    value: string
    onClick: () => void
  }
  
  
  function PinKey({
    value,
    onClick,
  }: PinKeyProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Enter ${value}`}
        className="
          flex
          h-[56px]
          w-full
          items-center
          justify-center
          rounded-[28px]
          border
          border-[#E2E6E2]
          bg-white
          text-[18px]
          font-semibold
          text-[#080C09]
          transition-all
          active:scale-[0.98]
          active:bg-[#F7F9F7]
        "
      >
        {value}
      </button>
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
  
  
  export default CreateTransactionPIN