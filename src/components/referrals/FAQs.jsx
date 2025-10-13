import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import { useReferralFaqsQuery } from '../../services/queries/useReferralQuery';

// A helper function to convert any YouTube URL into an embeddable URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
    }
    if (videoId) {
      // Add autoplay, mute, and other useful params for a better UX
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`;
    }
  } catch (error) {
    console.error("Could not parse video URL:", url);
    return '';
  }
  return ''; // Return empty if it's not a valid YouTube URL
};

const FAQs = () => {
  // --- OPTIMIZATION: Get user and brand color directly from Redux state ---
  const user = useSelector((state) => state.auth.user);
  const brandColor = useMemo(() => user?.store?.brandColor || user?.store?.theme_color || '#EF4444', [user]);
  // --- END OPTIMIZATION ---

  const { data: faqsData, isLoading } = useReferralFaqsQuery();
  
  // Safely destructure the data from the hook, with fallbacks
  const items = faqsData?.items || [];
  const rawVideoUrl = faqsData?.videoUrl || '';
  
  // Convert the raw URL into a usable embed URL
  const embedVideoUrl = useMemo(() => getYouTubeEmbedUrl(rawVideoUrl), [rawVideoUrl]);
  
  const thumbnail = 'https://placehold.co/1200x234/000000/FFFFFF?text=Referral+Intro+Video';
  
  const [openIndex, setOpenIndex] = useState(null);
  const [playing, setPlaying] = useState(false);

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="space-y-6">
      <div className="relative w-full h-[234px] rounded-xl overflow-hidden border border-gray-200 bg-black">
        {!playing ? (
          <>
            <img src={thumbnail} alt="Referral intro" className="absolute inset-0 w-full h-full object-cover" />
            
            {embedVideoUrl && (
              <button
                className="absolute inset-0 z-10 flex items-center justify-center"
                onClick={() => setPlaying(true)}
                aria-label="Play referral intro video"
              >
                <div
                  className="h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: brandColor }}
                >
                  <svg className="h-6 w-6 md:h-8 md:w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedVideoUrl}
            title="Referral Intro Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>

      <h2 className="text-base font-semibold text-gray-800">Referral FAQs</h2>
      
      <div className="space-y-3">
        {isLoading ? (
          <Card className="p-4 text-center text-gray-500">Loading FAQs...</Card>
        ) : !Array.isArray(items) || items.length === 0 ? (
          <Card className="p-4 text-center text-gray-500">No FAQs available.</Card>
        ) : (
          items.map((faq, index) => (
            <Card key={faq.id || index} className="p-4 rounded-xl border border-gray-200 cursor-pointer" onClick={() => toggleFAQ(index)}>
              <div className="flex justify-between items-center gap-4">
                <span className="font-medium text-gray-800">{faq.question}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-600 transform transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {openIndex === index && <p className="mt-3 text-sm text-gray-600 border-t border-gray-200 pt-3">{faq.answer}</p>}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQs;