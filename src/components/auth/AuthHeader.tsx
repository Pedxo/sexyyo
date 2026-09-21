import { ArrowLeft } from 'lucide-react'

interface AuthHeaderProps {
  onBack: () => void
  rightText?: string
}

function AuthHeader({
  onBack,
  rightText = 'Sign in',
}: AuthHeaderProps) {
  return (
    <div
      className="
        flex
        w-full
        items-center
        justify-between
      "
    >
      <button
        type="button"
        onClick={onBack}
        className="
          inline-flex
          items-center
          gap-1.5
          text-[14px]
          font-normal
          text-pedxo-gray
          transition-colors
          hover:text-pedxo-black
        "
      >
        <ArrowLeft
          size={16}
          strokeWidth={1.5}
        />

        <span>Back</span>
      </button>

      <span
        className="
          text-[14px]
          font-normal
          text-pedxo-gray
        "
      >
        {rightText}
      </span>
    </div>
  )
}

export default AuthHeader