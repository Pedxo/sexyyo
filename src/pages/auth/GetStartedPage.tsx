import {
    ArrowLeft,
    ArrowRight,
  } from 'lucide-react'
  
  import { useNavigate } from 'react-router'
  
  import Logo from '../../components/ui/Logo'
  import Button from '../../components/ui/Button'
  import SocialButton from '../../components/auth/SocialButton'
  
  import googleIcon from '../../assets/icons/Google_icon.svg'
  
  /*
    Desktop:
    White GitHub button -> dark GitHub icon
  */
  import githubWhiteBgIcon from '../../assets/icons/GitIcon_whiteBG.svg'
  
  /*
    Mobile:
    Dark GitHub button -> white GitHub icon
  */
  import githubDarkBgIcon from '../../assets/icons/GitIcon_darkBG.svg'
  
  
  interface GetStartedPageProps {
    onCreateAccount: () => void
    onLogin: () => void
  }
  
  
  function GetStartedPage({
    onCreateAccount,
    onLogin,
  }: GetStartedPageProps) {
    /*
      ---------------------------------------------------------
      ROUTER
      ---------------------------------------------------------
  
      Get Started is reached from Step 3.
  
      Therefore the Back button should explicitly return to:
  
        /onboarding/step-3
  
      We do not depend on browser history here.
    */
  
    const navigate = useNavigate()
  
    const handleBack = () => {
      navigate('/onboarding/step-3')
    }
  
  
    return (
      <main
        className="
          min-h-screen
          bg-white
        "
      >
  
        {/* =====================================================
            DESKTOP GET STARTED
            ===================================================== */}
  
        <section
          className="
            hidden
            min-h-screen
            w-full
            bg-white
            lg:block
          "
        >
  
          <div
            className="
              mx-auto
              flex
              min-h-screen
              w-full
              max-w-[1440px]
              flex-col
              items-center
              px-8
              py-16
            "
          >
  
            {/* =================================================
                DESKTOP BACK
                ================================================= */}
  
            <div
              className="
                w-full
                max-w-[400px]
              "
            >
  
              <button
                type="button"
                onClick={handleBack}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-[13px]
                  font-normal
                  text-pedxo-gray
                  transition-colors
                  duration-200
                  hover:text-pedxo-black
                "
              >
  
                <ArrowLeft
                  size={15}
                  strokeWidth={1.5}
                />
  
                <span>
                  Back
                </span>
  
              </button>
  
            </div>
  
  
            {/* =================================================
                MAIN CONTENT
                ================================================= */}
  
            <div
              className="
                mt-[42px]
                flex
                w-full
                max-w-[400px]
                flex-1
                flex-col
                items-center
              "
            >
  
              {/* =================================================
                  LOGO
                  ================================================= */}
  
              <Logo
                showText={false}
                size="lg"
              />
  
  
              {/* =================================================
                  HEADING
                  ================================================= */}
  
              <h1
                className="
                  mt-8
                  text-center
                  text-[48px]
                  font-semibold
                  leading-[1.02]
                  tracking-[-0.055em]
                  text-pedxo-black
                "
              >
                Fund once.{' '}
  
                <span className="text-pedxo-green">
                  Pay
                </span>
  
                <br />
  
                <span className="text-pedxo-green">
                  everywhere.
                </span>
  
              </h1>
  
  
              {/* =================================================
                  DESCRIPTION
                  ================================================= */}
  
              <p
                className="
                  mt-5
                  max-w-[390px]
                  text-center
                  text-[14px]
                  leading-5
                  text-pedxo-gray
                "
              >
                Create your Pedxo Pay wallet in under
                two minutes. Verify once, transact
                forever.
              </p>
  
  
              {/* =================================================
                  DESKTOP BUTTONS
                  ================================================= */}
  
              <div
                className="
                  mt-10
                  w-full
                  space-y-3
                "
              >
  
                {/* =================================================
                    CREATE ACCOUNT
                    ================================================= */}
  
                <Button
                  type="button"
                  onClick={onCreateAccount}
                  className="
                    h-[54px]
                    w-full
                    text-[14px]
                  "
                >
                  <span>
                    Create free account
                  </span>
  
                  <ArrowRight
                    size={16}
                    strokeWidth={1.8}
                  />
                </Button>
  
  
                {/* =================================================
                    LOGIN
                    ================================================= */}
  
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onLogin}
                  className="
                    h-[54px]
                    w-full
                    border-pedxo-border
                    text-[14px]
                    font-semibold
                    text-pedxo-green
                  "
                >
                  <span>
                    Login with your Pedxo account
                  </span>
  
                  <ArrowRight
                    size={16}
                    strokeWidth={1.8}
                  />
                </Button>
  
  
                {/* =================================================
                    GOOGLE
                    ================================================= */}
  
                <SocialButton
                  icon={googleIcon}
                >
                  Continue with Google
                </SocialButton>
  
  
                {/* =================================================
                    GITHUB
                    ================================================= */}
  
                <SocialButton
                  icon={githubWhiteBgIcon}
                >
                  Continue with Github
                </SocialButton>
  
              </div>
  
  
              {/* =================================================
                  EXISTING ACCOUNT
                  ================================================= */}
  
              <p
                className="
                  mt-7
                  text-[14px]
                  text-pedxo-gray
                "
              >
                Already have an account?{' '}
  
                <button
                  type="button"
                  onClick={onLogin}
                  className="
                    text-pedxo-green
                    transition-colors
                    hover:text-pedxo-green-dark
                  "
                >
                  Sign in
                </button>
  
              </p>
  
  
              {/* =================================================
                  DESKTOP TERMS
                  ================================================= */}
  
              <p
                className="
                  mt-auto
                  max-w-[390px]
                  pt-12
                  text-center
                  text-[12px]
                  leading-5
                  text-pedxo-gray
                "
              >
                By continuing you agree to Pedxo's{' '}
                <u>Terms</u> & <u>Privacy Policy</u>.
                KYC verification required to fund your
                wallet.
              </p>
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* =====================================================
            MOBILE GET STARTED
            ===================================================== */}
  
        <section
          className="
            flex
            min-h-screen
            flex-col
            bg-[radial-gradient(126.55%_96.03%_at_30%_20%,#3BCA60_0%,#005F21_70%)]
            px-6
            py-6
            lg:hidden
          "
        >
  
          {/* =================================================
              MOBILE HEADER
              ================================================= */}
  
          <AuthHeaderMobile
            onBack={handleBack}
          />
  
  
          {/* =================================================
              MOBILE LOGO
              ================================================= */}
  
          <div className="mt-2">
  
            <Logo
              light
              showText
              size="md"
            />
  
          </div>
  
  
          {/* =================================================
              MOBILE CONTENT
              ================================================= */}
  
          <div className="mt-[260px]">
  
            {/* =================================================
                HEADING
                ================================================= */}
  
            <h1
              className="
                max-w-[330px]
                text-[34px]
                font-medium
                leading-[1.02]
                tracking-[-0.055em]
                text-white
              "
            >
              Something's.{' '}
  
              <span className="italic text-[#3bca60]">
                Always
              </span>
  
              <br />
  
              <span className="italic text-[#3bca60]">
                Moving.
              </span>
  
            </h1>
  
  
            {/* =================================================
                DESCRIPTION
                ================================================= */}
  
            <p
              className="
                mt-5
                max-w-[330px]
                text-[14px]
                leading-5
                text-white/75
              "
            >
              Create your Pedxo Pay wallet in under two
              minutes. Verify once, transact forever.
            </p>
  
  
            {/* =================================================
                MOBILE BUTTONS
                ================================================= */}
  
            <div
              className="
                mt-8
                space-y-3
              "
            >
  
              {/* =================================================
                  CREATE ACCOUNT
                  ================================================= */}
  
                <Button
                type="button"
                variant="light"
                onClick={onCreateAccount}
                className="
                    md:h-[52px]
                    md:w-[342px]
                    h-[48px]
                    w-full
                    text-[14px]
                    font-bold
                "
                >
                Create account

                <ArrowRight
                    size={17}
                    strokeWidth={1.8}
                />
                </Button>
  
              {/* =================================================
                  GOOGLE
                  ================================================= */}
  
              <SocialButton
                icon={googleIcon}
                className="
                  md:h-[52px]
                  md:w-[342px]
                  h-[48px]
                  w-full
                  border-white
                  bg-white
                  text-pedxo-black
                  shadow-[0_10px_25px_rgba(0,0,0,0.10)]
                  hover:bg-white
                "
              >
                Continue with Google
              </SocialButton>
  
  
              {/* =================================================
                  GITHUB
                  ================================================= */}
  
              <SocialButton
                icon={githubDarkBgIcon}
                dark
                className="
                  md:h-[52px]
                  md:w-[342px]
                  h-[48px]
                  w-full
                  border-pedxo-black
                  bg-pedxo-black
                  text-white
                  shadow-[0_10px_25px_rgba(0,0,0,0.18)]
                  hover:bg-pedxo-black
                "
              >
                Continue with Github
              </SocialButton>
  
            </div>
  
  
            {/* =================================================
                EXISTING ACCOUNT
                ================================================= */}
  
            <p
              className="
                pb-3
                pt-6
                text-center
                text-[13px]
                text-white/70
              "
            >
              Already have an account?{' '}
  
              <button
                type="button"
                onClick={onLogin}
                className="
                  text-white
                  hover:underline
                "
              >
                Sign in
              </button>
  
            </p>
  
          </div>
  
        </section>
  
      </main>
    )
  }
  
  
  /* =========================================================
     MOBILE HEADER
     ========================================================= */
  
  function AuthHeaderMobile({
    onBack,
  }: {
    onBack: () => void
  }) {
    return (
      <div
        className="
          flex
          items-center
          justify-between
        "
      >
  
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex
            items-center
            gap-1.5
            text-[14px]
            text-white/80
            transition-colors
            duration-200
            hover:text-white
          "
        >
  
          <ArrowLeft
            size={16}
            strokeWidth={1.5}
          />
  
          <span>
            Back
          </span>
  
        </button>
  
      </div>
    )
  }
  
  
  export default GetStartedPage