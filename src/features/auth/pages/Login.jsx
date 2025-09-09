import React, { useState } from 'react';
import useForm from '../../../hooks/useFrom'; // If your file is actually useForm.js, update this path
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useLoginUserMutation } from '../../../services/queries/authQueries';

import EnterEmailModal from '../../../components/models/EnterEmailModal';
import OtpInputModal from '../../../components/models/ResetPasswordModal';
import SetNewPasswordModal from '../../../components/models/SetNewPasswordModal';

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

const Login = ({ onClose, onSwitchToRegister }) => {
  const { formData, handleChange } = useForm({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Reset password modal states
  const [showEnterEmail, setShowEnterEmail] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSetNewPassword, setShowSetNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');

  const { mutate: loginUser, isLoading, isError, error } = useLoginUserMutation({
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      window.dispatchEvent(
        new CustomEvent('SHOW_ALERT', {
          detail: { type: 'success', message: 'Login successful!' },
        })
      );
      onClose?.();
    },
    onError: (err) => {
      console.error('Login error:', err);
      window.dispatchEvent(
        new CustomEvent('SHOW_ALERT', {
          detail: { type: 'error', message: 'Login failed. Please try again.' },
        })
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData);
  };

  // Reset password handlers
  const openReset = () => setShowEnterEmail(true);
  const submitEmail = (email) => {
    setResetEmail(email);
    setShowEnterEmail(false);
    setShowOtp(true);
  };
  const confirmOtp = (otp) => {
    setResetOtp(otp);
    setShowOtp(false);
    setShowSetNewPassword(true);
  };
  const setNewPw = (pw) => {
    setShowSetNewPassword(false);
    setResetEmail('');
    setResetOtp('');
    window.dispatchEvent(
      new CustomEvent('SHOW_ALERT', {
        detail: { type: 'success', message: 'Password reset successful.' },
      })
    );
  };
  const closeAll = () => {
    setShowEnterEmail(false);
    setShowOtp(false);
    setShowSetNewPassword(false);
  };

  const dummyAddOnServices = ['Add on service 1', 'Add on service 2', 'Add on service 3', 'Add on service 4'];

  const apiError =
    error?.response?.data?.message ||
    error?.message ||
    (isError ? 'Login failed' : '');

  return (
    <div
      className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl min-h-[600px] lg:h-[600px]"
      aria-busy={isLoading ? 'true' : 'false'}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-700"
        aria-label="Close login modal"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      {/* Left Section */}
      <div
        className="relative hidden lg:flex flex-col items-center justify-center p-8 text-white w-[436px]"
        style={{
          backgroundImage: `url(${loginOverlayImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-[330px] left-[20px] z-20 flex flex-col items-start p-8 bg-red-shade rounded-2xl w-[390px] h-[270px] bg-opacity-80 backdrop-blur-sm">
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
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full mt-11 p-8 lg:w-1/2 flex flex-col items-center overflow-y-auto">
        <h2 id="auth-modal-title" className="text-[24px] font-semibold text-redd">
          Login
        </h2>
        <p className="mt-2 text-gray-600 text-sm">Login to your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 w-full max-w-[389px]" noValidate>
          <Input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
            autoComplete="email"
            required
            autoFocus
            className="w-full h-[60px] rounded-[15px] border border-gray-300"
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            }
            autoComplete="current-password"
            required
            className="w-full h-[60px] rounded-[15px] border border-gray-300"
          />

          {apiError ? (
            <p className="text-red-500 text-sm" role="alert">
              {apiError}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full rounded-[15px] bg-redd py-3 text-white shadow-md hover:bg-red-700 disabled:opacity-60"
            disabled={isLoading}
            aria-disabled={isLoading ? 'true' : 'false'}
          >
            {isLoading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <Button
          type="button"
          onClick={onSwitchToRegister}
          className="mt-4 w-full max-w-[389px] rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200"
        >
          Create Account
        </Button>

        <div className="mt-6 w-full max-w-[389px] text-center">
          <button onClick={openReset} className="text-sm text-redd">
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Reset Password Modals */}
      <EnterEmailModal isOpen={showEnterEmail} onEmailSubmit={submitEmail} onClose={closeAll} />
      <OtpInputModal isOpen={showOtp} onOtpConfirm={confirmOtp} onClose={closeAll} email={resetEmail} />
      <SetNewPasswordModal isOpen={showSetNewPassword} onSetPassword={setNewPw} onClose={closeAll} />
    </div>
  );
};

export default Login;