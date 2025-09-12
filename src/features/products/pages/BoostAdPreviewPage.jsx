// src/features/products/pages/BoostAdPreviewPage.jsx
import React, { useState, Fragment } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../../components/ui/Button';
import { MapPinIcon, CurrencyDollarIcon, StarIcon, TruckIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Transition, Dialog } from '@headlessui/react';
import { getContrastTextColor } from '../../../utils/colorUtils';
import { useProductDetailsQuery } from '../../../services/queries/useproductsQuery';
import { useToast } from '../../../components/ui/ToastProvider';
import { addItem } from '../../cart/cartSlice';
import { useAdsWalletQuery } from '../../../services/queries/useAdsWalletQuery';
import { useAdsTopUpMutation } from '../../../services/mutations/useAdsWalletMutation';

import ShoppingCartIconPng from '../../../assets/icons/shopping-cart.png';
import SponsoredIconPng from '../../../assets/icons/Sponsored.png';
import EditIconPng from '../../../assets/icons/edit.png';

/* ---------- Utils ---------- */
const fmtCurrency = (n, currency = '₦') => `${currency}${Intl.NumberFormat().format(Number(n || 0))}`;

/* ---------- Top Up Modal ---------- */
const TopUpModal = ({ isOpen, onClose, onConfirm, loading, currency = '₦' }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    await onConfirm?.(amt);
    setAmount('');
  };

  const quickAdd = (v) => setAmount((prev) => String(Number(prev || 0) + v));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-lg font-bold leading-6 text-gray-900">Top Up Wallet</Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">{currency}</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-4 pl-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[1000, 5000, 10000, 50000].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => quickAdd(v)}
                          className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
                        >
                          +{fmtCurrency(v, currency)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold"
                    style={{ backgroundColor: '#EF4444', color: 'white' }}
                  >
                    {loading ? 'Processing...' : 'Top Up'}
                  </Button>
                </form>

                <p className="text-xs text-gray-500 mt-3">
                  Upon successful payment, your wallet balance will update automatically.
                </p>
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
  const dispatch = useDispatch();

  const brandColor = useSelector((s) => s.ui?.brandColor) || '#EF4444';
  const contrastTextColor = getContrastTextColor(brandColor);
  const { userId } = useSelector((s) => s.user) || {};

  const {
    dailyBudget = 2000,
    duration = 7,
    selectedLocation = 'Lagos, Nigeria',
    audienceSliderValue = 50,
  } = state || {};

  const { data: product, isLoading, isError } = useProductDetailsQuery(productId, { enabled: !!productId });

  // NEW: ads wallet
  const { data: adsWallet, isLoading: loadingWallet } = useAdsWalletQuery();
  const topUpMutation = useAdsTopUpMutation();

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading preview...</div>;
  if (isError || !product) return <div className="flex justify-center items-center h-screen text-red-500">Failed to load product.</div>;

  const displayImage = product.detailsPageInfo?.mainImageUrl || product.imageUrl || '/placeholder.png';
  const productName = product.name || 'Product';
  const currentPrice = product.currentPrice || 0;
  const originalPrice = product.originalPrice || null;
  const discountText = product.discountText || '';
  const rating = product.rating || 0;
  const hasFreeDelivery = product.hasFreeDelivery || false;

  const totalApproximateSpend = Number(dailyBudget) * Number(duration);

  const currency = adsWallet?.currency || '₦';
  const spendingBalance = Number(adsWallet?.availableBalance || 0);

  const handleBoostProduct = () => {
    // Hook up to your promotion/ads service here
    push('Product boost created successfully.', { type: 'success' });
    navigate(`/my-products/${productId}/details`);
  };

  const handleEditLocation = () => {
    navigate(`/my-products/${productId}/boost-setup`, {
      state: { dailyBudget, duration, selectedLocation, audienceSliderValue },
    });
  };

  const handleEditBudget = () => {
    navigate(`/my-products/${productId}/boost-setup`, {
      state: { dailyBudget, duration, selectedLocation, audienceSliderValue },
    });
  };

  const handleAddToCart = () => {
    const id = product?.id || productId;
    if (!id) return;
    const item = {
      id,
      name: productName,
      price: Number(currentPrice) || 0,
      image: displayImage,
    };
    dispatch(addItem({ userId: userId || 'guest', item }));
    push('Added to cart.', { type: 'success' });
  };

  const onTopUpConfirm = async (amount) => {
    try {
      await topUpMutation.mutateAsync({ amount });
      push('Top up successful.', { type: 'success' });
      setIsTopUpOpen(false);
    } catch (err) {
      // toast handled in mutation; optional:
      push(err?.message || 'Failed to top up', { type: 'error' });
    }
  };

  const insufficient = totalApproximateSpend > spendingBalance;

  return (
    <div className="container mx-auto outline-none p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Manrope' }}>
          My product / Product details / <span style={{ color: brandColor }}>Boost Product</span>
        </h1>
      </div>

      <p className="text-lg font-semibold text-gray-700 mb-6">Your ad is almost ready</p>

      <div className="flex w-full md:w-1/2 justify-between bg-white p-3 rounded-2xl border border-amber-50 items-center mb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">Ad Preview</h3>
          <p className="text-sm text-gray-500">This is how your ad will appear to your customers</p>
        </div>
        <img src={EditIconPng} alt="Edit Ad" className="h-5 w-5 cursor-pointer hover:opacity-75" onClick={handleEditBudget} />
      </div>

      <div className="rounded-lg p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 outline-none">
        {/* Preview */}
        <div className="flex flex-col rounded-lg relative p-3">
          <div className="relative bg-white rounded-2xl flex flex-col shadow-lg overflow-hidden border border-gray-100">
            <div className="relative w-full h-auto">
              <div className="absolute top-3 left-3 bg-yellow-400 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-md z-10">
                <img src={SponsoredIconPng} alt="Sponsored" className="h-4 w-auto mr-1" />
                Sponsored
              </div>

              <img src={displayImage} alt={productName} className="w-full h-64 object-cover" />

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 bg-white bg-opacity-80 backdrop-blur-sm">
                <div className="flex items-center">
                  <img src={product.profile?.profilePic || '/default-profile.png'} alt="Profile" className="w-6 h-6 rounded-full mr-2 object-cover" />
                  <span className="text-sm font-medium text-gray-800">{product.profile?.userName || 'Store'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{rating}</span>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col items-start bg-white">
              <h4 className="text-lg font-bold text-gray-900 mb-1">{productName}</h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold" style={{ color: brandColor }}>
                  ₦{Number(currentPrice).toLocaleString()}
                </span>
                {originalPrice && <span className="text-md text-gray-500 line-through">₦{Number(originalPrice).toLocaleString()}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                {hasFreeDelivery && (
                  <span className="flex items-center bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <TruckIcon className="h-3 w-3 mr-1" /> Free delivery
                  </span>
                )}
                {discountText && (
                  <span className="flex items-center bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <TagIcon className="h-3 w-3 mr-1" /> {discountText}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center w-full text-sm text-gray-600">
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" /> {selectedLocation}
                </span>
                <img
                  src={ShoppingCartIconPng}
                  alt="Shopping Cart"
                  className="h-7 w-7 cursor-pointer hover:opacity-75"
                  onClick={handleAddToCart}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleBoostProduct}
            className="w-full mt-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-70"
            style={{ backgroundColor: insufficient ? '#9CA3AF' : brandColor, color: contrastTextColor }}
            disabled={insufficient}
            title={insufficient ? 'Insufficient wallet balance for selected budget' : 'Boost Product'}
          >
            {insufficient ? 'Insufficient Balance' : 'Boost Product'}
          </Button>
        </div>

        {/* Right column: summary */}
        <div className="flex flex-col space-y-6 p-2">
          <div className="w-full h-2 rounded-lg bg-gray-300">
            <div className="h-full rounded-lg" style={{ width: `${audienceSliderValue}%`, backgroundColor: brandColor }}></div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-lg font-medium text-gray-800">{selectedLocation}</span>
            </div>
            <button onClick={handleEditLocation} className="text-gray-500 hover:text-gray-700">
              <img src={EditIconPng} alt="Edit Location" className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-lg font-medium text-gray-800">
                ₦{Number(dailyBudget).toLocaleString()} for {duration} day{duration > 1 ? 's' : ''}
              </span>
            </div>
            <button onClick={handleEditBudget} className="text-gray-500 hover:text-gray-700">
              <img src={EditIconPng} alt="Edit Budget" className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex justify-between items-center">
            <span className="text-lg text-gray-800">Total Approximate Spend</span>
            <span className="text-xl font-bold" style={{ color: brandColor }}>
              ₦{Number(totalApproximateSpend).toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-gradient-to-r from-red-600 to-purple-800 rounded-lg p-4 flex flex-col items-start text-white">
            <div className="flex justify-between items-center w-full mb-2">
              <span className="text-lg font-semibold">
                Spending Wallet Balance {loadingWallet ? '(loading...)' : ''}
              </span>
              <Button
                className="px-4 py-2 text-sm font-semibold rounded-md border border-white"
                style={{ backgroundColor: 'white', color: brandColor }}
                onClick={() => setIsTopUpOpen(true)}
              >
                Top Up
              </Button>
            </div>
            <span className="text-3xl font-bold">
              {fmtCurrency(spendingBalance, currency)}
            </span>
            {insufficient && (
              <p className="mt-2 text-sm text-white/90">
                You need {fmtCurrency(totalApproximateSpend - spendingBalance, currency)} more to run this boost.
              </p>
            )}
          </div>

          <div className="w-full bg-red-600 rounded-lg p-4 flex justify-between items-center text-white">
            <span className="text-lg font-semibold">Estimated Reach</span>
            <span className="text-lg font-medium">1k - 2k Accounts</span>
          </div>

          <div className="w-full bg-red-600 rounded-lg p-4 flex justify-between items-center text-white">
            <span className="text-lg font-semibold">Estimated Product Clicks</span>
            <span className="text-lg font-medium">500</span>
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
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