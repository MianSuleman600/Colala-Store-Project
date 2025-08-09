// src/components/ui/StepIndicator.jsx
import React from 'react';

/**
 * StepIndicator Component
 * Renders a series of numbered circles with connecting lines to indicate progress.
 *
 * @param {object} props
 * @param {number[]} props.steps - An array of numbers representing the steps to display (e.g., [1, 2, 3]).
 * @param {number} props.currentStep - The currently active step number (relative to the 'steps' array).
 * @param {string} props.brandColor - The primary brand color in hex (e.g., '#EF4444').
 * @param {string} props.contrastColor - The contrast text color in hex (e.g., '#FFFFFF').
 * @param {string} [props.className] - Optional custom class names for the container div.
 */
const StepIndicator = ({ steps, currentStep, brandColor, contrastColor, className = '' }) => {
    const brandBgStyle = { backgroundColor: brandColor };
    const contrastTextStyle = { color: contrastColor };

    return (
        <div className={`flex items-center justify-between w-full ${className}`}>
            {steps.map((stepNum, index) => {
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                    <React.Fragment key={stepNum}>
                        <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                                ${isCurrent || isCompleted ? '' : 'bg-gray-300 text-gray-700'}`}
                            style={isCurrent || isCompleted ? { ...brandBgStyle, ...contrastTextStyle } : {}}
                        >
                            {isCompleted ? '✓' : stepNum}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-grow h-0.5 mx-0.5 ${currentStep > stepNum ? '' : 'bg-gray-300'}`}
                                style={currentStep > stepNum ? brandBgStyle : {}}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepIndicator;
