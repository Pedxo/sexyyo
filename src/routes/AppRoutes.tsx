import { createBrowserRouter } from 'react-router'

import ConfirmPIN from '../pages/auth/ConfirmPIN'
import CreateAccountPage from '../pages/auth/CreateAccountPage'
import CreatePassCode from '../pages/auth/CreatePassCode'
import CreateTransactionPIN from '../pages/auth/CreateTransactionPIN'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import GetStartedPage from '../pages/auth/GetStartedPage'
import OTPVerifyEmailPage from '../pages/auth/OTPVerifyEmailPage'
import ResetNewPassword from '../pages/auth/ResetNewPassword'
import SignInPage from '../pages/auth/SignInPage'

import LandingPage from '../pages/LandingPage'
import CheckoutPage from '../pages/checkout/CheckoutPage'

import StepOne from '../pages/onboarding/StepOne'
import StepTwo from '../pages/onboarding/StepTwo'
import StepThree from '../pages/onboarding/StepThree'

import DashboardPage from '../pages/dashboard/DashboardPage'
import TransactionsPage from '../pages/dashboard/TransactionsPage'
import WalletsPage from '../pages/dashboard/WalletsPage'
import PayoutsPage from '../pages/dashboard/PayoutsPage'
import SettingsPage from '../pages/dashboard/SettingsPage'

import DashboardLayout from '../components/dashboard/DashboardLayout'

const router =
  createBrowserRouter([
    {
      path: '/',
      Component: LandingPage,
    },

    {
      path: '/checkout',
      Component: CheckoutPage,
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

    {
      path: '/get-started',
      element: (
        <GetStartedPage
          onCreateAccount={() => {
            window.location.href =
              '/create-account'
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
            window.location.href =
              '/sign-in'
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

    {
      path: '/sign-in',
      Component: SignInPage,
    },

    {
      path: '/create-pass-code',
      Component: CreatePassCode,
    },

    {
      path: '/forgot-password',
      Component: ForgotPasswordPage,
    },

    {
      path: '/reset-new-password',
      Component: ResetNewPassword,
    },

    /*
      =========================================================
      DASHBOARD
      =========================================================
    */

    {
      path: '/dashboard',
      Component: DashboardLayout,

      children: [
        {
          index: true,
          Component: DashboardPage,
        },

        {
          path: 'wallets',
          Component: WalletsPage,
        },

        {
          path: 'transactions',
          Component: TransactionsPage,
        },

        {
          path: 'payouts',
          Component: PayoutsPage,
        },

        {
          path: 'settings',
          Component: SettingsPage,
        },
      ],
    },
  ])

export default router
