// src/components/models/EnterEmailModal.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * EnterEmailModal Component
 * Prompts the user to enter their email address for password reset.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {function} props.onEmailSubmit - Function to call with the entered email.
 * @param {string} [props.brandColor='#EF4444'] - Primary brand color in hex.
 * @param {string} [props.contrastColor='#FFFFFF'] - Contrast text color in hex.
 */
const EnterEmailModal = ({ isOpen, onClose, onEmailSubmit, brandColor = '#EF4444', contrastColor = '#FFFFFF' }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const contrastTextStyle = { color: contrastColor };
    const brandHoverStyle = { filter: 'brightness(110%)' };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handleSubmit = () => {
        if (!email.trim()) {
            setError('Email is required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Invalid email format.');
            return;
        }
        onEmailSubmit(email);
        // Do not close here; parent will manage closing and opening next modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[20px] shadow-lg w-full max-w-sm p-6 relative flex flex-col items-center">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h3 className="text-xl font-semibold mb-6 font-manrope" style={brandTextStyle}>Reset Password</h3>

                <p className="text-sm text-gray-600 mb-4 text-center">
                    Reset your password via your registered email
                </p>

                <div className="w-full mb-6">
                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={handleEmailChange}
                        icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                        className="h-[60px] rounded-[15px] border border-gray-300"
                        error={error}
                    />
                    {error && <p className="text-xs mt-1" style={brandTextStyle}>{error}</p>}
                </div>

                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full rounded-[15px] py-3 text-base shadow-md"
                    style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                >
                    Proceed
                </Button>
            </div>
        </div>
    );
};

export default EnterEmailModal;
