import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import StepIndicator from '../../../../components/ui/StepIndicator';
import renderFilePreview from '../../../../utils/FilePreview';

import {
  ArrowLeftIcon, BriefcaseIcon, IdentificationIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company',
  'Non‑profit Organization',
  'Other',
];

const Level2Form = ({
  formData,
  handleChange,
  handleFileChange,
  onNext,
  onBack,
  activeStep,
  mode = 'register',
  brandColor = '#EF4444',
  contrastColor = '#FFFFFF',
}) => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [showBusinessTypes, setShowBusinessTypes] = useState(false);

  useEffect(() => {
    return () => {
      ['ninSlip', 'cacCertificate'].forEach((field) => {
        const file = formData[field];
        if (file instanceof File) URL.revokeObjectURL(file);
      });
    };
  }, [formData]);

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
              {mode === 'upgrade' && <Button onClick={handleSaveAndExit} className="bg-black text-white rounded-[15px]">Save & Exit</Button>}
              <Button onClick={handleProceed} className="flex-1 rounded-[15px]" style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}>
                Proceed
              </Button>
            </div>
          </>
        )}

        {/* Step 2: File Upload */}
        {activeStep === 2 && (
          <>
            {['ninSlip', 'cacCertificate'].map(field => (
              <div key={field}>
                <label className="text-sm font-medium">{field === 'ninSlip' ? 'Upload NIN Slip' : 'Upload CAC Certificate'}</label>
                <div className="mt-1 border-2 border-dashed rounded p-4 flex flex-col items-center">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer text-red-500">
                    Upload File
                    <input type="file" name={field} className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" />
                  </label>
                  {renderFilePreview(formData[field])}
                  {validationErrors[field] && <p className="text-xs text-red-500">{validationErrors[field]}</p>}
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-auto">
              <Button onClick={onBack} className="w-[54px] bg-gray-100 rounded-[15px]"><ArrowLeftIcon className="h-5" /></Button>
              {mode === 'upgrade' && <Button onClick={handleSaveAndExit} className="bg-black text-white rounded-[15px]">Save & Exit</Button>}
              <Button onClick={handleProceed} className="flex-1 rounded-[15px]" style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}>
                Proceed to Level 3
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Level2Form;