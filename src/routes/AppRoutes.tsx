import { createBrowserRouter } from 'react-router'
import ConfirmPIN from '../pages/auth/ConfirmPIN'
import CreateAccountPage from '../pages/auth/CreateAccountPage'
import CreateTransactionPIN from '../pages/auth/CreateTransactionPIN'
import GetStartedPage from '../pages/auth/GetStartedPage'
import OTPVerifyEmailPage from '../pages/auth/OTPVerifyEmailPage'
import SignInPage from '../pages/auth/SignInPage'
//import CreateAccountPage from '../pages/auth/CreateAccountPage'
//import GetStartedPage from '../pages/GetStartedPage'

import LandingPage from '../pages/LandingPage'
import StepOne from '../pages/onboarding/StepOne'
import StepThree from '../pages/onboarding/StepThree'
import StepTwo from '../pages/onboarding/StepTwo'

const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/onboarding/step-1',
    Component: StepOne,
  },

  {
    path: '/onboarding/step-2',
    Component: StepTwo,
  },

  {
    path: '/onboarding/step-3',
    Component: StepThree,
  },
  // {
  //   path: '/get-started',
  //   Component: GetStartedPage,
  // },
  // {
  //   path: '/create-account',
  //   Component: CreateAccountPage,
  // },
  {
    path: '/get-started',
    element: (
      <GetStartedPage
        onCreateAccount={() => {
          window.location.href =
            '/create-account'
        }}
        onLogin={() => {
          console.log('Open sign in')
        }}
      />
    ),
  },

  {
    path: '/create-account',
    element: (
      <CreateAccountPage
        onBack={() => {
          window.location.href =
            '/get-started'
        }}
        onSignIn={() => {
          console.log('Open sign in')
        }}
      />
    ),
  },
  {
    path: '/otp-verify-email',
    Component: OTPVerifyEmailPage,
  },
  {
    path: '/create-transaction-pin',
    Component: CreateTransactionPIN,
  },
  {
    path: '/confirm-pin',
    Component: ConfirmPIN,
  },

  // Future authentication routes
  {
    path: '/sign-in',
    Component: SignInPage,
  },
  //
  //
  // {
  //   path: '/forgot-password',
  //   Component: ForgotPasswordPage,
  // },
  //
  // {
  //   path: '/otp-verification',
  //   Component: OTPVerificationPage,
  // },
  //
  // {
  //   path: '/reset-password',
  //   Component: ResetPasswordPage,
  // },

  // Future authenticated dashboard
  // {
  //   path: '/dashboard',
  //   Component: DashboardPage,
  // },
])

export default router