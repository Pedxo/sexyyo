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
  } from 'lucide-react'
  
  import {
    useLocation,
    useNavigate,
  } from 'react-router'
  
  import Logo from '../../components/ui/Logo'
  import Button from '../../components/ui/Button'
  import ValidationMessage from '../../components/auth/ValidationMessage'
  
  import stampBadge from '../../assets/icons/stamp_2.svg'
  import { useAuthStore } from '../../store/auth.store'
  
  
  interface LocationState {
    pin?: string[]
  }
  
  
  /*
    =============================================================
    PIN LENGTH
    =============================================================
  */
  
  const PIN_LENGTH = 6
  
  
  function ConfirmPIN() {
    const navigate = useNavigate()
    const location = useLocation()
  
    const state =
      location.state as LocationState | null
  
    /*
    ===========================================================
    AUTH STORE
    ===========================================================

    The PIN created on CreateTransactionPIN is now stored
    inside auth.store.ts as pendingTransactionPin.

    confirmTransactionPin() is responsible for checking
    whether the PIN entered on this page matches it.
  */

  const pendingTransactionPin = useAuthStore(
    (state) => state.pendingTransactionPin,
  )

  const confirmTransactionPin = useAuthStore(
    (state) => state.confirmTransactionPin,
  )

  
    //const originalPin = state?.pin || []
    const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''),)
    const [activeIndex, setActiveIndex] = useState(0)
    const [error, setError] = useState('')
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  
  
    /*
      ===========================================================
      FOCUS DESKTOP
      ===========================================================
    */
  
    useEffect(() => {
      if (window.innerWidth >= 1024) {
        inputRefs.current[0]?.focus()
      }
    }, [])
  
  
    /*
      ===========================================================
      COMPLETE
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
  
      inputRefs.current[nextIndex]?.focus()
    }
  
  
    /*
      ===========================================================
      DELETE
      ===========================================================
    */
  
    const deleteDigit = () => {
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
      DESKTOP INPUT
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
  
      const updated = [...pin]
  
      updated[index] =
        numericValue.charAt(0)
  
      setPin(updated)
      setError('')
  
      const nextIndex =
        Math.min(
          index + 1,
          PIN_LENGTH - 1,
        )
  
      setActiveIndex(nextIndex)
  
      inputRefs.current[
        nextIndex
      ]?.focus()
    }
  
  
    /*
      ===========================================================
      KEYBOARD
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
  
        setActiveIndex(
          previousIndex,
        )
  
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
      START OVER
      ===========================================================
    */
  
    const handleStartOver = () => {
      navigate(
        '/create-transaction-pin',
        {
          replace: true,
        },
      )
    }
  
  
    /*
      ===========================================================
      CONFIRM PIN
      ===========================================================
    */
  
      const handleConfirm = () => {
        setError('')
    
        /*
          =========================================================
          PIN MUST BE COMPLETE
          =========================================================
        */
    
        if (!isComplete) {
          return
        }
    
        /*
          =========================================================
          ENTERED PIN
          =========================================================
        */
    
        const enteredPin =
          pin.join('')
    
        /*
          =========================================================
          CHECK AUTH STORE SESSION
          =========================================================
    
          The previous version checked:
    
            location.state.pin
    
          That is no longer necessary.
    
          CreateTransactionPIN stores the PIN in:
    
            auth.store.ts
            pendingTransactionPin
        */
    
        if (
          !pendingTransactionPin ||
          pendingTransactionPin.length !== PIN_LENGTH
        ) {
          setError(
            'Your PIN session has expired. Please start over.',
          )
    
          return
        }
    
        /*
          =========================================================
          VERIFY WITH AUTH STORE
          =========================================================
    
          The store compares:
    
            enteredPin
    
          against:
    
            pendingTransactionPin
    
          If correct, the store automatically:
    
            transactionPin = enteredPin
            pendingTransactionPin = ''
        */
    
        const confirmed =
          confirmTransactionPin(enteredPin)
    
        /*
          =========================================================
          PIN DOES NOT MATCH
          =========================================================
        */
    
        if (!confirmed) {
          setError(
            'PINs do not match. Please try again.',
          )
    
          setPin(
            Array(PIN_LENGTH).fill(''),
          )
    
          setActiveIndex(0)
    
          inputRefs.current[0]?.focus()
    
          return
        }
    
        /*
          =========================================================
          SUCCESS
          =========================================================
    
          IMPORTANT:
    
          We DO NOT render CreatePINSuccessModal here.
    
          We return to CreateTransactionPIN and tell that page
          to open its existing success modal.
    
          This keeps your existing flow unchanged.
        */
    
        navigate(
          '/create-transaction-pin',
          {
            replace: true,
            state: {
              pinCreated: true,
            },
          },
        )
      }
    
  
  
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
                onClick={() =>
                  navigate(
                    '/create-transaction-pin',
                  )
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
                mt-24
                w-full
                max-w-[448px]
              "
            >
              <h2
                className="
                  text-[40px]
                  font-semibold
                  leading-[1.05]
                  tracking-[-0.045em]
                "
              >
                Confirm your{' '}
  
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
  
              <p
                className="
                  mt-3
                  text-[14px]
                  text-[#6E736E]
                "
              >
                Enter the same 6 digits once more to lock it in.
              </p>
  
  
              {/* PIN */}
  
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
                    const active =
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
                        onChange={(event) =>
                          handleInputChange(
                            index,
                            event.target
                              .value,
                          )
                        }
                        onKeyDown={(event) =>
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
                            active ||
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
  
  
              {/* Confirm */}
  
              <Button
                type="button"
                variant="modal"
                disabled={!isComplete}
                onClick={handleConfirm}
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
                Confirm PIN
  
                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </Button>
  
  
              {/* Start over */}
  
              <button
                type="button"
                onClick={handleStartOver}
                className="
                  mx-auto
                  mt-5
                  block
                  text-[12px]
                  font-medium
                  text-[#1CA045]
                  transition-colors
                  hover:text-[#005F21]
                "
              >
                Start over
              </button>
  
  
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
              onClick={() =>
                navigate(
                  '/create-transaction-pin',
                )
              }
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
  
          <div className="mt-10 w-full">
            <h1
              className="
                text-[30px]
                font-semibold
                leading-[1.05]
                tracking-[-0.045em]
              "
            >
              Confirm your{' '}
  
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
  
            <p
              className="
                mt-3
                max-w-[330px]
                text-[14px]
                leading-5
                text-[#6E736E]
              "
            >
              Enter the same 6 digits once more to lock it in.
            </p>
  
  
            {/* PIN indicators */}
  
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
                  const active =
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
                          active ||
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
  
  
            {/* Mobile keypad */}
  
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
              <PinKey
                value="1"
                onClick={() =>
                  addDigit('1')
                }
              />
  
              <PinKey
                value="2"
                onClick={() =>
                  addDigit('2')
                }
              />
  
              <PinKey
                value="3"
                onClick={() =>
                  addDigit('3')
                }
              />
  
              <PinKey
                value="4"
                onClick={() =>
                  addDigit('4')
                }
              />
  
              <PinKey
                value="5"
                onClick={() =>
                  addDigit('5')
                }
              />
  
              <PinKey
                value="6"
                onClick={() =>
                  addDigit('6')
                }
              />
  
              <PinKey
                value="7"
                onClick={() =>
                  addDigit('7')
                }
              />
  
              <PinKey
                value="8"
                onClick={() =>
                  addDigit('8')
                }
              />
  
              <PinKey
                value="9"
                onClick={() =>
                  addDigit('9')
                }
              />
  
              <div
                aria-hidden="true"
                className="h-[56px]"
              />
  
              <PinKey
                value="0"
                onClick={() =>
                  addDigit('0')
                }
              />
  
              <button
                type="button"
                aria-label="Delete PIN digit"
                onClick={deleteDigit}
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
                  active:scale-[0.98]
                "
              >
                <Delete
                  size={22}
                  strokeWidth={1.8}
                />
              </button>
            </div>
  
  
            {/* Confirm */}
  
            <Button
              type="button"
              variant="modal"
              disabled={!isComplete}
              onClick={handleConfirm}
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
              Confirm PIN
  
              <ArrowRight
                size={17}
                strokeWidth={1.8}
              />
            </Button>
  
  
            {/* Start over */}
  
            <button
              type="button"
              onClick={handleStartOver}
              className="
                mx-auto
                mt-5
                block
                text-[12px]
                font-medium
                text-[#1CA045]
              "
            >
              Start over
            </button>
  
  
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
          </div>
        </section>
      </main>
    )
  }
  
  
  /*
    =============================================================
    KEYPAD BUTTON
    =============================================================
  */
  
  function PinKey({
    value,
    onClick,
  }: {
    value: string
    onClick: () => void
  }) {
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
    BENEFIT
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
  
        <span className="text-[14px] text-white/90">
          {children}
        </span>
      </div>
    )
  }
  
  
  export default ConfirmPIN