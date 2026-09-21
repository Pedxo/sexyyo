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

  return (
    <OnboardingPage
      item={onboardingData[0]}
      currentStep={1}
      onContinue={handleContinue}
      onSkip={handleSkip}
    />
  )
}

export default StepOne