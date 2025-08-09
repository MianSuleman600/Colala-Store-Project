import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const WithdrawalModal = ({ isOpen, onClose, onSuccess }) => {
    if (!isOpen) return null;

    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [saveDetails, setSaveDetails] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle the actual withdrawal logic
        console.log('Withdrawal submitted:', { amount, accountNumber, bankName, accountName, saveDetails });
        // Assuming a successful withdrawal, call onSuccess
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Withdraw</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="save-details"
                            checked={saveDetails}
                            onChange={(e) => setSaveDetails(e.target.checked)}
                            className="h-5 w-5 rounded text-red-600 focus:ring-red-500"
                        />
                        <label htmlFor="save-details" className="text-gray-700">Save account details</label>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 text-white font-semibold rounded-xl bg-red-500 hover:bg-red-600 transition-colors"
                    >
                        Process Withdrawal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WithdrawalModal;