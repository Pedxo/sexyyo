import {
    FileText,
    LockKeyhole,
  } from 'lucide-react';
  import payIcon from "../../assets/icons/stamp_3.svg"
  
  function CheckoutSection(){
    return (
      <section className="bg-pedxo-black font-inter-tight px-6 py-24 md:px-10 lg:px-[60px] lg:py-28">
        <div
          className="
            mx-auto
            grid
            max-w-[1400px]
            items-center
            gap-16
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          <div className="max-w-[540px]">
            <p
              className="
                text-[10px]
                font-normal
                uppercase
                tracking-[0.08em]
                text-[#ffffff]
              "
            >
              Built for Pedxo checkout
            </p>
  
            <h2
              className="
                mt-6
                text-[46px]
                font-normal
                leading-[1.03]
                tracking-[-0.05em]
                text-[#f0f2ef]
                md:text-[59px]
              "
            >
              The checkout
              <br />
              that already
              <br />
              knows your
              <br />
  
              <span className="italic">
                wallet.
              </span>
            </h2>
  
            <p
              className="
                mt-7
                max-w-[470px]
                text-[14px]
                leading-6
                text-[#909892]
              "
            >
              Review the order, select an available currency, confirm
              with your transaction PIN, and move straight to
              fulfillment.
            </p>
          </div>
  
          <div className="flex justify-center lg:justify-end">
            <div
              className="
                w-full
                max-w-[470px]
                rounded-[15px]
                bg-[#f5f6f3]
                p-5
                shadow-[0_30px_70px_rgba(0,0,0,0.3)]
              "
            >
              <div className="flex items-center justify-between border-b border-[#dce0dc] pb-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#747b76]">
                    Order summary
                  </p>
  
                  <h3 className="mt-1 text-[14px] font-bold text-pedxo-text">
                    Pedxo service checkout
                  </h3>
                </div>
  
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e0efe3]
                    text-pedxo-green
                  "
                >
                  <img src={payIcon} alt="pay icon" className="h-4 w-4"/>
                </div>
              </div>
  
              <div className="space-y-3 py-4 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#777e79]">
                    Service total
                  </span>
  
                  <span className="font-bold">
                    $120.00
                  </span>
                </div>
  
                <div className="flex justify-between">
                  <span className="text-[#777e79]">
                    Pay from
                  </span>
  
                  <span className="font-bold">
                    USD Wallet
                  </span>
                </div>
              </div>
  
              <div className="flex items-center justify-between border-t border-[#dce0dc] py-4">
                <span className="text-[12px] font-semibold">
                  Total
                </span>
  
                <span className="text-[14px] font-semibold">
                  $120.00
                </span>
              </div>
  
              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-[8px]
                  bg-[#dcecdf]
                  px-3
                  py-3
                "
              >
                <div className="flex items-center gap-2">
                  <LockKeyhole
                    size={14}
                    className="text-pedxo-green"
                  />
  
                  <span className="text-[12px] font-bold text-[#45624d]">
                    PIN confirmation
                  </span>
                </div>
  
                <span className="text-[11px] font-semibold text-pedxo-green">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default CheckoutSection