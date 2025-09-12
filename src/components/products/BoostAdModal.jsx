import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import megaphoneImage from '../../assets/images/mic.png';
import './css/BoostAdModal.css';

const BoostAdModal = ({ isOpen, onClose, onProceed, brandColor, contrastTextColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center z-50 p-4">
      <div className="bg-[#f58756] rounded-4xl shadow-xl w-full max-w-[360px] max-h-[90vh] sm:max-h-[80vh] overflow-hidden relative flex flex-col">
        <div className="relative rounded-t-2xl flex flex-col items-center justify-center text-white">
          <img src={megaphoneImage} alt="Boost" className="w-72 h-auto" />
          <h3 className="text-xl absolute -top-4 mt-4 font-semibold">Boost Ad</h3>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
            aria-label="Close modal"
            type="button"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-3 space-y-6  flex-1 bg-[#ffd2d2] overflow-auto custom-scrollbar modal-content-area">
          <h4 className="text-sm font-bold text-gray-800 text-center mb-4" style={{ color: brandColor }}>
            Get Amazing Benefits from Boosting your product
          </h4>

          <div className="space-y-4">
            {[
              { title: 'Increased Visibility', description: 'Reach a larger audience beyond your existing followers.' },
              { title: 'Targeted Reach', description: 'Choose demographics and locations for best results.' },
              { title: 'More Engagement', description: 'Boosted products get more likes, comments, and clicks.' },
              { title: 'Wider Reach', description: 'Show your product beyond your store to maximize reach.' },
              { title: 'Budget Control', description: 'Set your own budget and duration with measurable results.' },
            ].map((benefit, i) => (
              <div key={i} className="bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm">
                <h5 className="text-sm font-semibold text-gray-800 mb-1">{benefit.title}</h5>
                <p className="text-xs text-gray-600 leading-snug">{benefit.description}</p>
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