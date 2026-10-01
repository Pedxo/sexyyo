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

import StepOne from '../pages/onboarding/StepOne'
import StepTwo from '../pages/onboarding/StepTwo'
import StepThree from '../pages/onboarding/StepThree'

import DashboardPage from '../pages/dashboard/DashboardPage'
import DashboardSectionPage from '../pages/dashboard/DashboardSectionPage'

import DashboardLayout from '../components/dashboard/DashboardLayout'

const router =
  createBrowserRouter([
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

    {
      path: '/get-started',
      element: (
        <GetStartedPage
          onCreateAccount={() => {
            window.location.href =
              '/create-account'
          }}
          onLogin={() => {
            window.location.href =
              '/sign-in'
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
          element: (
            <DashboardSectionPage
              title="Wallets"
              description="Manage your Pedxo multi-currency wallets and balances."
              activeItem="Wallets"
            />
          ),
        },

        {
          path: 'transactions',
          element: (
            <DashboardSectionPage
              title="Transactions"
              description="View deposits, transfers, payments and other money movement."
              activeItem="Transactions"
            />
          ),
        },

        {
          path: 'payouts',
          element: (
            <DashboardSectionPage
              title="Payouts"
              description="Manage withdrawals and outgoing payouts to your connected accounts."
              activeItem="Payouts"
            />
          ),
        },

        {
          path: 'settings',
          element: (
            <DashboardSectionPage
              title="Settings"
              description="Manage your Pedxo account, security and dashboard preferences."
              activeItem="Settings"
            />
          ),
        },
      ],
    },
  ])

export default router