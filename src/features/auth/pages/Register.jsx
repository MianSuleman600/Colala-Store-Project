import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateStepField, setLevelStep } from '../registrationSlice'; 
import { loginSuccess } from '../authSlice';
import { setAuthTokens } from '../../../api/apiClient';

import {
  useStartSellerRegistrationMutation,
  useSubmitL1ProfileMediaMutation,
  useSubmitL1CategoriesSocialMutation,
  useSubmitL2BusinessDetailsMutation,
  useSubmitL2DocumentsMutation,
  useSubmitL3PhysicalStoreMutation,
  useSubmitL3AddressMutation,
  useSubmitL3DeliveryMutation,
  useSubmitL3ThemeMutation,
} from '../../../services/mutations/onboardingMutations';

import Level1Form from './register/Level1';
import Level2Form from './register/Level2';
import Level3Form from './register/Level3';

import SuccessModal from '../../../components/models/SuccessModal';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import registerBannerImage from '../../../assets/images/login-banner.jpg';
import registerOverlayImage from '../../../assets/images/login-overlay.jpg';
import Button from '../../../components/ui/Button';

const Register = ({ onClose, onSwitchToLogin, mode = 'register' }) => {
  const dispatch = useDispatch();
  const { formData, currentLevel, currentStep } = useSelector((s) => s.registration);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutateAsync: startRegistration } = useStartSellerRegistrationMutation();
  const { mutateAsync: submitL1ProfileMedia } = useSubmitL1ProfileMediaMutation();
  const { mutateAsync: submitL1CategoriesSocial } = useSubmitL1CategoriesSocialMutation();
  const { mutateAsync: submitL2BusinessDetails } = useSubmitL2BusinessDetailsMutation();
  const { mutateAsync: submitL2Documents } = useSubmitL2DocumentsMutation();
  const { mutateAsync: submitL3PhysicalStore } = useSubmitL3PhysicalStoreMutation();
  const { mutateAsync: submitL3Address } = useSubmitL3AddressMutation();
  const { mutateAsync: submitL3Delivery } = useSubmitL3DeliveryMutation();
  const { mutateAsync: submitL3Theme } = useSubmitL3ThemeMutation();

  const handleStep1Submit = async () => {
    setIsSubmitting(true);
    try {
      const stepData = formData.level1.step1;
      const payload = {
        store_name: stepData.storeName, store_location: stepData.storeLocation,
        store_email: stepData.email, store_phone: stepData.phoneNumber,
        password: stepData.password, referral_code: stepData.referralCode,
      };
      if (mode === 'register') {
        const response = await startRegistration(payload);
        if (response.token) {
          const temporaryUser = {
            full_name: stepData.storeName, email: stepData.email,
            phone: stepData.phoneNumber, role: 'seller'
          };
          setAuthTokens({ accessToken: response.token });
          dispatch(loginSuccess({ token: response.token, user: temporaryUser }));
          dispatch(setLevelStep({ level: 1, step: 2 }));
        } else { console.error('❌ Registration API did not return a token.', response); }
      } else { dispatch(setLevelStep({ level: 1, step: 2 })); }
    } catch (error) { console.error('❌ Step 1 submission error:', error); } 
    finally { setIsSubmitting(false); }
  };

  const handleStep2Submit = async () => {
    setIsSubmitting(true);
    try {
      const stepData = formData.level1.step2;
      const apiFormData = new FormData();
      if (stepData.profilePicture) apiFormData.append('profile_image', stepData.profilePicture);
      if (stepData.storeBanner) apiFormData.append('banner_image', stepData.storeBanner);
      if (apiFormData.has('profile_image') || apiFormData.has('banner_image')) {
        await submitL1ProfileMedia(apiFormData);
      }
      dispatch(setLevelStep({ level: 1, step: 3 }));
    } catch (error) { console.error('❌ Step 2 submission error:', error); } 
    finally { setIsSubmitting(false); }
  };

  const handleStep3Submit = async () => {
    setIsSubmitting(true);
    try {
      const stepData = formData.level1.step3;
      const socialLinks = [
        { type: 'whatsapp', url: stepData.whatsapp }, { type: 'instagram', url: stepData.instagram },
        { type: 'facebook', url: stepData.facebook }, { type: 'twitter', url: stepData.twitter },
      ].filter(link => link.url && link.url.trim() !== '');
      const payload = { categories: stepData.categories, social_links: socialLinks };
      await submitL1CategoriesSocial(payload);
      dispatch(setLevelStep({ level: 2, step: 1 }));
    } catch (error) { console.error('❌ Step 3 submission error:', error); } 
    finally { setIsSubmitting(false); }
  };

  const handleStep4Submit = async () => {
    setIsSubmitting(true);
    try {
      const stepData = formData.level2.step1;
      const payload = {
        registered_name: stepData.businessName, business_type: stepData.businessType,
        nin_number: stepData.ninNumber, cac_number: stepData.cacNumber,
      };
      await submitL2BusinessDetails(payload);
      dispatch(setLevelStep({ level: 2, step: 2 }));
    } catch (error) { console.error('❌ Step 4 submission error:', error); } 
    finally { setIsSubmitting(false); }
  };

  const handleStep5Submit = async () => {
    setIsSubmitting(true);
    try {
      const stepData = formData.level2.step2;
      const apiFormData = new FormData();
      if (stepData.ninSlip) apiFormData.append('nin_document', stepData.ninSlip);
      if (stepData.cacCertificate) apiFormData.append('cac_document', stepData.cacCertificate);
      if (apiFormData.has('nin_document') || apiFormData.has('cac_document')) {
         await submitL2Documents(apiFormData);
      }
      dispatch(setLevelStep({ level: 3, step: 1 }));
    } catch (error) { console.error('❌ Step 5 submission error:', error); } 
    finally { setIsSubmitting(false); }
  };

  const handleStep6Submit = async () => {
    setIsSubmitting(true);
    try {
      const stepData = formData.level3.step1;
      const dataPayload = { has_physical_store: stepData.hasPhysicalStore ? 1 : 0 };
      await submitL3PhysicalStore(dataPayload);
      if (stepData.storeVideo) {
        const videoFormData = new FormData();
        videoFormData.append('store_video', stepData.storeVideo);
        await submitL3PhysicalStore(videoFormData);
      }
      dispatch(setLevelStep({ level: 3, step: 2 }));
    } catch (error) {
      console.error('❌ Step 6 submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep7Submit = async () => {
    setIsSubmitting(true);
    try {
      const stepData = formData.level3.step2;
      const promisesToRun = [];

      if (stepData.storeAddress) {
        const addressPayload = {
          state: stepData.storeAddress.state,
          local_government: stepData.storeAddress.localGovernment,
          full_address: stepData.storeAddress.fullAddress,
          is_main: stepData.storeAddress.is_main ? 1 : 0,
          opening_hours: stepData.storeAddress.openingHours || [],
        };
        promisesToRun.push(submitL3Address(addressPayload));
      }

      // ✅ FINAL FIX: The data transformation from camelCase to snake_case is applied here.
      if (stepData.deliveryPricing?.length) {
        for (const delivery of stepData.deliveryPricing) {
          const deliveryPayload = {
            state: delivery.state,
            local_government: delivery.localGovernment, // Mismatch fixed
            variant: delivery.variant,
            price: delivery.deliveryFee || 0,
            is_free: delivery.markForFreeDelivery ? 1 : 0,
          };
          promisesToRun.push(submitL3Delivery(deliveryPayload));
        }
      }
      
      if (stepData.selectedColor) {
        promisesToRun.push(submitL3Theme({ theme_color: stepData.selectedColor }));
      }
      
      await Promise.all(promisesToRun);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('❌ Step 7 submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    if (currentLevel === 1 && currentStep > 1) dispatch(setLevelStep({ level: 1, step: currentStep - 1 }));
    else if (currentLevel === 2 && currentStep === 1) dispatch(setLevelStep({ level: 1, step: 3 }));
    else if (currentLevel === 2 && currentStep === 2) dispatch(setLevelStep({ level: 2, step: 1 }));
    else if (currentLevel === 3 && currentStep === 1) dispatch(setLevelStep({ level: 2, step: 2 }));
    else if (currentLevel === 3 && currentStep === 2) dispatch(setLevelStep({ level: 3, step: 1 }));
  };

  const handleCloseSuccess = () => { setShowSuccessModal(false); onClose?.(); };

  const handleChange = (e, level, step) => dispatch(updateStepField({ level, step, name: e.target.name, value: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const handleFileChange = (e, level, step) => dispatch(updateStepField({ level, step, name: e.target.name, value: e.target.files?.[0] ?? null }));

  const renderCurrentForm = () => {
    const commonProps = { mode, onBack: handleBack, onLoginClick: onSwitchToLogin, isSubmitting };
    const levelKey = `level${currentLevel}`;
    const stepKey = `step${currentStep}`;

    if (currentLevel === 1) {
      let onNextHandler = currentStep === 1 ? handleStep1Submit : currentStep === 2 ? handleStep2Submit : handleStep3Submit;
      return <Level1Form {...commonProps} onNext={onNextHandler} activeStep={currentStep} formData={formData.level1[stepKey]} handleChange={(e) => handleChange(e, levelKey, stepKey)} handleFileChange={(e) => handleFileChange(e, levelKey, stepKey)} />;
    }
    if (currentLevel === 2) {
      let onNextHandler = currentStep === 1 ? handleStep4Submit : handleStep5Submit;
      return <Level2Form {...commonProps} onNext={onNextHandler} activeStep={currentStep} formData={formData.level2[stepKey]} handleChange={(e) => handleChange(e, levelKey, stepKey)} handleFileChange={(e) => handleFileChange(e, levelKey, stepKey)} />;
    }
    if (currentLevel === 3) {
      let onNextHandler = currentStep === 1 ? handleStep6Submit : handleStep7Submit;
      return <Level3Form {...commonProps} onNext={onNextHandler} activeStep={currentStep} formData={formData.level3[stepKey]} handleChange={(e) => handleChange(e, levelKey, stepKey)} handleFileChange={(e) => handleFileChange(e, levelKey, stepKey)} />;
    }
    return null;
  };

  return (
    <>
      <div className="relative flex w-full max-w-4xl rounded-2xl overflow-hidden bg-white shadow-xl max-h-[90vh]" aria-busy={isSubmitting}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-700"><XMarkIcon className="h-6 w-6" /></button>
        <div className="hidden lg:flex w-1/2 relative justify-center items-center text-white" style={{ backgroundImage: `url(${registerOverlayImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute bottom-0 mb-5 p-8 bg-[#921313] bg-opacity-60 rounded-2xl w-3/4 h-[270px] backdrop-blur-sm">
            <img src={registerBannerImage} alt="banner" className="absolute w-[200px] h-[200px] -bottom-5 left-[141px] object-contain" />
            <h4 className="text-[14px]">Request add-on services on <br /><span className="font-bold text-[20px]" style={{ fontFamily: "'Oleo Script', cursive" }}>Colala</span></h4>
            <ul className="space-y-2 text-sm mt-3">
              <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" /> Extra delivery zones</li>
              <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" /> Store themes</li>
              <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" /> Marketing boosts</li>
            </ul>
            <Button className="mt-3 bg-white text-red-600 rounded-md py-1 px-4">Request Service</Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto relative p-8">
          <h2 className="text-[24px] text-center font-semibold text-gray-800">{mode === 'register' ? 'Register' : 'Upgrade Store'}</h2>
          <p className="mt-2 text-gray-600 text-center text-sm">{mode === 'register' ? 'Create a free account today' : 'Update your store details'}</p>
          {renderCurrentForm()}
        </div>
      </div>
      {showSuccessModal && <SuccessModal title="Registration Completed" description="Your store has been successfully registered!" onClose={handleCloseSuccess} />}
    </>
  );
};

export default Register;