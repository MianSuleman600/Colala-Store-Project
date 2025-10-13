// src/components/models/ResetPasswordModal.jsx
// This component is now specifically for OTP input
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * OtpInputModal (formerly ResetPasswordModal) Component
 * Prompts the user to enter an OTP sent to their email.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {function} props.onOtpConfirm - Function to call with the entered OTP.
 * @param {string} props.email - The email address to which the OTP was sent.
 * @param {function} props.onResendCode - Function to call to resend the OTP.
 * @param {boolean} props.isProcessing - Loading state for OTP verification.
 * @param {boolean} props.isSendingCode - Loading state for resending the code. // NEW
 * @param {string} [props.brandColor='#EF4444'] - Primary brand color in hex.
 * @param {string} [props.contrastColor='#FFFFFF'] - Contrast text color in hex.
 */
const OtpInputModal = ({ isOpen, onClose, onOtpConfirm, email, onResendCode, isProcessing, isSendingCode, brandColor = '#EF4444', contrastColor = '#FFFFFF' }) => {
    const [otpCode, setOtpCode] = useState('');
    const [resendTimer, setResendTimer] = useState(59);
    const [resendMessage, setResendMessage] = useState('');
    const [error, setError] = useState('');

    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const contrastTextStyle = { color: contrastColor };
    const brandHoverStyle = { filter: 'brightness(110%)' };

    useEffect(() => {
        let timerInterval;
        // Use isSendingCode to manage the timer pause
        if (isOpen && resendTimer > 0 && !isSendingCode) {
            timerInterval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            clearInterval(timerInterval);
            setResendMessage('You can resend the code.');
        }
        return () => clearInterval(timerInterval);
    }, [isOpen, resendTimer, isSendingCode]); // Added isSendingCode to dependency array

    useEffect(() => {
        if (isOpen) {
            setOtpCode('');
            // Reset timer only if it's the first time opening or after an action
            setResendTimer(59);
            setResendMessage('');
            setError('');
        }
    }, [isOpen]);

    const handleCodeChange = (e) => {
        setOtpCode(e.target.value);
        setError('');
    };

    // FIX: Update handleResendCode to call the prop function
    const handleResendCode = async () => {
        if (resendTimer === 0) {
            setResendMessage('Sending new code...');
            setError('');

            const success = await onResendCode(); // Call the API function passed from Login

            if (success) {
                setResendTimer(59); // Reset timer on success
                setResendMessage('New code sent!');
            } else {
                // The parent component (Login) already pushes a toast for error, 
                // just reset the message here for a moment.
                setResendMessage('Failed to send. Try again.');
                // Do NOT reset the timer on API error to allow immediate retry
            }
        }
    };

    const handleProceed = () => {
        if (!otpCode.trim()) {
            setError('Please enter the code.');
            return;
        }
        if (otpCode.trim().length < 4) { // Assuming a 6-digit OTP
            setError('Code must be at least 4 digits.');
            return;
        }
        onOtpConfirm(otpCode);
        // Do not close here; parent will manage closing and opening next modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    Enter the code we sent to your email.
                </p>

                <div className="w-full mb-4">
                    <Input
                        type="text"
                        name="otpCode"
                        placeholder="Enter Code"
                        value={otpCode}
                        onChange={handleCodeChange}
                        className="h-[60px] rounded-[15px] border border-gray-300 text-center"
                        error={error}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => {
                                    // Dummy paste functionality
                                    // Fallback for clipboard.writeText() is not needed, we want to read
                                    navigator.clipboard.readText().then(text => {
                                        setOtpCode(text.trim()); // Use trim() to clean up pasted text
                                    }).catch(err => {
                                        console.error('Failed to read clipboard contents: ', err);
                                        setError('Clipboard access denied. Please type the code manually.');
                                    });
                                }}
                                className="px-3 py-1 rounded-md text-sm font-medium"
                                style={{ backgroundColor: brandColor, color: contrastColor }}
                            >
                                Paste
                            </button>
                        }
                    />
                    {error && <p className="text-xs mt-1" style={brandTextStyle}>{error}</p>}
                </div>

                <p className="text-xs text-gray-500 mb-6">
                    You can resend code in <span style={brandTextStyle}>{resendTimer.toString().padStart(2, '0')}</span>
                </p>

                <Button
                    type="button"
                    onClick={handleProceed}
                    className="w-full rounded-[15px] py-3 text-base shadow-md mb-3 disabled:opacity-60"
                    style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Verifying...' : 'Proceed'}
                </Button>

                <Button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0 || isSendingCode}
                    className={`w-full rounded-[15px] py-3 text-base shadow-sm ${resendTimer > 0 || isSendingCode ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                    {isSendingCode ? 'Sending...' : 'Resend Code'}
                </Button>
                {resendMessage && <p className="text-xs mt-2 text-center" style={brandTextStyle}>{resendMessage}</p>}
            </div>
        </div>
    );
};

export default OtpInputModal; // Exported as OtpInputModal, but file name is ResetPasswordModal.jsx