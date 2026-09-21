import { currencies } from '../../constants/landing'

function CurrencyStrip() {
  return (
    <section className="border-b border-pedxo-border font-inter-tight">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {currencies.map((currency) => (
          <div
            key={currency.code}
            className="
              flex
              h-[58px]
              items-center
              justify-center
              gap-2
              border-b
              border-r
              border-pedxo-border
              text-[11px]
              last:border-r-0
              lg:border-b-0
            "
          >
            {currency.icon ? (
              <img
                src={currency.icon}
                alt=""
                className="h-[14px] w-[14px] shrink-0"
              />
            ) : (
              <span className="text-[16px] font-medium text-pedxo-green-bright">
                {currency.symbol}
              </span>
            )}

            <span className="font-bold text-pedxo-gray">
              {currency.code}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CurrencyStrip