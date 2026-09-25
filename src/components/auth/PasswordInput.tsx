import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void

  /**
   * Allows each page to provide its own label.
   * Defaults to "Password" for backward compatibility.
   */
  label?: string

  /**
   * Allows each page to provide its own placeholder.
   */
  placeholder?: string

  /**
   * Controls whether the password requirement text is shown.
   *
   * Example:
   * showPasswordHint={false}
   *
   * Useful for Sign In and Passcode fields.
   */
  showPasswordHint?: boolean
}

function PasswordInput({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Create a strong password',
  showPasswordHint = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full">
      {/* Password label */}
      <label
        className="
          mb-2
          block
          text-[12px]
          font-medium
          text-pedxo-black
        "
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(event) => {
            /*
              PasswordInput exposes only the string value
              to the parent component.

              Parent components should therefore use:

              onChange={setPassword}

              or:

              onChange={(value) => setPassword(value)}
            */
            onChange(event.target.value)
          }}
          placeholder={placeholder}
          className="
            h-[50px]
            w-full
            rounded-full
            border
            border-[#dfe4df]
            bg-white
            px-[17px]
            pr-12
            text-[12px]
            text-pedxo-black
            outline-none
            transition-all
            placeholder:text-[12px]
            placeholder:text-[#858b86]
            focus:border-pedxo-green
            focus:ring-2
            focus:ring-pedxo-green/10
            md:text-[13px]
          "
        />

        {/* Show / hide password */}
        <button
          type="button"
          onClick={() =>
            setShowPassword((current) => !current)
          }
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-[#727973]
            transition-colors
            hover:text-pedxo-black
          "
          aria-label={
            showPassword
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
        >
          {showPassword ? (
            <EyeOff
              size={17}
              strokeWidth={1.7}
            />
          ) : (
            <Eye
              size={17}
              strokeWidth={1.7}
            />
          )}
        </button>
      </div>

      {/* Password requirement */}
      {showPasswordHint && (
        <p
          className="
            mt-2
            text-[10px]
            leading-4
            text-pedxo-gray
          "
        >
          Minimum 8 characters
        </p>
      )}
    </div>
  )
}

export default PasswordInput