// src/features/products/pages/BoostAdPreviewPage.jsx

import React, { useState, Fragment, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../../components/ui/Button";
import {
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Transition, Dialog } from "@headlessui/react";
import { getContrastTextColor } from "../../../utils/colorUtils";
import { useProductDetailsQuery } from "../../../services/queries/useproductsQuery";
import { useToast } from "../../../components/ui/ToastProvider";
import { useAdsWalletQuery } from "../../../services/queries/useAdsWalletQuery";
import { useAdsTopUpMutation } from "../../../services/mutations/useAdsWalletMutation";
import {
  useGetBoostPreviewMutation,
  useCreateBoostMutation,
} from "../../../services/mutations/useBoostMutations";

import ShoppingCartIconPng from "../../../assets/icons/shopping-cart.png";
import SponsoredIconPng from "../../../assets/icons/Sponsored.png";
import EditIconPng from "../../../assets/icons/edit.png";

const fmtCurrency = (n, currency = "₦") =>
  `${currency}${Intl.NumberFormat().format(Number(n || 0))}`;

const TopUpModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  currency = "₦",
}) => {
  const [amount, setAmount] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    await onConfirm?.(amt);
    setAmount("");
  };
  const quickAdd = (v) => setAmount((prev) => String(Number(prev || 0) + v));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Top Up Ads Wallet
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded border-gray-300"
                      placeholder="Enter amount"
                    />
                    <div className="mt-2 flex gap-2">
                      {[1000, 5000, 10000].map((v) => (
                        <Button
                          key={v}
                          type="button"
                          onClick={() => quickAdd(v)}
                        >
                          +{fmtCurrency(v, currency)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing..." : "Confirm Top Up"}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const BoostAdPreviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() || {};
  const { push } = useToast();

  const brandColor = useSelector((s) => s.ui?.brandColor) || "#EF4444";
  const contrastTextColor = getContrastTextColor(brandColor);

  const {
    dailyBudget = 2000,
    duration = 7,
    selectedLocation = "Lagos, Nigeria",
  } = state || {};

  // Use the product data passed from boost setup page, fallback to query if needed
  const passedProduct = state?.product;
  const { data: queryProduct, isLoading: productLoading } =
    useProductDetailsQuery(productId, {
      enabled: !!productId && !passedProduct,
    });

  const product = passedProduct || queryProduct;
  const { data: adsWallet, isLoading: walletLoading } = useAdsWalletQuery();
  const topUpMutation = useAdsTopUpMutation();

  const [previewData, setPreviewData] = useState(null);
  const { mutate: getPreview, isLoading: isPreviewLoading } =
    useGetBoostPreviewMutation({
      onSuccess: (data) => setPreviewData(data.data), // Backend nests response in 'data'
      onError: (error) =>
        push(
          error.response?.data?.message || "Could not fetch boost preview.",
          { type: "error" }
        ),
    });
  const { mutate: createBoost, isLoading: isCreatingBoost } =
    useCreateBoostMutation({
      onSuccess: () => {
        push("Product boost created successfully!", { type: "success" });
        navigate("/my-products");
      },
      onError: (error) =>
        push(error.response?.data?.message || "Failed to create boost.", {
          type: "error",
        }),
    });

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  useEffect(() => {
    if (productId && dailyBudget && duration) {
      getPreview({
        product_id: productId,
        budget: dailyBudget,
        duration: duration,
      });
    }
  }, [productId, dailyBudget, duration, getPreview]);

  if (productLoading && !passedProduct)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading preview...
      </div>
    );
  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load product.
      </div>
    );

  // Get the correct image - prioritize the primaryImage passed from boost setup
  const getDisplayImage = () => {
    // First try the primaryImage passed from boost setup
    if (product.primaryImage?.path) {
      return `${
        import.meta.env.VITE_API_URL || "https://colala.hmstech.xyz"
      }/storage/${product.primaryImage.path}`;
    }

    // Then try to find the main image from the images array
    const mainImage = product.images?.find((img) => img.is_main === 1);
    if (mainImage?.path) {
      return `${
        import.meta.env.VITE_API_URL || "https://colala.hmstech.xyz"
      }/storage/${mainImage.path}`;
    }

    // Fallback to first image
    if (product.images?.[0]?.path) {
      return `${
        import.meta.env.VITE_API_URL || "https://colala.hmstech.xyz"
      }/storage/${product.images[0].path}`;
    }

    // Last resort fallbacks
    return (
      product.imageUrl ||
      product.detailsPageInfo?.mainImageUrl ||
      "/placeholder.png"
    );
  };

  const displayImage = getDisplayImage();
  const totalApproximateSpend = previewData?.total ?? 0;
  const currency = adsWallet?.currency || "₦";
  const spendingBalance = Number(adsWallet?.availableBalance || 0);
  const insufficient = totalApproximateSpend > spendingBalance;

  // Debug logging
  console.log("BoostAdPreviewPage - Product data:", product);
  console.log("BoostAdPreviewPage - Primary image:", product?.primaryImage);
  console.log("BoostAdPreviewPage - Images array:", product?.images);
  console.log("BoostAdPreviewPage - Display image URL:", displayImage);
  console.log("BoostAdPreviewPage - Price data:", {
    price: product?.price,
    discount_price: product?.discount_price,
    currentPrice: product?.currentPrice,
    originalPrice: product?.originalPrice,
  });

  const estimatedReach = previewData?.estimated?.reach ?? "...";
  const estimatedClicks = previewData?.estimated?.clicks ?? "...";

  const handleBoostProduct = () => {
    if (insufficient || isCreatingBoost || isPreviewLoading) return;
    createBoost({
      product_id: productId,
      budget: dailyBudget,
      duration: duration,
    });
  };

  const onTopUpConfirm = async (amount) => {
    try {
      await topUpMutation.mutateAsync({ amount });
      push("Top up successful.", { type: "success" });
      setIsTopUpOpen(false);
    } catch (err) {
      push(err?.message || "Failed to top up", { type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        My product / Product details /{" "}
        <span style={{ color: brandColor }}>Boost Product</span>
      </h1>
      <p className="text-lg font-semibold text-gray-700 mb-6">
        Your ad is almost ready
      </p>

      <div className="flex w-full md:w-1/2 justify-between bg-white p-3 rounded-2xl border items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Ad Preview</h3>
        <img
          src={EditIconPng}
          alt="Edit Ad"
          className="h-5 w-5 cursor-pointer hover:opacity-75"
          onClick={() =>
            navigate(`/my-products/${productId}/boost-setup`, { state })
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Preview Card */}
        <div className="flex flex-col">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <img src={SponsoredIconPng} alt="Sponsored" className="h-6" />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span
                className="text-2xl font-bold"
                style={{ color: brandColor }}
              >
                {fmtCurrency(
                  product.discount_price ||
                    product.price ||
                    product.currentPrice ||
                    0
                )}
              </span>
              {product.discount_price && product.price && (
                <span className="text-lg text-gray-500 line-through">
                  {fmtCurrency(product.price)}
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={handleBoostProduct}
            className="w-full mt-6 py-3 rounded-lg font-semibold shadow-md transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              backgroundColor: insufficient ? "#9CA3AF" : brandColor,
              color: contrastTextColor,
            }}
            disabled={insufficient || isCreatingBoost || isPreviewLoading}
            title={insufficient ? "Insufficient wallet balance" : undefined}
          >
            {isCreatingBoost
              ? "Boosting..."
              : insufficient
              ? "Insufficient Balance"
              : "Boost Product"}
          </Button>
        </div>

        {/* Right column: Summary */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Audience Location
            </h3>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" /> {selectedLocation}
              </span>
              <button
                className="text-sm font-medium"
                style={{ color: brandColor }}
                onClick={() =>
                  navigate(`/my-products/${productId}/boost-setup`, { state })
                }
              >
                Edit
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Budget & Duration
            </h3>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-gray-600">
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />{" "}
                {fmtCurrency(dailyBudget)}/day for {duration} days
              </span>
              <button
                className="text-sm font-medium"
                style={{ color: brandColor }}
                onClick={() =>
                  navigate(`/my-products/${productId}/boost-setup`, { state })
                }
              >
                Edit
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
            <span className="text-lg text-gray-800">
              Total Approximate Spend
            </span>
            <span className="text-xl font-bold" style={{ color: brandColor }}>
              {isPreviewLoading
                ? "Calculating..."
                : fmtCurrency(totalApproximateSpend, currency)}
            </span>
          </div>
          <div className="w-full bg-gradient-to-r from-red-600 to-purple-800 rounded-lg p-4 text-white">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-lg font-semibold">
                Spending Wallet Balance {walletLoading ? "(...)" : ""}
              </span>
              <Button
                className="px-4 py-2 text-sm font-semibold rounded-md border border-white"
                style={{ backgroundColor: "white", color: brandColor }}
                onClick={() => setIsTopUpOpen(true)}
              >
                Top Up
              </Button>
            </div>
            <span className="text-3xl font-bold">
              {fmtCurrency(spendingBalance, currency)}
            </span>
            {insufficient && !isPreviewLoading && (
              <p className="mt-2 text-sm text-white/90">
                You need{" "}
                {fmtCurrency(totalApproximateSpend - spendingBalance, currency)}{" "}
                more.
              </p>
            )}
          </div>
          <div className="w-full bg-red-600 rounded-lg p-4 text-white flex justify-between items-center">
            <span className="text-lg font-semibold">Estimated Reach</span>
            <span className="text-lg font-medium">
              {isPreviewLoading ? "..." : estimatedReach}
            </span>
          </div>
          <div className="w-full bg-red-600 rounded-lg p-4 text-white flex justify-between items-center">
            <span className="text-lg font-semibold">
              Estimated Product Clicks
            </span>
            <span className="text-lg font-medium">
              {isPreviewLoading ? "..." : estimatedClicks}
            </span>
          </div>
        </div>
      </div>
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onConfirm={onTopUpConfirm}
        loading={topUpMutation.isLoading}
        currency={currency}
      />
    </div>
  );
};

export default BoostAdPreviewPage;
