// src/pages/SubscriptionPage.jsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useToast } from '../../components/ui/ToastProvider';
import { useGetPlansQuery, useGetSubscriptionsQuery } from '../../services/queries/useSubscriptionQuery';
import { useCreateSubscriptionMutation, useCancelSubscriptionMutation } from '../../services/mutations/useSubscriptionMutation';
import backgroundImage from '../../assets/images/subscription/2.png';

const SubscriptionPlanCard = ({ plan, brandColor, onSubscribe, onCancel, isActive, isCanceling, isSubscribing }) => {
  const cardBgColor = plan.color || '#f0f0f0';
  const cardTextColor = getContrastTextColor(cardBgColor);
  const priceLabel = typeof plan.price === 'number' ? `N${plan.price.toLocaleString()}` : plan.price;

  return (
    <div className="relative flex flex-col items-center p-6 pb-24 rounded-3xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]" style={{ backgroundColor: cardBgColor }}>
      <h3 className="text-3xl font-extrabold mb-4" style={{ color: cardTextColor }}>{plan.name}</h3>
      <div className="bg-white px-8 py-4 rounded-full shadow-inner mb-6">
        <p className="text-3xl font-bold" style={{ color: brandColor }}>{priceLabel}</p>
        <p className="text-sm text-gray-500 text-center">{plan.duration}</p>
      </div>
      <ul className="w-full space-y-3 mb-8">
        {(plan.benefits || []).map((benefit) => (
          <li key={`${plan.name}-${benefit}`} className="flex items-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: cardTextColor }}>
            <CheckCircle size={20} className="mr-3" />
            <span className="text-base font-medium">{benefit}</span>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-6 w-[calc(100%-48px)]">
        {isActive ? (
          <Button
            onClick={() => onCancel(plan)}
            disabled={isCanceling}
            className="w-full py-3 px-6 rounded-full font-semibold text-center shadow-md bg-gray-500 text-white"
          >
            {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
          </Button>
        ) : (
          <Button
            onClick={() => onSubscribe(plan)}
            disabled={isSubscribing}
            className="w-full py-3 px-6 rounded-full font-semibold shadow-md"
            style={{ backgroundColor: brandColor, color: getContrastTextColor(brandColor) }}
          >
            {isSubscribing ? 'Processing...' : 'Subscribe'}
          </Button>
        )}
      </div>
    </div>
  );
};

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { push } = useToast();
  const { userId, isLoggedIn } = useSelector((s) => s.user);

  // Data Fetching
  const { data: storeProfile } = useStoreProfile(userId, { enabled: isLoggedIn && !!userId });
  const { data: plans = [], isLoading: plansLoading } = useGetPlansQuery();
  const { data: activeSubscription, isLoading: subscriptionLoading } = useGetSubscriptionsQuery({ enabled: isLoggedIn && !!userId });
  
  // Mutations
  const createSubscription = useCreateSubscriptionMutation();
  const cancelSubscription = useCancelSubscriptionMutation();

  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);

  const activePlanName = activeSubscription?.plan || 'Free'; // Default to a free tier if no subscription

  const handleSubscribe = (plan) => {
    if (!isLoggedIn) {
      push('Please log in to subscribe.', { type: 'info' });
      navigate('/login');
      return;
    }
    // This now triggers the API call directly
    createSubscription.mutate({ planId: plan.id });
  };
  
  const handleCancel = (plan) => {
      if(window.confirm(`Are you sure you want to cancel your ${plan.name} subscription?`)){
          cancelSubscription.mutate(activeSubscription.id);
      }
  }

  if (plansLoading || subscriptionLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading plans...</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center py-8 px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ScrollToTop />
      <h1 className="text-4xl font-bold mb-2" style={{ color: brandColor }}>Subscription</h1>
      <div className="h-1 w-24 rounded-full mb-10" style={{ backgroundColor: brandColor }} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.id}
            plan={plan}
            brandColor={brandColor}
            onSubscribe={handleSubscribe}
            onCancel={handleCancel}
            isActive={activePlanName === plan.name}
            isSubscribing={createSubscription.isLoading}
            isCanceling={cancelSubscription.isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;