import {
    Landmark,
    Send,
  } from 'lucide-react'
  
  import { balanceFeatures } from '../../constants/landing';
  import payIcon from "../../assets/icons/stamp_3.svg";
  
  const icons = [
    <Landmark size={17} />,
    <Send size={16} />,
  ]
  
  function BalanceSection(){
    return (
      <section
        id="how-it-works"
        className="
          border-b
          border-pedxo-border
          px-6
          py-24
          md:px-10
          lg:px-[60px]
          lg:py-28
          font-inter-tight
        "
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-pedxo-green
              "
            >
              Everything in one place
            </p>
  
            <h2
              className="
                mx-auto
                mt-6
                max-w-[900px]
                text-[45px]
                font-normal
                leading-[1.03]
                tracking-[-0.05em]
                text-pedxo-text
                md:text-[56px]
              "
            >
              One balance should
              <br />
  
              do{' '}
              <span className="italic text-pedxo-green">
                more.
              </span>
            </h2>
          </div>
  
          <div className="mt-14 border-t border-pedxo-border">
            {balanceFeatures.map((feature, index) => (
              <div
                key={feature.number}
                className="
                  grid
                  gap-6
                  border-b
                  border-pedxo-border
                  py-8
                  lg:grid-cols-[70px_1fr_1.1fr]
                  lg:items-center
                "
              >
                <span className="text-[11px] text-[#737a76]">
                  {feature.number}
                </span>
  
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#e6f1e9]
                      text-pedxo-green
                    "
                  >
                    {index < 2 ? (icons[index]) : (
                      <img src={payIcon}
                      alt="pay icon"
                      className="h-[17px] w-[17px]"/>
                    )}
                  </div>
  
                  <div>
                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#777f7a]
                      "
                    >
                      {feature.label}
                    </p>
  
                    <h3 className="mt-1 text-[17px] font-semibold tracking-[-0.02em]">
                      {feature.title}
                    </h3>
                  </div>
                </div>
  
                <p
                  className="
                    max-w-[450px]
                    text-[14px]
                    leading-6
                    text-[#737a76]
                  "
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default BalanceSection