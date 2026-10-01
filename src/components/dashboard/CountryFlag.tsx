import type {
    ComponentType,
    SVGProps,
  } from 'react'
  
  import * as Flags from 'country-flag-icons/react/3x2'
  
  import {
    hasFlag,
  } from 'country-flag-icons'
  
  interface CountryFlagProps {
    countryCode: string | null
    countryName?: string
    className?: string
  }
  
  /*
  =========================================================
  COUNTRY FLAG
  =========================================================
  
  Uses real SVG flags instead of Unicode emoji.
  
  This avoids Windows displaying:
  
  NG
  US
  GB
  
  instead of:
  
  🇳🇬
  🇺🇸
  🇬🇧
  
  The component supports all country codes supplied by
  country-flag-icons.
  =========================================================
  */
  function CountryFlag({
    countryCode,
    countryName,
    className = '',
  }: CountryFlagProps) {
    if (!countryCode) {
      return null
    }
  
    const normalizedCode =
      countryCode.toUpperCase()
  
    if (!hasFlag(normalizedCode)) {
      return null
    }
  
    const FlagComponent =
      Flags[
        normalizedCode as keyof typeof Flags
      ] as
        | ComponentType<
            SVGProps<SVGSVGElement>
          >
        | undefined
  
    if (!FlagComponent) {
      return null
    }
  
    return (
      <FlagComponent
        title={
          countryName ||
          normalizedCode
        }
        aria-label={
          countryName ||
          normalizedCode
        }
        className={`
          block
          shrink-0
          overflow-hidden
          rounded-[2px]
          ${className}
        `}
      />
    )
  }
  
  export default CountryFlag