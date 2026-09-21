import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?:
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'light'
    | 'modal'
  className?: string
  loading?: boolean
  loadingText?: string
}

function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  loadingText = 'Creating account...',
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    /* =====================================================
       GREEN BUTTON
       ===================================================== */
    primary:
      'bg-pedxo-green text-pedxo-white hover:bg-pedxo-green-dark shadow-[0_10px_20px_rgba(28,160,69,0.16)]',

    /* =====================================================
       WHITE OUTLINED BUTTON
       ===================================================== */
    secondary:
      'border border-pedxo-border bg-pedxo-white text-pedxo-black hover:bg-pedxo-soft-green',

    /* =====================================================
       DARK BUTTON
       ===================================================== */
    dark:
      'bg-pedxo-black text-pedxo-white hover:bg-pedxo-green-deep',

    /* =====================================================
       LIGHT BUTTON
       ===================================================== */
    light:
      'border border-pedxo-white bg-pedxo-white text-pedxo-black shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:bg-pedxo-white',

    /* =====================================================
       MODAL BUTTON
       ===================================================== */
    modal:
      'bg-[linear-gradient(135deg,#1CA045_0%,#3BCA60_100%)] text-white shadow-[0_20px_60px_-20px_rgba(0,95,33,0.35)] hover:brightness-[1.03]',
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        px-5
        py-3
        text-[12px]
        font-medium
        transition-all
        duration-200

        ${variants[variant]}

        ${loading ? 'opacity-70' : ''}

        ${disabled || loading ? 'cursor-not-allowed' : ''}

        ${className}
      `}
    >
      {loading ? (
        <>
          <span
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-white/40
              border-t-white
            "
          />

          <span>
            {loadingText}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button