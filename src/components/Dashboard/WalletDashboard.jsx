import React, { useState } from 'react';
import {
    CreditCard,
    ArrowUpCircle,
    ArrowDownCircle,
    CheckCircle,
    X
} from 'lucide-react';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';

// Mock data for transactions
const mockTransactions = {
    withdrawals: [
        { id: 1, type: 'Funds Withdrawal', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 2, type: 'Funds Withdrawal', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 3, type: 'Funds Withdrawal', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 4, type: 'Funds Withdrawal', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
    ],
    payments: [
        { id: 5, type: 'Ads Payment - Wallet', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 6, type: 'Ads Payment - Wallet', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 7, type: 'Ads Payment - Wallet', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 8, type: 'Ads Payment - Wallet', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 9, type: 'Ads Payment - Wallet', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
    ],
    deposits: [
        { id: 10, type: 'Wallet Deposit', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 11, type: 'Wallet Deposit', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
        { id: 12, type: 'Wallet Deposit', amount: 'N20,000', status: 'Successful', date: '07/10/25 - 06:22 AM' },
    ]
};

// Modal for the withdrawal form
const WithdrawalModal = ({ isOpen, closeModal, openSuccessModal }) => {
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [saveDetails, setSaveDetails] = useState(false);

    const handleWithdraw = (e) => {
        e.preventDefault();
        console.log('Processing withdrawal:', { amount, accountNumber, bankName, accountName, saveDetails });
        // After successful processing, close this modal and open the success modal
        closeModal();
        openSuccessModal(amount);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center"
                                >
                                    Withdraw
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                        <X size={20} />
                                    </button>
                                </Dialog.Title>

                                <form className="mt-4 space-y-4" onSubmit={handleWithdraw}>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Amount to withdraw"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Account Number"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Bank Name"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Account Name"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="save-details"
                                            checked={saveDetails}
                                            onChange={(e) => setSaveDetails(e.target.checked)}
                                            className="h-5 w-5 rounded text-red-600 focus:ring-red-500"
                                            style={{backgroundColor: '#EF4444', borderColor: '#EF4444'}}
                                        />
                                        <label htmlFor="save-details" className="text-sm text-gray-700">Save account details</label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-600 transition-colors duration-200"
                                    >
                                        Process Withdrawal
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

// Modal for the successful withdrawal message
const WithdrawalSuccessModal = ({ isOpen, closeModal, withdrawalAmount }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-green-100 rounded-full p-2">
                                        <CheckCircle className="text-green-500" size={36} />
                                    </div>
                                </div>
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Your withdrawal of <span className="font-bold">{withdrawalAmount}</span> is being processed
                                </Dialog.Title>

                                <div className="mt-6 flex justify-around space-x-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-xl border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-xl border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none"
                                        onClick={closeModal}
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
};

// Main component that orchestrates the wallet view and modals
const WalletDashboard = () => {
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [activeTab, setActiveTab] = useState('Deposits'); // 'Deposits' or 'Payments'

    const openWithdrawalModal = () => setIsWithdrawalModalOpen(true);
    const closeWithdrawalModal = () => setIsWithdrawalModalOpen(false);

    const openSuccessModal = (amount) => {
        setWithdrawalAmount(amount);
        setIsSuccessModalOpen(true);
    };
    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    const displayedTransactions = activeTab === 'Deposits' ? mockTransactions.deposits : mockTransactions.payments;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Shopping Wallet Section */}
                <div className="bg-white p-6 rounded-[20px] shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Shopping Wallet</h2>
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-2xl text-white shadow-lg">
                        <h3 className="font-medium text-lg">Shopping Wallet</h3>
                        <p className="text-4xl font-bold mt-2">N35,000</p>
                        <button
                            onClick={openWithdrawalModal}
                            className="mt-6 w-full py-3 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Transaction History Section */}
                <div className="bg-white p-6 rounded-[20px] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
                            <button
                                onClick={() => setActiveTab('Deposits')}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${activeTab === 'Deposits' ? 'bg-red-500 text-white' : 'text-gray-600'}`}
                            >
                                Deposits
                            </button>
                            <button
                                onClick={() => setActiveTab('Payments')}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${activeTab === 'Payments' ? 'bg-red-500 text-white' : 'text-gray-600'}`}
                            >
                                Payments
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {displayedTransactions.map(transaction => (
                            <div
                                key={transaction.id}
                                className="flex items-center p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        {activeTab === 'Deposits' ? (
                                            <ArrowUpCircle size={20} className="text-green-500" />
                                        ) : (
                                            <ArrowDownCircle size={20} className="text-green-500" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-800">{transaction.type}</p>
                                    <p className="text-xs text-gray-500 mt-1">{transaction.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm text-red-500">{transaction.amount}</p>
                                    <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <WithdrawalModal
                isOpen={isWithdrawalModalOpen}
                closeModal={closeWithdrawalModal}
                openSuccessModal={openSuccessModal}
            />
            <WithdrawalSuccessModal
                isOpen={isSuccessModalOpen}
                closeModal={closeSuccessModal}
                withdrawalAmount={withdrawalAmount}
            />
        </div>
    );
};

export default WalletDashboard;
