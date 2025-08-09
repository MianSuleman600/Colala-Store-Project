// src/components/models/SetNewPasswordModal.jsx
import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * SetNewPasswordModal Component
 * Allows the user to set a new password after successful OTP verification.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {function} props.onSetPassword - Function to call with the new password.
 * @param {string} [props.brandColor='#EF4444'] - Primary brand color in hex.
 * @param {string} [props.contrastColor='#FFFFFF'] - Contrast text color in hex.
 */
const SetNewPasswordModal = ({ isOpen, onClose, onSetPassword, brandColor = '#EF4444', contrastColor = '#FFFFFF' }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const brandBgStyle = { backgroundColor: brandColor };
    const brandTextStyle = { color: brandColor };
    const contrastTextStyle = { color: contrastColor };
    const brandHoverStyle = { filter: 'brightness(110%)' };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        setError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setError('');
    };

    const handleSubmit = () => {
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError('Both password fields are required.');
            return;
        }
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        onSetPassword(newPassword);
        // Do not close here; parent will manage closing after API call
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

                <div className="w-full mb-4">
                    <Input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="p-1"
                                aria-label="Toggle new password visibility"
                            >
                                {showNewPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                            </button>
                        }
                        className="h-[60px] rounded-[15px] border border-gray-300"
                        error={error}
                    />
                </div>

                <div className="w-full mb-6">
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Re-Enter new password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="p-1"
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                            </button>
                        }
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

export default SetNewPasswordModal;
