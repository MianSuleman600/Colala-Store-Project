// src/pages/referrals/FAQs.jsx
import React, { useMemo, useState } from 'react';
import { ChevronDownIcon, PlayIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import { useReferralFaqsQuery } from '../../services/queries/useReferralQuery';

const FAQs = ({ brandColor = '#EF4444', contrastTextColor = '#ffffff' }) => {
  const { data: faqs } = useReferralFaqsQuery();
  const [openIndex, setOpenIndex] = useState(null);
  const [playing, setPlaying] = useState(false);

  const items = Array.isArray(faqs?.items) ? faqs.items : [];
  const videoUrl = faqs?.videoUrl || '';
  const thumbnail = faqs?.thumbnail || 'https://placehold.co/1200x234/000000/FFFFFF?text=Referral+Intro+Video';

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="space-y-6">
      {/* Video */}
      <div className="relative w-full h-[234px] rounded-xl overflow-hidden border border-gray-200">
        {!playing ? (
          <>
            <img src={thumbnail} alt="Referral intro" className="absolute inset-0 w-full h-full object-cover" />
            {videoUrl ? (
              <button
                className="absolute inset-0 z-10 flex items-center justify-center"
                onClick={() => setPlaying(true)}
              >
                <div
                  className="h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: brandColor }}
                >
                  <svg className="h-6 w-6 md:h-8 md:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            ) : null}
          </>
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            controls
            autoPlay
            onEnded={() => setPlaying(false)}
          />
        )}
      </div>

      {/* FAQ Header */}
      <h2 className="text-base font-semibold text-gray-800">Referral FAQs</h2>

      {/* FAQs */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="p-4">No FAQ available.</Card>
        ) : (
          items.map((faq, index) => (
            <Card key={index} className="p-4 rounded-xl border border-gray-200" onClick={() => toggleFAQ(index)}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{faq.question}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-600 transform transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {openIndex === index && <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQs;