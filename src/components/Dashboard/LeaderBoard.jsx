// src/pages/LeaderBoard.jsx
import React, { useMemo, useState } from 'react';
import ScrollToTop from '../ui/ScrollToTop';
import { useLeaderboardSellersQuery, useLeaderboardFaqsQuery } from '../../services/queries/useLeaderboardQuery';

const toPeriodParam = (label) => {
  const l = String(label).toLowerCase();
  if (l.includes('today')) return 'today';
  if (l.includes('weekly') || l.includes('week')) return 'week';
  if (l.includes('monthly') || l.includes('month')) return 'month';
  return 'all';
};

export default function LeaderBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Today');

  const periodParam = toPeriodParam(activeTab);
  const { data: sellers = [], isLoading } = useLeaderboardSellersQuery(periodParam);
  const { data: faqs = [] } = useLeaderboardFaqsQuery();

  // Ensure sorted descending by score just in case
  const sorted = useMemo(() => {
    const arr = Array.isArray(sellers) ? [...sellers] : [];
    arr.sort((a, b) => b.score - a.score);
    return arr;
  }, [sellers]);

  const topSellers = useMemo(() => sorted.slice(0, 3), [sorted]);
  const rankedSellers = useMemo(() => sorted.slice(3), [sorted]);

  const tabs = ['Today', 'Weekly', 'Monthly', 'All Time'];

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center bg-gray-100 font-sans">
      <ScrollToTop />
      <div className="w-full max-w-4xl h-full flex flex-col rounded-3xl overflow-hidden shadow-xl">
        <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-red-500 to-pink-500 flex flex-col relative">
          <header className="flex justify-between items-center text-white mb-6">
            <h2 className="text-3xl font-bold">Seller Leaderboard</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="How it works"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.156-1.57 2.656-2.585 4.389-2.585C16.892 4.934 18 6.444 18 8.167c0 1.554-.887 2.768-2.342 3.488-.956.467-1.523 1.155-1.523 1.838v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </button>
          </header>

          <div className="flex justify-between items-center text-white mb-8">
            <span className="text-3xl font-bold">{activeTab}</span>
            <div className="flex space-x-2 p-1 rounded-full bg-black bg-opacity-10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-1 px-4 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-white text-gray-900' : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-white text-center py-12">Loading leaderboard...</div>
          ) : (
            <Podium topSellers={topSellers} />
          )}
        </div>

        <LeaderboardList rankedSellers={rankedSellers} />

        <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} faqs={faqs} />
      </div>
    </div>
  );
}

// Podium
const Podium = ({ topSellers }) => {
  const emptySeller = { name: '', score: null, avatarUrl: null };
  const [second, first, third] = [topSellers[1] || emptySeller, topSellers[0] || emptySeller, topSellers[2] || emptySeller];

  return (
    <div className="relative flex justify-center items-end h-64 md:h-80 mb-6">
      <PodiumSeller seller={second} rank={2} positionClass="absolute left-0 bottom-0 z-10" heightClass="h-40 md:h-48" />
      <PodiumSeller seller={first} rank={1} positionClass="relative z-20 mx-4" heightClass="h-56 md:h-72" />
      <PodiumSeller seller={third} rank={3} positionClass="absolute right-0 bottom-0 z-10" heightClass="h-28 md:h-36" />
    </div>
  );
};

const PodiumSeller = ({ seller, rank, positionClass, heightClass }) => {
  const isFirst = rank === 1;
  const blockColor = isFirst ? 'bg-[#da4587]' : 'bg-white bg-opacity-80';
  const textColor = isFirst ? 'text-gray-900' : 'text-gray-800';
  const avatarSrc = seller?.avatarUrl || 'https://placehold.co/80x80/cccccc/000000?text=?';

  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${positionClass}`}>
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 border-4 ${isFirst ? 'border-yellow-400' : 'border-gray-300'}`}>
        <img src={avatarSrc} alt={seller?.name || ''} className="w-full h-full object-cover" />
      </div>
      <div className="text-center">
        <p className={`font-semibold ${isFirst ? 'text-white text-xl' : 'text-white text-lg'} whitespace-nowrap`}>{seller?.name || ''}</p>
        <p className="text-white text-sm font-medium">{Number.isFinite(seller?.score) ? seller.score : ''}</p>
      </div>
      <div className={`w-24 md:w-32 rounded-t-lg shadow-lg mt-2 ${heightClass} flex items-center justify-center font-bold text-9xl ${textColor} ${blockColor}`}>
        {rank}
      </div>
    </div>
  );
};

// Ranked list
const LeaderboardList = ({ rankedSellers }) => {
  return (
    <div className="flex-1 bg-white p-4 md:p-6 rounded-b-3xl overflow-y-auto">
      <ul className="space-y-4">
        {(rankedSellers || []).map((seller, index) => (
          <li key={seller.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-4">
              <span className="font-bold text-lg text-gray-700">{index + 4}</span>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={seller.avatarUrl || 'https://placehold.co/80x80/cccccc/000000?text=?'} alt={seller.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-medium text-gray-800">{seller.name}</p>
            </div>
            <span className="font-bold text-lg text-red-500">{seller.score}</span>
          </li>
        ))}
        {(rankedSellers || []).length === 0 && <li className="text-center text-gray-500 p-4">No ranked sellers to display.</li>}
      </ul>
    </div>
  );
};

// Modal — pulls FAQs from props
const HowItWorksModal = ({ isOpen, onClose, faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-serif italic text-gray-800">How it works</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {Array.isArray(faqs) && faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-4 shadow-sm">
                <button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="mt-4 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No FAQs available.</div>
          )}
        </div>
      </div>
    </div>
  );
};