// src/pages/ReferralsPage.jsx
import React, { useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Card from '../ui/Card';
import WithdrawalModal from '../../components/referrals/models/WithdrawalModal';
import TransferSuccessModal from '../../components/referrals/models/SuccessfulTransferModal';
import FAQs from '../referrals/FAQs';
import ProductSearch from '../referrals/FindProducts';
import GradientCard from '../ui/GradientCard';
import ScrollToTop from '../ui/ScrollToTop';

// FIX: Correctly destructure the props object
const ReferralsPage = ({ brandColor, contrastTextColor }) => {
    const [activeTab, setActiveTab] = useState('wallet');
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [isTransferSuccessModalOpen, setIsTransferSuccessModalOpen] = useState(false);

    // Now this will log the correct color strings
    console.log('brandColor:', brandColor, 'contrastTextColor:', contrastTextColor);

    // Dummy data
    const totalEarnings = '35,000';
    const totalReferrals = 20;
    const referralCode = 'QERDEQWE';
    const currency = '₦';

    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode)
            .then(() => alert('Referral code copied!'))
            .catch(err => console.error('Failed to copy text:', err));
    };

    const handleWithdrawalSuccess = () => {
        setIsWithdrawalModalOpen(false);
        setIsTransferSuccessModalOpen(true);
    };

    // A small optimization: use a single style object for repeated styles
    const activeTabStyles = { backgroundColor: brandColor, color: contrastTextColor };

    const renderContent = () => {
        if (activeTab === 'wallet') {
            return (
                <>
                    {/* Applying brand color dynamically */}
                    <GradientCard
                        className="p-6 rounded-[20px] text-white"
                        style={{ background: `linear-gradient(to right, ${brandColor}, #ff8c8c)` }}
                    >
                        <p className="text-sm font-light">Referral Earnings</p>
                        <h3 className="text-5xl font-bold mt-1 mb-6">{currency}{totalEarnings}</h3>
                        <p className="text-sm font-light">No of referrals</p>
                        <h4 className="text-2xl font-semibold">{totalReferrals}</h4>

                        <div className="flex justify-end space-x-4 mt-8">
                            <Button
                                className="px-6 py-2 bg-white font-semibold rounded-xl shadow"
                                style={{ color: brandColor }}
                                onClick={() => setIsWithdrawalModalOpen(true)}
                            >
                                Withdraw
                            </Button>
                            <Button
                                className="px-6 py-2 bg-white font-semibold rounded-xl shadow"
                                style={{ color: brandColor }}
                                onClick={handleWithdrawalSuccess}
                            >
                                Transfer
                            </Button>
                        </div>
                    </GradientCard>

                    <Card className="p-4 rounded-2xl border border-gray-200 shadow-sm mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Referral Code</span>
                                <span className="text-lg font-semibold tracking-wider text-black">{referralCode}</span>
                            </div>
                            <button
                                onClick={handleCopyCode}
                                className="text-gray-600 hover:text-black p-2 transition-colors"
                            >
                                <DocumentDuplicateIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </Card>

                    <h2 className="text-sm font-semibold mb-1" style={{ color: brandColor }}>Refer and Earn on Colala</h2>
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                        Refer your friends and unlock exclusive rewards. The more friends you bring in, the more you earn.
                    </p>

                    <div className="space-y-6 ml-2 border-l-2 border-gray-200 pl-4">
                        {[
                            { step: 1, text: 'Invite a friend with your referral code for them to get a one time referral bonus' },
                            { step: 2, text: 'Referral completes an order.' },
                            { step: 3, text: 'Get commissions on their orders' },
                        ].map(({ step, text }) => (
                            <div key={step} className="flex items-start space-x-4">
                                <div
                                    className="h-6 w-6 text-sm rounded-full flex items-center justify-center font-bold"
                                    style={{ backgroundColor: brandColor + '1A', color: brandColor }} // Using a semi-transparent brand color for the background
                                >
                                    {step}
                                </div>
                                <p className="text-sm text-gray-800">{text}</p>
                            </div>
                        ))}
                    </div>
                </>
            );
        } else if (activeTab === 'faqs') {
            return <FAQs brandColor={brandColor} contrastTextColor={contrastTextColor} />; // Pass props to nested component
        } else if (activeTab === 'search') {
            return <ProductSearch brandColor={brandColor} contrastTextColor={contrastTextColor}/>;
        }
    };

    return (
        <div className="p-4 md:p-8">
              <ScrollToTop/>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Referrals</h1>

            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                    className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors duration-200 ${
                        activeTab === 'wallet' ? 'text-white shadow-md' : 'text-gray-600'
                    }`}
                    style={activeTab === 'wallet' ? activeTabStyles : {}}
                    onClick={() => setActiveTab('wallet')}
                >
                    Wallet
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors duration-200 ${
                        activeTab === 'faqs' ? 'text-white shadow-md' : 'text-gray-600'
                    }`}
                    style={activeTab === 'faqs' ? activeTabStyles : {}}
                    onClick={() => setActiveTab('faqs')}
                >
                    FAQs
                </button>
                <button
                    className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors duration-200 ${
                        activeTab === 'search' ? 'text-white shadow-md' : 'text-gray-600'
                    }`}
                    style={activeTab === 'search' ? activeTabStyles : {}}
                    onClick={() => setActiveTab('search')}
                >
                    Search
                </button>
            </div>

            {renderContent()}

            <WithdrawalModal
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
                onSuccess={handleWithdrawalSuccess}
                brandColor={brandColor} // Pass brandColor to modal if needed
            />
            <TransferSuccessModal
                isOpen={isTransferSuccessModalOpen}
                onClose={() => setIsTransferSuccessModalOpen(false)}
                brandColor={brandColor} // Pass brandColor to modal if needed
            />
        </div>
    );
};

export default ReferralsPage;