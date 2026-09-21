import type {
    ButtonHTMLAttributes,
    ReactNode,
  } from 'react'
  
  
  interface SocialButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string
    children: ReactNode
    dark?: boolean
  }
  
  
  function SocialButton({
    icon,
    children,
    dark = false,
    className = '',
    ...props
  }: SocialButtonProps) {
    return (
      <button
        type="button"
        {...props}
        className={`
          flex
          h-[52px]
          w-full
          items-center
          justify-center
          gap-3
          rounded-full
          border
          px-5
          text-[14px]
          font-semibold
          transition-all
          duration-200
  
          ${
            dark
              ? `
                border-pedxo-black
                bg-pedxo-black
                text-white
                shadow-[0_10px_20px_rgba(8,12,9,0.14)]
                hover:bg-pedxo-green-deep
              `
              : `
                border-pedxo-border
                bg-white
                text-pedxo-black
                shadow-[0_10px_20px_rgba(8,12,9,0.06)]
                hover:bg-pedxo-soft-green
              `
          }
  
          ${className}
        `}
      >
        <img
          src={icon}
          alt=""
          className="
            h-[19px]
            w-[19px]
            shrink-0
          "
        />
  
        <span className="text-[14px]">
          {children}
        </span>
      </button>
    )
  }
  
  
  export default SocialButton