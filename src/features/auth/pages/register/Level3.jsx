// src/features/auth/pages/register/Level3Form.jsx

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import DeliveryPricingScreen from "../../../../components/ui/DeliveryPricingScreen";
import DeliveryPriceCard from "../../../../components/ui/DeliveryPriceCard";
import StepIndicator from "../../../../components/ui/StepIndicator";
import { useToast } from "../../../../components/ui/ToastProvider";
import LocationSelectModal from "../../../../components/models/LocationSelectModal";
import { ArrowLeftIcon, CameraIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { states, getLgasByState } from "../../../../utils/locationData";
import { useSubmitL3DeliveryMutation, useDeleteL3DeliveryMutation } from "../../../../services/mutations/onboardingMutations";

const dummyColors = ["#FF0000", "#0000FF", "#008000", "#FFA500", "#800080", "#FFC0CB", "#00CED1", "#FFD700", "#A52A2A"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/avi", "video/x-msvideo"];
const MAX_VIDEO_MB = 10;

// Helper to convert camelCase keys to snake_case
const camelToSnake = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(value);
    return acc;
  }, {});
};

const Level3Form = ({
  formData = {},
  handleChange,
  handleFileChange,
  onBack,
  onNext,
  activeStep,
  mode = "register",
  brandColor = "#EF4444",
  contrastColor = "#FFFFFF",
}) => {
  const { push } = useToast();
  const videoInputRef = useRef(null);

  const [showDeliveryPricingModal, setShowDeliveryPricingModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [editingDeliveryIndex, setEditingDeliveryIndex] = useState(null);

  const [showLocationSelectModal, setShowLocationSelectModal] = useState(false);
  const [modalTargetField, setModalTargetField] = useState(null);
  const [addressLgas, setAddressLgas] = useState([]);
  
  const { mutateAsync: addDelivery } = useSubmitL3DeliveryMutation();
  const { mutateAsync: deleteDelivery } = useDeleteL3DeliveryMutation();

  useEffect(() => {
    if (formData.storeAddress?.state) {
        setAddressLgas(getLgasByState(formData.storeAddress.state));
    } else {
        setAddressLgas([]);
    }
  }, [formData.storeAddress?.state]);

  const isStepValid = useMemo(() => {
    if (activeStep === 1) {
      return !formData.hasPhysicalStore || !!formData.storeVideo;
    } else if (activeStep === 2) {
      const address = formData.storeAddress || {};
      const isAddressComplete = !!(address.state?.trim() && address.localGovernment?.trim() && address.fullAddress?.trim());
      const hasDelivery = formData.deliveryPricing && formData.deliveryPricing.length > 0;
      const hasColor = !!formData.selectedColor;
      return isAddressComplete && hasDelivery && hasColor;
    }
    return false;
  }, [formData, activeStep]);
  
  const getPreviewUrl = (val) => val instanceof File ? URL.createObjectURL(val) : val || "";
  const videoPreviewUrl = getPreviewUrl(formData.storeVideo);

  const handleAddressFieldChange = (field, value) => {
    const newStoreAddress = {
      ...(formData.storeAddress || {}),
      [field]: value,
    };
    handleChange({
      target: { name: 'storeAddress', value: newStoreAddress },
    });
  };
  
  const handleOpeningHoursChange = (idx, field, value) => {
    const baseOpeningHours = formData.storeAddress?.openingHours?.length 
        ? [...formData.storeAddress.openingHours]
        : daysOfWeek.map(day => ({ day, from: "", to: "" }));
    
    baseOpeningHours[idx] = { ...baseOpeningHours[idx], [field]: value };
    
    const newStoreAddress = {
      ...(formData.storeAddress || {}),
      openingHours: baseOpeningHours,
    };

    handleChange({
      target: { name: 'storeAddress', value: newStoreAddress },
    });
  };

  const handleSaveDeliveryPrice = async (newData) => {
    const payload = camelToSnake({
        state: newData.state,
        localGovernment: newData.localGovernment,
        variant: newData.variant,
        price: newData.deliveryFee || 0,
        isFree: newData.markForFreeDelivery ? 1 : 0,
    });

    try {
        if (editingDelivery) {
            if(editingDelivery.id) await deleteDelivery(editingDelivery.id);
            const response = await addDelivery(payload);
            const newItemWithId = { ...newData, id: response?.id || Date.now() };
            const updatedList = [...formData.deliveryPricing];
            updatedList[editingDeliveryIndex] = newItemWithId;
            handleChange({ target: { name: "deliveryPricing", value: updatedList } });
            push('Delivery price updated!', { type: 'success' });
        } else {
            const response = await addDelivery(payload);
            const newItemWithId = { ...newData, id: response?.id || Date.now() };
            const updatedList = [...(formData.deliveryPricing || []), newItemWithId];
            handleChange({ target: { name: "deliveryPricing", value: updatedList } });
            push('Delivery price added!', { type: 'success' });
        }
    } catch (error) {
        push(error.data?.message || 'Failed to save delivery price.', { type: 'error' });
    } finally {
        setShowDeliveryPricingModal(false);
        setEditingDelivery(null);
        setEditingDeliveryIndex(null);
    }
  };

  const handleEditDelivery = (item, index) => { setEditingDelivery(item); setEditingDeliveryIndex(index); setShowDeliveryPricingModal(true); };
  const handleDeleteDeliveryPrice = async (item, index) => {
    if (!item.id) {
        const updatedList = (formData.deliveryPricing || []).filter((_, idx) => idx !== index);
        handleChange({ target: { name: "deliveryPricing", value: updatedList } });
        push('Delivery zone removed.', { type: 'info' });
        return;
    }
    if (window.confirm("Are you sure you want to delete this delivery zone?")) {
        try {
            await deleteDelivery(item.id);
            const updatedList = (formData.deliveryPricing || []).filter((_, idx) => idx !== index);
            handleChange({ target: { name: "deliveryPricing", value: updatedList } });
            push('Delivery price deleted.', { type: 'success' });
        } catch (error) { push(error.data?.message || 'Failed to delete delivery price.', { type: 'error' }); }
    }
  };
  
  const handleColorSelect = (color) => handleChange({ target: { name: "selectedColor", value: color } });
  const handleProceed = () => onNext();
  const onVideoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) { push("Only MP4, MOV, or AVI videos are allowed.", { type: "error" }); e.target.value = ''; return; }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) { push(`Max video size is ${MAX_VIDEO_MB}MB.`, { type: "error" }); e.target.value = ''; return; }
    handleFileChange(e);
  }, [push, handleFileChange]);
  
  const handleOpenLocationSelect = (target) => { setModalTargetField(target); setShowLocationSelectModal(true); };

  const handleSelectLocation = (selectedLocation) => {
    const currentAddress = formData.storeAddress || {};
    let newStoreAddress;

    if (modalTargetField === 'state') {
      newStoreAddress = {
        ...currentAddress,
        state: selectedLocation,
        localGovernment: '', 
      };
    } else {
      newStoreAddress = {
        ...currentAddress,
        localGovernment: selectedLocation,
      };
    }

    handleChange({ target: { name: 'storeAddress', value: newStoreAddress } });
    setShowLocationSelectModal(false);
  };

  return (
    <div className={`w-full h-full ${mode === "register" ? "max-w-[489px] px-4 py-2 sm:px-8" : "p-0 flex flex-col"}`}>
      {/* Header */}
      <div className="p-4 mt-6 border rounded-2xl bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold" style={{ color: brandColor }}>Level 3</h4>
          <button className="text-sm hover:underline" style={{ color: brandColor }}>View Benefits</button>
        </div>
        <StepIndicator steps={[1, 2]} currentStep={activeStep} brandColor={brandColor} contrastColor="#EBEBEB" />
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-col gap-4 h-full flex-1 overflow-y-auto">
        {/* Step 1: Physical Store */}
        {activeStep === 1 && (
          <>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm">
              <span>Do you have a physical store?</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" name="hasPhysicalStore" checked={!!formData.hasPhysicalStore} onChange={(e) => handleChange({ target: { name: "hasPhysicalStore", value: e.target.checked } })} />
                <div className={`w-11 h-6 bg-gray-200 rounded-full relative ${formData.hasPhysicalStore ? "bg-red-500" : ""}`}>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${formData.hasPhysicalStore ? "translate-x-5" : ""}`} />
                </div>
              </label>
            </div>
            {formData.hasPhysicalStore && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Upload a short video of your store (Max {MAX_VIDEO_MB}MB)</label>
                <div role="button" tabIndex={0} onClick={() => videoInputRef.current?.click()} className="w-full h-48 rounded-xl border-dashed border-2 border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors mt-2">
                  {videoPreviewUrl ? <video src={videoPreviewUrl} controls className="h-full w-full object-contain bg-black" /> : <div className="flex flex-col items-center text-gray-500"><CameraIcon className="h-8 w-8 text-gray-400" /><span className="mt-1 text-xs text-center">Tap to upload a store video</span></div>}
                </div>
                <input ref={videoInputRef} type="file" name="storeVideo" className="sr-only" accept={ALLOWED_VIDEO_TYPES.join(",")} onChange={onVideoChange} />
              </div>
            )}
          </>
        )}

        {/* Step 2: Store Address & Delivery */}
        {activeStep === 2 && (
          <div className="flex flex-col h-full">
            <div className="overflow-y-auto pr-2 -mr-2 space-y-4 flex-grow">
              <h5 className="font-semibold">Store Address</h5>
              <div className="relative cursor-pointer" onClick={() => handleOpenLocationSelect('state')}>
                <Input placeholder="Select State" value={formData.storeAddress?.state || ""} readOnly className="cursor-pointer" />
                <ChevronRightIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <div className="relative cursor-pointer" onClick={() => handleOpenLocationSelect('localGovernment')}>
                <Input placeholder="Select Local Government" value={formData.storeAddress?.localGovernment || ""} readOnly disabled={!formData.storeAddress?.state} className="cursor-pointer disabled:bg-gray-100" />
                <ChevronRightIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <Input placeholder="Full Address (Street, Building No.)" value={formData.storeAddress?.fullAddress || ""} onChange={(e) => handleAddressFieldChange('fullAddress', e.target.value)} />
              
              <h5 className="font-semibold pt-2">Opening Hours (Optional)</h5>
              {daysOfWeek.map((day, i) => (
                <div key={day} className="flex gap-2 items-center">
                  <span className="w-20 text-sm">{day}</span>
                  <Input type="time" value={formData.storeAddress?.openingHours?.[i]?.from || ""} onChange={e => handleOpeningHoursChange(i, "from", e.target.value)} />
                  <span className="text-sm">to</span>
                  <Input type="time" value={formData.storeAddress?.openingHours?.[i]?.to || ""} onChange={e => handleOpeningHoursChange(i, "to", e.target.value)} />
                </div>
              ))}

              <div className="flex justify-between items-center border p-3 rounded-lg cursor-pointer shadow-sm mt-2 hover:bg-gray-50" onClick={() => { setEditingDelivery(null); setEditingDeliveryIndex(null); setShowDeliveryPricingModal(true); }}>
                <span>Add Delivery Pricing</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>

              {(formData.deliveryPricing || []).map((zone, i) => (
                <DeliveryPriceCard key={zone.id || i} data={zone} brandColor={brandColor} onEdit={() => handleEditDelivery(zone, i)} onDelete={() => handleDeleteDeliveryPrice(zone, i)} />
              ))}

              <p className="font-semibold pt-2">Select a store brand color</p>
              <div className="grid grid-cols-6 gap-2 pb-2">
                {dummyColors.map(color => (
                  <div key={color} role="button" tabIndex={0} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleColorSelect(color)} className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all ${formData.selectedColor === color ? 'border-black scale-110' : 'border-transparent'}`} style={{ backgroundColor: color }} onClick={() => handleColorSelect(color)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className={`flex gap-2 mt-4 ${mode === "upgrade" ? "sticky bottom-0 bg-white p-4" : "pt-4"}`}>
        <Button type="button" onClick={onBack} className="bg-gray-100 rounded-lg p-3"><ArrowLeftIcon className="h-5" /></Button>
        <Button type="button" onClick={handleProceed} className="flex-1 rounded-lg disabled:opacity-50" style={{ backgroundColor: brandColor, color: contrastColor }} disabled={!isStepValid}>
          {mode === "register" ? "Proceed" : "Complete Registration"}
        </Button>
      </div>

      {/* Modals */}
      {showLocationSelectModal && (
        <LocationSelectModal
          onClose={() => setShowLocationSelectModal(false)}
          onSelectLocation={handleSelectLocation}
          title={modalTargetField === 'state' ? 'Select State' : 'Select Local Government'}
          locations={modalTargetField === 'state' ? states.map(s => s.name) : addressLgas}
        />
      )}

      {showDeliveryPricingModal && (
        <DeliveryPricingScreen
          initialData={editingDelivery}
          onSave={handleSaveDeliveryPrice}
          onClose={() => {
            setShowDeliveryPricingModal(false);
            setEditingDelivery(null);
            setEditingDeliveryIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default Level3Form;
