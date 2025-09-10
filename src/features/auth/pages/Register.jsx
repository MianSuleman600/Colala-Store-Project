import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStepField, setLevelStep } from '../registrationSlice';

import { useRegisterUserMutation } from '../../../services/queries/authQueries';
import { useUpdateStoreProfileMutation } from '../../../services/mutations/storeProfileMutation';

import Button from '../../../components/ui/Button';

import Level1Form from '../pages/register/Level1';
import Level2Form from '../pages/register/Level2';
import Level3Form from '../pages/register/Level3';
import SuccessModal from '../../../components/models/SuccessModal';
import { useToast } from '../../../components/ui/ToastProvider';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

import registerBannerImage from '../../../assets/images/login-banner.jpg';
import registerOverlayImage from '../../../assets/images/login-overlay.jpg';

const Register = ({ onClose, onSwitchToLogin, mode = 'register' }) => {
  const dispatch = useDispatch();
  const { push } = useToast();
  const { formData, currentLevel, currentStep } = useSelector((s) => s.registration);

  const {
    mutate: registerUser,
    isSuccess: regOK,
    isError: regErr,
    error: regError,
  } = useRegisterUserMutation();

  const {
    mutate: updateStoreProfile,
    isSuccess: updOK,
    isError: updErr,
    error: updError,
  } = useUpdateStoreProfileMutation();

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (regOK || updOK) {
      setShowSuccess(true);
      push('Success! Your store was saved.', { type: 'success' });
    }
    if (regErr || updErr) {
      const err = regError || updError;
      console.error('❌ Mutation error:', err);
      push('Submission failed. Please try again.', { type: 'error' });
    }
  }, [regOK, updOK, regErr, updErr, regError, updError, push]);

  const handleSubmit = async (allData) => {
    setSubmitting(true);
    try {
      if (mode === 'register') {
        registerUser(allData);
      } else {
        updateStoreProfile({ userId: allData.userId, payload: allData });
      }
    } catch (err) {
      console.error('❌ handleSubmit error:', err);
      push('Unexpected error during submit.', { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e, level, step) =>
    dispatch(
      updateStepField({
        level,
        step,
        name: e.target.name,
        value: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      })
    );

  const handleFileChange = (e, level, step) =>
    dispatch(
      updateStepField({
        level,
        step,
        name: e.target.name,
        value: e.target.files?.[0] ?? null,
      })
    );

  const handleNext = (maybeFormData) => {
    if (currentLevel === 1 && currentStep < 3) {
      dispatch(setLevelStep({ level: 1, step: currentStep + 1 }));
    } else if (currentLevel === 1 && currentStep === 3) {
      dispatch(setLevelStep({ level: 2, step: 1 }));
    } else if (currentLevel === 2 && currentStep === 1) {
      dispatch(setLevelStep({ level: 2, step: 2 }));
    } else if (currentLevel === 2 && currentStep === 2) {
      dispatch(setLevelStep({ level: 3, step: 1 }));
    } else if (currentLevel === 3 && currentStep === 1) {
      dispatch(setLevelStep({ level: 3, step: 2 }));
    } else if (currentLevel === 3 && currentStep === 2) {
      handleSubmit(maybeFormData || formData);
    }
  };

  const handleBack = () => {
    if (currentLevel === 1 && currentStep > 1) {
      dispatch(setLevelStep({ level: 1, step: currentStep - 1 }));
    } else if (currentLevel === 2 && currentStep === 1) {
      dispatch(setLevelStep({ level: 1, step: 3 }));
    } else if (currentLevel === 2 && currentStep === 2) {
      dispatch(setLevelStep({ level: 2, step: 1 }));
    } else if (currentLevel === 3 && currentStep === 1) {
      dispatch(setLevelStep({ level: 2, step: 2 }));
    } else if (currentLevel === 3 && currentStep === 2) {
      dispatch(setLevelStep({ level: 3, step: 1 }));
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose?.();
  };

  let CurrentForm = null;

  if (currentLevel === 1) {
    CurrentForm = (
      <Level1Form
        mode={mode}
        activeStep={currentStep}
        formData={formData.level1[`step${currentStep}`]}
        handleChange={(e) => handleChange(e, 'level1', `step${currentStep}`)}
        handleFileChange={(e) => handleFileChange(e, 'level1', `step${currentStep}`)}
        onNext={handleNext}
        onBack={handleBack}
        onLoginClick={onSwitchToLogin}
      />
    );
  }

  if (currentLevel === 2) {
    CurrentForm = (
      <Level2Form
        mode={mode}
        activeStep={currentStep}
        formData={formData.level2[`step${currentStep}`]}
        handleChange={(e) => handleChange(e, 'level2', `step${currentStep}`)}
        handleFileChange={(e) => handleFileChange(e, 'level2', `step${currentStep}`)}
        onNext={handleNext}
        onBack={handleBack}
        onLoginClick={onSwitchToLogin}
      />
    );
  }

  if (currentLevel === 3) {
    CurrentForm = (
      <Level3Form
        mode={mode}
        activeStep={currentStep}
        formData={formData.level3[`step${currentStep}`]}
        handleChange={(e) => handleChange(e, 'level3', `step${currentStep}`)}
        handleFileChange={(e) => handleFileChange(e, 'level3', `step${currentStep}`)}
        onNext={(fd) => handleNext(fd)}
        onBack={handleBack}
        onLoginClick={onSwitchToLogin}
      />
    );
  }

  return (
    <>
      <div
        className="relative flex w-full max-w-4xl rounded-2xl overflow-hidden bg-white shadow-xl max-h-[90vh]"
        aria-busy={submitting ? 'true' : 'false'}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-700" aria-label="Close register modal" >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Left Panel */}
        <div
          className="hidden lg:flex w-1/2 relative justify-center items-center text-white"
          style={{
            backgroundImage: `url(${registerOverlayImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute bottom-0 mb-5 p-8 bg-red-shade overflow-hidden bg-opacity-80 rounded-2xl w-3/4 h-[270px] backdrop-blur-sm">
            <img
              src={registerBannerImage}
              alt="banner"
              className="absolute w-[200px] h-[200px] -bottom-5 left-[141px] object-contain"
            />
            <h4 className="text-[14px]">
              Request add-on services on <br />
              <span className="font-bold text-[20px]" style={{ fontFamily: "'Oleo Script', cursive" }}>
                Colala
              </span>
            </h4>
            <ul className="space-y-2 text-sm mt-3">
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2" /> Extra delivery zones
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2" /> Store themes
              </li>
              <li className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2" /> Marketing boosts
              </li>
            </ul>
            <Button className="mt-3 bg-white text-red-600 rounded-md py-1 px-4">Request Service</Button>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 overflow-y-auto relative p-8">
          <h2 id="auth-modal-title" className="text-[24px] text-center font-semibold text-redd">
            {mode === 'register' ? 'Register' : 'Upgrade Store'}
          </h2>
          <p className="mt-2 text-gray-600 text-center text-sm">
            {mode === 'register' ? 'Create a free account today' : 'Update your store details'}
          </p>

          

          {CurrentForm}
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          onClose={handleCloseSuccess}
          title={mode === 'register' ? "Registration Successful!" : "Profile Updated!"}
          message={mode === 'register' ? "Your store has been registered." : "Your store profile has been updated."}
        />
      )}
    </>
  );
};

export default Register;