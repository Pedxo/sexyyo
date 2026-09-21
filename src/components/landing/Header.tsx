import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router'

import Button from '../ui/Button'
import Logo from '../ui/Logo'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    {
      label: 'Wallet',
      href: '#wallet',
    },
    {
      label: 'How it works',
      href: '#how-it-works',
    },
    {
      label: 'Security',
      href: '#security',
    },
  ]

  return (
    <header className="relative z-50 w-full">
      <div
        className="
          mx-auto
          flex
          h-[78px]
          w-full
          max-w-[1400px]
          items-center
          justify-between
          px-6
          md:px-10
          lg:px-[60px]
        "
      >
        <Logo />

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="
                text-[14px]
                text-[#6E736E]
                transition-colors
                hover:text-pedxo-green
              "
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/sign-in"
            className="
              text-[14px]
              font-medium
              text-[#080c09]
              hover:text-pedxo-green
            "
          >
            Sign in
          </Link>

          <Link to="/onboarding/step-1">
            <Button className="rounded-full px-5 py-2.5 text-[10px]">
              Create account
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          className="
            flex
            h-[36px]
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-pedxo-border
            md:hidden
          "
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="
            absolute
            left-0
            top-full
            w-full
            border-y
            border-pedxo-border
            bg-[#f7f8f5]
            px-6
            py-6
            shadow-xl
            md:hidden
          "
        >
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-pedxo-text"
              >
                {item.label}
              </a>
            ))}

            <div className="flex flex-col gap-3 pt-2">
              <Link to="/sign-in">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Button>
              </Link>

              <Link to="/onboarding/step-1">
                <Button
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Create account
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header