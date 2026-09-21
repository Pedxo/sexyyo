import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import CurrencyStrip from '../components/landing/CurrencyStrip'
import BalanceSection from '../components/landing/BalanceSection'
import CheckoutSection from '../components/landing/CheckoutSection'
import SecuritySection from '../components/landing/SecuritySection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

function LandingPage(){
  return (
    <div className="min-h-screen overflow-x-hidden bg-pedxo-bg text-pedxo-text">
      <Header />

      <main>
        <Hero />

        <CurrencyStrip />

        <BalanceSection />

        <CheckoutSection />

        <SecuritySection />

        <CTASection />
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage