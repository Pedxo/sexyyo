import type {
    InputHTMLAttributes,
  } from 'react'
  
  interface AuthInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    helperText?: string
  }
  
  function AuthInput({
    label,
    helperText,
    className = '',
    ...props
  }: AuthInputProps) {
    return (
      <div className="w-full">
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
  
        <input
          {...props}
          className={`
            h-[50px]
            w-full
            rounded-full
            border
            border-pedxo-border
            bg-white
            px-[17px]
            md:text-[14px]
            text-[12px]
            text-pedxo-black
            outline-none
            transition-all
            placeholder:text-pedxo-gray
            placeholder:text-[12px]
            focus:border-pedxo-green
            focus:ring-2
            focus:ring-pedxo-green/10
            ${className}
          `}
        />
  
        {helperText && (
          <p
            className="
              mt-2
              text-[11px]
              text-pedxo-gray
            "
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
  
  export default AuthInput