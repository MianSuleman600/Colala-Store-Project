// src/components/ui/InfoBox.jsx

import React from 'react';
import ProgressBar from './ProgressBar';
import Button from './Button';
import Card from './Card';

const InfoBox = ({ title, actionText, actionOnClick, completionPercentage, actionButtonStyle }) => {
    return (
        <Card className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-grow text-center md:text-left">
                <p className="text-lg text-gray-800 mb-2">{title}</p>
                <Button
                    onClick={actionOnClick}
                    className="py-2 px-6 rounded-lg transition-colors"
                    // Apply the passed actionButtonStyle here
                    style={actionButtonStyle}
                >
                    {actionText}
                </Button>
            </div>
            <div className="w-full md:w-60 mt-4 md:mt-0">
                <ProgressBar percentage={completionPercentage} />
                <p className="text-sm text-gray-600 text-center mt-2">
                    Percentage completion ({completionPercentage}%)
                </p>
            </div>
        </Card>
    );
};

export default InfoBox;