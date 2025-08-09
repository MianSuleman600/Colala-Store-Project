import React, { useState } from 'react';
import ScrollToTop from '../ui/ScrollToTop';

// Main App component that orchestrates the leaderboard and modal.
export default function LeaderBoard() {
    // State to manage the visibility of the "How it works" modal.
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to manage the active time period tab for the leaderboard.
    const [activeTab, setActiveTab] = useState('Today');

    // Mock data for the sellers on the leaderboard.
    const sellers = [
        { id: 1, name: 'Sasha Stores', score: 200, avatarUrl: 'https://placehold.co/80x80/D81D5C/FFFFFF?text=SS' },
        { id: 2, name: 'Vee Stores', score: 180, avatarUrl: 'https://placehold.co/80x80/6B7280/FFFFFF?text=VS' },
        { id: 3, name: 'Dan Stores', score: 150, avatarUrl: 'https://placehold.co/80x80/1F2937/FFFFFF?text=DS' },
        { id: 4, name: 'Kevin Stores', score: 100, avatarUrl: 'https://placehold.co/80x80/C6F6D5/38A169?text=KS' },
        { id: 5, name: 'Rabby Stores', score: 70, avatarUrl: 'https://placehold.co/80x80/9F7AEA/FFFFFF?text=RS' },
        { id: 6, name: 'Dann Stores', score: 350, avatarUrl: 'https://placehold.co/80x80/9F7AEA/FFFFFF?text=DS' },
        { id: 7, name: 'Don Stores', score: 400, avatarUrl: 'https://placehold.co/80x80/C0C5B0/2D3748?text=DS' },
        { id: 8, name: 'Chris Stores', score: 250, avatarUrl: 'https://placehold.co/80x80/FEEBCB/DD6B20?text=CS' },
    ];

    // The top 3 sellers for the podium are the first three in the sorted array.
    const topSellers = sellers.slice(0, 3);
    // The rest of the sellers for the ranked list.
    const rankedSellers = sellers.slice(3).sort((a, b) => b.score - a.score);

    const tabs = ['Today', 'Weekly', 'Monthly', 'All Time'];

    return (
        <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center bg-gray-100 font-sans">
              <ScrollToTop/>
            <div className="w-full max-w-4xl h-full  flex flex-col rounded-3xl overflow-hidden shadow-xl">
                {/* Main Leaderboard Container with a vibrant gradient background */}
                <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-red-500 to-pink-500 flex flex-col relative">
                    {/* Header with title and help icon */}
                    <header className="flex justify-between items-center text-white mb-6">
                        <h2 className="text-3xl font-bold">Seller Leaderboard</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                        >
                            {/* SVG for the question mark icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.156-1.57 2.656-2.585 4.389-2.585C16.892 4.934 18 6.444 18 8.167c0 1.554-.887 2.768-2.342 3.488-.956.467-1.523 1.155-1.523 1.838v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                            </svg>
                        </button>
                    </header>

                    {/* Tab bar for different time periods */}
                    <div className="flex justify-between items-center text-white mb-8">
                        <span className="text-3xl font-bold">{activeTab}</span>
                        <div className="flex space-x-2 p-1 rounded-full bg-black bg-opacity-10">
                            {tabs.map(tab => (
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

                    {/* Podium for the top 3 sellers */}
                    <Podium topSellers={topSellers} />
                </div>

                {/* Ranked list of sellers below the podium */}
                <LeaderboardList rankedSellers={rankedSellers} />
            </div>

            {/* Render the modal if it's open */}
            <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

// Podium component to display the top 3 sellers in a visually distinct way.
const Podium = ({ topSellers }) => {
    // A placeholder for the sellers if there are not enough for the top 3.
    const emptySeller = { name: '', score: null, avatarUrl: null };
    const [second, first, third] = [
        topSellers[1] || emptySeller,
        topSellers[0] || emptySeller,
        topSellers[2] || emptySeller,
    ];

    return (
        <div className="relative flex justify-center items-end h-64 md:h-80 mb-6">
            {/* 2nd Place Block */}
            <PodiumSeller
                seller={second}
                rank={2}
                positionClass="absolute left-0 bottom-0 z-10"
                heightClass="h-40 md:h-48"
            />
            {/* 1st Place Block */}
            <PodiumSeller
                seller={first}
                rank={1}
                positionClass="relative z-20 mx-4"
                heightClass="h-56 md:h-72"
            />
            {/* 3rd Place Block */}
            <PodiumSeller
                seller={third}
                rank={3}
                positionClass="absolute right-0 bottom-0 z-10"
                heightClass="h-28 md:h-36"
            />
        </div>
    );
};

// Component for an individual seller on the podium.
const PodiumSeller = ({ seller, rank, positionClass, heightClass }) => {
    const isFirst = rank === 1;
    // Styling for the podium block based on rank.
    const blockColor = isFirst ? 'bg-[#da4587]' : 'bg-white bg-opacity-80';
    const textColor = isFirst ? 'text-gray-900' : 'text-gray-800';

    return (
        <div className={`flex flex-col items-center  transition-all duration-300 ${positionClass}`}>
            {/* Seller's avatar */}
            <div className={`w-20 h-20 md:w-24  md:h-24 rounded-full overflow-hidden mb-2 border-4 ${isFirst ? 'border-yellow-400' : 'border-gray-300'}`}>
                <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full  object-cover" />
            </div>
            {/* Seller's name and score */}
            <div className="text-center">
                <p className={`font-semibold ${isFirst ? 'text-white text-xl' : 'text-white text-lg'} whitespace-nowrap`}>{seller.name}</p>
                <p className="text-white text-sm font-medium">{seller.score}</p>
            </div>
            {/* Podium block itself */}
            <div className={`w-24 md:w-32  rounded-t-lg shadow-lg mt-2 ${heightClass} flex items-center justify-center font-bold text-9xl ${textColor} ${blockColor}`}>
                {rank}
            </div>
        </div>
    );
};

// Component for the standard ranked list of sellers.
const LeaderboardList = ({ rankedSellers }) => {
    return (
        <div className="flex-1 bg-white p-4 md:p-6 rounded-b-3xl overflow-y-auto">
            <ul className="space-y-4">
                {rankedSellers.map((seller, index) => (
                    <li key={seller.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl shadow-sm">
                        {/* Rank, avatar, and name */}
                        <div className="flex items-center space-x-4">
                            <span className="font-bold text-lg text-gray-700">{index + 4}</span>
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img src={seller.avatarUrl} alt={seller.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-medium text-gray-800">{seller.name}</p>
                        </div>
                        {/* Score */}
                        <span className="font-bold text-lg text-red-500">{seller.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Modal for the "How it works" accordion.
const HowItWorksModal = ({ isOpen, onClose }) => {
    // State to manage which accordion item is currently open.
    const [openIndex, setOpenIndex] = useState(null);

    // Mock data for the accordion questions and answers.
    const faqData = [
        {
            question: 'How are sellers ranked on Colala?',
            answer: 'Sellers are ranked based on several factors that contribute to their overall score, including sales volume, customer reviews, and response time.',
        },
        {
            question: 'Question 2',
            answer: 'This is the answer to question 2. It provides details on the next step of the process.',
        },
        {
            question: 'Question 3',
            answer: 'This is the answer to question 3. More information can be found in our help center.',
        },
    ];

    if (!isOpen) return null;

    return (
        // Modal backdrop and container
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-lg p-6">
                {/* Modal header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-serif italic text-gray-800">How it works</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        {/* SVG for the close icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Accordion list */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-4 shadow-sm">
                            <button
                                className="w-full flex justify-between items-center text-left"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                                {/* Plus/minus icon based on accordion state */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            {/* Answer content, conditionally rendered */}
                            {openIndex === index && (
                                <div className="mt-4 text-gray-600">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
