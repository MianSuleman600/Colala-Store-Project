import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/apiConfig';

// ---------------------------
// Service Functions
// ---------------------------

// --- Level 1 ---
const startSellerRegistration = (data) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.START,
  method: 'POST',
  data,
});

const submitL1ProfileMedia = (formData) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL1.PROFILE_MEDIA,
  method: 'POST',
  data: formData,
});

const submitL1CategoriesSocial = (data) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL1.CATEGORIES_SOCIAL,
  method: 'POST',
  data,
});

// --- Level 2 ---
const submitL2BusinessDetails = (data) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL2.BUSINESS_DETAILS,
  method: 'POST',
  data,
});

const submitL2Documents = (formData) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL2.DOCUMENTS,
  method: 'POST',
  data: formData,
});

// --- Level 3 ---
const submitL3PhysicalStore = (formData) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL3.PHYSICAL_STORE,
  method: 'POST',
  data: formData,
});

const submitL3Address = (data) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL3.ADDRESS,
  method: 'POST',
  data,
});

const submitL3Delivery = (data) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL3.DELIVERY,
  method: 'POST',
  data,
});

// ✅ ADDED: Service function for deleting a delivery price.
const deleteL3Delivery = (deliveryId) => apiRequest({
  // Your backend route is DELETE /level3/delivery/{id}
  url: `${ENDPOINTS.SELLER_ONBOARDING.LEVEL3.DELIVERY}/${deliveryId}`,
  method: 'DELETE',
});

const submitL3Theme = (data) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL3.THEME,
  method: 'POST',
  data,
});

const submitL3UtilityBill = (formData) => apiRequest({
  url: ENDPOINTS.SELLER_ONBOARDING.LEVEL3.UTILITY_BILL,
  method: 'POST',
  data: formData,
});

// ---------------------------
// React Query Mutations
// ---------------------------

export const useStartSellerRegistrationMutation = (options = {}) => useMutation({ mutationFn: startSellerRegistration, ...options });
export const useSubmitL1ProfileMediaMutation = (options = {}) => useMutation({ mutationFn: submitL1ProfileMedia, ...options });
export const useSubmitL1CategoriesSocialMutation = (options = {}) => useMutation({ mutationFn: submitL1CategoriesSocial, ...options });

export const useSubmitL2BusinessDetailsMutation = (options = {}) => useMutation({ mutationFn: submitL2BusinessDetails, ...options });
export const useSubmitL2DocumentsMutation = (options = {}) => useMutation({ mutationFn: submitL2Documents, ...options });

export const useSubmitL3PhysicalStoreMutation = (options = {}) => useMutation({ mutationFn: submitL3PhysicalStore, ...options });
export const useSubmitL3AddressMutation = (options = {}) => useMutation({ mutationFn: submitL3Address, ...options });
export const useSubmitL3DeliveryMutation = (options = {}) => useMutation({ mutationFn: submitL3Delivery, ...options });
export const useSubmitL3ThemeMutation = (options = {}) => useMutation({ mutationFn: submitL3Theme, ...options });
export const useSubmitL3UtilityBillMutation = (options = {}) => useMutation({ mutationFn: submitL3UtilityBill, ...options });

// ✅ ADDED: Export the new mutation hook for deletion.
export const useDeleteL3DeliveryMutation = (options = {}) => useMutation({ mutationFn: deleteL3Delivery, ...options });