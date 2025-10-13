// src/features/auth/registrationSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { saveToIndexedDB } from '../../utils/indexedDB';
import { computeProgressBreakdown, REQUIRED_FIELDS } from '../../utils/progress';


const getInitialFormState = () => ({
  level1: {
    step1: { storeName: '', storeLocation: '', email: '', phoneNumber: '', password: '', referralCode: '' },
    step2: { profilePicture: null, storeBanner: null },
    step3: { categories: [], whatsapp: '', instagram: '', facebook: '', twitter: '' },
  },
  level2: {
    step1: { businessName: '', businessType: '', ninNumber: '', cacNumber: '' },
    step2: { ninSlip: null, cacCertificate: null },
  },
  level3: {
    step1: { hasPhysicalStore: false, storeVideo: null },
    step2: { storeAddress: { state: '', localGovernment: '', fullAddress: '', openingHours: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ day, from: '', to: '' })) } },
    step3: { deliveryPricing: [] }, // Step 3
    step4: { utilityBill: null }, // Step 4
    step5: { selectedColor: '#EF4444' }, // Step 5
  },
});

const registrationSlice = createSlice({
  name: 'registration',
  initialState: {
    formData: getInitialFormState(),
    currentLevel: 1,
    currentStep: 1,
    // This is the LIVE, client-side calculated progress for immediate UI feedback.
    profileCompletion: 0, 
  },
  reducers: {
    loadFormData: (state, action) => {
      state.formData = action.payload || getInitialFormState();
      state.profileCompletion = computeProgressBreakdown(state.formData, REQUIRED_FIELDS).overallPercentage;
    },
    updateStepField: (state, action) => {
      const { level, step, name, value } = action.payload;
      if (state.formData[level]?.[step]) {
        state.formData[level][step][name] = value;
        // Recalculate live progress on every field change.
        state.profileCompletion = computeProgressBreakdown(state.formData, REQUIRED_FIELDS).overallPercentage;
        saveToIndexedDB(state.formData);
      }
    },
    setLevelStep: (state, action) => {
      state.currentLevel = action.payload.level;
      state.currentStep = action.payload.step;
    },
    resetRegistration: (state) => {
      state.formData = getInitialFormState();
      state.currentLevel = 1;
      state.currentStep = 1;
      state.profileCompletion = 0;
      saveToIndexedDB(state.formData);
    },
  },
});

export const { updateStepField, setLevelStep, resetRegistration, loadFormData } = registrationSlice.actions;
export default registrationSlice.reducer;