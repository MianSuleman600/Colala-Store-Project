// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                       ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

