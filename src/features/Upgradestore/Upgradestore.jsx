// src/features/Upgradestore/Upgradestore.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Level1Form from '../auth/pages/register/Level1';
import Level2Form from '../auth/pages/register/Level2';
import Level3Form from '../auth/pages/register/Level3';

import CircularProgress from '../../components/ui/CircularProgress';
import SuccessModal from '../../components/models/SuccessModal';
import ErrorModal from '../../components/models/ErrorModal';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/ToastProvider';

import { updateStepField, setLevelStep } from '../auth/registrationSlice';
import { useStoreProfile } from '../../services/queries/storeProfileQuery';
import { useUpdateStoreProfileMutation } from '../../services/mutations/storeProfileMutation';
import { getContrastTextColor } from '../../utils/colorUtils';
import { computeProgressBreakdown, REQUIRED_FIELDS } from '../../utils/progress';

const stepsPerLevel = { 1: 3, 2: 2, 3: 2 };
const formsMap = { 1: Level1Form, 2: Level2Form, 3: Level3Form };

const UpgradeStorePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { push } = useToast();

  const { userId, isLoggedIn } = useSelector((s) => s.user);
  const { formData, profileCompletion, currentLevel, currentStep } = useSelector((s) => s.registration);

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [prefilled, setPrefilled] = useState(false);

  // Fetch current profile
  const {
    data: currentStoreProfile,
    isLoading: isProfileLoading,
    refetch,
  } = useStoreProfile(userId, {
    enabled: isLoggedIn && !!userId,
  });

  const {
    mutate: updateStoreProfile,
    isSuccess: updOK,
    isError: updErr,
    error: updError,
    isLoading: isUpdating,
  } = useUpdateStoreProfileMutation();

  // Mutation status -> toasts + modals
  useEffect(() => {
    if (updOK) {
      push('Profile updated successfully.', { type: 'success' });
      setShowSuccessModal(true);
      refetch?.();
    }
    if (updErr) {
      const msg = updError?.message || 'Submission failed. Please try again.';
      push(msg, { type: 'error' });
      setModalErrorMessage(msg);
      setShowErrorModal(true);
      console.error('❌ Update mutation error:', updError);
    }
  }, [updOK, updErr, updError, refetch, push]);

  // Prefill from current profile so all levels show existing data
  useEffect(() => {
    if (!currentStoreProfile || prefilled) return;

    const p = currentStoreProfile;

    // Level 1 - Step 1
    [
      ['storeName', p.storeName || ''],
      ['storeLocation', p.location || ''],
      ['email', p.email || ''],
      ['phoneNumber', p.phoneNumber || ''],
      ['referralCode', p.referralCode || ''],
    ].forEach(([name, value]) =>
      dispatch(updateStepField({ level: 'level1', step: 'step1', name, value }))
    );

    // Level 1 - Step 2
    [
      ['profilePicture', p.profilePictureUrl || ''],
      ['storeBanner', p.bannerImageUrl || ''],
    ].forEach(([name, value]) =>
      dispatch(updateStepField({ level: 'level1', step: 'step2', name, value }))
    );

    // Level 1 - Step 3
    [
      ['categories', p.categories || []],
      ['whatsapp', p.whatsapp || ''],
      ['instagram', p.instagram || ''],
      ['facebook', p.facebook || ''],
      ['twitter', p.twitter || ''],
    ].forEach(([name, value]) =>
      dispatch(updateStepField({ level: 'level1', step: 'step3', name, value }))
    );

    // Level 2 - Step 1
    [
      ['businessName', p.businessName || ''],
      ['businessType', p.businessType || ''],
      ['ninNumber', p.ninNumber || ''],
      ['cacNumber', p.cacNumber || ''],
    ].forEach(([name, value]) =>
      dispatch(updateStepField({ level: 'level2', step: 'step1', name, value }))
    );

    // Level 2 - Step 2
    [
      ['ninSlip', p.ninSlipUrl || ''],
      ['cacCertificate', p.cacCertificateUrl || ''],
    ].forEach(([name, value]) =>
      dispatch(updateStepField({ level: 'level2', step: 'step2', name, value }))
    );

    // Level 3 - Step 1
    [
      ['hasPhysicalStore', !!p.hasPhysicalStore],
      ['storeVideo', p.storeVideoUrl || ''],
    ].forEach(([name, value]) =>
      dispatch(updateStepField({ level: 'level3', step: 'step1', name, value }))
    );

    // Level 3 - Step 2
    const storeAddress = p.storeAddress || { state: '', localGovernment: '', fullAddress: '', openingHours: [] };
    const deliveryPricing = p.deliveryPricing || [];
    [
      ['storeAddress', storeAddress],
      ['deliveryPricing', deliveryPricing],
      ['selectedColor', p.brandColor || '#EF4444'],
    ].forEach(([name, value]) =>
      dispatch(updateStepField({ level: 'level3', step: 'step2', name, value }))
    );

    setPrefilled(true);
  }, [currentStoreProfile, prefilled, dispatch]);

  // Prefer selected color from form; fallback profile; else default
  const brandColor =
    formData?.level3?.step2?.selectedColor ||
    currentStoreProfile?.brandColor ||
    '#EF4444';
  const contrastColor = getContrastTextColor(brandColor);

  // Sidebar progress
  const progress = useMemo(
    () => computeProgressBreakdown(formData, REQUIRED_FIELDS),
    [formData]
  );

  const levelsProgress = useMemo(() => {
    return [1, 2, 3].map((id) => {
      const key = `level${id}`;
      const lvl = progress.byLevel[id] || { completed: 0, total: 0, percentage: 0 };
      const steps = Object.keys(formData?.[key] || {}).length || stepsPerLevel[id];
      return {
        id,
        title: `Level ${id}`,
        completion: lvl.percentage,
        completed: lvl.completed,
        total: lvl.total,
        steps,
      };
    });
  }, [progress, formData]);

  // --- Handlers ---
  const handleSubmit = useCallback(
    async (allData) => {
      if (!isLoggedIn || !userId) return;
      setSubmitting(true);
      try {
        // Upgrade uses updateStoreProfile (does not affect "number of registered users")
        updateStoreProfile({ userId, payload: allData || formData });
      } catch (err) {
        console.error('❌ handleSubmit error:', err);
        const msg = 'An unknown error occurred.';
        push(msg, { type: 'error' });
        setModalErrorMessage(msg);
        setShowErrorModal(true);
      } finally {
        setSubmitting(false);
      }
    },
    [isLoggedIn, userId, formData, updateStoreProfile, push]
  );

  const handleChange = (e, level, step) => {
    const { name, type, checked, value } = e.target;
    dispatch(
      updateStepField({
        level,
        step,
        name,
        value: type === 'checkbox' ? checked : value,
      })
    );
  };

  const handleFileChange = (e, level, step) => {
    dispatch(
      updateStepField({
        level,
        step,
        name: e.target.name,
        value: e.target.files?.[0] ?? null,
      })
    );
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    const maxStep = stepsPerLevel[currentLevel];

    if (nextStep <= maxStep) dispatch(setLevelStep({ level: currentLevel, step: nextStep }));
    else if (currentLevel < 3) dispatch(setLevelStep({ level: currentLevel + 1, step: 1 }));
    else handleSubmit(formData);
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    if (prevStep > 0) dispatch(setLevelStep({ level: currentLevel, step: prevStep }));
    else if (currentLevel > 1)
      dispatch(setLevelStep({ level: currentLevel - 1, step: stepsPerLevel[currentLevel - 1] }));
  };

  // Current form component
  const CurrentFormComponent = formsMap[currentLevel];
  const currentFormData = formData?.[`level${currentLevel}`]?.[`step${currentStep}`] || {};

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Access Denied</h2>
        <p className="text-gray-700 mb-6">Please log in to upgrade your store.</p>
        <Button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-lg text-gray-700">Loading your store profile...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:p-8"
      aria-busy={submitting || isUpdating ? 'true' : 'false'}
    >
      <div className="relative flex w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[350px] bg-white p-8 border-r border-gray-200 space-y-6 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Upgrade Store</h1>

          {levelsProgress.map((lvl) => {
            const isActive = currentLevel === lvl.id;
            return (
              <div
                key={lvl.id}
                className={[
                  'p-4 border rounded-2xl shadow-sm transition-colors',
                  isActive ? 'border-red-500/50 ring-1 ring-red-500/40' : 'border-gray-300',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-800">{lvl.title}</h2>
                  <CircularProgress
                    percentage={lvl.completion}
                    size={44}
                    strokeWidth={5}
                    color={brandColor}
                    textColor={brandColor}
                  />
                </div>

                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-lg font-bold mb-3" style={{ color: brandColor }}>
                  {lvl.completion}%
                </p>

                <div className="text-xs text-gray-500 mb-3">
                  <p>Steps: {lvl.steps}</p>
                  <p>
                    Fields: {lvl.completed}/{lvl.total}
                  </p>
                </div>

                <Button
                  className="w-full py-3 rounded-[15px] text-base shadow-md"
                  style={{ backgroundColor: brandColor, color: contrastColor }}
                  onClick={() => dispatch(setLevelStep({ level: lvl.id, step: 1 }))}
                >
                  View Details
                </Button>
              </div>
            );
          })}
        </aside>

        {/* Main Form Area */}
        <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="h-4 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${profileCompletion}%`, backgroundColor: brandColor }}
            />
          </div>
          <p className="text-center text-sm mt-2 text-gray-600">{profileCompletion}% Complete</p>

          {/* Full-width form */}
          <div className="mt-6 w-full max-w-full">
            <CurrentFormComponent
              mode="upgrade"
              activeStep={currentStep}
              formData={currentFormData}
              handleChange={(e) => handleChange(e, `level${currentLevel}`, `step${currentStep}`)}
              handleFileChange={(e) => handleFileChange(e, `level${currentLevel}`, `step${currentStep}`)}
              onNext={handleNext}
              onBack={handleBack}
              brandColor={brandColor}
              contrastColor={contrastColor}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      {showSuccessModal && (
        <SuccessModal
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/');
          }}
          title="Profile Updated!"
          message="Your store profile was successfully updated."
        />
      )}
      {showErrorModal && (
        <ErrorModal message={modalErrorMessage} onClose={() => setShowErrorModal(false)} />
      )}
    </div>
  );
};

export default UpgradeStorePage;