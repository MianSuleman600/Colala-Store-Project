import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import useForm from '../../../hooks/useFrom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';



import loginBannerImage from '../../../assets/images/login-banner.jpg';
import loginOverlayImage from '../../../assets/images/login-overlay.jpg';

import {
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    XMarkIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Login = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, error } = useSelector((state) => state.auth);

    const { formData, handleChange } = useForm({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Backend: Replace simulation with real API call
        // dispatch(loginUser(formData));

        setTimeout(() => {
            console.log('Simulated login success!');
            onClose(); // ⬅️ Close modal on success
        }, 1500);
    };

    const dummyAddOnServices = [
        'Add on service 1',
        'Add on service 2',
        'Add on service 3',
        'Add on service 4',
    ];

    return (
        <div className="fixed flex-col inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            
            <div className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl min-h-[600px] lg:h-[600px]">

                {/* ❌ Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 text-gray-500 hover:text-gray-700"
                    aria-label="Close login modal"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                {/* 🖼 Left Section - Add-on Services (hidden on small screens) */}
                <div
                    className="relative hidden lg:flex flex-col items-center justify-center p-8 text-white w-[436px]"
                    style={{
                        backgroundImage: `url(${loginOverlayImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Add-on Card */}
                    <div className="absolute top-[330px] left-[20px] z-20 flex flex-col items-start p-8 bg-red-shade rounded-2xl  w-[390px] h-[270px]  bg-opacity-80 backdrop-blur-sm">
                        <img
                            src={loginBannerImage}
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
                                    className="flex items-center text-[14px] text-white"
                                    style={{ fontFamily: 'Manrope' }}
                                >
                                    <CheckCircleIcon className="mr-2 h-5 w-5 text-white" />
                                    {service}
                                </li>
                            ))}
                        </ul>

                        <Button className="w-[157px] h-[32px] mt-3 rounded-md bg-white py-2 text-red-600 shadow-md hover:bg-gray-100">
                            Request Service
                        </Button>
                    </div>
                </div>

                {/* 🔐 Right Section - Login Form */}
                <div className="w-full mt-11 p-8 lg:w-1/2 flex flex-col items-center">
                    {/* Title */}
                    <h2 className="text-[24px] font-semibold text-redd leading-none font-manrope">
                        Login
                    </h2>

                    <p className="mt-2 text-gray-600 text-sm">Login to your account</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4 w-full max-w-[389px]">
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                            required
                            className="w-full h-[60px] rounded-[15px] border border-gray-300 border-opacity-100"
                        />

                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
                            rightIcon={
                                <button
                                    type="button"
                                    aria-label="Toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            }
                            required
                            className="w-full h-[60px] rounded-[15px] border border-gray-300"
                        />

                        {/* Status/Error messages */}
                        {status === 'loading' && <p className="text-blue-500">Logging in...</p>}
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full rounded-[15px] bg-redd py-3 text-white text-base shadow-md hover:bg-red-700"
                            disabled={status === 'loading'}
                        >
                            Login
                        </Button>
                    </form>

                    {/* Create Account */}
                    <Button
                        onClick={() => navigate('/register')}  // ✅ Change `/register` to your route
                        className="mt-4 w-full max-w-[389px] rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
                    >
                        Create Account
                    </Button>


                    {/* Forgot Password */}
                    <div className="mt-6 w-full max-w-[389px] text-center">
                        <a href="/forgot-password" className="text-redd text-sm hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
