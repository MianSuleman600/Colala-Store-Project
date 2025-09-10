import React, { useState, useRef, useEffect, useCallback } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import StepIndicator from "../../../../components/ui/StepIndicator";
import EnterEmailModal from "../../../../components/models/EnterEmailModal";
import OtpInputModal from "../../../../components/models/ResetPasswordModal";
import SetNewPasswordModal from "../../../../components/models/SetNewPasswordModal";
import renderFilePreview from "../../../../utils/FilePreview.js";
import { useToast } from "../../../../components/ui/ToastProvider";
import { authService } from "../../../../services/authService";
import { useNavigate } from "react-router-dom";

import {
  EnvelopeIcon, LockClosedIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon,
  PhoneIcon, MapPinIcon, BuildingStorefrontIcon, CameraIcon,
  TagIcon, XMarkIcon, ChevronDownIcon, BriefcaseIcon
} from "@heroicons/react/24/outline";

const locations = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"];
const dummyCategories = ["Electronics", "Fashion", "Books", "Groceries", "Sports", "Health"];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_MB = 5;

const Level1Form = ({
  mode = "register",
  formData = {},
  handleChange,
  handleFileChange,
  onNext,
  onBack,
  onSaveExit,
  onLoginClick,
  activeStep,
  brandColor = "#e53e3e",
  contrastColor = "#EBEBEB"
}) => {
  const { push } = useToast();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // USE LOWERCASE

  // Category dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Change password 3-step flow
  const [showEnterEmail, setShowEnterEmail] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSetNewPassword, setShowSetNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [processing, setProcessing] = useState({ send: false, verify: false, reset: false });

  // Upload refs for Step 2
  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const brandBgStyle = { backgroundColor: brandColor };
  const brandTextStyle = { color: brandColor };
  const contrastTextStyle = { color: contrastColor };
  const brandHoverStyle = { filter: "brightness(110%)" };

  const level1GlobalSteps = [1, 2, 3];

  const validateStep = () => {
    const errs = {};
    if (activeStep === 1) {
      if (!formData.storeName) errs.storeName = "Store name required";
      if (!formData.storeLocation) errs.storeLocation = "Store location required";
      if (!formData.email) errs.email = "Email required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
      if (!formData.phoneNumber) errs.phoneNumber = "Phone required";

      if (mode === "register") {
        if (!formData.password) errs.password = "Password required";
        else if (formData.password.length < 6) errs.password = "Minimum 6 characters";
      }
    }
    if (activeStep === 2) {
      if (!formData.profilePicture) errs.profilePicture = "Profile Picture required";
      if (!formData.storeBanner) errs.storeBanner = "Store Banner required";
    }
    if (activeStep === 3) {
      if (!formData.categories || formData.categories.length === 0)
        errs.categories = "Select at least one category";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = () => {
    if (!validateStep()) return;
    onNext();
  };

  const handleRemoveCategory = (cat) => {
    const updated = (formData.categories || []).filter((c) => c !== cat);
    handleChange({ target: { name: "categories", value: updated } });
  };

  // Change password handlers (upgrade flow)
  const handleOpenChangePassword = () => {
    setResetEmail("");
    setResetOtp("");
    setShowEnterEmail(true);
  };

  const handleEmailSubmit = async (email) => {
    try {
      setProcessing((p) => ({ ...p, send: true }));
      await authService.requestPasswordReset(email);
      setResetEmail(email);
      setShowEnterEmail(false);
      setShowOtp(true);
      push("A verification code has been sent to your email.", { type: "info" });
    } catch (e) {
      push(e?.message || "Failed to send reset code.", { type: "error" });
    } finally {
      setProcessing((p) => ({ ...p, send: false }));
    }
  };

  const handleOtpConfirm = async (otp) => {
    try {
      setProcessing((p) => ({ ...p, verify: true }));
      await authService.verifyPasswordResetOtp({ email: resetEmail, otp });
      setResetOtp(otp);
      setShowOtp(false);
      setShowSetNewPassword(true);
    } catch (e) {
      push(e?.message || "Invalid or expired code.", { type: "error" });
    } finally {
      setProcessing((p) => ({ ...p, verify: false }));
    }
  };

  const handleNewPassword = async (newPassword) => {
    try {
      setProcessing((p) => ({ ...p, reset: true }));
      await authService.resetPasswordWithOtp({ email: resetEmail, otp: resetOtp, newPassword });
      setShowSetNewPassword(false);
      push("Your password has been updated.", { type: "success" });
    } catch (e) {
      push(e?.message || "Failed to update password.", { type: "error" });
    } finally {
      setProcessing((p) => ({ ...p, reset: false }));
    }
  };

  const wrapperClass = `w-full h-full max-h-[90vh] ${
    mode === "register" ? "max-w-[389px] px-2 py-4 sm:px-8" : "max-w-none p-0"
  }`;

  // Helpers for Step 2 validation
  const validateImage = (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      push("Only JPG, PNG, WEBP images are allowed.", { type: "error" });
      return false;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      push(`Max image size is ${MAX_IMAGE_MB}MB.`, { type: "error" });
      return false;
    }
    return true;
  };

  const onProfileFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }
    handleFileChange(e);
  };

  const onBannerFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }
    handleFileChange(e);
  };

  const getPreviewUrl = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (val instanceof File) return URL.createObjectURL(val);
    if (val?.fileUrl) return val.fileUrl;
    if (val?.file instanceof File) return URL.createObjectURL(val.file);
    return "";
  };

  const profilePreview = getPreviewUrl(formData.profilePicture);
  const bannerPreview = getPreviewUrl(formData.storeBanner);

  useEffect(() => {
    return () => {
      // Optionally revoke created URLs if you track them
    };
  }, []);

  // FIX: reliable Home navigation
  const handleGoHome = useCallback((e) => {
    e?.preventDefault?.();
    navigate("/"); // push to home
  }, [navigate]);

  return (
    <div className={wrapperClass}>
      {/* Header */}
      <div className="w-full p-4 border rounded-[15px] shadow-sm bg-white mt-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold" style={{ color: brandColor }}>Level 1</h4>
          <button className="text-sm hover:underline" style={{ color: brandColor }}>View Benefits</button>
        </div>
        <StepIndicator steps={[1, 2, 3]} currentStep={activeStep} brandColor={brandColor} contrastColor={contrastColor} />
      </div>

      {/* Steps */}
      <div className="space-y-4 mt-8 flex flex-col h-full">
        {/* STEP 1 */}
        {activeStep === 1 && (
          <>
            <Input name="storeName" placeholder="Store Name" icon={<BuildingStorefrontIcon className="h-5 w-5" />} value={formData.storeName || ""} onChange={handleChange} error={errors.storeName} />

            <div className="relative">
              <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select name="storeLocation" value={formData.storeLocation || ""} onChange={handleChange} className="w-full p-3 rounded-[15px] border pl-10">
                <option value="" disabled>Select Location</option>
                {locations.map((loc) => <option key={loc}>{loc}</option>)}
              </select>
            </div>
            {errors.storeLocation && <p className="text-xs" style={{ color: brandColor }}>{errors.storeLocation}</p>}

            <Input name="email" type="email" placeholder="Email" icon={<EnvelopeIcon className="h-5 w-5" />} value={formData.email || ""} onChange={handleChange} error={errors.email} />
            <Input name="phoneNumber" type="tel" placeholder="Phone Number" icon={<PhoneIcon className="h-5 w-5" />} value={formData.phoneNumber || ""} onChange={handleChange} error={errors.phoneNumber} />

            {mode === "register" && (
              <>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  value={formData.password || ""}
                  onChange={handleChange}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  }
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowEnterEmail(true)}
                  className="text-sm hover:underline text-right w-full block mt-1"
                  style={{ color: brandColor }}
                >
                  Forgot Password?
                </button>
              </>
            )}

            {mode === "upgrade" && (
              <div className="rounded-[15px] p-3 bg-white border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Change account password</span>
                  <Button
                    type="button"
                    onClick={handleOpenChangePassword}
                    className="px-3 py-1 rounded-md text-sm"
                    style={{ backgroundColor: brandColor, color: contrastColor }}
                  >
                    Change
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We’ll send a verification code to your email. After verification, you can set a new password.
                </p>
              </div>
            )}

            <Input name="referralCode" placeholder="Referral Code (Optional)" value={formData.referralCode || ""} onChange={handleChange} error={errors.referralCode} />

            <div className="mt-4 flex flex-col gap-2">
              {mode === "upgrade" && <Button type="button" onClick={onSaveExit} className="bg-black w-1/2 text-white">Save & Exit</Button>}
              <Button type="button" onClick={handleProceed} className="w-full" style={{ backgroundColor: brandColor, color: contrastColor, ...brandHoverStyle }}>
                Create Account
              </Button>
              {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border">Login</Button>}
            </div>

            {mode === "register" && (
              <p className="text-[8px] p-1 text-center">
                By proceeding you agree to Colala’s <span className="text-redd text-[8px]">terms of use</span> and privacy policy
              </p>
            )}
          </>
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <>
            {/* Profile Picture */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload a profile picture for your store
              </label>

              <div
                role="button"
                tabIndex={0}
                onClick={() => profileInputRef.current?.click()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && profileInputRef.current?.click()}
                className="mx-auto h-32 w-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors"
                aria-label="Upload profile picture"
              >
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile Preview" className="h-full w-full object-cover rounded-full" />
                ) : (
                  <CameraIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>

              <input
                ref={profileInputRef}
                type="file"
                name="profilePicture"
                className="sr-only"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                onChange={onProfileFileChange}
              />

              {errors.profilePicture && <p className="text-xs mt-1" style={{ color: brandColor }}>{errors.profilePicture}</p>}
            </div>

            {/* Store Banner */}
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Upload a banner for your store
              </label>

              <div
                role="button"
                tabIndex={0}
                onClick={() => bannerInputRef.current?.click()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && bannerInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors"
                aria-label="Upload store banner"
              >
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner Preview" className="h-full w-full object-cover" />
                ) : (
                  <CameraIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>

              <input
                ref={bannerInputRef}
                type="file"
                name="storeBanner"
                className="sr-only"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                onChange={onBannerFileChange}
              />

              {errors.storeBanner && <p className="text-xs mt-1" style={{ color: brandColor }}>{errors.storeBanner}</p>}
            </div>

            <div className="flex gap-4 mt-6">
              <Button type="button" onClick={onBack}><ArrowLeftIcon className="h-5 w-5" /></Button>
              {mode === "upgrade" && <Button type="button" onClick={onSaveExit}>Save & Exit</Button>}
              <Button type="button" onClick={handleProceed} className="flex-1" style={{ backgroundColor: brandColor, color: contrastColor, ...brandHoverStyle }}>
                Proceed
              </Button>
            </div>

            {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border mt-2">Login</Button>}
          </>
        )}

        {/* STEP 3 */}
        {activeStep === 3 && (
          <>
            <div className="relative">
              <div className="flex items-center border rounded-lg p-3 cursor-pointer" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span>{formData.categories?.length ? `Selected (${formData.categories.length})` : "Select Category"}</span>
              </div>
              {showCategoryDropdown && (
                <div className="absolute mt-2 border w-full rounded-lg shadow bg-white z-20">
                  {dummyCategories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        const selected = formData.categories || [];
                        const updated = selected.includes(cat) ? selected.filter((c) => c !== cat) : [...selected, cat];
                        handleChange({ target: { name: "categories", value: updated } });
                      }}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${formData.categories?.includes(cat) ? "bg-red-100" : ""}`}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.categories && <p className="text-xs" style={{ color: brandColor }}>{errors.categories}</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories?.map((cat) => (
                <span key={cat} className="px-3 py-1 rounded-full text-sm flex items-center" style={{ backgroundColor: brandColor, color: contrastColor }}>
                  {cat}
                  <button type="button" onClick={() => handleRemoveCategory(cat)} className="ml-2"><XMarkIcon className="h-4 w-4" /></button>
                </span>
              ))}
            </div>

            <Input name="whatsapp" placeholder="WhatsApp Link" value={formData.whatsapp || ""} onChange={handleChange} />
            <Input name="instagram" placeholder="Instagram Link" value={formData.instagram || ""} onChange={handleChange} />
            <Input name="facebook" placeholder="Facebook Link" value={formData.facebook || ""} onChange={handleChange} />
            <Input name="twitter" placeholder="Twitter Link" value={formData.twitter || ""} onChange={handleChange} />

            <div className="flex gap-2">
              <Button type="button" onClick={onBack}><ArrowLeftIcon className="h-5 w-5" /></Button>
              {mode === "upgrade" && <Button type="button" onClick={onSaveExit}>Save & Exit</Button>}
              <Button type="button" onClick={handleProceed} style={{ backgroundColor: brandColor, color: contrastColor, ...brandHoverStyle }}>
                {mode === "register" ? "Proceed to Level 2" : "Update"}
              </Button>
              {mode === "register" && (
                <Button type="button" onClick={handleGoHome} className="px-3 bg-black text-white rounded-lg">
                  Home
                </Button>
              )}
            </div>

            {mode === "register" && <Button type="button" onClick={onLoginClick} className="bg-gray-100 border mt-2">Login</Button>}
          </>
        )}
      </div>

      {/* Modals */}
      <EnterEmailModal
        isOpen={showEnterEmail}
        onEmailSubmit={handleEmailSubmit}
        onClose={() => setShowEnterEmail(false)}
        brandColor={brandColor}
        contrastColor={contrastColor}
      />

      <OtpInputModal
        isOpen={showOtp}
        onOtpConfirm={handleOtpConfirm}
        onClose={() => setShowOtp(false)}
        email={resetEmail}
        brandColor={brandColor}
        contrastColor={contrastColor}
      />

      <SetNewPasswordModal
        isOpen={showSetNewPassword}
        onSetPassword={handleNewPassword}
        onClose={() => setShowSetNewPassword(false)}
        brandColor={brandColor}
        contrastColor={contrastColor}
      />
    </div>
  );
};

export default Level1Form;