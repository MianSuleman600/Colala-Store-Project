import React, { useMemo, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { ArrowUpCircle, ArrowDownCircle, CheckCircle, X } from 'lucide-react';
import { Transition, Dialog } from '@headlessui/react';
import ScrollToTop from '../ui/ScrollToTop';
import { useToast } from '../ui/ToastProvider';

// Import the correct, live data hooks
import { useWalletBalanceQuery } from '../../services/queries/useWalletQuery';
import { useTransactionsQuery } from '../../services/queries/useTransactionQuery';
import { useReferralWithdrawMutation } from '../../services/mutations/useReferralMutation'; // Withdrawal logic might still be under referrals

const fmtCurrency = (n, currency = '₦') =>
  `${currency}${Intl.NumberFormat().format(Number(n || 0))}`;

/* ---------------- Withdrawal Modal ---------------- */
const WithdrawalModal = ({ isOpen, onClose, onWithdraw, brandColor }) => {
  const { push } = useToast();
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) throw new Error('Please enter a valid amount');
      if (!accountNumber.trim() || !bankName.trim() || !accountName.trim()) {
        throw new Error('Please complete all bank details');
      }
      setIsSubmitting(true);
      await onWithdraw?.({ amount: amt, bankName, accountNumber, accountName });
      // The parent will handle closing and success state
    } catch (err) {
      push(err?.message || 'Withdrawal failed', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="w-full max-w-md transform rounded-3xl bg-white p-6 text-left shadow-xl">
              <Dialog.Title className="text-lg font-bold flex justify-between items-center">
                Withdraw
                <button onClick={onClose}><X size={20} /></button>
              </Dialog.Title>
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 border rounded-xl" />
                <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full p-3 border rounded-xl" />
                <input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full p-3 border rounded-xl" />
                <input type="text" placeholder="Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="w-full p-3 border rounded-xl" />
                <button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold rounded-2xl text-white" style={{ backgroundColor: brandColor }}>
                  {isSubmitting ? 'Processing...' : 'Process Withdrawal'}
                </button>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div></div>
      </Dialog>
    </Transition>
  );
};

/* ---------------- Success Modal ---------------- */
const WithdrawalSuccessModal = ({ isOpen, onClose, withdrawalAmount, currency = '₦', brandColor }) => (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto"><div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="w-full max-w-md transform rounded-3xl bg-white p-6 text-center shadow-xl">
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <Dialog.Title className="text-xl font-bold mb-2">Withdrawal Successful!</Dialog.Title>
              <p className="text-gray-600 mb-4">
                Your withdrawal of {currency}{Intl.NumberFormat().format(withdrawalAmount)} has been processed successfully.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 font-semibold rounded-2xl text-white"
                style={{ backgroundColor: brandColor }}
              >
                Close
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div></div>
      </Dialog>
    </Transition>
);

/* ---------------- Main Wallet Dashboard Component ---------------- */
const WalletDashboard = ({ embedded = true }) => {
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [activeTab, setActiveTab] = useState('Deposits');

  const { user } = useSelector((state) => state.auth);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);

  // Use the correct live data hooks
  const { data: walletData, isLoading: isLoadingWallet } = useWalletBalanceQuery({ enabled: !!user });
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactionsQuery({}, { enabled: !!user });
  const withdrawMutation = useReferralWithdrawMutation(); // This might need to be a more general withdrawal mutation later

  const currency = '₦';
  const availableBalance = walletData?.shopping_balance || 0;

  const displayedTransactions = useMemo(() => {
    const incomeTypes = new Set(['deposit', 'transfer_referral_to_shopping', 'reward']);
    const expenseTypes = new Set(['payment', 'withdrawal', 'transfer']);
    return transactions.filter((t) =>
      activeTab === 'Deposits'
        ? incomeTypes.has(t.type?.toLowerCase())
        : expenseTypes.has(t.type?.toLowerCase())
    );
  }, [transactions, activeTab]);

  const onWithdraw = async (payload) => {
    await withdrawMutation.mutateAsync(payload);
    setWithdrawalAmount(Number(payload.amount) || 0);
    setIsWithdrawalModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const header = (
    <div className="p-6 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(to right, ${brandColor}, #F472B6)` }}>
      <h3 className="font-medium text-lg">Available Balance</h3>
      <p className="text-4xl font-bold mt-2">{fmtCurrency(availableBalance, currency)}</p>
      <button
        onClick={() => setIsWithdrawalModalOpen(true)}
        className="mt-6 w-full py-3 bg-white font-semibold rounded-xl"
        style={{ color: brandColor }}
      >
        Withdraw
      </button>
    </div>
  );

  const transactionsSection = (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('Deposits')}
            className={`px-4 py-2 text-sm rounded-lg ${activeTab === 'Deposits' ? 'text-white' : 'text-gray-600'}`}
            style={activeTab === 'Deposits' ? { backgroundColor: brandColor } : {}}
          >Deposits</button>
          <button
            onClick={() => setActiveTab('Payments')}
            className={`px-4 py-2 text-sm rounded-lg ${activeTab === 'Payments' ? 'text-white' : 'text-gray-600'}`}
            style={activeTab === 'Payments' ? { backgroundColor: brandColor } : {}}
          >Payments</button>
        </div>
      </div>
      <div className="space-y-4">
        {isLoadingWallet || isLoadingTransactions ? <p className="p-4">Loading...</p> :
         displayedTransactions.length === 0 ? <p className="p-4 text-gray-500">No {activeTab.toLowerCase()} found.</p> :
         displayedTransactions.map((tx) => {
            const isDeposit = tx.amount > 0;
            return (
              <div key={tx.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="mr-4"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: isDeposit ? '#D1FAE5' : '#FEE2E2'}}>
                  {isDeposit ? <ArrowUpCircle size={20} className="text-green-600" /> : <ArrowDownCircle size={20} className="text-red-600" />}
                </div></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm capitalize">{tx.type.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
                <p className={`font-semibold text-sm ${isDeposit ? 'text-green-600' : 'text-red-500'}`}>{fmtCurrency(tx.amount, currency)}</p>
              </div>
            );
          })
        }
      </div>
    </div>
  );
  
  if (!embedded) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="w-full space-y-4">
            {header}
            {transactionsSection}
            <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} onWithdraw={onWithdraw} brandColor={brandColor} />
            <WithdrawalSuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} withdrawalAmount={withdrawalAmount} currency={currency} brandColor={brandColor}/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {header}
      {transactionsSection}
      <WithdrawalModal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} onWithdraw={onWithdraw} brandColor={brandColor} />
      <WithdrawalSuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} withdrawalAmount={withdrawalAmount} currency={currency} brandColor={brandColor}/>
    </div>
  );
};

export default WalletDashboard;