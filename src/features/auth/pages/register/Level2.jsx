import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import StepIndicator from '../../../../components/ui/StepIndicator';
import renderFilePreview from '../../../../utils/FilePreview';
import { useToast } from '../../../../components/ui/ToastProvider';

import {
  ArrowLeftIcon, BriefcaseIcon, IdentificationIcon, DocumentTextIcon, CameraIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company',
  'Non‑profit Organization',
  'Other',
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];
const MAX_DOC_MB = 10;

const Level2Form = ({
  formData,
  handleChange,
  handleFileChange,
  onNext,
  onBack,
  onLoginClick,
  activeStep,
  mode = 'register',
  brandColor = '#EF4444',
  contrastColor = '#FFFFFF',
}) => {
  const navigate = useNavigate();
  const { push } = useToast();
  const handleGoHome = useCallback((e) => {
      e?.preventDefault?.();
      navigate("/"); // push to home
    }, [navigate]);

  const [validationErrors, setValidationErrors] = useState({});
  const [showBusinessTypes, setShowBusinessTypes] = useState(false);

  // Refs for upload inputs
  const ninInputRef = useRef(null);
  const cacInputRef = useRef(null);

  // Helpers
  const isPdf = (fileLike) => {
    if (!fileLike) return false;
    if (fileLike instanceof File) return fileLike.type === 'application/pdf' || /\.pdf$/i.test(fileLike.name || '');
    if (typeof fileLike === 'string') return /\.pdf$/i.test(fileLike);
    if (fileLike?.file) return fileLike.file.type === 'application/pdf' || /\.pdf$/i.test(fileLike.file.name || '');
    return false;
  };

  const makeObjectUrl = (fileLike) => {
    if (fileLike instanceof File) return URL.createObjectURL(fileLike);
    if (fileLike?.file instanceof File) return URL.createObjectURL(fileLike.file);
    return null;
  };

  // Create preview URLs (memoized) and clean them up
  const ninPreviewUrl = useMemo(() => {
    if (!formData?.ninSlip) return '';
    if (typeof formData.ninSlip === 'string') return formData.ninSlip;
    if (formData.ninSlip?.fileUrl) return formData.ninSlip.fileUrl;
    return makeObjectUrl(formData.ninSlip) || '';
  }, [formData?.ninSlip]);

  const cacPreviewUrl = useMemo(() => {
    if (!formData?.cacCertificate) return '';
    if (typeof formData.cacCertificate === 'string') return formData.cacCertificate;
    if (formData.cacCertificate?.fileUrl) return formData.cacCertificate.fileUrl;
    return makeObjectUrl(formData.cacCertificate) || '';
  }, [formData?.cacCertificate]);

  useEffect(() => {
    return () => {
      // Cleanup blob URLs if we created them
      if (ninPreviewUrl && ninPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(ninPreviewUrl);
      if (cacPreviewUrl && cacPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(cacPreviewUrl);
    };
  }, [ninPreviewUrl, cacPreviewUrl]);

  const validateCurrentStep = () => {
    const errors = {};
    if (activeStep === 1) {
      if (!formData.businessName?.trim()) errors.businessName = 'Business Name is required.';
      if (!formData.businessType) errors.businessType = 'Business Type is required.';
      if (!formData.ninNumber?.trim()) errors.ninNumber = 'NIN Number is required.';
      if (!formData.cacNumber?.trim()) errors.cacNumber = 'CAC Number is required.';
    } else if (activeStep === 2) {
      if (!formData.ninSlip) errors.ninSlip = 'NIN Slip upload is required.';
      if (!formData.cacCertificate) errors.cacCertificate = 'CAC Certificate upload is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceed = () => {
    if (!validateCurrentStep()) return;
    onNext();
  };

  const handleSaveAndExit = () => navigate('/dashboard');

  const handleBusinessTypeSelect = (type) => {
    handleChange({ target: { name: 'businessType', value: type } });
    setShowBusinessTypes(false);
    setValidationErrors((prev) => ({ ...prev, businessType: '' }));
  };

  const brandBgStyle = { backgroundColor: brandColor };
  const brandTextStyle = { color: brandColor };
  const contrastTextStyle = { color: contrastColor };
  const brandHoverStyle = { filter: 'brightness(110%)' };

  const wrapperClass = `w-full h-full ${mode === 'register' ? 'max-w-[389px] px-4 py-2 sm:px-8' : 'p-0'}`;

  // File validation for Step 2 uploads
  const validateDoc = useCallback(
    (file) => {
      if (!ALLOWED_DOC_TYPES.includes(file.type)) {
        push('Only JPG, PNG, WEBP images or PDF files are allowed.', { type: 'error' });
        return false;
      }
      if (file.size > MAX_DOC_MB * 1024 * 1024) {
        push(`Max file size is ${MAX_DOC_MB}MB.`, { type: 'error' });
        return false;
      }
      return true;
    },
    [push]
  );

  const onNinChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!validateDoc(file)) {
      e.target.value = '';
      return;
    }
    handleFileChange(e); // parent sets formData.ninSlip
    setValidationErrors((prev) => ({ ...prev, ninSlip: '' }));
  };

  const onCacChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!validateDoc(file)) {
      e.target.value = '';
      return;
    }
    handleFileChange(e); // parent sets formData.cacCertificate
    setValidationErrors((prev) => ({ ...prev, cacCertificate: '' }));
  };

  return (
    <div className={wrapperClass}>
      {/* Header */}
      <div className="mt-6 border p-4 rounded-[15px] bg-white shadow-sm" style={{ borderColor: brandColor }}>
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold" style={brandTextStyle}>Level 2</h4>
          <span className="text-sm hover:underline" style={brandTextStyle}>View Benefits</span>
        </div>
        <StepIndicator steps={[1, 2]} currentStep={activeStep} brandColor={brandColor} contrastColor={contrastColor} />
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full h-auto">
        {/* Step 1: Business Info */}
        {activeStep === 1 && (
          <>
            <Input
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName || ''}
              onChange={handleChange}
              icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
              error={validationErrors.businessName}
            />

            {/* Business Type Dropdown */}
            <div className="relative">
              <Input
                name="businessType"
                placeholder="Business Type"
                readOnly
                value={formData.businessType || ''}
                icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                rightIcon={
                  <button type="button" onClick={() => setShowBusinessTypes(!showBusinessTypes)}>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </button>
                }
                className="cursor-pointer"
                error={validationErrors.businessType}
              />
              {showBusinessTypes && (
                <div className="absolute mt-1 w-full border bg-white rounded-lg shadow max-h-40 overflow-y-auto z-20">
                  {businessTypes.map(type => (
                    <div key={type}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleBusinessTypeSelect(type)}>
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Input
              name="ninNumber"
              placeholder="NIN Number"
              value={formData.ninNumber || ''}
              onChange={handleChange}
              icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
              error={validationErrors.ninNumber}
            />

            <Input
              name="cacNumber"
              placeholder="CAC Number"
              value={formData.cacNumber || ''}
              onChange={handleChange}
              icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />}
              error={validationErrors.cacNumber}
            />

            <div className="flex gap-4 mt-auto">
              <Button onClick={onBack} className="w-[54px] bg-gray-100 rounded-[15px]"><ArrowLeftIcon className="h-5" /></Button>
              {mode === 'upgrade' && <Button onClick={() => navigate('/dashboard')} className="bg-black text-white rounded-[15px]">Save & Exit</Button>}
              <Button onClick={() => { if (validateCurrentStep()) onNext(); }} className="flex-1 rounded-[15px]" style={{ backgroundColor: brandColor, color: contrastColor, filter: 'brightness(110%)' }}>
                Proceed
              </Button>

              {mode === "register" && (
                <Button type="button" onClick={handleGoHome} className="px-3 bg-black text-white rounded-lg">
                  Home
                </Button>
              )}
              
            </div>

             {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border">Login</Button>}
           
          </>
        )}

        {/* Step 2: File Uploads (NIN & CAC) */}
        {activeStep === 2 && (
          <>
            {/* NIN Slip */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload a clear picture of your NIN slip
              </label>

              <div
                role="button"
                tabIndex={0}
                onClick={() => ninInputRef.current?.click()}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && ninInputRef.current?.click()}
                className="w-full h-44 rounded-xl  border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors"
                aria-label="Upload NIN slip"
              >
                {ninPreviewUrl ? (
                  isPdf(formData.ninSlip) ? (
                    <embed
                      src={ninPreviewUrl}
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={ninPreviewUrl}
                      alt="NIN slip preview"
                      className="h-full w-full object-contain"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <CameraIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-1 text-xs">Upload a clear picture of your NIN slip</span>
                  </div>
                )}
              </div>

              <input
                ref={ninInputRef}
                type="file"
                name="ninSlip"
                className="sr-only"
                accept={ALLOWED_DOC_TYPES.join(',')}
                onChange={onNinChange}
              />

              {validationErrors.ninSlip && (
                <p className="text-xs text-red-500">{validationErrors.ninSlip}</p>
              )}
            </div>

            {/* CAC Certificate */}
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Upload a copy of your CAC certificate
              </label>

              <div
                role="button"
                tabIndex={0}
                onClick={() => cacInputRef.current?.click()}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && cacInputRef.current?.click()}
                className="w-full h-44 rounded-xl  border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors"
                aria-label="Upload CAC certificate"
              >
                {cacPreviewUrl ? (
                  isPdf(formData.cacCertificate) ? (
                    <embed
                      src={cacPreviewUrl}
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={cacPreviewUrl}
                      alt="CAC certificate preview"
                      className="h-full w-full object-contain"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <CameraIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-1 text-xs">Upload a clear picture of your CAC certificate</span>
                  </div>
                )}
              </div>

              <input
                ref={cacInputRef}
                type="file"
                name="cacCertificate"
                className="sr-only"
                accept={ALLOWED_DOC_TYPES.join(',')}
                onChange={onCacChange}
              />

              {validationErrors.cacCertificate && (
                <p className="text-xs text-red-500">{validationErrors.cacCertificate}</p>
              )}
            </div>

            <div className="flex gap-4 mt-auto">
              <Button onClick={onBack} className="w-[54px] bg-gray-100 rounded-[15px]"><ArrowLeftIcon className="h-5" /></Button>
              {mode === 'upgrade' && <Button onClick={() => navigate('/dashboard')} className="bg-black text-white rounded-[15px]">Save & Exit</Button>}
              <Button onClick={() => { if (validateCurrentStep()) onNext(); }} className="flex-1 rounded-[15px]" style={{ backgroundColor: brandColor, color: contrastColor, filter: 'brightness(110%)' }}>
                Proceed to Level 3
              </Button>
               {mode === "register" && (
                <Button type="button" onClick={handleGoHome} className="px-3 bg-black text-white rounded-lg">
                  Home
                </Button>
              )}
            </div>
             {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border">Login</Button>}
           
          </>
        )}
      </div>
    </div>
  );
};

export default Level2Form;