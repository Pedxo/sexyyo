import { countries } from 'countries-list'
import {currencies as isoCurrencies,} from 'countries-list/currencies'
import type {TCurrencyCode,} from 'countries-list'

// import usdcIcon from '../assets/icons/usdcIcon.svg'

/*
=========================================================
CURRENCY TYPES
=========================================================
*/

export type CryptoCurrencyCode =
  | 'USDT'
  | 'USDC'
  | 'BTC'
  | 'ETH'
  | 'SOL'
  | 'XRP'
  | 'BNB'
  | 'ADA'
  | 'DOGE'

export type CurrencyCode =
  | TCurrencyCode
  | CryptoCurrencyCode

export interface CurrencyDefinition {
  code: CurrencyCode
  name: string
  symbol: string

  countryCode: string | null
  countryName: string

  iso4217Numeric: string | null
  decimals: number
  locale: string

  isCrypto: boolean
  isWithdrawn: boolean

  /*
  Optional visual icon.
  */
  icon?: string

  iconColor?: string
}

/*
=========================================================
COUNTRY CURRENCY OPTION
=========================================================
*/

export interface CountryCurrencyOption {
  id: string

  countryCode: string
  countryName: string

  currencyCode: CurrencyCode
  currencyName: string
  symbol: string

  iso4217Numeric: string | null
  decimals: number

  locale: string
  isCrypto: boolean
}

/*
=========================================================
CURRENCY SELECTOR OPTION
=========================================================

IMPORTANT:

This is different from CountryCurrencyOption.

CountryCurrencyOption:

USD - American Samoa
USD - United States
USD - Ecuador
USD - Guam
...

CurrencySelectorOption:

USD - United States
GBP - United Kingdom
NGN - Nigeria
...

Therefore the dropdown has ONE entry per currency.
*/

export interface CurrencySelectorOption {
  id: string

  currencyCode: CurrencyCode

  currencyName: string
  symbol: string

  countryCode: string | null
  countryName: string

  iso4217Numeric: string | null
  decimals: number

  locale: string
  isCrypto: boolean

  icon?: string
}

/*
=========================================================
CURRENCY -> REPRESENTATIVE COUNTRY MAP
=========================================================
*/

interface CurrencyCountry {
  countryCode: string
  countryName: string
}

const currencyCountryMap: Record<
  string,
  CurrencyCountry
> = {}

/*
=========================================================
BUILD INITIAL COUNTRY/CURRENCY RELATIONSHIP
=========================================================
*/

Object.entries(
  countries,
).forEach(
  ([countryCode, country]) => {
    const countryCurrencies =
      Array.isArray(
        country.currency,
      )
        ? country.currency
        : []

    countryCurrencies.forEach(
      (currencyCode) => {
        if (
          !currencyCountryMap[
            currencyCode
          ]
        ) {
          currencyCountryMap[
            currencyCode
          ] = {
            countryCode,
            countryName:
              country.name,
          }
        }
      },
    )
  },
)

/*
=========================================================
CANONICAL REPRESENTATIVE COUNTRIES
=========================================================

The country list contains currencies used by multiple
countries.

For the Dashboard selector we want one predictable
representative country.

Most importantly:

USD -> United States
GBP -> United Kingdom
NGN -> Nigeria

This prevents USD from becoming American Samoa simply
because AS happens to be encountered first in the country
dataset.
*/

const preferredCurrencyCountries:
  Record<string, string> = {
    USD: 'US',
    GBP: 'GB',
    NGN: 'NG',

    EUR: 'DE',

    AED: 'AE',
    AFN: 'AF',
    ALL: 'AL',
    AMD: 'AM',
    AOA: 'AO',
    ARS: 'AR',
    AUD: 'AU',
    BGN: 'BG',
    BHD: 'BH',
    BIF: 'BI',
    BND: 'BN',
    BRL: 'BR',
    CAD: 'CA',
    CHF: 'CH',
    CLP: 'CL',
    CNY: 'CN',
    COP: 'CO',
    CRC: 'CR',
    CZK: 'CZ',
    DKK: 'DK',
    DOP: 'DO',
    DZD: 'DZ',
    EGP: 'EG',
    ETB: 'ET',
    FJD: 'FJ',
    GEL: 'GE',
    GHS: 'GH',
    GMD: 'GM',
    GNF: 'GN',
    GTQ: 'GT',
    HKD: 'HK',
    HNL: 'HN',
    HUF: 'HU',
    IDR: 'ID',
    ILS: 'IL',
    INR: 'IN',
    IQD: 'IQ',
    ISK: 'IS',
    JMD: 'JM',
    JOD: 'JO',
    JPY: 'JP',
    KES: 'KE',
    KHR: 'KH',
    KRW: 'KR',
    KWD: 'KW',
    KZT: 'KZ',
    LAK: 'LA',
    LBP: 'LB',
    LKR: 'LK',
    MAD: 'MA',
    MDL: 'MD',
    MGA: 'MG',
    MKD: 'MK',
    MMK: 'MM',
    MNT: 'MN',
    MOP: 'MO',
    MRU: 'MR',
    MUR: 'MU',
    MVR: 'MV',
    MWK: 'MW',
    MXN: 'MX',
    MYR: 'MY',
    MZN: 'MZ',
    NAD: 'NA',
    NIO: 'NI',
    NOK: 'NO',
    NPR: 'NP',
    NZD: 'NZ',
    OMR: 'OM',
    PAB: 'PA',
    PEN: 'PE',
    PGK: 'PG',
    PHP: 'PH',
    PKR: 'PK',
    PLN: 'PL',
    PYG: 'PY',
    QAR: 'QA',
    RON: 'RO',
    RSD: 'RS',
    RUB: 'RU',
    RWF: 'RW',
    SAR: 'SA',
    SBD: 'SB',
    SCR: 'SC',
    SDG: 'SD',
    SEK: 'SE',
    SGD: 'SG',
    SLE: 'SL',
    SOS: 'SO',
    SRD: 'SR',
    SSP: 'SS',
    STN: 'ST',
    SYP: 'SY',
    SZL: 'SZ',
    THB: 'TH',
    TJS: 'TJ',
    TMT: 'TM',
    TND: 'TN',
    TOP: 'TO',
    TRY: 'TR',
    TTD: 'TT',
    TWD: 'TW',
    TZS: 'TZ',
    UAH: 'UA',
    UGX: 'UG',
    UYU: 'UY',
    UZS: 'UZ',
    VND: 'VN',
    VUV: 'VU',
    WST: 'WS',
    XAF: 'CM',
    XCD: 'AG',
    XOF: 'SN',
    XPF: 'PF',
    YER: 'YE',
    ZAR: 'ZA',
    ZMW: 'ZM',
  }

Object.entries(
  preferredCurrencyCountries,
).forEach(
  ([currencyCode, countryCode]) => {
    const country =
      countries[
        countryCode as keyof typeof countries
      ]

    if (
      country &&
      isoCurrencies[
        currencyCode as TCurrencyCode
      ]
    ) {
      currencyCountryMap[
        currencyCode
      ] = {
        countryCode,
        countryName:
          country.name,
      }
    }
  },
)

/*
=========================================================
SPECIAL EURO REPRESENTATION
=========================================================

We use Germany as the representative country so the
existing CountryFlag component can render a real country
flag. EUR itself is multinational.
*/

if (countries.DE) {
  currencyCountryMap.EUR = {
    countryCode: 'DE',
    countryName: countries.DE.name,
  }
}

/*
=========================================================
BUILD ISO 4217 CURRENCY DEFINITIONS
=========================================================
*/

const isoCurrencyDefinitions =
  Object.fromEntries(
    Object.entries(
      isoCurrencies,
    ).map(
      ([
        code,
        definition,
      ]) => {
        const country =
          currencyCountryMap[
            code
          ]

        const locale =
          country
            ? `en-${country.countryCode}`
            : 'en-US'

        return [
          code,
          {
            code,

            name:
              definition.name,

            symbol:
              definition.symbol,

            countryCode:
              country?.countryCode ??
              null,

            countryName:
              country?.countryName ??
              'International currency',

            iso4217Numeric:
              definition.numeric,

            decimals:
              definition.decimals ??
              2,

            locale,

            isCrypto: false,

            isWithdrawn:
              definition.withdrawn ===
              true,
          },
        ]
      },
    ),
  ) as Record<
    TCurrencyCode,
    CurrencyDefinition
  >

/*
=========================================================
CRYPTO CURRENCIES
=========================================================

Crypto assets are NOT ISO 4217 currencies.

They are therefore registered separately and then merged
into the application's CurrencyCode registry.
*/

const cryptoCurrencyDefinitions:
  Record<
    CryptoCurrencyCode,
    CurrencyDefinition
  > = {
  USDT: {
    code: 'USDT',
    name: 'Tether USD',
    symbol: '₮',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 2,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },

  USDC: {
    code: 'USDC',
    name: 'USD Coin',
  
    // USDC uses its SVG icon instead of a text currency symbol.
    symbol: '◎',
  
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 2,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  
    // icon: usdcIcon,
    // iconColor: '#080C09',
  },

  BTC: {
    code: 'BTC',
    name: 'Bitcoin',
    symbol: '₿',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 8,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },

  ETH: {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 8,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },

  SOL: {
    code: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 6,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },

  XRP: {
    code: 'XRP',
    name: 'XRP',
    symbol: 'XRP',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 6,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },

  BNB: {
    code: 'BNB',
    name: 'BNB',
    symbol: 'BNB',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 8,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },

  ADA: {
    code: 'ADA',
    name: 'Cardano',
    symbol: 'ADA',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 6,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },

  DOGE: {
    code: 'DOGE',
    name: 'Dogecoin',
    symbol: 'Ð',
    countryCode: null,
    countryName: 'Digital asset',
    iso4217Numeric: null,
    decimals: 6,
    locale: 'en-US',
    isCrypto: true,
    isWithdrawn: false,
  },
}

/*
=========================================================
FINAL CURRENCY REGISTRY
=========================================================
*/

export const currencies: Record<
  CurrencyCode,
  CurrencyDefinition
> = {
  ...isoCurrencyDefinitions,
  ...cryptoCurrencyDefinitions,
}

/*
=========================================================
DASHBOARD CURRENCIES
=========================================================
*/

export const dashboardCurrencies:
  CurrencyCode[] = [
  'NGN',
  'USD',
  'GBP',
]

/*
=========================================================
COMPLETE COUNTRY/CURRENCY OPTIONS
=========================================================

This remains country-specific.

Example:

US - USD
AS - USD
EC - USD
...

Do NOT use this array for the Dashboard currency
selector because it intentionally contains duplicates.
*/

export const countryCurrencyOptions:
  CountryCurrencyOption[] =
    Object.entries(
      countries,
    )
      .flatMap(
        ([
          countryCode,
          country,
        ]) => {
          const countryCurrencies =
            Array.isArray(
              country.currency,
            )
              ? country.currency
              : []

          return countryCurrencies
            .filter(
              (currencyCode) => {
                const definition =
                  isoCurrencies[
                    currencyCode as TCurrencyCode
                  ]

                return (
                  Boolean(
                    definition,
                  ) &&
                  definition.withdrawn !==
                    true
                )
              },
            )
            .map(
              (
                currencyCode,
              ) => {
                const definition =
                  isoCurrencies[
                    currencyCode as TCurrencyCode
                  ]

                const locale =
                  `en-${countryCode}`

                return {
                  id: `${countryCode}-${currencyCode}`,

                  countryCode,

                  countryName:
                    country.name,

                  currencyCode:
                    currencyCode as CurrencyCode,

                  currencyName:
                    definition.name,

                  symbol:
                    definition.symbol,

                  iso4217Numeric:
                    definition.numeric,

                  decimals:
                    definition.decimals ??
                    2,

                  locale,

                  isCrypto: false,
                }
              },
            )
        },
      )
      .sort(
        (
          first,
          second,
        ) => {
          const countrySort =
            first.countryName.localeCompare(
              second.countryName,
            )

          if (
            countrySort !== 0
          ) {
            return countrySort
          }

          return first.currencyCode.localeCompare(
            second.currencyCode,
          )
        },
      )

/*
=========================================================
DYNAMIC UNIQUE CURRENCY SELECTOR OPTIONS
=========================================================

THIS is what CurrencySelector.tsx should use.

There is exactly ONE option per currency code.

USD therefore appears once.
GBP appears once.
NGN appears once.
USDT appears once.
USDC appears once.
BTC appears once.
etc.
*/

const fiatCurrencySelectorOptions:
  CurrencySelectorOption[] =
    Object.values(
      isoCurrencyDefinitions,
    )
      .filter(
        (definition) =>
          !definition.isWithdrawn,
      )
      .map(
        (definition) => ({
          id: `currency-${definition.code}`,

          currencyCode:
            definition.code,

          currencyName:
            definition.name,

          symbol:
            definition.symbol,

          countryCode:
            definition.countryCode,

          countryName:
            definition.countryName,

          iso4217Numeric:
            definition.iso4217Numeric,

          decimals:
            definition.decimals,

          locale:
            definition.locale,

          isCrypto: false,

          icon:
            definition.icon,
        }),
      )

const cryptoCurrencySelectorOptions:
  CurrencySelectorOption[] =
    Object.values(
      cryptoCurrencyDefinitions,
    ).map(
      (definition) => ({
        id: `crypto-${definition.code}`,

        currencyCode:
          definition.code,

        currencyName:
          definition.name,

        symbol:
          definition.symbol,

        countryCode:
          null,

        countryName:
          'Digital asset',

        iso4217Numeric:
          null,

        decimals:
          definition.decimals,

        locale:
          definition.locale,

        isCrypto: true,

        icon:
          definition.icon,
      }),
    )

export const currencySelectorOptions:
  CurrencySelectorOption[] = [
    ...fiatCurrencySelectorOptions,
    ...cryptoCurrencySelectorOptions,
  ].sort(
    (first, second) => {
      /*
        Keep fiat currencies first and crypto after them.
      */

      if (
        first.isCrypto !==
        second.isCrypto
      ) {
        return first.isCrypto
          ? 1
          : -1
      }

      return first.currencyCode.localeCompare(
        second.currencyCode,
      )
    },
  )

/*
=========================================================
ACTIVE ISO CURRENCIES
=========================================================
*/

export const activeCurrencyCodes =
  (
    Object.keys(
      isoCurrencies,
    ) as TCurrencyCode[]
  ).filter(
    (code) =>
      isoCurrencies[
        code
      ].withdrawn !== true,
  )

/*
=========================================================
GET COUNTRY CURRENCY
=========================================================
*/

export const getCountryCurrency =
  (
    countryCode: string,
    currencyCode: CurrencyCode,
  ): CountryCurrencyOption | undefined =>
    countryCurrencyOptions.find(
      (item) =>
        item.countryCode ===
          countryCode &&
        item.currencyCode ===
          currencyCode,
    )

/*
=========================================================
GET CURRENCY
=========================================================
*/

export const getCurrency =
  (
    currency: CurrencyCode,
  ): CurrencyDefinition | undefined =>
    currencies[currency]

/*
=========================================================
GET SELECTOR OPTION
=========================================================
*/

export const getCurrencySelectorOption =
  (
    currency: CurrencyCode,
  ): CurrencySelectorOption | undefined =>
    currencySelectorOptions.find(
      (item) =>
        item.currencyCode ===
        currency,
    )

/*
=========================================================
CURRENCY FORMATTER
=========================================================
*/

export const formatCurrency = (
  amount: number,
  currency: CurrencyCode,
): string => {
  const definition =
    currencies[currency]

  if (!definition) {
    return amount.toFixed(2)
  }

  /*
  Crypto formatting.
  */

  if (definition.isCrypto) {
    return `${definition.symbol}${amount.toLocaleString(
      'en-US',
      {
        minimumFractionDigits:
          definition.decimals,

        maximumFractionDigits:
          definition.decimals,
      },
    )}`
  }

  /*
  Fiat currency formatting.
  */

  try {
    return new Intl.NumberFormat(
      definition.locale,
      {
        style: 'currency',

        currency,

        currencyDisplay:
          'symbol',

        minimumFractionDigits:
          definition.decimals,

        maximumFractionDigits:
          definition.decimals,
      },
    ).format(amount)
  } catch {
    return `${definition.symbol}${amount.toLocaleString(
      'en-US',
      {
        minimumFractionDigits:
          definition.decimals,

        maximumFractionDigits:
          definition.decimals,
      },
    )}`
  }
}

/*
=========================================================
COMPACT CURRENCY FORMATTER
=========================================================
*/

export const formatCompactCurrency = (
  amount: number,
  currency: CurrencyCode,
): string => {
  const definition =
    currencies[currency]

  if (!definition) {
    return amount.toLocaleString(
      'en-US',
    )
  }

  return `${definition.symbol}${amount.toLocaleString(
    definition.locale,
    {
      minimumFractionDigits: 0,

      maximumFractionDigits: 0,
    },
  )}`
}



