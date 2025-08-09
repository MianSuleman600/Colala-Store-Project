// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ label, icon, rightIcon, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={props.id || props.name} className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative rounded-md shadow-sm">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {icon}
                    </div>
                )}
                <input
                    className={`block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm
                                ${icon ? 'pl-10' : ''}
                                ${rightIcon ? 'pr-10' : ''}
                                ${className}`}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
                        {rightIcon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;