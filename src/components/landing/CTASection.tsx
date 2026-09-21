import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import Button from '../ui/Button'

function CTASection(){
  return (
    <section className="border-b border-pedxo-border px-6 py-10 md:px-10 lg:px-[44px] lg:py-[36px] font-inter-tight">
      <div
        className="
          mx-auto
          flex
          max-w-[1400px]
          flex-col
          gap-8
          rounded-[12px]
          bg-pedxo-green
          px-7
          py-10
          lg:flex-row
          lg:items-center
          lg:justify-between
          lg:px-8
        "
      >
        <div>
          <p
            className="
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#b7dfc0]
            "
          >
            Pedxo Pay
          </p>

          <h2
            className="
              mt-4
              text-[40px]
              font-normal
              tracking-[-0.04em]
              text-white
              md:text-[60px]
            "
          >
            Fund once. Keep moving.
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/sign-up">
            <Button
              variant="secondary"
              className="rounded-[10px] border-0 px-5 py-3"
            >
              Create account
              <ArrowRight size={13} />
            </Button>
          </Link>

          <Link to="/sign-in">
            <button
              className="
                rounded-[24px]
                border
                border-white/20
                px-5
                py-3
                text-[11px]
                text-white
                transition-colors
                hover:bg-white/10
              "
            >
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTASection