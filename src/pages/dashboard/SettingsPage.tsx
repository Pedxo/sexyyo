import { useState } from 'react'
import {
  Lock,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from 'lucide-react'
import { api } from '../../services/api'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'profile' | 'preferences'>('security')

  // Security States
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinSuccess, setPinSuccess] = useState<string | null>(null)
  const [pinError, setPinError] = useState<string | null>(null)
  const [savingPin, setSavingPin] = useState(false)

  const [biometricsEnabled, setBiometricsEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [defaultCurrency, setDefaultCurrency] = useState('USD')

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinError(null)
    setPinSuccess(null)

    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      setPinError('PIN must be exactly 6 numeric digits.')
      return
    }

    if (newPin !== confirmPin) {
      setPinError('PIN confirmation does not match.')
      return
    }

    setSavingPin(true)
    try {
      await api.setPin(newPin)
      setPinSuccess('Your 6-digit transaction PIN has been updated successfully.')
      setNewPin('')
      setConfirmPin('')
    } catch (err: any) {
      setPinError(err.message || 'Failed to update PIN.')
    } finally {
      setSavingPin(false)
    }
  }

  return (
    <div className="dashboard-page min-h-full px-4 py-5 sm:px-6 lg:px-8 lg:py-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#080C09]">
          Settings & Security
        </h1>
        <p className="mt-1 text-xs text-[#6E736E]">
          Manage your transaction PIN, multi-currency settings, biometrics, and profile preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-full bg-white border border-[#E2E6E2] p-1 w-fit">
        {[
          { id: 'security', label: 'Security & PIN' },
          { id: 'profile', label: 'Profile & KYC' },
          { id: 'preferences', label: 'Preferences' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-[#080C09] text-white shadow-sm'
                : 'text-[#6E736E] hover:text-[#080C09]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change PIN Card */}
          <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F]">
            <div className="flex items-center gap-2.5 text-[#080C09] mb-1">
              <Lock size={18} className="text-[#1CA045]" />
              <h2 className="text-base font-bold">6-Digit Transaction PIN</h2>
            </div>
            <p className="text-xs text-[#6E736E] max-w-xl mb-6">
              Your transaction PIN authorizes all checkouts, internal transfers, and withdrawals.
            </p>

            {pinSuccess && (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{pinSuccess}</span>
              </div>
            )}

            {pinError && (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePin} className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  New 6-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  required
                  placeholder="••••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2.5 text-center text-lg font-mono tracking-widest text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  required
                  placeholder="••••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2.5 text-center text-lg font-mono tracking-widest text-[#080C09] outline-none transition focus:border-[#1CA045] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={savingPin}
                className="rounded-full bg-[#1CA045] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#005F21] transition"
              >
                {savingPin ? 'Updating PIN...' : 'Save New PIN'}
              </button>
            </form>
          </div>

          {/* Biometrics & 2FA Card */}
          <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F7ED] text-[#1CA045]">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#080C09]">Biometric Checkout</h4>
                  <p className="text-[11px] text-[#6E736E]">
                    Allow FaceID or fingerprint authorization on supported mobile and desktop browsers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  biometricsEnabled ? 'bg-[#1CA045]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    biometricsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-[#F0F2F0] pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#080C09]">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-[#6E736E]">
                    Require an authenticator app code for new device logins and large payouts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  twoFactorEnabled ? 'bg-[#1CA045]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F] space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#141A15] text-lg font-bold text-white">
              CA
            </div>
            <div>
              <h3 className="text-base font-bold text-[#080C09]">Clarissa Adeleke</h3>
              <p className="text-xs text-[#6E736E]">clarissa@pedxo.com</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#E8F7ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1CA045]">
                <ShieldCheck size={11} />
                <span>KYC Tier 2 Verified</span>
              </span>
            </div>
          </div>

          <div className="border-t border-[#F0F2F0] pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-[#E2E6E2] bg-[#FAFBF9] p-4">
              <span className="text-[#8A8F8A]">Customer ID</span>
              <p className="mt-1 font-mono font-bold text-[#080C09]">PDX-CUST-99214</p>
            </div>
            <div className="rounded-2xl border border-[#E2E6E2] bg-[#FAFBF9] p-4">
              <span className="text-[#8A8F8A]">Country of Residence</span>
              <p className="mt-1 font-bold text-[#080C09]">United States / Nigeria (Dual)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-[0px_8px_24px_-8px_#080C091F] space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#080C09] mb-1">Default Payment Wallet</h3>
            <p className="text-xs text-[#6E736E] mb-4">
              Select your primary wallet for one-click checkout quotes.
            </p>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2.5 text-xs font-semibold text-[#080C09] outline-none"
            >
              <option value="USD">🇺🇸 US Dollar (USD)</option>
              <option value="NGN">🇳🇬 Nigerian Naira (NGN)</option>
              <option value="GBP">🇬🇧 British Pound (GBP)</option>
              <option value="USDT">🪙 Tether (USDT)</option>
              <option value="USDC">🪙 USD Coin (USDC)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
