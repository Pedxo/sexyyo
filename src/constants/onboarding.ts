import stepOneImage from '../assets/images/onboarding/step-1.svg'
import stepTwoImage from '../assets/images/onboarding/step-2.svg'
import stepThreeImage from '../assets/images/onboarding/step-3.svg'

import badgeStepOne from '../assets/icons/badge_sample.svg'
import badgeStepTwo from '../assets/icons/badge_send.svg'
import badgeStepThree from '../assets/icons/badge_payout.svg'

export interface OnboardingItem {
  id: number
  image: string
  badgeIcon: string
  eyebrow: string
  titleStart: string
  titleHighlight: string
  description: string
  checklist: string[]
  walletLabel: string
  walletCurrencies: string
}

export const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    image: stepOneImage,
    badgeIcon: badgeStepOne,
    eyebrow: 'Multi-currency wallet',
    titleStart: 'One balance.',
    titleHighlight: 'Six currencies.',
    description:
      'Hold NGN, USD, GBP, EUR, USDT and USDC in a single wallet. Fund once, spend in the currency that makes sense no per-purchase conversion friction.',
    checklist: [
      'Dedicated wallet account number per currency',
      'Deposits post to balance in under 2 minutes',
      'Full statements and exportable history',
    ],
    walletLabel: 'MULTI-CURRENCY WALLET',
    walletCurrencies: 'NGN · USD · GBP · EUR · USDT · USDC',
  },

  {
    id: 2,
    image: stepTwoImage,
    badgeIcon: badgeStepTwo,
    eyebrow: 'Instant transfers',
    titleStart: 'Send in seconds.',
    titleHighlight: 'Free between friends.',
    description:
      'Move money to any Pedxo user instantly, off external rails and free of charge. Save beneficiaries, split with your team, keep everyone paid.',
    checklist: [
      'Instant Pedxo-to-Pedxo transfers, zero fees',
      'Save beneficiaries for one-tap sends',
      'Every transaction receipted and traceable',
    ],
    walletLabel: 'INSTANT TRANSFERS',
    walletCurrencies: 'Pedxo → Pedxo · instant · $0 fee',
  },

  {
    id: 3,
    image: stepThreeImage,
    badgeIcon: badgeStepThree,
    eyebrow: 'Pay for Pedxo, effortlessly',
    titleStart: 'Fund once.',
    titleHighlight: 'Pay for everything.',
    description:
      'Skip re-entering cards at checkout. Top up your wallet, then pay for any Pedxo service straight from balance — with a full ledger of every move.',
    checklist: [
      'One balance for every Pedxo service',
      'No re-entering cards at checkout',
      'Fund via bank, card, USDT or USDC',
    ],
    walletLabel: 'PAY FOR PEDXO, EFFORTLESSLY',
    walletCurrencies: 'Wallet checkout · bank · card · crypto',
  },
]