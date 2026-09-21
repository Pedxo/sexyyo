import { AlertCircle } from 'lucide-react'

interface ValidationMessageProps {
  title?: string
  message: string
}

function ValidationMessage({
  title = "We couldn't create that account",
  message,
}: ValidationMessageProps) {
  if (!message) {
    return null
  }

  return (
    <div
      className="
        rounded-[24px]
        border
        border-[#E62C2C4D]
        bg-[#FFF0F3]
        px-4
        py-3
      "
      role="alert"
    >
      {/* =====================================================
          ERROR TITLE
          ===================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <AlertCircle
          size={16}
          strokeWidth={2}
          className="
            shrink-0
            text-[#E62C2C]
          "
        />

        <span
          className="
            text-[12px]
            font-semibold
            leading-5
            text-pedxo-black
          "
        >
          {title}
        </span>
      </div>

      {/* =====================================================
          ERROR DESCRIPTION
          ===================================================== */}

      <p
        className="
          mt-1
          pl-6
          text-[11px]
          leading-5
          text-[#6E736E]
        "
      >
        {message}
      </p>
    </div>
  )
}

export default ValidationMessage