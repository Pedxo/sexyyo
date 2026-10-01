import type {
  ComponentType,
  SVGProps,
} from 'react'

import * as Flags from 'country-flag-icons/react/3x2'

import { hasFlag } from 'country-flag-icons'

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

The country code must be a valid ISO alpha-2 code,
for example:

NG -> Nigeria
US -> United States
GB -> United Kingdom
*/

function CountryFlag({
  countryCode,
  countryName,
  className = '',
}: CountryFlagProps) {
  if (!countryCode) {
    return null
  }

  const normalizedCode = countryCode.toUpperCase()

  if (!hasFlag(normalizedCode)) {
    return null
  }

  const FlagComponent =
    Flags[
      normalizedCode as keyof typeof Flags
    ] as
      | ComponentType<SVGProps<SVGSVGElement>>
      | undefined

  if (!FlagComponent) {
    return null
  }

  const accessibleName =
    countryName || normalizedCode

  return (
    <FlagComponent
      aria-label={accessibleName}
      role="img"
      className={`
        block
        shrink-0
        overflow-hidden
        rounded-[2px]
        ${className}
      `}
    >
      <title>{accessibleName}</title>
    </FlagComponent>
  )
}

export default CountryFlag