import {
    Fingerprint,
    ShieldCheck,
  } from 'lucide-react';
  import payIcon from "../../assets/icons/stamp_3.svg";
  import SvgIcon from "../ui/SvgIcon"
  
  const securityItems = [
    {
      icon: <Fingerprint size={20} />,
      title: 'Transaction PIN',
      text: 'Money movement requires your secure PIN confirmation.',
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'Verified limits',
      text: 'Account limits align with your verification level.',
    },
    {
      icon: <SvgIcon src={payIcon} alt="" className="h-[20px] w-[20px]" />,
      title: 'Clear records',
      text: 'Every deposit, transfer and payment stays traceable.',
    },
  ]
  
  function SecuritySection(){
    return (
      <section
        id="security"
        className="
          border-b
          border-pedxo-border
          px-6
          py-24
          md:px-10
          lg:px-[60px]
          lg:py-28
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-[1400px]
            gap-14
            lg:grid-cols-[0.8fr_1.2fr]
            lg:items-center
          "
        >
          <div>
            <p
              className="
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-pedxo-green
              "
            >
              Protected by design
            </p>
  
            <h2
              className="
                mt-5
                text-[43px]
                font-normal
                leading-[1.04]
                tracking-[-0.05em]
                text-pedxo-text
                md:text-[60px]
              "
            >
              Confidence at
              <br />
              every{' '}
  
              <span className="italic font-inter-tight text-pedxo-green">
                move.
              </span>
            </h2>
          </div>
  
          <div
            className="
              grid
              overflow-hidden
              rounded-[15px]
              border
              border-pedxo-border
              bg-[#fafbf9]
              md:grid-cols-3
            "
          >
            {securityItems.map((item, index) => (
              <div
                key={item.title}
                className={`
                  min-h-[190px]
                  border-b
                  border-pedxo-border
                  p-6
                  last:border-b-0
                  md:border-b-0
                  ${
                    index !== securityItems.length - 1
                      ? 'md:border-r'
                      : ''
                  }
                `}
              >
                <div className="text-pedxo-green">
                  {item.icon}
                </div>
  
                <h3 className="mt-8 text-[16px] font-inter-tight font-semibold">
                  {item.title}
                </h3>
  
                <p className="mt-3 text-[14px] font-inter-tight leading-6 text-[#747b76] ">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default SecuritySection