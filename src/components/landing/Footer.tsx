import { Link } from 'react-router'

import Logo from '../ui/Logo'

function Footer(){
  return (
    <footer className="bg-[#f7f8f5]">
      <div
        className="
          mx-auto
          font-inter-tight
          flex
          max-w-[1400px]
          flex-col
          gap-6
          px-6
          py-8
          text-[12px]
          text-[#6e736e]
          md:flex-row
          md:items-center
          md:justify-between
          md:px-10
          lg:px-[60px]
        "
      >
        <Logo />

        <p className="text-center">
          Multi-currency wallet for the way you use Pedxo.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/sign-in"
            className="hover:text-pedxo-green"
          >
            Sign in
          </Link>

          <Link
            to="/onboarding/step-1"
            className="hover:text-pedxo-green"
          >
            Create account
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer