// src/services/promotionsService.js
import { ENDPOINTS } from '../../api/apiConfig';
import { apiRequest } from '../../api/apiClient';

const authHeaders = (token) =>
  token
    ? { Authorization: `Bearer ${token}` }
    : {};

export const getPromotions = async (token, params = {}) => {
  const res = await apiRequest.get(ENDPOINTS.PROMOTIONS.LIST, {
    headers: authHeaders(token),
    params,
  });
  return res?.data ?? res; // support both axios and fetch-like wrappers
};

export const getPromotionDetail = async (id, token) => {
  const res = await apiRequest.get(ENDPOINTS.PROMOTIONS.DETAIL(id), {
    headers: authHeaders(token),
  });
  return res?.data ?? res;
};

export const createPromotion = async (payload, token) => {
  const res = await apiRequest.post(ENDPOINTS.PROMOTIONS.CREATE, payload, {
    headers: authHeaders(token),
  });
  return res?.data ?? res;
};

export const updatePromotion = async (id, payload, token) => {
  const res = await apiRequest.patch(ENDPOINTS.PROMOTIONS.UPDATE(id), payload, {
    headers: authHeaders(token),
  });
  return res?.data ?? res;
};

export const extendPromotion = async (id, payload, token) => {
  const res = await apiRequest.post(ENDPOINTS.PROMOTIONS.EXTEND(id), payload, {
    headers: authHeaders(token),
  });
  return res?.data ?? res;
};

export const pausePromotion = async (id, token) => {
  const res = await apiRequest.post(ENDPOINTS.PROMOTIONS.PAUSE(id), null, {
    headers: authHeaders(token),
  });
  return res?.data ?? res;
};

export const resumePromotion = async (id, token) => {
  const res = await apiRequest.post(ENDPOINTS.PROMOTIONS.RESUME(id), null, {
    headers: authHeaders(token),
  });
  return res?.data ?? res;
};

export const deletePromotion = async (id, token) => {
  const res = await apiRequest.delete(ENDPOINTS.PROMOTIONS.DELETE(id), {
    headers: authHeaders(token),
  });
  return res?.data ?? res;
};