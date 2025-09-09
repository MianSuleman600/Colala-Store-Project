import React, { useMemo, useState, Fragment } from 'react';
import { ArrowUpCircle, ArrowDownCircle, CheckCircle, X } from 'lucide-react';
import { Transition, Dialog } from '@headlessui/react';
import ScrollToTop from '../../components/ui/ScrollToTop';

import { useReferralWalletQuery, useReferralTransactionsQuery } from '../../services/queries/useReferralQuery.js';
import { useReferralWithdrawMutation } from '../../services/mutations/useReferralMutation.js';

const toast = (type, message) => {
  try {
    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { type, message } }));
  } catch {}
};

const fmtCurrency = (n, currency = '₦') =>
  `${currency}${Intl.NumberFormat().format(Number(n || 0))}`;

/* ---------------- Withdrawal Modal ---------------- */
const WithdrawalModal = ({ isOpen, onClose, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [saveDetails, setSaveDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) throw new Error('Please enter a valid amount');
      if (!accountNumber.trim() || !bankName.trim() || !accountName.trim()) {
        throw new Error('Please complete all bank details');
      }
      setSubmitting(true);
      await onWithdraw?.({ amount: amt, accountNumber, bankName, accountName, saveDetails });
      toast('success', 'Withdrawal request submitted');
      onClose?.();
    } catch (err) {
      toast('error', err?.message || 'Withdrawal failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                  Withdraw
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="number"
                    placeholder="Amount to withdraw"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={saveDetails}
                      onChange={(e) => setSaveDetails(e.target.checked)}
                      className="h-5 w-5 rounded text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">Save account details</span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-600 transition-colors duration-200 disabled:opacity-80"
                  >
                    {submitting ? 'Processing...' : 'Process Withdrawal'}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

/* ---------------- Success Modal ---------------- */
const WithdrawalSuccessModal = ({ isOpen, onClose, withdrawalAmount, currency = '₦' }) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog className="relative z-50" onClose={onClose}>
      <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 bg-black/50" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-6 text-center align-middle shadow-xl transition-all">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <CheckCircle className="text-green-500" size={36} />
                </div>
              </div>
              <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                Your withdrawal of <span className="font-bold">{fmtCurrency(withdrawalAmount, currency)}</span> is being processed
              </Dialog.Title>

              <div className="mt-6 flex justify-around space-x-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
                  onClick={onClose}
                >
                  Go to wallet
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

/* ---------------- Wallet Dashboard ---------------- */
const WalletDashboard = ({
  embedded = true, // embedded in dashboard right-panel by default
  brandColor = '#EF4444',
  contrastTextColor = '#FFFFFF',
}) => {
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('Deposits'); // Deposits | Payments

  // Data
  const { data: wallet } = useReferralWalletQuery();
  const { data: transactions = [], isLoading: loadingTx } = useReferralTransactionsQuery({});
  const withdrawMutation = useReferralWithdrawMutation();

  const currency = wallet?.currency || '₦';
  const available = Number(wallet?.availableBalance || 0);

  // Transactions tabs mapping
  const displayedTransactions = useMemo(() => {
    const incomeTypes = new Set(['earning', 'deposit', 'transfer_in']);
    const expenseTypes = new Set(['payment', 'withdrawal', 'transfer']);
    return (transactions || []).filter((t) =>
      activeTab === 'Deposits'
        ? incomeTypes.has(String(t.type || '').toLowerCase())
        : expenseTypes.has(String(t.type || '').toLowerCase())
    );
  }, [transactions, activeTab]);

  // Handlers
  const onWithdraw = async (payload) => {
    try {
      await withdrawMutation.mutateAsync(payload);
      setWithdrawalAmount(Number(payload.amount) || 0);
      setIsWithdrawalModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch {
      // toast handled in mutation
    }
  };

  const header = (
    <div
      className="p-6 rounded-2xl text-white shadow-lg"
      style={{
        background: 'linear-gradient(90deg, rgba(239,68,68,1) 0%, rgba(236,72,153,1) 100%)',
      }}
    >
      <h3 className="font-medium text-lg">{'Available Balance'}</h3>
      <p className="text-4xl font-bold mt-2">{fmtCurrency(available, currency)}</p>
      <button
        onClick={() => setIsWithdrawalModalOpen(true)}
        className="mt-6 w-full py-3 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        Withdraw
      </button>
    </div>
  );

  const transactionsSection = (
    <div className="bg-white p-6 rounded-[20px] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('Deposits')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              activeTab === 'Deposits' ? 'bg-red-500 text-white' : 'text-gray-600'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveTab('Payments')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              activeTab === 'Payments' ? 'bg-red-500 text-white' : 'text-gray-600'
            }`}
          >
            Payments
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loadingTx ? (
          <div className="p-4 text-gray-500">Loading transactions...</div>
        ) : displayedTransactions.length === 0 ? (
          <div className="p-4 text-gray-500">No transactions available.</div>
        ) : (
          displayedTransactions.map((tx) => {
            const isDeposit = ['earning', 'deposit', 'transfer_in'].includes(String(tx.type || '').toLowerCase());
            return (
              <div key={tx.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    {isDeposit ? (
                      <ArrowUpCircle size={20} className="text-green-500" />
                    ) : (
                      <ArrowDownCircle size={20} className="text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{tx.note || 'Transaction'}</p>
                  <p className="text-xs text-gray-500 mt-1">{(tx.type || '').toString()}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${isDeposit ? 'text-green-600' : 'text-red-500'}`}>
                    {fmtCurrency(tx.amount, currency)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(tx.date || new Date()).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  if (!embedded) {
    // Standalone full page (if you mount this outside the dashboard)
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <ScrollToTop />
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <h2 className="text-xl font-bold mb-4">Shopping Wallet</h2>
            {header}
          </div>
          {transactionsSection}
        </div>

        {/* Modals */}
        <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} onWithdraw={onWithdraw} />
        <WithdrawalSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          withdrawalAmount={withdrawalAmount}
          currency={currency}
        />
      </div>
    );
  }

  // Embedded in right panel of dashboard
  return (
    <div className="w-full space-y-4">
      {header}
      {transactionsSection}

      {/* Modals */}
      <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} onWithdraw={onWithdraw} />
      <WithdrawalSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        withdrawalAmount={withdrawalAmount}
        currency={currency}
      />
    </div>
  );
};

export default WalletDashboard;