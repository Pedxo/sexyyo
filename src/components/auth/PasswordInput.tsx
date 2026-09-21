import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
}

function PasswordInput({
  value,
  onChange,
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
        Password
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(event) => {
            /*
              PasswordInput exposes only the value
              to the parent component.

              Therefore CreateAccountPage should use:

              onChange={setPassword}
            */
            onChange(event.target.value)
          }}
          placeholder="Create a strong password"
          className="
            h-[50px]
            w-full
            rounded-full
            border
            border-[#dfe4df]
            bg-white
            px-[17px]
            pr-12
            md:text-[13px]
            text-[12px]
            text-pedxo-black
            outline-none
            transition-all
            placeholder:text-[#858b86]
            placeholder:text-[12px]
            focus:border-pedxo-green
            focus:ring-2
            focus:ring-pedxo-green/10
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
          "
          aria-label={
            showPassword
              ? 'Hide password'
              : 'Show password'
          }
        >
          {showPassword ? (
            <EyeOff size={17} strokeWidth={1.7} />
          ) : (
            <Eye size={17} strokeWidth={1.7} />
          )}
        </button>
      </div>

      {/* Password requirement */}
      <p
        className="
          mt-2
          text-[10px]
          leading-4
          text-pedxo-gray
        "
      >
      </p>
    </div>
  )
}

export default PasswordInput