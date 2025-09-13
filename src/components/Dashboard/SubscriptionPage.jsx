//D:\Project\frontend\src\components\Dashboard\SubscriptionPage.jsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { getContrastTextColor } from '../../utils/colorUtils';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useToast } from '../../components/ui/ToastProvider';
import backgroundImage from '../../assets/images/subscription/2.png';

const SubscriptionPlanCard = ({ plan, brandColor, onSubscribe, isActive }) => {
  const cardBgColor = plan.color;
  const cardTextColor = getContrastTextColor(cardBgColor);

  const priceLabel =
    typeof plan.price === 'number' ? `N${plan.price.toLocaleString()}` : plan.price;

  return (
    <div
      className="relative flex flex-col items-center p-6 pb-16 rounded-3xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
      style={{ backgroundColor: cardBgColor }}
      aria-current={isActive ? 'true' : 'false'}
    >
      {/* Plan Title */}
      <h3 className="text-3xl font-extrabold mb-4" style={{ color: cardTextColor }}>
        {plan.name}
      </h3>

      {/* Price */}
      <div className="bg-white px-8 py-4 rounded-full shadow-inner mb-6">
        <p className="text-3xl font-bold" style={{ color: brandColor }}>
          {priceLabel}
        </p>
        <p className="text-sm text-gray-500 text-center">{plan.duration}</p>
      </div>

      {/* Benefits */}
      <ul className="w-full space-y-3 mb-8">
        {plan.benefits.map((benefit) => (
          <li
            key={`${plan.name}-${benefit}`}
            className="flex items-center p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: cardTextColor }}
          >
            <CheckCircle size={20} className="mr-3" style={{ color: cardTextColor }} />
            <span className="text-base font-medium">{benefit}</span>
          </li>
        ))}
      </ul>

      {/* Action */}
      <div className="absolute bottom-6 w-[calc(100%-48px)]">
        {isActive ? (
          <div
            className="w-full py-3 px-6 rounded-full font-semibold text-center shadow-md flex items-center justify-center"
            style={{ backgroundColor: getContrastTextColor(brandColor), color: brandColor }}
          >
            <CheckCircle size={20} className="mr-2" /> Subscription Active
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => onSubscribe(plan)}
            className="w-full py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg"
            style={{ backgroundColor: brandColor, color: getContrastTextColor(brandColor) }}
            aria-label={`Subscribe to ${plan.name} plan`}
          >
            Subscribe
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

  // Brand color from profile
  const { data: storeProfile, isError: profileError } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });

  const brandColor = useMemo(() => storeProfile?.brandColor || '#EF4444', [storeProfile]);
  const contrastTextColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  // Surface profile error
  if (profileError) {
    // Non-blocking toast
    push('Failed to load store profile. Using default theme.', { type: 'error' });
  }

  // Active plan (if you have it in profile, otherwise defaults to Basic)
  const activePlanName = storeProfile?.subscription?.plan || 'Basic';

  // Plans data
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      duration: '/month',
      benefits: ['Free benefit 1', 'Free benefit 2', 'Free benefit 3', 'Free benefit 4'],
      color: '#FFDAB9',
    },
    {
      name: 'Standard',
      price: 50000,
      duration: '/month',
      benefits: ['All Basic benefits', 'Standard benefit 1', 'Standard benefit 2', 'Standard benefit 3'],
      color: '#E0BBE4',
    },
    {
      name: 'Premium',
      price: 150000,
      duration: '/month',
      benefits: ['All Standard benefits', 'Premium benefit 1', 'Premium benefit 2', 'Premium benefit 3'],
      color: '#957DAD',
    },
  ];

  const handleSubscribe = (plan) => {
    if (!isLoggedIn) {
      push('Please log in to subscribe.', { type: 'info' });
      navigate('/login');
      return;
    }
    if (plan.name === activePlanName) {
      push('This is already your active plan.', { type: 'info' });
      return;
    }
    // Route to your subscription checkout/upgrade flow
    // Adjust this path to your real route
    push(`Redirecting to subscribe to ${plan.name}...`, { type: 'success' });
    navigate(`/subscribe/checkout?plan=${encodeURIComponent(plan.name)}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center py-8 px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ScrollToTop />

      <h1 className="text-4xl font-bold mb-2" style={{ color: brandColor }}>
        Subscription
      </h1>
      <div
        className="h-1 w-24 rounded-full mb-10"
        style={{ backgroundColor: brandColor }}
        aria-hidden
      />

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <SubscriptionPlanCard
            key={plan.name}
            plan={plan}
            brandColor={brandColor}
            onSubscribe={handleSubscribe}
            isActive={activePlanName === plan.name}
          />
        ))}
      </div>

     
    </div>
  );
};

export default SubscriptionPage;