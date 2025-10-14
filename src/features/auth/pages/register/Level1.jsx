import React, { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
// FIXED: Import useSelector to check for authentication status
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../../api/apiClient";
import { ENDPOINTS } from "../../../../api/apiConfig";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import StepIndicator from "../../../../components/ui/StepIndicator";
import { useToast } from "../../../../components/ui/ToastProvider";
import EnterEmailModal from "../../../../components/models/EnterEmailModal";
import OtpInputModal from "../../../../components/models/ResetPasswordModal";
import SetNewPasswordModal from "../../../../components/models/SetNewPasswordModal";
import { authService } from "../../../../services/authService";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  CameraIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const locations = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"];
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_IMAGE_MB = 5;

// FIXED: The query hook now accepts an 'enabled' prop to control when it runs
const useGetCatalogCategoriesQuery = ({ enabled }) =>
  useQuery({
    queryKey: ["catalogCategories"],
    queryFn: () =>
      apiRequest({ url: ENDPOINTS.SELLER_ONBOARDING.CATALOG.CATEGORIES }),
    staleTime: 1000 * 60 * 5,
    // This is the key: the query will NOT run if enabled is false.
    enabled: enabled,
  });

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
  contrastColor = "#EBEBEB",
}) => {
  const { push } = useToast();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // States for upgrade/password change flow
  const [showEnterEmail, setShowEnterEmail] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSetNewPassword, setShowSetNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [processing, setProcessing] = useState({
    send: false,
    verify: false,
    reset: false,
  });

  // FIXED: Get the token from Redux state to check if user is authenticated
  const authToken = useSelector((state) => state.auth.token);

  // FIXED: Conditionally enable the query. It will only fetch data if the user
  // has a token AND is currently on step 3.
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCatalogCategoriesQuery({
      enabled: !!authToken && activeStep === 3,
    });

  const availableCategories = categoriesData?.items || [];

  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const isStepValid = useMemo(() => {
    switch (activeStep) {
      case 1:
        const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
        const isPasswordValid =
          mode === "register"
            ? formData.password && formData.password.length >= 6
            : true;
        return !!(
          formData.storeName &&
          formData.storeLocation &&
          formData.email &&
          isEmailValid &&
          formData.phoneNumber &&
          isPasswordValid
        );
      case 2:
        return !!(formData.profilePicture && formData.storeBanner);
      case 3:
        return !!(formData.categories && formData.categories.length > 0);
      default:
        return false;
    }
  }, [formData, activeStep, mode]);

  // COMPLETED: Validation logic to set specific error messages
  const validateStep = () => {
    const newErrors = {};
    switch (activeStep) {
      case 1:
        if (!formData.storeName)
          newErrors.storeName = "Store name is required.";
        if (!formData.storeLocation)
          newErrors.storeLocation = "Location is required.";
        if (!formData.email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Email is invalid.";
        if (!formData.phoneNumber)
          newErrors.phoneNumber = "Phone number is required.";
        if (
          mode === "register" &&
          (!formData.password || formData.password.length < 6)
        ) {
          newErrors.password = "Password must be at least 6 characters.";
        }
        break;
      case 2:
        if (!formData.profilePicture)
          push("Profile picture is required.", { type: "error" });
        if (!formData.storeBanner)
          push("Store banner is required.", { type: "error" });
        break;
      case 3:
        if (!formData.categories || formData.categories.length === 0) {
          push("Please select at least one category.", { type: "error" });
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (isStepValid) {
      onNext();
    } else {
      // Trigger validation to show error messages
      validateStep();
      push("Please fill all required fields.", { type: "error" });
    }
  };

  const handleRemoveCategory = (categoryId) => {
    const updated = (formData.categories || []).filter(
      (id) => id !== categoryId
    );
    handleChange({ target: { name: "categories", value: updated } });
  };

  // --- Upgrade mode handlers (Password Change Flow) ---
  const handleOpenChangePassword = () => setShowEnterEmail(true);

  // COMPLETED: Email submission logic
  const handleEmailSubmit = async (email) => {
    setProcessing((p) => ({ ...p, send: true }));
    try {
      // Use your actual service method here
      await authService.sendResetCode({ email });
      push("A verification code has been sent to your email.", {
        type: "success",
      });
      setResetEmail(email);
      setShowEnterEmail(false);
      setShowOtp(true);
    } catch (error) {
      push(error.message || "Failed to send verification code.", {
        type: "error",
      });
    } finally {
      setProcessing((p) => ({ ...p, send: false }));
    }
  };

  // COMPLETED: OTP confirmation logic
  const handleOtpConfirm = async (otp) => {
    setProcessing((p) => ({ ...p, verify: true }));
    try {
      // Use your actual service method here
      await authService.verifyResetCode({ email: resetEmail, code: otp });
      push("OTP verified successfully.", { type: "success" });
      setResetOtp(otp);
      setShowOtp(false);
      setShowSetNewPassword(true);
    } catch (error) {
      push(error.message || "Invalid OTP. Please try again.", {
        type: "error",
      });
    } finally {
      setProcessing((p) => ({ ...p, verify: false }));
    }
  };

  // COMPLETED: New password submission logic
  const handleNewPassword = async (newPassword) => {
    setProcessing((p) => ({ ...p, reset: true }));
    try {
      // Use your actual service method here
      await authService.resetPassword({
        email: resetEmail,
        code: resetOtp,
        password: newPassword,
      });
      push("Password has been changed successfully.", { type: "success" });
      setShowSetNewPassword(false);
      setResetEmail(""); // Clear state
      setResetOtp("");
    } catch (error) {
      push(error.message || "Failed to reset password.", { type: "error" });
    } finally {
      setProcessing((p) => ({ ...p, reset: false }));
    }
  };

  // --- File handling ---
  // COMPLETED: Image validation logic
  const validateImage = (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      push(`Invalid file type. Please use ${ALLOWED_IMAGE_TYPES.join(", ")}.`, {
        type: "error",
      });
      return false;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      push(`File is too large. Max size is ${MAX_IMAGE_MB}MB.`, {
        type: "error",
      });
      return false;
    }
    return true;
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = null; // Clear the input if validation fails
      return;
    }
    handleFileChange(e);
  };

  const getPreviewUrl = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val; // For existing URLs
    if (val instanceof File) return URL.createObjectURL(val);
    return "";
  };

  const profilePreview = getPreviewUrl(formData.profilePicture);
  const bannerPreview = getPreviewUrl(formData.storeBanner);

  // Dynamic text for the main action button
  const proceedButtonText = useMemo(() => {
    if (activeStep === 1)
      return mode === "register" ? "Create Account" : "Proceed";
    if (activeStep === 3) return "Proceed to Level 2";
    return "Proceed";
  }, [activeStep, mode]);

  return (
    // FIXED: className syntax
    <div
      className={`w-full h-full max-h-[90vh] max-w-[470px] ${
        mode === "register"
          ? "max-w-[389px] px-2 py-4 sm:px-8"
          : "max-w-none p-0"
      }`}
    >
      {/* Header */}
      <div className="w-full p-4 border rounded-[15px] shadow-sm bg-white mt-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold" style={{ color: brandColor }}>
            Level 1
          </h4>
          <button
            className="text-sm hover:underline"
            style={{ color: brandColor }}
          >
            View Benefits
          </button>
        </div>
        <StepIndicator
          steps={[1, 2, 3]}
          currentStep={activeStep}
          brandColor={brandColor}
          contrastColor={contrastColor}
        />
      </div>

      <div className="space-y-4 mt-8 flex flex-col h-full">
        {activeStep === 1 && (
          <>
            <Input
              name="storeName"
              placeholder="Store Name"
              icon={<BuildingStorefrontIcon className="h-5 w-5" />}
              value={formData.storeName || ""}
              onChange={handleChange}
              error={errors.storeName}
            />
            <div className="relative">
              <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                name="storeLocation"
                value={formData.storeLocation || ""}
                onChange={handleChange}
                className="w-full p-3 rounded-[15px] border pl-10"
              >
                <option value="" disabled>
                  Select Location
                </option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.storeLocation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.storeLocation}
                </p>
              )}
            </div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              icon={<EnvelopeIcon className="h-5 w-5" />}
              value={formData.email || ""}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="Phone Number"
              icon={<PhoneIcon className="h-5 w-5" />}
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              error={errors.phoneNumber}
            />
            {mode === "register" && (
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                icon={<LockClosedIcon className="h-5 w-5" />}
                value={formData.password || ""}
                onChange={handleChange}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                }
                error={errors.password}
              />
            )}
            {mode === "upgrade" && (
              <div className="rounded-[15px] p-3 bg-white border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Change account password
                  </span>
                  <Button
                    type="button"
                    onClick={handleOpenChangePassword}
                    className="px-3 py-1 rounded-md text-sm"
                    style={{
                      backgroundColor: brandColor,
                      color: contrastColor,
                    }}
                  >
                    Change
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We’ll send a verification code to your email.
                </p>
              </div>
            )}
            <Input
              name="referralCode"
              placeholder="Referral Code (Optional)"
              value={formData.referralCode || ""}
              onChange={handleChange}
            />

            <div className="mt-4 flex flex-col gap-2">
              {mode === "upgrade" && (
                <Button type="button" onClick={onSaveExit}>
                  Save & Exit
                </Button>
              )}
              <Button
                type="button"
                onClick={handleProceed}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: brandColor, color: contrastColor }}
                disabled={!isStepValid}
              >
                {proceedButtonText}
              </Button>
              {mode === "register" && (
                <Button
                  type="button"
                  onClick={onLoginClick}
                  className="bg-gray-100 border"
                >
                  Login
                </Button>
              )}
            </div>
          </>
        )}

        {activeStep === 2 && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Upload profile picture
              </label>
              <div
                role="button"
                tabIndex={0}
                onClick={() => profileInputRef.current?.click()}
                className="mx-auto h-32 w-32 rounded-full flex items-center justify-center overflow-hidden bg-gray-50 border"
              >
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="h-full w-full object-cover"
                  />
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
                onChange={onFileChange}
              />
            </div>
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium">
                Upload store banner
              </label>
              <div
                role="button"
                tabIndex={0}
                onClick={() => bannerInputRef.current?.click()}
                className="w-full h-36 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 border"
              >
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="h-full w-full object-cover"
                  />
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
                onChange={onFileChange}
              />
            </div>
            <div className="flex gap-4 mt-6">
              <Button type="button" onClick={onBack}>
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              {mode === "upgrade" && (
                <Button type="button" onClick={onSaveExit}>
                  Save & Exit
                </Button>
              )}
              <Button
                type="button"
                onClick={handleProceed}
                className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: brandColor, color: contrastColor }}
                disabled={!isStepValid}
              >
                {proceedButtonText}
              </Button>
            </div>
            {mode === "register" && (
              <Button
                type="button"
                onClick={onLoginClick}
                className="bg-gray-100 border mt-2"
              >
                Login
              </Button>
            )}
          </>
        )}

        {activeStep === 3 && (
          <>
            <div className="relative">
              <div
                className="flex items-center border rounded-lg p-3 cursor-pointer"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span>
                  {formData.categories?.length
                    ? `Selected (${formData.categories.length})`
                    : "Select Category"}
                </span>
              </div>
              {showCategoryDropdown && (
                <div className="absolute mt-2 border w-full rounded-lg shadow bg-white z-20 max-h-60 overflow-y-auto">
                  {isLoadingCategories ? (
                    <div className="p-2 text-gray-500">Loading...</div>
                  ) : (
                    availableCategories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          const selected = formData.categories || [];
                          const updated = selected.includes(cat.id)
                            ? selected.filter((id) => id !== cat.id)
                            : [...selected, cat.id];
                          handleChange({
                            target: { name: "categories", value: updated },
                          });
                        }}
                        // FIXED: className syntax with template literal
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          formData.categories?.includes(cat.id)
                            ? "bg-red-100"
                            : ""
                        }`}
                      >
                        {cat.title}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.categories || []).map((catId) => {
                const category = availableCategories.find(
                  (c) => c.id === catId
                );
                return (
                  <span
                    key={catId}
                    className="px-3 py-1 rounded-full text-sm flex items-center"
                    style={{
                      backgroundColor: brandColor,
                      color: contrastColor,
                    }}
                  >
                    {category ? category.title : "..."}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(catId)}
                      className="ml-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                );
              })}
            </div>
            <Input
              name="whatsapp"
              placeholder="WhatsApp Link (Optional)"
              value={formData.whatsapp || ""}
              onChange={handleChange}
            />
            <Input
              name="instagram"
              placeholder="Instagram Link (Optional)"
              value={formData.instagram || ""}
              onChange={handleChange}
            />
            <Input
              name="facebook"
              placeholder="Facebook Link (Optional)"
              value={formData.facebook || ""}
              onChange={handleChange}
            />
            <Input
              name="twitter"
              placeholder="Twitter Link (Optional)"
              value={formData.twitter || ""}
              onChange={handleChange}
            />

            <div className="flex gap-2">
              <Button type="button" onClick={onBack}>
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              {mode === "upgrade" && (
                <Button type="button" onClick={onSaveExit}>
                  Save & Exit
                </Button>
              )}
              <Button
                type="button"
                onClick={handleProceed}
                className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: brandColor, color: contrastColor }}
                disabled={!isStepValid}
              >
                {proceedButtonText}
              </Button>
            </div>
            {mode === "register" && (
              <Button
                type="button"
                onClick={onLoginClick}
                className="bg-gray-100 border mt-2"
              >
                Login
              </Button>
            )}
          </>
        )}
      </div>

      <EnterEmailModal
        isOpen={showEnterEmail}
        onEmailSubmit={handleEmailSubmit}
        onClose={() => setShowEnterEmail(false)}
        brandColor={brandColor}
        contrastColor={contrastColor}
        isProcessing={processing.send}
      />
      <OtpInputModal
        isOpen={showOtp}
        onOtpConfirm={handleOtpConfirm}
        onClose={() => setShowOtp(false)}
        email={resetEmail}
        brandColor={brandColor}
        contrastColor={contrastColor}
        isProcessing={processing.verify}
      />
      <SetNewPasswordModal
        isOpen={showSetNewPassword}
        onSetPassword={handleNewPassword}
        onClose={() => setShowSetNewPassword(false)}
        brandColor={brandColor}
        contrastColor={contrastColor}
        isProcessing={processing.reset}
      />
    </div>
  );
};

export default Level1Form;
