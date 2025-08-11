// D:\Project\frontend\src\features\auth\registrationSlice.js

import { createSlice } from '@reduxjs/toolkit';

// --- CONSTANTS ---
// Define the fields required for 100% profile completion
const REQUIRED_PROFILE_FIELDS = [
    'email',
    'storeName',
    'phoneNumber',
    'storeLocation',
    'password',
    'businessName',
    'businessType',
    'ninNumber',
    'cacNumber',
    'ninSlip',
    'cacCertificate',
    'profilePicture',
    'storeBanner',
    'storeAddress', // This field will be checked for its sub-fields
    'deliveryPricing',
    'selectedColor',
    'categories',
];

// Define required sub-fields for nested objects to make the logic scalable
const NESTED_REQUIRED_FIELDS = {
    storeAddress: ['state', 'localGovernment', 'fullAddress'],
};

// --- HELPER FUNCTION (could be moved to a utils file) ---
// Helper function to calculate profile completion percentage
const calculateCompletion = (formData, requiredFields) => {
    let completedFieldsCount = 0;
    const totalRequiredFields = requiredFields.length;

    if (totalRequiredFields === 0) {
        return 100;
    }

    requiredFields.forEach(field => {
        const value = formData[field];
        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            if (value.length > 0) {
                completedFieldsCount++;
            }
        } else if (typeof value === 'object' && value !== null) {
            // Check for file objects created by our handleChange function
            if (value.file instanceof File) {
                completedFieldsCount++;
                return; // Exit this iteration early
            }

            const subFields = NESTED_REQUIRED_FIELDS[field];
            if (subFields) {
                const isNestedObjectComplete = subFields.every(subField =>
                    value[subField] !== null && value[subField] !== undefined && value[subField] !== ''
                );
                if (isNestedObjectComplete) {
                    completedFieldsCount++;
                }
            } else {
                if (Object.keys(value).length > 0) {
                    completedFieldsCount++;
                }
            }
        } else {
            completedFieldsCount++;
        }
    });

    return Math.round((completedFieldsCount / totalRequiredFields) * 100);
};

// --- INITIAL STATE ---
const getInitialFormState = () => ({
    storeName: '',
    email: '',
    phoneNumber: '',
    storeLocation: '',
    password: '',
    referralCode: '',
    businessName: '',
    businessType: '',
    ninNumber: '',
    cacNumber: '',
    ninSlip: null,
    cacCertificate: null,
    profilePicture: null,
    storeBanner: null,
    storeVideo: null,
    hasPhysicalStore: false,
    storeAddress: {
        state: '',
        localGovernment: '',
        fullAddress: '',
        openingHours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ day, from: '', to: '' })),
    },
    deliveryPricing: [],
    selectedColor: '#FF0000',
    selectedAddOnServices: [],
    categories: [],
});

// --- SLICE ---
const registrationSlice = createSlice({
    name: 'registration',
    initialState: {
        formData: getInitialFormState(),
        currentStep: 1,
        // 🔴 Removed: status and error properties, as they're now handled by RTK Query
        profileCompletion: 0,
        requiredFields: REQUIRED_PROFILE_FIELDS,
    },
    reducers: {
        updateField: (state, action) => {
            const { name, value } = action.payload;
            const path = name.split('.');
            let current = state.formData;

            for (let i = 0; i < path.length - 1; i++) {
                if (!current[path[i]]) {
                    current[path[i]] = {};
                }
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;

            state.profileCompletion = calculateCompletion(state.formData, state.requiredFields);
        },
        setStep: (state, action) => {
            state.currentStep = action.payload;
        },
        resetRegistration: (state) => {
            state.formData = getInitialFormState();
            state.currentStep = 1;
            // 🔴 Removed: state.status and state.error resets
            state.profileCompletion = 0;
        },
        // 🟢 New reducer to reset form data on successful submission, if needed
        // This is optional and depends on your specific app flow
        resetFormData: (state) => {
             state.formData = getInitialFormState();
        }
    },
    // 🔴 Removed: extraReducers, as the registerUser thunk is no longer needed
});

export const { updateField, setStep, resetRegistration, resetFormData } = registrationSlice.actions;

export default registrationSlice.reducer;