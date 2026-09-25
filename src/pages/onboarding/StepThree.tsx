import { useNavigate } from 'react-router'

import { onboardingData } from '../../constants/onboarding'
import OnboardingPage from './OnboardingPage'

function StepThree() {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/get-started')
  }

  const handleSkip = () => {
    navigate('/get-started')
  }

  const handleSignIn = () => {
    navigate('/sign-in')
  }

  return (
    <OnboardingPage
      item={onboardingData[2]}
      currentStep={3}
      onContinue={handleContinue}
      onSkip={handleSkip}
      onSignIn={handleSignIn}
    />
  )
}

export default StepThree