import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import Level1Form from '../auth/pages/register/Level1';
import Level2Form from '../auth/pages/register/Level2';
import Level3Form from '../auth/pages/register/Level3';

import CircularProgress from '../../components/ui/CircularProgress';
import SuccessModal from '../../components/models/SuccessModal';
import ErrorModal from '../../components/models/ErrorModal';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/ToastProvider';

import { updateStepField, setLevelStep, loadFormData } from '../auth/registrationSlice';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { getContrastTextColor } from '../../utils/colorUtils';
import { computeProgressBreakdown, REQUIRED_FIELDS } from '../../utils/progress';

import {
  useSubmitL1ProfileMediaMutation,
  useSubmitL1CategoriesSocialMutation,
  useSubmitL2BusinessDetailsMutation,
  useSubmitL2DocumentsMutation,
  useSubmitL3PhysicalStoreMutation,
  useSubmitL3AddressMutation,
  useSubmitL3DeliveryMutation,
  useSubmitL3ThemeMutation,
  useSubmitL3UtilityBillMutation,
} from '../../services/mutations/onboardingMutations';

const stepsPerLevel = { 1: 3, 2: 2, 3: 5 };
const formsMap = { 1: Level1Form, 2: Level2Form, 3: Level3Form };

const UpgradeStorePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { push } = useToast();
  const queryClient = useQueryClient();

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const { formData, currentLevel, currentStep } = useSelector((state) => state.registration);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  const { data: storeProfile, isLoading: isProfileLoading } = useStoreProfile(userId, { enabled: !!userId });

  const { mutateAsync: submitL1ProfileMedia } = useSubmitL1ProfileMediaMutation();
  const { mutateAsync: submitL1CategoriesSocial } = useSubmitL1CategoriesSocialMutation();
  const { mutateAsync: submitL2BusinessDetails } = useSubmitL2BusinessDetailsMutation();
  const { mutateAsync: submitL2Documents } = useSubmitL2DocumentsMutation();
  const { mutateAsync: submitL3PhysicalStore } = useSubmitL3PhysicalStoreMutation();
  const { mutateAsync: submitL3UtilityBill } = useSubmitL3UtilityBillMutation();
  const { mutateAsync: submitL3Address } = useSubmitL3AddressMutation();
  const { mutateAsync: submitL3Delivery } = useSubmitL3DeliveryMutation();
  const { mutateAsync: submitL3Theme } = useSubmitL3ThemeMutation();

  // Prefill store profile data
  useEffect(() => {
    if (storeProfile && !prefilled) {
      const p = storeProfile;
      const initialData = {
        level1: {
          step1: { storeName: p.name || '', storeLocation: p.location || '', email: p.email || '', phoneNumber: p.phone || '' },
          step2: { profilePicture: p.profilePictureUrl || null, storeBanner: p.bannerImageUrl || null },
          step3: { categories: p.categories?.map(c => c.id) || [], whatsapp: p.socialLinks?.find(s => s.type === 'whatsapp')?.url || '', instagram: p.socialLinks?.find(s => s.type === 'instagram')?.url || '', facebook: p.socialLinks?.find(s => s.type === 'facebook')?.url || '', twitter: p.socialLinks?.find(s => s.type === 'twitter')?.url || '' },
        },
        level2: {
          step1: { businessName: p.business?.registered_name || '', businessType: p.business?.business_type || '', ninNumber: p.business?.nin_number || '', cacNumber: p.business?.cac_number || '' },
          step2: { ninSlip: p.business?.nin_document_url || null, cacCertificate: p.business?.cac_document_url || null },
        },
        level3: {
          step1: { hasPhysicalStore: !!p.business?.has_physical_store, storeVideo: p.business?.store_video_url || null },
          step2: { storeAddress: p.addresses?.[0] || {} },
          step3: { deliveryPricing: p.delivery || [] },
          step4: { utilityBill: p.business?.utility_bill_url || null },
          step5: { selectedColor: p.brandColor || '#EF4444' },
        }
      };
      dispatch(loadFormData(initialData));
      setPrefilled(true);
    }
  }, [storeProfile, prefilled, dispatch]);

  const brandColor = useMemo(() => formData?.level3?.step5?.selectedColor || storeProfile?.brandColor || '#EF4444', [formData, storeProfile]);
  const contrastColor = useMemo(() => getContrastTextColor(brandColor), [brandColor]);

  const liveProgress = useMemo(() => computeProgressBreakdown(formData, REQUIRED_FIELDS), [formData]);
  const profileCompletion = liveProgress.overallPercentage;
  const levelsProgress = useMemo(() => [1, 2, 3].map(id => ({ id, title: `Level ${id}`, completion: liveProgress.byLevel[id]?.percentage || 0 })), [liveProgress]);

  // ---------------- Change Handlers ----------------
  const handleChange = useCallback((level, step) => (e) => {
    const { name, type, checked, value } = e.target;
    dispatch(updateStepField({ level, step, name, value: type === 'checkbox' ? checked : value }));
  }, [dispatch]);

  const handleFileChange = useCallback((level, step) => (e) => {
    dispatch(updateStepField({ level, step, name: e.target.name, value: e.target.files?.[0] ?? null }));
  }, [dispatch]);

  // ---------------- Step Submission ----------------
  const handleSubmitCurrentStep = useCallback(async () => {
    const levelKey = `level${currentLevel}`;
    const stepKey = `step${currentStep}`;
    const stepData = formData[levelKey][stepKey];
    let submissionPromise;

    try {
      setIsSubmitting(true);

      if (levelKey === 'level1' && stepKey === 'step2') {
        const payload = new FormData();
        if (stepData.profilePicture instanceof File) payload.append('profile_image', stepData.profilePicture);
        if (stepData.storeBanner instanceof File) payload.append('banner_image', stepData.storeBanner);
        if (payload.has('profile_image') || payload.has('banner_image')) submissionPromise = submitL1ProfileMedia(payload);
      } else if (levelKey === 'level1' && stepKey === 'step3') {
        const socialLinks = [
          { type: 'whatsapp', url: stepData.whatsapp },
          { type: 'instagram', url: stepData.instagram },
          { type: 'facebook', url: stepData.facebook },
          { type: 'twitter', url: stepData.twitter }
        ].filter(l => l.url);
        submissionPromise = submitL1CategoriesSocial({ categories: stepData.categories, social_links: socialLinks });
      } else if (levelKey === 'level2' && stepKey === 'step1') {
        submissionPromise = submitL2BusinessDetails({ registered_name: stepData.businessName, business_type: stepData.businessType, nin_number: stepData.ninNumber, cac_number: stepData.cacNumber });
      } else if (levelKey === 'level2' && stepKey === 'step2') {
        const payload = new FormData();
        if (stepData.ninSlip instanceof File) payload.append('nin_document', stepData.ninSlip);
        if (stepData.cacCertificate instanceof File) payload.append('cac_document', stepData.cacCertificate);
        if (payload.has('nin_document') || payload.has('cac_document')) submissionPromise = submitL2Documents(payload);
      } else if (levelKey === 'level3' && stepKey === 'step1') {
        submissionPromise = submitL3PhysicalStore({ has_physical_store: stepData.hasPhysicalStore ? 1 : 0 });
        if (stepData.storeVideo instanceof File) {
          const videoForm = new FormData();
          videoForm.append('store_video', stepData.storeVideo);
          await submitL3PhysicalStore(videoForm);
        }
      } else if (levelKey === 'level3' && stepKey === 'step2') {
        if (stepData.storeAddress) submissionPromise = submitL3Address(stepData.storeAddress);
      } else if (levelKey === 'level3' && stepKey === 'step3') {
        if (stepData.deliveryPricing?.length) {
          const promises = stepData.deliveryPricing.map(d => submitL3Delivery(d));
          await Promise.all(promises);
        }
      } else if (levelKey === 'level3' && stepKey === 'step4') {
        if (stepData.utilityBill instanceof File) submissionPromise = submitL3UtilityBill(stepData.utilityBill);
      } else if (levelKey === 'level3' && stepKey === 'step5') {
        submissionPromise = submitL3Theme({ theme_color: stepData.selectedColor });
      }

      if (submissionPromise) await submissionPromise;

      push('Step saved!', { type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['storeProfile', userId] });
    } catch (error) {
      const message = error.message || 'Failed to save step.';
      setModalErrorMessage(message);
      setShowErrorModal(true);
      push(message, { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentLevel, currentStep, formData, push, queryClient, userId, submitL1ProfileMedia, submitL1CategoriesSocial, submitL2BusinessDetails, submitL2Documents, submitL3PhysicalStore, submitL3Address, submitL3Delivery, submitL3UtilityBill, submitL3Theme]);

  // ---------------- Navigation ----------------
  const handleNext = async () => {
    await handleSubmitCurrentStep();
    const nextStep = currentStep + 1;
    if (nextStep <= stepsPerLevel[currentLevel]) dispatch(setLevelStep({ level: currentLevel, step: nextStep }));
    else if (currentLevel < 3) dispatch(setLevelStep({ level: currentLevel + 1, step: 1 }));
    else setShowSuccessModal(true);
  };

  const handleBack = () => {
    if (currentStep > 1) dispatch(setLevelStep({ level: currentLevel, step: currentStep - 1 }));
    else if (currentLevel > 1) dispatch(setLevelStep({ level: currentLevel - 1, step: stepsPerLevel[currentLevel - 1] }));
  };

  const CurrentFormComponent = formsMap[currentLevel];
  const currentFormData = formData?.[`level${currentLevel}`]?.[`step${currentStep}`] || {};

  if (isProfileLoading) return <div className="p-8 text-center">Loading your store details...</div>;
  if (!user) return <div className="p-8 text-center">Please log in to upgrade your store.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8">
      <div className="relative flex w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <aside className="hidden lg:flex flex-col w-[350px] p-8 border-r">
          <h1 className="text-3xl font-bold mb-6">Upgrade Store</h1>
          {levelsProgress.map((lvl) => (
            <div key={lvl.id} className={`p-4 border rounded-2xl mb-4 ${currentLevel === lvl.id ? 'ring-2' : ''}`} style={{ '--tw-ring-color': brandColor }}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{lvl.title}</h2>
                <CircularProgress percentage={lvl.completion} color={brandColor} />
              </div>
              <p className="text-lg font-bold" style={{ color: brandColor }}>{lvl.completion}%</p>
              <Button className="w-full mt-3 py-3" style={{ backgroundColor: brandColor, color: contrastColor }} onClick={() => dispatch(setLevelStep({ level: lvl.id, step: 1 }))}>View Details</Button>
            </div>
          ))}
        </aside>

        <main className="flex-1 p-6 md:p-8 flex flex-col">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="h-4 rounded-full" style={{ width: `${profileCompletion}%`, backgroundColor: brandColor }} />
          </div>
          <p className="text-center text-sm mt-2">{profileCompletion}% Complete</p>
          <div className="mt-6 w-full flex-1">
            <CurrentFormComponent
              mode="upgrade"
              activeStep={currentStep}
              formData={currentFormData}
              handleChange={handleChange(`level${currentLevel}`, `step${currentStep}`)}
              handleFileChange={handleFileChange(`level${currentLevel}`, `step${currentStep}`)}
              onNext={handleNext}
              onBack={handleBack}
              brandColor={brandColor}
              contrastColor={contrastColor}
              isSubmitting={isSubmitting}
            />
          </div>
        </main>
      </div>

      {showSuccessModal && <SuccessModal onClose={() => { setShowSuccessModal(false); navigate('/'); }} title="Profile Updated!" message="Your store profile was successfully updated." />}
      {showErrorModal && <ErrorModal message={modalErrorMessage} onClose={() => setShowErrorModal(false)} />}
    </div>
  );
};

export default UpgradeStorePage;
