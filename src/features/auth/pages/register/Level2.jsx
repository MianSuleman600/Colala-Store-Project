import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import StepIndicator from '../../../../components/ui/StepIndicator';
import { useToast } from '../../../../components/ui/ToastProvider';

import {
  ArrowLeftIcon, BriefcaseIcon, IdentificationIcon, CameraIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// FINAL, DEFINITIVE FIX:
// This array now provides the EXACT values ('BN', 'LTD') that your Laravel backend validation requires.
// The 'label' is what the user sees in the UI.
const businessTypes = [
  { value: 'BN',  label: 'Business Name (Sole Proprietor)' },
  { value: 'LTD', label: 'Limited Liability Company (LTD)' },
];

const ALLOWED_DOC_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
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
  const [validationErrors, setValidationErrors] = useState({});
  const [showBusinessTypes, setShowBusinessTypes] = useState(false);

  const ninInputRef = useRef(null);
  const cacInputRef = useRef(null);

  const isStepValid = useMemo(() => {
    if (activeStep === 1) {
      return !!(formData.businessName?.trim() && formData.businessType && formData.ninNumber?.trim() && formData.cacNumber?.trim());
    } else if (activeStep === 2) {
      return !!(formData.ninSlip && formData.cacCertificate);
    }
    return false;
  }, [formData, activeStep]);

  const getPreviewUrl = (fileLike) => {
    if (!fileLike) return '';
    if (typeof fileLike === 'string') return fileLike;
    if (fileLike instanceof File) return URL.createObjectURL(fileLike);
    return '';
  };
  const isPdf = (fileLike) => {
    if (!fileLike) return false;
    const name = fileLike instanceof File ? fileLike.name : typeof fileLike === 'string' ? fileLike : '';
    const type = fileLike instanceof File ? fileLike.type : '';
    return type === 'application/pdf' || /\.pdf$/i.test(name);
  };
  
  const ninPreviewUrl = getPreviewUrl(formData.ninSlip);
  const cacPreviewUrl = getPreviewUrl(formData.cacCertificate);

  const handleProceed = () => {
    onNext();
  };

  const handleBusinessTypeSelect = (typeValue) => {
    handleChange({ target: { name: 'businessType', value: typeValue } });
    setShowBusinessTypes(false);
  };
  
  const validateDoc = useCallback((file) => {
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      push('Only JPG, PNG, WEBP, or PDF are allowed.', { type: 'error' });
      return false;
    }
    if (file.size > MAX_DOC_MB * 1024 * 1024) {
      push(`Max file size is ${MAX_DOC_MB}MB.`, { type: 'error' });
      return false;
    }
    return true;
  }, [push]);

  const onFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (validateDoc(file)) {
      handleFileChange(e);
    } else {
      e.target.value = null;
    }
  }, [validateDoc, handleFileChange]);
  
  const selectedBusinessTypeLabel = useMemo(() => {
    return businessTypes.find(bt => bt.value === formData.businessType)?.label || '';
  }, [formData.businessType]);

  return (
    <div className={`w-full h-full ${mode === 'register' ? 'max-w-[389px] px-4 py-2 sm:px-8' : 'p-0'}`}>
      {/* Header */}
      <div className="mt-6 border p-4 rounded-[15px] bg-white shadow-sm" style={{ borderColor: brandColor }}>
        <div className="flex items-center justify-between"><h4 className="text-lg font-semibold" style={{ color: brandColor }}>Level 2</h4><span className="text-sm hover:underline" style={{ color: brandColor }}>View Benefits</span></div>
        <StepIndicator steps={[1, 2]} currentStep={activeStep} brandColor={brandColor} contrastColor={contrastColor} />
      </div>

      <div className="mt-8 flex flex-col gap-4 w-full h-auto">
        {activeStep === 1 && (
          <>
            <Input name="businessName" placeholder="Business Name" value={formData.businessName || ''} onChange={handleChange} icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />} error={validationErrors.businessName}/>
            <div className="relative">
              <Input name="businessType" placeholder="Business Type" readOnly value={selectedBusinessTypeLabel} icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />} rightIcon={<button type="button" onClick={() => setShowBusinessTypes(!showBusinessTypes)}><ChevronDownIcon className="h-5 w-5 text-gray-400" /></button>} className="cursor-pointer" error={validationErrors.businessType}/>
              {showBusinessTypes && (
                <div className="absolute mt-1 w-full border bg-white rounded-lg shadow max-h-40 overflow-y-auto z-20">
                  {businessTypes.map(type => (
                    <div key={type.value} className="px-3 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleBusinessTypeSelect(type.value)}>
                      {type.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Input name="ninNumber" placeholder="NIN Number" value={formData.ninNumber || ''} onChange={handleChange} icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />} error={validationErrors.ninNumber}/>
            <Input name="cacNumber" placeholder="CAC Number" value={formData.cacNumber || ''} onChange={handleChange} icon={<IdentificationIcon className="h-5 w-5 text-gray-400" />} error={validationErrors.cacNumber}/>
            <div className="flex gap-4 mt-auto">
              <Button onClick={onBack} className="w-[54px] bg-gray-100 rounded-[15px]"><ArrowLeftIcon className="h-5" /></Button>
              <Button onClick={handleProceed} className="flex-1 rounded-[15px] disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: brandColor, color: contrastColor }} disabled={!isStepValid}>Proceed</Button>
            </div>
            {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border">Login</Button>}
          </>
        )}

        {activeStep === 2 && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload your NIN slip</label>
              <div role="button" tabIndex={0} onClick={() => ninInputRef.current?.click()} className="w-full h-44 rounded-xl border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors">
                {ninPreviewUrl ? (isPdf(formData.ninSlip) ? <embed src={ninPreviewUrl} type="application/pdf" className="w-full h-full" /> : <img src={ninPreviewUrl} alt="NIN slip preview" className="h-full w-full object-contain" />) : <div className="flex flex-col items-center text-gray-500"><CameraIcon className="h-8 w-8 text-gray-400" /><span className="mt-1 text-xs">Upload NIN slip</span></div>}
              </div>
              <input ref={ninInputRef} type="file" name="ninSlip" className="sr-only" accept={ALLOWED_DOC_TYPES.join(',')} onChange={onFileChange} />
            </div>
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700">Upload your CAC certificate</label>
              <div role="button" tabIndex={0} onClick={() => cacInputRef.current?.click()} className="w-full h-44 rounded-xl border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors">
                {cacPreviewUrl ? (isPdf(formData.cacCertificate) ? <embed src={cacPreviewUrl} type="application/pdf" className="w-full h-full" /> : <img src={cacPreviewUrl} alt="CAC certificate preview" className="h-full w-full object-contain" />) : <div className="flex flex-col items-center text-gray-500"><CameraIcon className="h-8 w-8 text-gray-400" /><span className="mt-1 text-xs">Upload CAC certificate</span></div>}
              </div>
              <input ref={cacInputRef} type="file" name="cacCertificate" className="sr-only" accept={ALLOWED_DOC_TYPES.join(',')} onChange={onFileChange} />
            </div>
            <div className="flex gap-4 mt-auto">
              <Button onClick={onBack} className="w-[54px] bg-gray-100 rounded-[15px]"><ArrowLeftIcon className="h-5" /></Button>
              <Button onClick={handleProceed} className="flex-1 rounded-[15px] disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: brandColor, color: contrastColor }} disabled={!isStepValid}>Proceed to Level 3</Button>
            </div>
            {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border">Login</Button>}
          </>
        )}
      </div>
    </div>
  );
};

export default Level2Form;