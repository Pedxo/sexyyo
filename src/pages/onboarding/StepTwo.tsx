import { useNavigate } from 'react-router'

import { onboardingData } from '../../constants/onboarding'
import OnboardingPage from './OnboardingPage'

function StepTwo() {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/onboarding/step-3')
  }

  const handleSkip = () => {
    navigate('/get-started')
  }

  const handleSignIn = () => {
    navigate('/sign-in')
  }


  return (
    <OnboardingPage
      item={onboardingData[1]}
      currentStep={2}
      onContinue={handleContinue}
      onSkip={handleSkip}
      onSignIn={handleSignIn}
    />
  )
}

export default StepTwo