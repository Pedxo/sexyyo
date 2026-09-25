import logoIcon from '../../assets/icons/logo.svg'//main logo green
import onboardingLogo from "../../assets/icons/logo_onboard1.png"; //use on the onboardingImage

interface LogoProps {
  light?: boolean
  showText?: boolean
  onboarding?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Logo({
  light = false,
  showText = true,
  onboarding = false,
  size = 'md',
  className = '',
}: LogoProps) {
  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-12 w-12',
  }

  return (
    <div
      className={`
        flex
        items-center
        gap-2
        ${className}
      `}
    >
      <img
        src={onboarding ? onboardingLogo : logoIcon}
        alt="Pedxo Pay"
        className={`
          shrink-0
          ${iconSizes[size]}
          ${onboarding ? 'onboarding-logo object-contain' : ''}
        `}
      />

      {showText && (
        <span
          className={`
            text-[13px]
            font-bold
            tracking-[-0.02em]
            ${
              light
                ? 'text-white'
                : 'text-pedxo-black'
            }
          `}
        >
          Pedxo Pay
        </span>
      )}
    </div>
  )
}

export default Logo