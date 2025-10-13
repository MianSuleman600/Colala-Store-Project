import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import GradientCard from '../../components/ui/GradientCard';
import ScrollToTop from '../../components/ui/ScrollToTop';

// Import all the separate components
import WithdrawalModal from '../../components/referrals/models/WithdrawalModal';
import TransferSuccessModal from '../../components/referrals/models/SuccessfulTransferModal';
import TransferModal from '../../components/referrals/models/TransferModal'; // <-- Import the new modal
import FAQs from '../referrals/FAQs';
import ProductSearch from '../referrals/FindProducts';

import { useReferralWalletQuery } from '../../services/queries/useReferralQuery.js';
import { useReferralWithdrawMutation } from '../../services/mutations/useReferralMutation.js';
import { copyText } from '../../utils/clipboard.js';
import { useToast } from '../../components/ui/ToastProvider';
import { getContrastTextColor } from '../../utils/colorUtils';

const ReferralsPage = () => {
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState('wallet');
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false); // <-- State for the new modal
  const [isTransferSuccessModalOpen, setIsTransferSuccessModalOpen] = useState(false);
  const [lastTransferAmount, setLastTransferAmount] = useState(0);
  
  const { user } = useSelector((state) => state.auth);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const { data: wallet, isLoading: isLoadingWallet } = useReferralWalletQuery();
  const withdrawMutation = useReferralWithdrawMutation();
  // We no longer need the transfer mutation here, as it's handled inside the new modal.

  const { totalEarnings, totalReferrals, referralCode, currency } = useMemo(() => ({
    totalEarnings: wallet?.totalEarnings ?? 0,
    totalReferrals: wallet?.totalReferrals ?? 0,
    referralCode: wallet?.referralCode ?? '------',
    currency: wallet?.currency ?? '₦',
  }), [wallet]);

  const handleCopyCode = async () => {
    if (!referralCode || referralCode === '------') {
      push('Referral code not available.', { type: 'error' });
      return;
    }
    await copyText(referralCode);
    push('Referral code copied!', { type: 'success' });
  };

  const handleWithdrawalSubmit = (payload) => {
    withdrawMutation.mutate(payload, {
      onSuccess: () => {
        setIsWithdrawalModalOpen(false);
        push('Withdrawal request submitted successfully.', { type: 'success' });
      },
    });
  };

  // This function is called by the new TransferModal on success
  const handleTransferSuccess = (amount) => {
    setLastTransferAmount(amount);
    setIsTransferSuccessModalOpen(true);
  };

  const activeTabStyles = { backgroundColor: brandColor, color: contrastTextColor };

  const renderContent = () => {
    if (activeTab === 'wallet') {
      return (
        <div className="space-y-6">
          <GradientCard className="p-6 rounded-2xl text-white" style={{ background: `linear-gradient(to right, ${brandColor}, #ff8c8c)` }}>
            <p className="text-sm">Referral Earnings</p>
            <h3 className="text-5xl font-bold mt-1 mb-6">{currency}{Intl.NumberFormat().format(totalEarnings)}</h3>
            <p className="text-sm">No of referrals</p>
            <h4 className="text-2xl font-semibold">{totalReferrals}</h4>
            <div className="flex justify-end space-x-4 mt-8">
              <Button className="px-6 py-2 bg-white font-semibold rounded-xl" style={{ color: brandColor }} onClick={() => setIsWithdrawalModalOpen(true)}>Withdraw</Button>
              <Button className="px-6 py-2 bg-white font-semibold rounded-xl" style={{ color: brandColor }} onClick={() => setIsTransferModalOpen(true)}>Transfer</Button>
            </div>
          </GradientCard>
          <Card className="p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">Referral Code</span>
                <span className="text-lg font-semibold tracking-wider block">{referralCode}</span>
              </div>
              <button onClick={handleCopyCode} className="p-2 text-gray-600 hover:text-black"><DocumentDuplicateIcon className="h-6 w-6" /></button>
            </div>
          </Card>
          <h2 className="text-sm font-semibold" style={{ color: brandColor }}>Refer and Earn on Colala</h2>
          <p className="text-sm text-gray-700">Refer your friends and unlock exclusive rewards. The more friends you bring in, the more you earn.</p>
          <div className="space-y-6 ml-2 border-l-2 pl-4">
            {[
              { step: 1, text: 'Invite a friend with your referral code for them to get a one time referral bonus' },
              { step: 2, text: 'Referral completes an order.' },
              { step: 3, text: 'Get commissions on their orders' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start space-x-4">
                <div className="h-6 w-6 text-sm rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: brandColor + '1A', color: brandColor }}>{step}</div>
                <p className="text-sm text-gray-800">{text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (activeTab === 'faqs') return <FAQs />;
    if (activeTab === 'search') return <ProductSearch />;
    return null;
  };

  return (
    <div className="p-4 md:p-8">
      <ScrollToTop />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Referrals</h1>
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button className={`flex-1 py-2 px-4 rounded-md font-semibold ${activeTab === 'wallet' ? 'text-white shadow-md' : 'text-gray-600'}`} style={activeTab === 'wallet' ? activeTabStyles : {}} onClick={() => setActiveTab('wallet')}>Wallet</button>
        <button className={`flex-1 py-2 px-4 rounded-md font-semibold ${activeTab === 'faqs' ? 'text-white shadow-md' : 'text-gray-600'}`} style={activeTab === 'faqs' ? activeTabStyles : {}} onClick={() => setActiveTab('faqs')}>FAQs</button>
        <button className={`flex-1 py-2 px-4 rounded-md font-semibold ${activeTab === 'search' ? 'text-white shadow-md' : 'text-gray-600'}`} style={activeTab === 'search' ? activeTabStyles : {}} onClick={() => setActiveTab('search')}>Search</button>
      </div>

      {isLoadingWallet ? <div className="text-center p-8">Loading wallet...</div> : renderContent()}

      <WithdrawalModal 
        isOpen={isWithdrawalModalOpen} 
        onClose={() => setIsWithdrawalModalOpen(false)} 
        brandColor={brandColor} 
        onWithdraw={handleWithdrawalSubmit} 
      />
      
      {/* Add the new TransferModal */}
      <TransferModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
        brandColor={brandColor} 
        onSuccess={handleTransferSuccess} 
      />
      
      <TransferSuccessModal 
        isOpen={isTransferSuccessModalOpen} 
        onClose={() => setIsTransferSuccessModalOpen(false)} 
        amount={lastTransferAmount} 
        currency={currency} 
        brandColor={brandColor} 
      />
    </div>
  );
};

export default ReferralsPage;