import {
    useRef,
    useState,
  } from 'react'
  
  interface OTPProps {
    value: string[]
    onChange: (value: string[]) => void
  
    /*
      Optional error state.
  
      When true, all OTP boxes receive the
      red error border.
    */
    error?: boolean
  
    /*
      Allows each page to control its own
      OTP dimensions.
    */
    inputClassName?: string
  
    /*
      Optional class for the OTP container.
    */
    containerClassName?: string
  
    /*
      Used for accessibility.
    */
    ariaLabelPrefix?: string
  
    /*
      Automatically focus the first OTP box.
    */
    autoFocus?: boolean
  }
  
  function OTP({
    value,
    onChange,
    error = false,
    inputClassName = '',
    containerClassName = '',
    ariaLabelPrefix = 'OTP digit',
    autoFocus = false,
  }: OTPProps) {
    /*
      Stores the currently active OTP box.
    */
    const [activeIndex, setActiveIndex] = useState(0)
  
    /*
      Stores references to all six inputs.
    */
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  
    /*
      Update one OTP digit.
    */
    const handleChange = (
      index: number,
      inputValue: string,
    ) => {
      /*
        Remove anything that isn't a number.
      */
      const numbersOnly =
        inputValue.replace(/\D/g, '')
  
      /*
        If the user deletes the value,
        clear this box.
      */
      if (!numbersOnly) {
        const updated = [...value]
  
        updated[index] = ''
  
        onChange(updated)
  
        return
      }
  
      /*
        This also supports pasting several digits
        into an individual OTP box.
      */
      const digits = numbersOnly.slice(0, 6)
  
      const updated = [...value]
  
      digits
        .split('')
        .forEach((digit, offset) => {
          const targetIndex =
            index + offset
  
          if (targetIndex < 6) {
            updated[targetIndex] = digit
          }
        })
  
      onChange(updated)
  
      /*
        Move to the next box.
      */
      const nextIndex = Math.min(
        index + digits.length,
        5,
      )
  
      setActiveIndex(nextIndex)
  
      inputRefs.current[nextIndex]?.focus()
    }
  
    /*
      Handle keyboard navigation.
    */
    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      /*
        Backspace:
        If the current box is empty,
        move to the previous box and clear it.
      */
      if (
        event.key === 'Backspace' &&
        !value[index] &&
        index > 0
      ) {
        const previousIndex =
          index - 1
  
        const updated = [...value]
  
        updated[previousIndex] = ''
  
        onChange(updated)
  
        setActiveIndex(previousIndex)
  
        inputRefs.current[
          previousIndex
        ]?.focus()
  
        return
      }
  
      /*
        Left arrow.
      */
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
  
        return
      }
  
      /*
        Right arrow.
      */
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
      Handle pasting a complete OTP.
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
  
      onChange(updated)
  
      /*
        Keep focus on the last entered box.
      */
      const nextIndex = Math.min(
        pasted.length,
        5,
      )
  
      setActiveIndex(nextIndex)
  
      inputRefs.current[
        nextIndex
      ]?.focus()
    }
  
    return (
      <div
        className={`
          flex
          ${containerClassName}
        `}
      >
        {value.map((digit, index) => {
          const isActive =
            activeIndex === index
  
          const hasValue =
            digit.length > 0
  
          return (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] =
                  element
              }}
              value={digit}
              type="text"
              inputMode="numeric"
              autoComplete={
                index === 0
                  ? 'one-time-code'
                  : 'off'
              }
              maxLength={1}
              autoFocus={
                autoFocus && index === 0
              }
              aria-label={`${ariaLabelPrefix} ${
                index + 1
              }`}
              onFocus={() =>
                setActiveIndex(index)
              }
              onChange={(event) =>
                handleChange(
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
                rounded-[24px]
                border
                bg-[#FFFFFF01]
                text-center
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
  
                ${
                  error
                    ? `
                      !border-[#E62C2C]
                      !shadow-none
                    `
                    : ''
                }
  
                ${inputClassName}
              `}
            />
          )
        })}
      </div>
    )
  }
  
  export default OTP