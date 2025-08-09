// src/pages/SubscriptionPage.jsx
import React from 'react';
import Button from '../../components/ui/Button'; // Assuming you have a reusable Button component
import { CheckCircle } from 'lucide-react'; // Checkmark icon for benefits
import { getContrastTextColor } from '../../utils/colorUtils'; // Utility for text color contrast
import ScrollToTop from '../ui/ScrollToTop';
// Import the background image
import backgroundImage from '../../assets/images/subscription/2.png'; // Adjust this path if needed

/**
 * SubscriptionPlanCard Component
 * Renders a single subscription plan card.
 */
const SubscriptionPlanCard = ({ plan, brandColor, isActive }) => {
    const cardBgColor = plan.color; // Use the plan's specific color for the card background
    const cardTextColor = getContrastTextColor(cardBgColor);

    return (
        <div
            className="relative flex flex-col items-center p-6 pb-12 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
            style={{ backgroundColor: cardBgColor }}
        >
              <ScrollToTop/>
            {/* Plan Title */}
            <h3
                className="text-4xl font-extrabold mb-4"
                style={{ color: cardTextColor }}
            >
                {plan.name}
            </h3>

            {/* Price Section - Corrected rounded-2xl to rounded-full */}
            <div className="bg-white px-8 py-4 rounded-full shadow-inner mb-6"> {/* Changed rounded-2xl to rounded-full */}
                <p className="text-4xl font-bold" style={{ color: brandColor }}>
                    {plan.price === 'Free' ? 'Free' : `N${plan.price}`}
                </p>
                <p className="text-sm text-gray-500 text-center">{plan.duration}</p>
            </div>

            {/* Benefits List */}
            <ul className="w-full space-y-3 mb-8">
                {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: cardTextColor }}>
                        <CheckCircle size={20} className="mr-3" style={{ color: cardTextColor }} />
                        <span className="text-base font-medium">{benefit}</span>
                    </li>
                ))}
            </ul>

            {/* Action Button / Active Status */}
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
                        className="w-full py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg"
                        style={{ backgroundColor: brandColor, color: getContrastTextColor(brandColor) }}
                    >
                        Subscribe
                    </Button>
                )}
            </div>
        </div>
    );
};

/**
 * SubscriptionPage Component
 * Displays various subscription plans.
 */
const SubscriptionPage = () => {
    const brandColor = '#EF4444'; // Example brand color (red)
    const contrastTextColor = getContrastTextColor(brandColor);

    // Dummy subscription plans data
    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            duration: '/month',
            benefits: ['Free benefit 1', 'Free benefit 2', 'Free benefit 3', 'Free benefit 4'],
            color: '#FFDAB9', // Peach/Orange color from screenshot
            isActive: true, // Set Basic as active for demonstration
        },
        {
            name: 'Standard',
            price: '50,000',
            duration: '/month',
            benefits: ['All Basic benefits', 'Standard benefit 1', 'Standard benefit 2', 'Standard benefit 3'],
            color: '#E0BBE4', // Purple-ish color from screenshot
            isActive: false,
        },
        {
            name: 'Premium',
            price: '150,000',
            duration: '/month',
            benefits: ['All Standard benefits', 'Premium benefit 1', 'Premium benefit 2', 'Premium benefit 3'],
            color: '#957DAD', // Darker purple from screenshot
            isActive: false,
        },
    ];

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col items-center py-8 px-4"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <h1 className="text-4xl font-bold text-black mb-12 text-shadow-lg">
                Subscription
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                {plans.map((plan, index) => (
                    <SubscriptionPlanCard
                        key={index}
                        plan={plan}
                        brandColor={brandColor}
                        isActive={plan.isActive}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;
