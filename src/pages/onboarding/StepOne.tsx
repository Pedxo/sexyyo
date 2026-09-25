import { useNavigate } from 'react-router'

import { onboardingData } from '../../constants/onboarding'
import OnboardingPage from './OnboardingPage'

function StepOne() {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/onboarding/step-2')
  }

  const handleSkip = () => {
    navigate('/get-started')
  }
  const handleSignIn = () => {
    navigate('/sign-in')
  }

  return (
    <OnboardingPage
      item={onboardingData[0]}
      currentStep={1}
      onContinue={handleContinue}
      onSkip={handleSkip}
      onSignIn={handleSignIn}
    />
  )
}

export default StepOne