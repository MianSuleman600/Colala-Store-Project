// src/features/auth/registrationSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { saveToIndexedDB } from '../../utils/indexedDB';
import { computeProgressBreakdown, REQUIRED_FIELDS } from '../../utils/progress';

// --- Initial State (Levels/Steps) ---
const getInitialFormState = () => ({
  level1: {
    step1: {
      storeName: '',
      storeLocation: '',
      email: '',
      phoneNumber: '',
      password: '',
      referralCode: '',
    },
    step2: {
      profilePicture: null,
      storeBanner: null,
    },
    step3: {
      location: '',
      facebook: '',
      instagram: '',
      twitter: '',
      whatsapp: '',
    },
  },
  level2: {
    step1: {
      businessName: '',
      businessType: '',
      ninNumber: '',
      cacNumber: '',
    },
    step2: {
      ninSlip: null,
      cacCertificate: null,
    },
  },
  level3: {
    step1: {
      hasPhysicalStore: false,
      storeVideo: null,
    },
    step2: {
      deliveryPricing: [],
      selectedColor: '#FF0000',
      storeAddress: {
        state: '',
        localGovernment: '',
        fullAddress: '',
        openingHours: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
          day,
          from: '',
          to: '',
        })),
      },
    },
  },
});

// --- Compute Completion ---
function calculateCompletion(formData) {
  return computeProgressBreakdown(formData, REQUIRED_FIELDS).overallPercentage;
}

const initialFormData = getInitialFormState();

// --- Slice ---
const registrationSlice = createSlice({
  name: 'registration',
  initialState: {
    formData: initialFormData,
    currentLevel: 1,
    currentStep: 1,
    profileCompletion: calculateCompletion(initialFormData),
  },
  reducers: {
    loadFormData: (state, action) => {
      state.formData = action.payload || getInitialFormState();
      state.profileCompletion = calculateCompletion(state.formData);
    },
    updateStepField: (state, action) => {
      const { level, step, name, value } = action.payload;
      if (!state.formData[level]?.[step]) return;
      state.formData[level][step][name] = value;
      state.profileCompletion = calculateCompletion(state.formData);
      saveToIndexedDB(state.formData);
    },
    setLevelStep: (state, action) => {
      state.currentLevel = action.payload.level;
      state.currentStep = action.payload.step;
    },
    resetRegistration: (state) => {
      state.formData = getInitialFormState();
      state.currentLevel = 1;
      state.currentStep = 1;
      state.profileCompletion = calculateCompletion(state.formData);
      saveToIndexedDB(state.formData);
    },
  },
});

export const { updateStepField, setLevelStep, resetRegistration, loadFormData } =
  registrationSlice.actions;

export default registrationSlice.reducer;