import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import LocationSelectModal from "../../../../components/models/LocationSelectModal";
import DeliveryPricingScreen from "../../../../components/ui/DeliveryPricingScreen";
import DeliveryPriceCard from "../../../../components/ui/DeliveryPriceCard";
import StepIndicator from "../../../../components/ui/StepIndicator";
import { useToast } from "../../../../components/ui/ToastProvider";

import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";

const dummyColors = ["#FF0000", "#0000FF", "#008000", "#FFA500", "#800080", "#FFC0CB", "#00CED1", "#FFD700", "#A52A2A"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Allowed video MIME types and size (adjust if needed)
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_VIDEO_MB = 50;

const Level3Form = ({
  formData,
  handleChange,
  handleFileChange,
  onBack,
  onNext,
  onLoginClick,
  activeStep,
  mode = "register",
  brandColor = "#EF4444",
  contrastColor = "#FFFFFF",
}) => {
  const navigate = useNavigate();
  const { push } = useToast();

  const [validationErrors, setValidationErrors] = useState({});
  const [showDeliveryPricingModal, setShowDeliveryPricingModal] = useState(false);
  const [editingDeliveryPriceData, setEditingDeliveryPriceData] = useState(null);
  const [editingDeliveryPriceIndex, setEditingDeliveryPriceIndex] = useState(null);
  const [showLocationSelectModal, setShowLocationSelectModal] = useState(false);

  const {
    hasPhysicalStore = false,
    storeVideo,
    storeAddress = { state: "", localGovernment: "", fullAddress: "", openingHours: [] },
    deliveryPricing = [],
    selectedColor
  } = formData;

  // Refs for video input
  const videoInputRef = useRef(null);

  // Create preview URL for video
  const videoPreviewUrl = useMemo(() => {
    if (!storeVideo) return "";
    if (typeof storeVideo === "string") return storeVideo;
    if (storeVideo?.fileUrl) return storeVideo.fileUrl;
    if (storeVideo instanceof File) return URL.createObjectURL(storeVideo);
    if (storeVideo?.file instanceof File) return URL.createObjectURL(storeVideo.file);
    return "";
  }, [storeVideo]);

  useEffect(() => {
    return () => {
      if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleSaveDeliveryPrice = (data) => {
    const updated = editingDeliveryPriceIndex !== null
      ? deliveryPricing.map((d, i) => (i === editingDeliveryPriceIndex ? data : d))
      : [...deliveryPricing, data];

    handleChange({ target: { name: "deliveryPricing", value: updated } });
    setShowDeliveryPricingModal(false);
    setEditingDeliveryPriceData(null);
    setEditingDeliveryPriceIndex(null);
  };

  const handleDeleteDeliveryPrice = (i) => {
    const updated = deliveryPricing.filter((_, idx) => idx !== i);
    handleChange({ target: { name: "deliveryPricing", value: updated } });
  };

  const handleColorSelect = (color) => {
    handleChange({ target: { name: "selectedColor", value: color } });
  };

  const handleOpeningHoursChange = (idx, field, value) => {
    const base = storeAddress.openingHours?.length
      ? storeAddress.openingHours
      : daysOfWeek.map(day => ({ day, from: "", to: "" }));

    const updated = [...base];
    updated[idx] = { ...updated[idx], [field]: value };

    handleChange({
      target: {
        name: "storeAddress",
        value: { ...storeAddress, openingHours: updated }
      }
    });
  };

  const validateStep = () => {
    const errs = {};
    if (activeStep === 1) {
      if (hasPhysicalStore && !storeVideo) errs.storeVideo = "Store video required";
    } else if (activeStep === 2) {
      if (!deliveryPricing.length) errs.deliveryPricing = "At least one delivery zone required";
      if (!selectedColor) errs.selectedColor = "Select a color";
      if (!storeAddress.fullAddress || !storeAddress.state || !storeAddress.localGovernment) {
        errs.storeAddress = "Store address required";
      }
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = () => {
    if (!validateStep()) return;

    if (activeStep === 2) {
      onNext(formData);
    } else {
      onNext();
    }
  };

  const brandBgStyle = { backgroundColor: brandColor };
  const brandTextStyle = { color: brandColor };
  const contrastTextStyle = { color: contrastColor };
  const brandHoverStyle = { filter: "brightness(110%)" };

  const wrapperClass = `w-full h-full ${mode === "register" ? "max-w-[389px] px-4 py-2 sm:px-8" : "p-0"}`;

  // Validate selected video before passing to parent
  const validateVideo = useCallback((file) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      push("Only MP4, MOV (QuickTime), or WEBM videos are allowed.", { type: "error" });
      return false;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      push(`Max video size is ${MAX_VIDEO_MB}MB.`, { type: "error" });
      return false;
    }
    return true;
  }, [push]);

  const onVideoChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!validateVideo(file)) {
      e.target.value = "";
      return;
    }
    // Let parent handle updating formData.storeVideo
    handleFileChange(e);
    setValidationErrors((prev) => ({ ...prev, storeVideo: "" }));
  };

  return (
    <div className={wrapperClass}>
      {/* Header */}
      <div className="p-4 mt-6 border rounded-[15px] bg-white shadow-sm" style={{ borderColor: brandColor }}>
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold" style={brandTextStyle}>
            {mode === "register" ? "Level 3" : "Upgrade Store"}
          </h4>
          <span className="text-sm hover:underline" style={brandTextStyle}>View Benefits</span>
        </div>
        <StepIndicator steps={[1, 2]} currentStep={activeStep} brandColor={brandColor} contrastColor={contrastColor} />
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col gap-4 h-full">
        {activeStep === 1 && (
          <>
            {/* Toggle physical store */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm">
              <span>Does your business have a physical store?</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={hasPhysicalStore}
                  onChange={() =>
                    handleChange({ target: { name: "hasPhysicalStore", value: !hasPhysicalStore } })
                  }
                />
                <div className={`w-11 h-6 bg-gray-200 rounded-full relative ${hasPhysicalStore ? "bg-red-500" : ""}`}>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${hasPhysicalStore ? "translate-x-5" : ""}`} />
                </div>
              </label>
            </div>

            {/* Video upload section */}
            {hasPhysicalStore && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload a 1-minute video of your store
                </label>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => videoInputRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && videoInputRef.current?.click()}
                  className="w-full h-48 rounded-xl  border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors mt-2"
                  aria-label="Upload store video"
                >
                  {videoPreviewUrl ? (
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="h-full w-full object-contain bg-black"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <CameraIcon className="h-8 w-8 text-gray-400" />
                      <span className="mt-1 text-xs text-center">Tap to upload a clear 1-minute store video (MP4/MOV/WEBM)</span>
                    </div>
                  )}
                </div>

                <input
                  ref={videoInputRef}
                  type="file"
                  name="storeVideo"
                  className="sr-only"
                  accept={ALLOWED_VIDEO_TYPES.join(",")}
                  onChange={onVideoChange}
                />

                {validationErrors.storeVideo && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.storeVideo}</p>
                )}
              </div>
            )}


          </>
        )}

        {activeStep === 2 && (
          <>
            <h5 className="font-semibold mt-2">Store Address</h5>
            <Input
              placeholder="State"
              value={storeAddress.state || ""}
              onChange={(e) =>
                handleChange({
                  target: { name: "storeAddress", value: { ...storeAddress, state: e.target.value } },
                })
              }
            />
            <Input
              placeholder="Local Government"
              value={storeAddress.localGovernment || ""}
              onChange={(e) =>
                handleChange({
                  target: { name: "storeAddress", value: { ...storeAddress, localGovernment: e.target.value } },
                })
              }
            />
            <Input
              placeholder="Full Address"
              value={storeAddress.fullAddress || ""}
              onChange={(e) =>
                handleChange({
                  target: { name: "storeAddress", value: { ...storeAddress, fullAddress: e.target.value } },
                })
              }
            />
            {validationErrors.storeAddress && <p className="text-xs text-red-500">{validationErrors.storeAddress}</p>}

            <h5 className="font-semibold mt-2">Opening Hours</h5>
            {daysOfWeek.map((day, i) => (
              <div key={day} className="flex gap-2 items-center">
                <span className="w-20">{day}</span>
                <Input type="time" value={storeAddress.openingHours?.[i]?.from || ""} onChange={e => handleOpeningHoursChange(i, "from", e.target.value)} />
                <span>to</span>
                <Input type="time" value={storeAddress.openingHours?.[i]?.to || ""} onChange={e => handleOpeningHoursChange(i, "to", e.target.value)} />
              </div>
            ))}

            <div className="flex justify-between items-center border p-3 rounded cursor-pointer shadow-sm mt-4" onClick={() => setShowDeliveryPricingModal(true)}>
              <span>Add Delivery Pricing</span>
            </div>
            {deliveryPricing.map((zone, i) => (
              <DeliveryPriceCard key={i} data={zone} brandColor={brandColor} onDelete={() => handleDeleteDeliveryPrice(i)} />
            ))}
            {validationErrors.deliveryPricing && <p className="text-xs text-red-500">{validationErrors.deliveryPricing}</p>}

            <p className="text-sm mt-3">Select a store brand color</p>
            <div className="grid grid-cols-5 gap-2">
              {dummyColors.map(color => (
                <div
                  key={color}
                  className={`w-9 h-9 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
            {validationErrors.selectedColor && <p className="text-xs text-red-500">{validationErrors.selectedColor}</p>}
          </>
        )}

        <div className="flex gap-2 mt-auto">
          <Button type="button" onClick={onBack} className="bg-gray-100 rounded-[15px]">
            <ArrowLeftIcon className="h-5" />
          </Button>
          <Button
            type="button"
            onClick={handleProceed}
            className="flex-1 rounded-[15px]"
            style={{ ...brandBgStyle, ...contrastTextStyle, ...brandHoverStyle }}
          >
            {mode === "register" && activeStep === 1
              ? "Proceed"
              : mode === "register"
                ? "Complete Registration"
                : "Confirm Upgrade"}
          </Button>
        </div>
         {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border">Login</Button>}
           
      </form>

      {showLocationSelectModal && (
        <LocationSelectModal onClose={() => setShowLocationSelectModal(false)} onSelectLocation={() => { }} title="Select Location" />
      )}
      {showDeliveryPricingModal && (
        <DeliveryPricingScreen
          initialData={editingDeliveryPriceData}
          onSave={handleSaveDeliveryPrice}
          onClose={() => setShowDeliveryPricingModal(false)}
          brandColor={brandColor}
          contrastColor={contrastColor}
        />
      )}
    </div>
  );
};

export default Level3Form;