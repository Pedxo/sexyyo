import { Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'



import Button from '../ui/Button'
import WalletPreview from './WalletPreview'

function Hero(){
  return (
    <section
      id="wallet"
      className="
        overflow-hidden
        border-b
        border-pedxo-border
      "
    >
      <div
        className="
          mx-auto
          grid
          min-h-[720px]
          w-full
          max-w-[1400px]
          items-center
          gap-14
          px-6
          py-16
          md:px-10
          lg:grid-cols-[0.9fr_1.1fr]
          lg:px-[60px]
          lg:py-20
        "
      >
        <div className="max-w-[570px]">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#dce1dc]
              bg-[#fafbfa]
              px-3
              py-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#626b66]
              font-bold
            "
          >
            <span className="h-2 w-2 rounded-full bg-pedxo-green" />
            One wallet · six currencies
          </div>

          <h1
            className="
              mt-5
              max-w-[570px]
              text-[60px]
              font-normal
              leading-[0.94]
              tracking-[-0.06em]
              text-pedxo-text
              sm:text-[78px]
              lg:text-[82px]
            "
          >
            Your
            <br />

            money,
            <br />

            <span className="italic text-pedxo-green">
              in
            </span>
            <br />
            <span className="italic text-pedxo-green">
              motion.
            </span>
          </h1>

          <p
            className="
              mt-6
              max-w-[450px]
              text-[16px]
              leading-6
              text-[#68706c]
            "
          >
            Hold NGN, USD, GBP, EUR, USDT and USDC. Fund once,
            send instantly, withdraw when you need to, and pay for
            services without adding a card.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/sign-up">
              <Button className="rounded-[12px] px-5 py-3">
                Open your wallet
                <ArrowRight size={13} />
              </Button>
            </Link>

            <a href="#how-it-works">
              <Button
                variant="secondary"
                className="rounded-[12px] px-5 py-3"
              >
                See how it works
              </Button>
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
            {[
              'Multi-currency balances',
              'PIN-protected payments',
              'Traceable activity',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
              >
                <Check
                  size={14}
                  strokeWidth={2}
                  className="text-pedxo-green"
                />

                <span className="text-[11px] text-[#727975]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div
            className="
              absolute
              h-[420px]
              w-[420px]
              rounded-full
              bg-[#dcebdd]
              opacity-50
              blur-[100px]
            "
          />

          <div className="relative w-full">
            <WalletPreview />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero