import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';

import video1 from '../../assets/images/feed/2.png'

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: 'Question 1',
            answer: 'This is the answer to question 1. You can put detailed information here.',
        },
        {
            question: 'Question 2',
            answer: 'This is the answer to question 2. It can be a little longer to provide more context.',
        },
        {
            question: 'Question 3',
            answer: 'This is the answer to question 3.',
        },
        {
            question: 'How to earn on Colala?',
            answer: 'You can earn on Colala easily by referring your friends. You get a referral bonus once they make a purchase.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-6">
            {/* Video Thumbnail */}
            <div className="relative w-full h-[234px] rounded-xl overflow-hidden border border-gray-200">
                <img
                    src={video1}
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <button className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="h-12 w-12 md:h-16 md:w-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <svg className="h-6 w-6 md:h-8 md:w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* FAQ Header */}
            <h2 className="text-base font-semibold text-gray-800">Referral FAQs</h2>

            {/* FAQs List */}
            <div className="space-y-3">
                {faqData.map((faq, index) => (
                    <Card
                        key={index}
                        className="p-4 rounded-xl border border-gray-200"
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{faq.question}</span>
                            <ChevronDownIcon
                                className={`h-5 w-5 text-gray-600 transform transition-transform duration-300 ${
                                    openIndex === index ? 'rotate-180' : ''
                                }`}
                            />
                        </div>
                        {openIndex === index && (
                            <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FAQs;
