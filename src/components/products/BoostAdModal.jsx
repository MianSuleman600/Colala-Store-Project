// src/components/modals/BoostAdModal.jsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Close icon
import Button from '../ui/Button'; // Re-using your Button component
import megaphoneImage from '../../assets/images/mic.png'; // Path to your megaphone image
import './css/BoostAdModal.css'; // Import a new CSS file for custom styles

/**
 * BoostAdModal Component
 * Displays a modal to inform users about boosting their product,
 * matching the design in 'ads.png'.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onProceed - Callback when the "Proceed" button is clicked.
 * @param {string} props.brandColor - Primary brand color for styling.
 * @param {string} props.contrastTextColor - Text color for contrast.
 */
const BoostAdModal = ({ isOpen, onClose, onProceed, brandColor, contrastTextColor }) => {
    if (!isOpen) return null;

    // Inline SVG for the megaphone icon to match ads.png
    const MegaphoneIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-24 w-24 text-white" // Adjusted size and color to match the image
        >
            <path d="M11.5 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zm2.35 4.72a.75.75 0 00-1.06-1.06L9.22 5.94a.75.75 0 001.06 1.06l1.59-1.59zM4.72 9.45a.75.75 0 00-1.06 1.06L5.94 12.22a.75.75 0 001.06-1.06l-1.59-1.59zM3 12a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5A.75.75 0 003 12zm2.35 5.03a.75.75 0 001.06-1.06L5.94 14.78a.75.75 0 00-1.06 1.06l1.59 1.59zM12 21a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75zm5.03-2.35a.75.75 0 00-1.06 1.06l1.59 1.59a.75.75 0 001.06-1.06l-1.59-1.59zM18 12a.75.75 0 00-.75-.75h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 00.75-.75zM15.78 5.94a.75.75 0 001.06-1.06l-1.59-1.59a.75.75 0 00-1.06 1.06l1.59 1.59zM12 2.25C6.848 2.25 2.75 6.348 2.75 11.5S6.848 20.75 12 20.75s9.25-4.098 9.25-9.25S17.152 2.25 12 2.25zM12 3.75c4.28 0 7.75 3.47 7.75 7.75S16.28 19.25 12 19.25 4.25 15.78 4.25 11.5 7.72 3.75 12 3.75zM10.25 9.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM13.25 9.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM15.75 9.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" />
        </svg>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* The main modal container now handles all rounded corners and overflow hidden */}
            <div className="bg-[#f58756] rounded-2xl shadow-xl w-full max-w-[350px] max-h-[90vh] sm:max-h-[80vh] overflow-hidden relative flex flex-col">
                {/* Top Section with Megaphone and Gradient Background */}
                {/* Ensure this section also has rounded top corners or relies on the parent's overflow-hidden */}
                <div className="relative rounded-t-2xl flex flex-col items-center justify-center text-white">
                    <img src={megaphoneImage} alt="" className='w-300 h-full' />
                    <h3 className="text-xl absolute -top-4 mt-4" style={{ fontFamily: 'oleo script' }}>Boost Ad</h3>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Main Content Section */}
                {/* Removed rounded-b-2xl and now relies on the parent's overflow-hidden for bottom rounding */}
                {/* The top-left and top-right rounding will now come from the `modal-content-area` style */}
                <div className="p-6 space-y-6 flex-1 bg-[#ffd2d2] overflow-auto custom-scrollbar modal-content-area">

                    <h4 className="text-[10px] font-bold text-gray-800 text-center mb-4" style={{  color: brandColor }}>
                        Get Amazing Benefits from Boosting your product
                    </h4>

                    {/* Benefit Cards */}
                    <div className="space-y-4">
                        {[
                            { title: "Increased Visibility", description: "Boosting your product helps it reach a larger audience beyond your existing followers, increasing the chances of being seen by potential customers." },
                            { title: "Targeted Reach", description: "You can choose specific demographics, locations, ensuring your ad is seen by the people most likely to engage with it." },
                            { title: "More Engagement", description: "Boosted products tend to get more likes, comments, shares, and clicks, helping you build credibility and foster a more active community." },
                            { title: "Wider Reach", description: "Boosted products will not only be featured on gym paddy but also outside gym paddy to get more visibility and reach" },
                            { title: "Budget Control", description: "You can set your own budget and duration, making it easy to manage costs while still achieving measurable marketing results." },
                        ].map((benefit, index) => (
                            <div key={index} className="bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
                                <h5 className="text-[14px] font-semibold text-gray-800 mb-1">{benefit.title}</h5>
                                <p className="text-[10px] text-gray-600 leading-tight max-h-[2.5em] overflow-y-auto">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 pb-4">
                        <Button
                            onClick={onProceed}
                            className="w-full py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
                            style={{ backgroundColor: brandColor, color: contrastTextColor }}
                        >
                            Proceed
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoostAdModal;