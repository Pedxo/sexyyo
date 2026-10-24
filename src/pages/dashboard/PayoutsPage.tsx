import { useState } from 'react'
import {
  Building2,
  Coins,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import WithdrawModal from '../../components/dashboard/modals/WithdrawModal'

interface Beneficiary {
  id: string
  name: string
  type: 'bank' | 'crypto'
  account: string
  institutionOrNetwork: string
  currency: string
}

const DEFAULT_BENEFICIARIES: Beneficiary[] = [
  {
    id: '1',
    name: 'Clarissa Adeleke (Personal)',
    type: 'bank',
    account: '1092817462',
    institutionOrNetwork: 'Providus Bank',
    currency: 'NGN',
  },
  {
    id: '2',
    name: 'Clarissa Adeleke (US Checking)',
    type: 'bank',
    account: '****4891',
    institutionOrNetwork: 'JPMorgan Chase',
    currency: 'USD',
  },
  {
    id: '3',
    name: 'Cold Storage Vault',
    type: 'crypto',
    account: '9xWp...3kLm',
    institutionOrNetwork: 'Solana SPL',
    currency: 'USDC',
  },
]

export default function PayoutsPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(DEFAULT_BENEFICIARIES)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // New beneficiary state
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'bank' | 'crypto'>('bank')
  const [newAccount, setNewAccount] = useState('')
  const [newInstitution, setNewInstitution] = useState('')
  const [newCurrency, setNewCurrency] = useState('USD')

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newAccount.trim()) return

    const created: Beneficiary = {
      id: Date.now().toString(),
      name: newName.trim(),
      type: newType,
      account: newAccount.trim(),
      institutionOrNetwork: newInstitution.trim() || (newType === 'bank' ? 'Bank Partner' : 'Crypto Rail'),
      currency: newCurrency,
    }

    setBeneficiaries([created, ...beneficiaries])
    setNewName('')
    setNewAccount('')
    setNewInstitution('')
    setShowAddModal(false)
  }

  const handleDelete = (id: string) => {
    setBeneficiaries(beneficiaries.filter((b) => b.id !== id))
  }

  return (
    <div className="dashboard-page min-h-full px-4 py-5 sm:px-6 lg:px-8 lg:py-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#080C09]">
            Payouts & Beneficiaries
          </h1>
          <p className="mt-1 text-xs text-[#6E736E]">
            Manage outgoing withdrawal destinations, bank accounts, and crypto rails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E6E2] bg-white px-4 py-2 text-xs font-semibold text-[#080C09] hover:bg-[#F5F6F3] transition"
          >
            <Plus size={14} />
            <span>Add Beneficiary</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1CA045] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#005F21] transition"
          >
            <ArrowUpRight size={14} />
            <span>Withdraw Money</span>
          </button>
        </div>
      </div>

      {/* Payout Security & Quota Card */}
      <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 shadow-[0px_8px_24px_-8px_#080C091F]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#F0F2F0]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F8A]">
              Daily Withdrawal Limit
            </span>
            <p className="text-xl font-bold text-[#080C09]">$50,000.00 USD</p>
            <p className="text-[11px] text-[#1CA045] font-semibold">$48,500.00 remaining today</p>
          </div>

          <div className="space-y-1 md:pl-6 pt-4 md:pt-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F8A]">
              Settlement Speed
            </span>
            <p className="text-xl font-bold text-[#080C09]">5 – 15 Minutes</p>
            <p className="text-[11px] text-[#6E736E]">Automated clearing via Lead Bank / Providus</p>
          </div>

          <div className="space-y-1 md:pl-6 pt-4 md:pt-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8F8A]">
              Security Tier
            </span>
            <p className="text-xl font-bold text-[#1CA045] flex items-center gap-1.5">
              <ShieldCheck size={20} />
              <span>Tier 2 Verified</span>
            </p>
            <p className="text-[11px] text-[#6E736E]">PIN & Biometric multi-factor protected</p>
          </div>
        </div>
      </div>

      {/* Beneficiaries List */}
      <div className="rounded-[28px] border border-[#E2E6E2] bg-white p-6 shadow-[0px_8px_24px_-8px_#080C091F]">
        <h2 className="text-base font-bold text-[#080C09] mb-4">Saved Beneficiaries</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beneficiaries.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-[#E2E6E2] bg-[#FAFBF9] p-4 flex flex-col justify-between hover:border-[#1CA045]/60 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E2E6E2] text-[#080C09]">
                      {b.type === 'bank' ? <Building2 size={15} /> : <Coins size={15} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#080C09]">{b.name}</h4>
                      <p className="text-[10px] text-[#6E736E]">{b.institutionOrNetwork}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white border border-[#E2E6E2] px-2 py-0.5 text-[10px] font-bold text-[#080C09]">
                    {b.currency}
                  </span>
                </div>

                <div className="mt-4 border-t border-[#E2E6E2]/50 pt-2 font-mono text-xs font-semibold text-[#080C09]">
                  {b.account}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#E2E6E2]/50 text-xs">
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="font-semibold text-[#1CA045] hover:underline"
                >
                  Send payout
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-[#8A8F8A] hover:text-rose-600 transition p-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false)
          }}
        >
          <div className="relative w-full max-w-md rounded-[28px] border border-[#E2E6E2] bg-white p-6 md:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-[#080C09] mb-1">Add Payout Beneficiary</h3>
            <p className="text-xs text-[#6E736E] mb-5">
              Save a verified bank account or external crypto wallet for one-click payouts.
            </p>

            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  Beneficiary Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('bank')}
                    className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                      newType === 'bank'
                        ? 'border-[#1CA045] bg-[#E8F7ED] text-[#1CA045]'
                        : 'border-[#E2E6E2] bg-white text-[#6E736E]'
                    }`}
                  >
                    Bank Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('crypto')}
                    className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                      newType === 'crypto'
                        ? 'border-[#1CA045] bg-[#E8F7ED] text-[#1CA045]'
                        : 'border-[#E2E6E2] bg-white text-[#6E736E]'
                    }`}
                  >
                    Crypto Address
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clarissa Adeleke"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2 text-xs text-[#080C09] outline-none focus:border-[#1CA045] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  Currency
                </label>
                <select
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2 text-xs font-semibold text-[#080C09] outline-none focus:border-[#1CA045] focus:bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USDT">USDT (₮)</option>
                  <option value="USDC">USDC (◎)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  {newType === 'bank' ? 'Bank Name' : 'Crypto Network'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'bank' ? 'e.g. Providus Bank' : 'e.g. Solana SPL'}
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2 text-xs text-[#080C09] outline-none focus:border-[#1CA045] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#080C09] mb-1">
                  {newType === 'bank' ? 'Account Number / IBAN' : 'Wallet Address'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={newType === 'bank' ? 'Enter account number' : 'Paste address'}
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E6E2] bg-[#FAFBF9] px-4 py-2 text-xs font-mono text-[#080C09] outline-none focus:border-[#1CA045] focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-full border border-[#E2E6E2] py-2.5 text-xs font-semibold text-[#080C09] hover:bg-[#F5F6F3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#1CA045] py-2.5 text-xs font-semibold text-white hover:bg-[#005F21]"
                >
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
      />
    </div>
  )
}
