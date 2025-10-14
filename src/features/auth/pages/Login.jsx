import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../authSlice';
import { setAuthTokens } from '../../../api/apiClient';
import useForm from '../../../hooks/useFrom'; // FIX: Corrected typo from useFrom to useForm
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';

import {
  useLoginUserMutation,
  useSendResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} from '../../../services/queries/authQueries';

import EnterEmailModal from '../../../components/models/EnterEmailModal';
import OtpInputModal from '../../../components/models/ResetPasswordModal';
import SetNewPasswordModal from '../../../components/models/SetNewPasswordModal';

import loginBannerImage from '../../../assets/images/login-banner.jpg';
import loginOverlayImage from '../../../assets/images/login-overlay.jpg';

import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Login = ({ onClose, onSwitchToRegister }) => {
  const { formData, handleChange } = useForm({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { push } = useToast();

  const [showEnterEmail, setShowEnterEmail] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSetNewPassword, setShowSetNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');

  const { mutate: loginUser, isLoading, isError, error } = useLoginUserMutation({
    onSuccess: (response) => {
      console.log("Login response:", response);
      const token = response.data?.token;
      const user = response.data?.user;
      const store = response.data?.store;

      if (token && user) {
        const userPayload = {
          ...user,
          store: store,
        };

        // ✅ THE FIX, PART 1: Save the correct user ID to local storage on successful login.
        // We know `userPayload.id` is correct here because it comes directly from the login API.
        localStorage.setItem('userId', userPayload.id);

        setAuthTokens({ accessToken: token });
        dispatch(loginSuccess({ token: token, user: userPayload }));
        push('Login successful!', { type: 'success' });
        onClose?.();
      } else {
        console.error('Login error: API response missing token, user, or store object.', response);
        push('Login failed: Invalid server response.', { type: 'error' });
      }
    },
    onError: (err) => {
      console.error('Login API error:', err);
    },
  });

  const { mutateAsync: sendCode, isLoading: isSendingCode } = useSendResetCodeMutation();
  const { mutateAsync: verifyCode, isLoading: isVerifyingCode } = useVerifyResetCodeMutation();
  const { mutateAsync: resetPassword, isLoading: isResetingPassword } = useResetPasswordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(formData);
  };

  const openReset = () => setShowEnterEmail(true);

  const handleEmailSubmit = async (email) => {
    try {
      await sendCode({ email });
      setResetEmail(email);
      setShowEnterEmail(false);
      setShowOtp(true);
      push('A verification code has been sent to your email.', { type: 'success' });
    } catch (err) {
      push(err.data?.message || 'Failed to send verification code.', { type: 'error' });
    }
  };

  // FIX: Add the handleResendCode logic
  const handleResendCode = async () => {
    try {
      await sendCode({ email: resetEmail });
      push('A new verification code has been sent to your email.', { type: 'success' });
      return true;
    } catch (err) {
      push(err.data?.message || 'Failed to resend verification code.', { type: 'error' });
      return false;
    }
  };

  const handleOtpConfirm = async (otp) => {
    try {
      // FIX: Change the key from 'code' to 'otp' to match $request->otp in PHP
      await verifyCode({ email: resetEmail, otp: otp });
      setResetOtp(otp);
      setShowOtp(false);
      setShowSetNewPassword(true);
      push('OTP verified successfully.', { type: 'success' });
    } catch (err) {
      push(err.data?.message || 'Invalid OTP. Please try again.', { type: 'error' });
    }
  };

  const handleNewPassword = async (password) => {
    try {
      await resetPassword({ email: resetEmail, code: resetOtp, password });
      setShowSetNewPassword(false);
      setResetEmail('');
      setResetOtp('');
      push('Password has been changed successfully. You can now log in.', { type: 'success' });
    } catch (err) {
      push(err.data?.message || 'Failed to reset password.', { type: 'error' });
    }
  };

  const closeAllResetModals = () => {
    setShowEnterEmail(false);
    setShowOtp(false);
    setShowSetNewPassword(false);
  };

  const dummyAddOnServices = ['Add on service 1', 'Add on service 2', 'Add on service 3', 'Add on service 4'];

  const apiError = error?.response?.data?.message || (isError ? 'Invalid email or password.' : '');

  return (
    <div
      className="relative flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl min-h-[600px] lg:h-[600px]"
      aria-busy={isLoading ? 'true' : 'false'}
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-700" aria-label="Close login modal">
        <XMarkIcon className="h-6 w-6" />
      </button>

      <div
        className="relative hidden lg:flex flex-col items-center justify-center p-8 text-white w-[436px]"
        style={{ backgroundImage: `url(${loginOverlayImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute top-[330px] left-[20px] z-20 flex flex-col items-start p-8 bg-red-shade rounded-2xl w-[390px] h-[270px] bg-opacity-80 backdrop-blur-sm">
          <img src={loginBannerImage} alt="Foreground graphic" className="absolute z-10 w-[250px] h-[200px] top-[83px] left-[141px] object-contain" />
          <h3 className="text-lg mb-2">
            Request various add-on services on{' '}
            <span className="text-white font-bold text-[28px]" style={{ fontFamily: 'Oleo Script' }}>Colala</span>
          </h3>
          <ul className="space-y-2">
            {dummyAddOnServices.map((service, index) => (
              <li key={index} className="flex items-center text-[14px] text-white" style={{ fontFamily: 'Manrope' }}>
                <CheckCircleIcon className="mr-2 h-5 w-5 text-white" />
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full mt-11 p-8 lg:w-1/2 flex flex-col items-center overflow-y-auto">
        <h2 id="auth-modal-title" className="text-[24px] font-semibold text-redd">Login</h2>
        <p className="mt-2 text-gray-600 text-sm">Login to your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 w-full max-w-[389px]" noValidate>
          <Input type="email" name="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />} autoComplete="email" required autoFocus className="w-full h-[60px] rounded-[15px] border border-gray-300" />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
              </button>
            }
            autoComplete="current-password"
            required
            className="w-full h-[60px] rounded-[15px] border border-gray-300"
          />

          {apiError && <p className="text-red-500 text-sm" role="alert">{apiError}</p>}

          <Button type="submit" className="w-full rounded-[15px] bg-redd py-3 text-white shadow-md hover:bg-red-700 disabled:opacity-60" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <Button type="button" onClick={onSwitchToRegister} className="mt-4 w-full max-w-[389px] rounded-[15px] border border-gray-300 bg-gray-100 py-3 text-gray-800 shadow-sm hover:bg-gray-200">
          Create Account
        </Button>

        <div className="mt-6 w-full max-w-[389px] text-center">
          <button onClick={openReset} className="text-sm text-redd">
            Forgot Password?
          </button>
        </div>
      </div>

      <EnterEmailModal isOpen={showEnterEmail} onEmailSubmit={handleEmailSubmit} onClose={closeAllResetModals} isProcessing={isSendingCode} />
      {/* FIX: Pass the handleResendCode function and the loading state */}
      <OtpInputModal
        isOpen={showOtp}
        onOtpConfirm={handleOtpConfirm}
        onClose={closeAllResetModals}
        email={resetEmail}
        isProcessing={isVerifyingCode}
        onResendCode={handleResendCode} // New prop for resending code
        isSendingCode={isSendingCode} // Pass the correct loading state
      />
      <SetNewPasswordModal isOpen={showSetNewPassword} onSetPassword={handleNewPassword} onClose={closeAllResetModals} isProcessing={isResetingPassword} />
    </div>
  );
};

export default Login;