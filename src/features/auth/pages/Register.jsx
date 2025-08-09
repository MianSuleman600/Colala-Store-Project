// Register.jsx
import React, { useEffect, useState } from 'react'; // Import useState
import { useDispatch, useSelector } from 'react-redux';
import {
    registerUser,
    updateField,
    setStep,
    resetRegistration,
} from '../registrationSlice'; // Correct path to your slice
import { useNavigate } from 'react-router-dom';

// Your UI Components
import Button from '../../../components/ui/Button';
import Level1 from './register/Level1';
import Level2 from './register/Level2';
import Level3 from './register/Level3';

// Assets
import registerBannerImage from '../../../assets/images/login-banner.jpg';
import registerOverlayImage from '../../../assets/images/login-overlay.jpg';
// Icons
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Register Component
 * This component orchestrates the multi-step user registration process.
 * It manages the overall form data, current step, and handles submission.
 * It also displays add-on services on the left panel.
 *
 * @param {object} props
 * @param {function} props.onClose - Function to close the registration modal.
 * @param {function} props.onLoginClick - Function to switch to the login view/modal.
 */
const Register = ({ onClose, onLoginClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { formData, currentStep, status, error } = useSelector((state) => state.registration);

    // Local state to hold actual File objects, not stored in Redux
    const [filesToUpload, setFilesToUpload] = useState({});

    // Define the brand colors for the registration flow UI
    const brandColor = '#e53e3e'; // Corresponds to Tailwind's red-500
    const contrastColor = '#EBEBEB'; // Corresponds to Tailwind's white

    // Reset form state when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetRegistration());
            setFilesToUpload({}); // Also clear local file state
        };
    }, [dispatch]);

    // Handle successful registration
    useEffect(() => {
        if (status === 'succeeded') {
            const showSuccessModal = () => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
                modal.innerHTML = `
                    <div class="bg-white p-8 rounded-lg shadow-xl text-center">
                        <p class="text-lg font-semibold text-green-600 mb-4">Registration successful!</p>
                        <button id="closeSuccessModal" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Close</button>
                    </div>
                `;
                document.body.appendChild(modal);
                document.getElementById('closeSuccessModal').onclick = () => {
                    document.body.removeChild(modal);
                    onClose();
                };
            };
            showSuccessModal();
        }
    }, [status, onClose]);

    const dummyAddOnServices = [
        'Add on service 1',
        'Add on service 2',
        'Add on service 3',
        'Add on service 4',
    ];

    // Generic handler to dispatch field updates (for text inputs)
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateField({ name, value }));
    };

    // Special handler for file inputs
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            // Store file metadata in Redux (serializable)
            dispatch(updateField({ name, value: { name: file.name, size: file.size, type: file.type } }));
            // Store the actual File object locally for submission
            setFilesToUpload(prev => ({ ...prev, [name]: file }));
        } else {
            // If file is cleared, remove from Redux and local state
            dispatch(updateField({ name, value: null }));
            setFilesToUpload(prev => {
                const newState = { ...prev };
                delete newState[name];
                return newState;
            });
        }
    };

    const handleAddOnServiceToggle = (service) => {
        const currentServices = formData.selectedAddOnServices || [];
        const newServices = currentServices.includes(service)
            ? currentServices.filter((s) => s !== service)
            : [...currentServices, service];
        dispatch(updateField({ name: 'selectedAddOnServices', value: newServices }));
    };

    // --- Navigation Logic for Register Component ---
    const handleNextStep = () => {
        dispatch(setStep(currentStep + 1));
    };

    const handlePreviousStep = () => {
        dispatch(setStep(currentStep - 1));
    };

    // Final Submission
    const handleSubmitFinal = (e) => {
        // Safely call preventDefault only if 'e' is an event object
        e?.preventDefault();

        // Create FormData object to send all data, including files
        const dataToSend = new FormData();

        // Append all form data fields from Redux state
        for (const key in formData) {
            // Skip file metadata, as actual files are handled separately
            if (['profilePicture', 'storeBanner', 'ninSlip', 'cacCertificate', 'storeVideo'].includes(key)) {
                continue;
            }
            if (typeof formData[key] === 'object' && formData[key] !== null) {
                // For nested objects like storeAddress, stringify them
                dataToSend.append(key, JSON.stringify(formData[key]));
            } else {
                dataToSend.append(key, formData[key]);
            }
        }

        // Append actual File objects from local state
        for (const fileKey in filesToUpload) {
            dataToSend.append(fileKey, filesToUpload[fileKey]);
        }

        // Dispatch the registration action with the FormData
        // Your registerUser thunk will need to be updated to accept FormData
        dispatch(registerUser(dataToSend));
    };

    // --- Renders only one Level component based on currentStep ---
    const renderStepContent = () => {
        const commonProps = {
            formData, // Redux state (now contains file metadata)
            handleChange, // For text inputs
            handleFileChange, // For file inputs (updates local state and Redux metadata)
            onLoginClick,
            registrationStatus: status,
            registrationError: error,
            brandColor: brandColor,
            contrastColor: contrastColor,
            mode: 'register',
        };

        // Level 1: Handles global steps 1-3 internally
        if (currentStep >= 1 && currentStep <= 3) {
            return (
                <Level1
                    {...commonProps}
                    currentStep={currentStep}
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                />
            );
        }

        // Level 2: Handles global steps 4-5 internally
        if (currentStep >= 4 && currentStep <= 5) {
            return (
                <Level2
                    {...commonProps}
                    currentStep={currentStep}
                    onNext={handleNextStep}
                    onBack={handlePreviousStep}
                />
            );
        }

        // Level 3: Handles global steps 6-7 internally
        if (currentStep >= 6 && currentStep <= 7) {
            return (
                <Level3
                    {...commonProps}
                    currentStep={currentStep}
                    onBack={handlePreviousStep}
                    onNext={handleNextStep}
                    onSubmit={handleSubmitFinal}
                />
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl min-h-[600px] lg:h-[600px]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 text-gray-500 hover:text-gray-700"
                    aria-label="Close registration modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Left - Add-on Services */}
                <div
                    className="relative hidden lg:flex flex-col items-center justify-center p-8 text-white w-[436px]"
                    style={{
                        backgroundImage: `url(${registerOverlayImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className={`absolute top-[330px] left-[20px] z-20 flex flex-col items-start p-8 rounded-2xl w-[390px] h-[270px] bg-opacity-80 backdrop-blur-sm`} style={{ backgroundColor: 'rgba(230, 57, 70, 0.8)' }}>
                        <img
                            src={registerBannerImage}
                            alt="Foreground graphic"
                            className="absolute z-10 w-[250px] h-[200px] top-[83px] left-[141px] object-contain"
                        />
                        <h3 className="text-lg mb-2">
                            Request various add-on services on{' '}
                            <span className="text-white font-bold text-[28px]" style={{ fontFamily: 'Oleo Script' }}>
                                Colala
                            </span>
                        </h3>
                        <ul className="space-y-2">
                            {dummyAddOnServices.map((service, index) => (
                                <li
                                    key={index}
                                    className="flex items-center text-[14px] text-white cursor-pointer"
                                    style={{ fontFamily: 'Manrope' }}
                                    onClick={() => handleAddOnServiceToggle(service)}
                                >
                                    <CheckCircleIcon
                                        className={`mr-2 h-5 w-5 ${formData.selectedAddOnServices?.includes(service)
                                            ? 'text-green-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                    {service}
                                </li>
                            ))}
                        </ul>
                        <Button className="w-[157px] h-[32px] mt-3 rounded-md bg-white py-2 text-red-600 shadow-md hover:bg-gray-100">
                            Request Service
                        </Button>
                    </div>
                </div>

                {/* Right - Registration Form */}
                <div className="w-full mt-11 p-8 lg:w-1/2 flex flex-col items-center overflow-y-auto max-h-[90vh]">
                    <h2 className={`text-[24px] font-semibold leading-none font-manrope`} style={{ color: brandColor }}>Register</h2>
                    <p className="mt-2 text-gray-600 text-sm">Create a free account today</p>
                    {status === 'loading' && <p className="mt-4 text-blue-600">Submitting...</p>}
                    {status === 'failed' && <p className="mt-4 text-red-600">Error: {error}</p>}
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
};

export default Register;
