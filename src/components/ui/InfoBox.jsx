import React from 'react';
import Button from './Button';
import Card from './Card';

const ProgressBar = ({ percentage = 0 }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
    </div>
);

const InfoBox = ({ title, actionText, actionOnClick, completionPercentage, actionButtonStyle }) => {
    return (
        <Card className="p-6 flex flex-col bg-[#DFDFDF] md:flex-row rounded-xl items-center justify-between gap-6">
            <div className="flex-grow text-center md:text-left">
                <p className="text-lg text-gray-800 mb-2">{title}</p>
                <Button onClick={actionOnClick} style={actionButtonStyle}>
                    {actionText}
                </Button>
            </div>
            {typeof completionPercentage === 'number' &&
                <div className="w-full md:w-60 mt-4 md:mt-0">
                    <ProgressBar percentage={completionPercentage} />
                    <p className="text-sm text-gray-600 text-center mt-2">
                        Profile completion ({completionPercentage}%)
                    </p>
                </div>
            }
        </Card>
    );
};

export default InfoBox;