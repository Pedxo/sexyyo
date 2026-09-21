import {
    LockKeyhole,
    ArrowRight,
    RotateCcw,
  } from 'lucide-react'
  
  import {useEffect, useState} from 'react'
  import Button from '../../components/ui/Button'
  import lockIcon from "../../assets/icons/lockIcon.svg";
  import timeIcon from "../../assets/icons/timeIcon.svg"
  
  interface AccountLockModalProps {
    onResetPassword: () => void
    onUnlock: () => void
  }
  
  function AccountLockModal({
    onResetPassword,
    onUnlock,
  }: AccountLockModalProps) {
    /*
      =========================================================
      TEMPORARY ACCOUNT LOCK TIMER
      =========================================================
  
      04:20 = 260 seconds.
  
      Replace this frontend timer with the lock duration
      returned by your backend when authentication is connected.
    */
  
    const [remainingSeconds, setRemainingSeconds] =
      useState(4 * 60 + 20)
  
    useEffect(() => {
      const timer = window.setInterval(() => {
        setRemainingSeconds((current) => {
          if (current <= 1) {
            window.clearInterval(timer)
  
            onUnlock()
  
            return 0
          }
  
          return current - 1
        })
      }, 1000)
  
      return () => {
        window.clearInterval(timer)
      }
    }, [onUnlock])
  
    const minutes = Math.floor(
      remainingSeconds / 60,
    )
  
    const seconds = remainingSeconds % 60
  
    const formattedTime = `${String(
      minutes,
    ).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`
  
    return (
      <div
        className="
          fixed
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          px-6
          lg:left-1/2
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-lock-title"
      >
        <div
          className="
            flex
            w-full
            max-w-[448px]
            flex-col
            md:mt-30
            mt-32
            items-center
            rounded-[28px]
            border
            border-pedxo-border
            bg-white
            px-8
            py-8
            text-center
            shadow-[0px_8px_24px_-8px_rgba(8,12,9,0.122)]
          "
        >
          {/* =====================================================
              ICON
              ===================================================== */}
  
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-[#E62C2C1A]
              text-pedxo-green
            "
          >
            <img src={lockIcon} alt="lock icon" className="md:h-11 md:w-11 h-8 w-8"/>
          </div>
  
          {/* =====================================================
              TITLE
              ===================================================== */}
  
          <h2
            id="account-lock-title"
            className="
              mt-2
              md:text-[20px]
              text-[17px]
              font-semibold
              leading-tight
              tracking-[-0.025em]
              text-pedxo-black
            "
          >
            Account temporarily locked
          </h2>
  
          {/* =====================================================
              SUBTITLE
              ===================================================== */}
  
          <p
            className="
              mt-3
              max-w-[390px]
              md:text-[13px]
              text-[11px]
              leading-5
              text-pedxo-gray
            "
          >
            For your security, we've paused sign-in
            after 3 unsuccessful attempts. You can try
            again once the timer ends, or reset your
            password now.
          </p>
  
          {/* =====================================================
              RETRY TIMER
              ===================================================== */}
  
          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              md:text-[13px]
              text-[11px]
              font-medium
              text-pedxo-gray
              rounded-full
              md:px-8
              md:py-4
              px-4
              py-2
              bg-[#F0F3EF]
            "
          >
            <img src={timeIcon} alt="time icon" className="h-4 w-4"/>
  
            Retry in {formattedTime}
          </div>
  
          {/* =====================================================
              RESET PASSWORD
              ===================================================== */}
  
          <Button
            type="button"
            variant="modal"
            onClick={onResetPassword}
            className="
              mt-6
              h-[48px]
              w-full
              max-w-[382px]
              md:text-[14px]
              text-[12px]
              font-semibold
              shadow-[0px_20px_60px_-20px_rgba(0,95,33,0.349)]
            "
          >
            Reset password
  
            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </Button>
        </div>
      </div>
    )
  }
  
  export default AccountLockModal