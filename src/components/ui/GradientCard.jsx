import React from 'react';

const GradientCard = ({ children, className, ...props }) => {
    return (
        <div
            className={`rounded-2xl p-6 shadow-lg text-white bg-gradient-to-r from-red-500 to-pink-500 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GradientCard;