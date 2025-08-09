// src/components/ui/VerticalStepIndicator.jsx
import React from 'react';

/**
 * VerticalStepIndicator Component
 * Renders a vertical series of numbered circles with connecting lines to indicate progress.
 * Designed for use in a sidebar or vertical layout.
 *
 * @param {object} props
 * @param {number[]} props.steps - An array of numbers representing the steps to display (e.g., [1, 2, 3]).
 * @param {number} props.currentStep - The currently active step number (relative to the 'steps' array).
 * @param {string} props.brandColor - The primary brand color in hex (e.g., '#EF4444').
 * @param {string} props.contrastColor - The contrast text color in hex (e.g., '#FFFFFF').
 */
const VerticalStepIndicator = ({ steps, currentStep, brandColor, contrastColor }) => {
    // Inline styles for brand colors
    const brandBgStyle = { backgroundColor: brandColor };
    const contrastTextStyle = { color: contrastColor };

    return (
        <div className="flex flex-col items-center h-full">
            {steps.map((stepNum, index) => (
                <React.Fragment key={stepNum}>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300 flex-shrink-0
                            ${currentStep >= stepNum ? '' : 'bg-gray-300 text-gray-700'}`}
                        style={currentStep >= stepNum ? { ...brandBgStyle, ...contrastTextStyle } : {}}
                    >
                        {stepNum}
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`flex-grow w-0.5 my-1 ${currentStep > stepNum ? '' : 'bg-gray-300'}`}
                            style={currentStep > stepNum ? brandBgStyle : {}}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default VerticalStepIndicator;
