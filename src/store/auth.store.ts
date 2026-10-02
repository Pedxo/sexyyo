import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/*
  =============================================================
  MOCK AUTH STORE
  =============================================================

  Temporary frontend-only authentication.

  The pages handle:
  - Input validation
  - Error messages
  - Loading states
  - Modals
  - Navigation

  This store handles:
  - Mock account data
  - Email verification
  - Passcode
  - Transaction PIN
  - Login
  - Failed login attempts
  - Account locking
  - Password reset

  When the backend is ready, the functions in this store
  can be replaced with API calls.
*/

/*
  =============================================================
  MOCK SETTINGS
  =============================================================
*/

const MOCK_EMAIL_OTP = '123456'
const MOCK_RESET_OTP = '123456'

const MOCK_ACCOUNT_EMAIL = 'demo@pedxo.com'
const MOCK_ACCOUNT_PASSWORD = 'Pedxo@123'

const ACCOUNT_LOCK_DURATION = 260 * 1000
// 4 minutes 20 seconds

const MAX_FAILED_ATTEMPTS = 3

/*
  =============================================================
  USER
  =============================================================
*/

export interface User {
  email: string
  emailVerified: boolean
}

/*
  =============================================================
  SIGN-IN RESULT
  =============================================================
*/

export type SignInResult = {
  success: boolean

  reason?:
    | 'invalid_credentials'
    | 'locked'
    | 'not_verified'

  attemptsLeft?: number

  lockedUntil?: number | null
}

/*
  =============================================================
  AUTH STORE
  =============================================================
*/

interface AuthStore {
  user: User | null

  accountEmail: string
  accountPassword: string

  passCode: string

  transactionPin: string
  pendingTransactionPin: string

  emailOtp: string
  emailVerified: boolean

  resetEmail: string
  resetOtp: string
  resetOtpVerified: boolean

  isAuthenticated: boolean
  keepSignedIn: boolean

  failedAttempts: number
  lockedUntil: number | null

  createAccount: (
    email: string,
    password: string,
  ) => void

  verifyEmailOtp: (
    otp: string,
  ) => boolean

  resendEmailOtp: () => void

  createPassCode: (
    passCode: string,
  ) => void

  createTransactionPin: (
    pin: string,
  ) => void

  confirmTransactionPin: (
    pin: string,
  ) => boolean

  clearPendingTransactionPin: () => void

  signIn: (
    email: string,
    password: string,
    keepSignedIn: boolean,
  ) => SignInResult

  unlockAccount: () => void

  signOut: () => void

  forgotPassword: (
    email: string,
  ) => void

  verifyResetOtp: (
    otp: string,
  ) => boolean

  resendResetOtp: () => void

  resetPassword: (
    password: string,
  ) => boolean

  resetAuthState: () => void
}

/*
  =============================================================
  STORE
  =============================================================
*/

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      /*
        =======================================================
        INITIAL MOCK ACCOUNT
        =======================================================
      */

      user: {
        email: MOCK_ACCOUNT_EMAIL,
        emailVerified: true,
      },

      accountEmail: MOCK_ACCOUNT_EMAIL,
      accountPassword: MOCK_ACCOUNT_PASSWORD,

      /*
        =======================================================
        SECURITY SETUP
        =======================================================
      */

      passCode: '',

      transactionPin: '',
      pendingTransactionPin: '',

      /*
        =======================================================
        EMAIL VERIFICATION
        =======================================================
      */

      emailOtp: MOCK_EMAIL_OTP,
      emailVerified: true,

      /*
        =======================================================
        PASSWORD RESET
        =======================================================
      */

      resetEmail: '',
      resetOtp: MOCK_RESET_OTP,
      resetOtpVerified: false,

      /*
        =======================================================
        SESSION
        =======================================================
      */

      isAuthenticated: false,
      keepSignedIn: false,

      /*
        =======================================================
        SIGN-IN SECURITY
        =======================================================
      */

      failedAttempts: 0,
      lockedUntil: null,

      /*
        =======================================================
        CREATE ACCOUNT
        =======================================================
      */

      createAccount: (
        email,
        password,
      ) => {
        const cleanEmail = email
          .trim()
          .toLowerCase()

        set({
          accountEmail: cleanEmail,
          accountPassword: password,

          user: {
            email: cleanEmail,
            emailVerified: false,
          },

          emailOtp: MOCK_EMAIL_OTP,
          emailVerified: false,

          isAuthenticated: false,
          keepSignedIn: false,

          failedAttempts: 0,
          lockedUntil: null,

          passCode: '',
          transactionPin: '',
          pendingTransactionPin: '',

          resetEmail: '',
          resetOtp: MOCK_RESET_OTP,
          resetOtpVerified: false,
        })
      },

      /*
        =======================================================
        VERIFY EMAIL OTP
        =======================================================
      */

      verifyEmailOtp: (
        otp,
      ) => {
        const state = get()

        if (
          !state.user ||
          otp !== state.emailOtp
        ) {
          return false
        }

        set({
          emailVerified: true,

          user: {
            ...state.user,
            emailVerified: true,
          },
        })

        return true
      },

      /*
        =======================================================
        RESEND EMAIL OTP
        =======================================================
      */

      resendEmailOtp: () => {
        set({
          emailOtp: MOCK_EMAIL_OTP,
          emailVerified: false,
        })
      },

      /*
        =======================================================
        CREATE PASSCODE
        =======================================================
      */

      createPassCode: (
        passCode,
      ) => {
        set({
          passCode,
        })
      },

      /*
        =======================================================
        CREATE TRANSACTION PIN
        =======================================================
      */

      createTransactionPin: (
        pin,
      ) => {
        set({
          pendingTransactionPin: pin,
        })
      },

      /*
        =======================================================
        CONFIRM TRANSACTION PIN
        =======================================================
      */

      confirmTransactionPin: (
        pin,
      ) => {
        const state = get()

        if (
          !state.pendingTransactionPin
        ) {
          return false
        }

        if (
          pin !==
          state.pendingTransactionPin
        ) {
          return false
        }

        set({
          transactionPin: pin,
          pendingTransactionPin: '',
        })

        return true
      },

      /*
        =======================================================
        CLEAR PENDING TRANSACTION PIN
        =======================================================
      */

      clearPendingTransactionPin: () => {
        set({
          pendingTransactionPin: '',
        })
      },

      /*
        =======================================================
        SIGN IN
        =======================================================
      */

      signIn: (
        email,
        password,
        keepSignedIn,
      ) => {
        const state = get()

        /*
          -----------------------------------------------------
          CHECK EXISTING ACCOUNT LOCK
          -----------------------------------------------------
        */

        if (
          state.lockedUntil !== null
        ) {
          const lockStillActive =
            Date.now() <
            state.lockedUntil

          if (lockStillActive) {
            return {
              success: false,
              reason: 'locked',
              attemptsLeft: 0,
              lockedUntil:
                state.lockedUntil,
            }
          }

          /*
            Lock expired.

            Give the user a fresh set of
            three attempts.
          */

          set({
            failedAttempts: 0,
            lockedUntil: null,
          })
        }

        /*
          -----------------------------------------------------
          CHECK EMAIL + PASSWORD
          -----------------------------------------------------
        */

        const credentialsMatch =
          email
            .trim()
            .toLowerCase() ===
            state.accountEmail
              .trim()
              .toLowerCase() &&
          password ===
            state.accountPassword

        /*
          -----------------------------------------------------
          WRONG CREDENTIALS
          -----------------------------------------------------
        */

        if (!credentialsMatch) {
          const nextAttempt =
            state.failedAttempts + 1

          /*
            THIRD FAILED ATTEMPT
          */

          if (
            nextAttempt >=
            MAX_FAILED_ATTEMPTS
          ) {
            const lockedUntil =
              Date.now() +
              ACCOUNT_LOCK_DURATION

            set({
              failedAttempts:
                nextAttempt,
              lockedUntil,
            })

            return {
              success: false,
              reason: 'locked',
              attemptsLeft: 0,
              lockedUntil,
            }
          }

          /*
            FIRST OR SECOND ATTEMPT
          */

          const attemptsLeft =
            MAX_FAILED_ATTEMPTS -
            nextAttempt

          set({
            failedAttempts:
              nextAttempt,
          })

          return {
            success: false,
            reason:
              'invalid_credentials',
            attemptsLeft,
          }
        }

        /*
          -----------------------------------------------------
          EMAIL VERIFICATION
          -----------------------------------------------------
        */

        if (
          !state.emailVerified
        ) {
          return {
            success: false,
            reason:
              'not_verified',
          }
        }

        /*
          -----------------------------------------------------
          SUCCESS
          -----------------------------------------------------
        */

        set({
          isAuthenticated: true,
          keepSignedIn,

          failedAttempts: 0,
          lockedUntil: null,
        })

        return {
          success: true,
          attemptsLeft:
            MAX_FAILED_ATTEMPTS,
        }
      },

      /*
        =======================================================
        UNLOCK ACCOUNT
        =======================================================
      */

      unlockAccount: () => {
        set({
          failedAttempts: 0,
          lockedUntil: null,
        })
      },

      /*
        =======================================================
        SIGN OUT
        =======================================================
      */

      signOut: () => {
        set({
          isAuthenticated: false,
          keepSignedIn: false,
        })
      },

      /*
        =======================================================
        FORGOT PASSWORD
        =======================================================
      */

      forgotPassword: (
        email,
      ) => {
        set({
          resetEmail:
            email.trim().toLowerCase(),

          resetOtp:
            MOCK_RESET_OTP,

          resetOtpVerified: false,
        })
      },

      /*
        =======================================================
        VERIFY RESET OTP
        =======================================================
      */

      verifyResetOtp: (
        otp,
      ) => {
        const state = get()

        const valid =
          Boolean(state.resetEmail) &&
          otp === state.resetOtp

        if (!valid) {
          return false
        }

        set({
          resetOtpVerified: true,
        })

        return true
      },

      /*
        =======================================================
        RESEND RESET OTP
        =======================================================
      */

      resendResetOtp: () => {
        set({
          resetOtp:
            MOCK_RESET_OTP,

          resetOtpVerified: false,
        })
      },

      /*
        =======================================================
        RESET PASSWORD
        =======================================================
      */

      resetPassword: (
        password,
      ) => {
        const state = get()

        if (
          !state.resetOtpVerified
        ) {
          return false
        }

        if (
          !state.resetEmail ||
          state.resetEmail
            .toLowerCase() !==
            state.accountEmail
              .toLowerCase()
        ) {
          return false
        }

        set({
          accountPassword:
            password,

          resetOtpVerified:
            false,

          isAuthenticated: false,
          keepSignedIn: false,
        })

        return true
      },

      /*
        =======================================================
        RESET EVERYTHING
        =======================================================
      */

      resetAuthState: () => {
        set({
          user: {
            email: MOCK_ACCOUNT_EMAIL,
            emailVerified: true,
          },

          accountEmail:
            MOCK_ACCOUNT_EMAIL,

          accountPassword:
            MOCK_ACCOUNT_PASSWORD,

          passCode: '',

          transactionPin: '',
          pendingTransactionPin: '',

          emailOtp:
            MOCK_EMAIL_OTP,

          emailVerified: true,

          resetEmail: '',

          resetOtp:
            MOCK_RESET_OTP,

          resetOtpVerified: false,

          isAuthenticated: false,
          keepSignedIn: false,

          failedAttempts: 0,
          lockedUntil: null,
        })
      },
    }),

    {
      name: 'pedxo-auth-storage',
    },
  ),
)