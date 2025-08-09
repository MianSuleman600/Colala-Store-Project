// D:\Project\frontend\src\features\auth\registrationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function to calculate profile completion percentage
const calculateCompletion = (formData, requiredFields) => {
    let completedFieldsCount = 0;
    const totalRequiredFields = requiredFields.length;

    if (totalRequiredFields === 0) {
        return 100; // Avoid division by zero if no fields are defined as required
    }

    requiredFields.forEach(field => {
        const value = formData[field];

        // Check for basic truthiness (non-null, non-undefined, non-empty string)
        if (value !== null && value !== undefined && value !== '') {
            // Special handling for specific field types
            if (Array.isArray(value)) {
                // For arrays (like deliveryPricing, selectedAddOnServices, categories), check if they have elements
                if (value.length > 0) {
                    completedFieldsCount++;
                }
            } else if (typeof value === 'object' && value instanceof File) {
                // For File objects (e.g., ninSlip, cacCertificate, profilePicture, storeBanner, storeVideo)
                completedFieldsCount++; // Presence of the file object means it's "complete" for now
            } else if (typeof value === 'object' && value !== null) {
                // For nested objects (like storeAddress), check if its required sub-fields are complete
                if (field === 'storeAddress') {
                    const addressRequired = ['state', 'localGovernment', 'fullAddress'];
                    const addressCompleted = addressRequired.every(subField =>
                        value[subField] !== null && value[subField] !== undefined && value[subField] !== ''
                    );
                    if (addressCompleted) {
                        completedFieldsCount++;
                    }
                } else {
                    // For other generic objects, consider them complete if not empty
                    if (Object.keys(value).length > 0) {
                        completedFieldsCount++;
                    }
                }
            } else {
                // For primitive values (strings, numbers, booleans)
                completedFieldsCount++;
            }
        }
    });

    return Math.round((completedFieldsCount / totalRequiredFields) * 100);
};


// Define initialFormState as a function to ensure a fresh object is returned every time.
// This prevents unintended shared references when resetting the state.
const getInitialFormState = () => ({
    // Level 1 fields
    storeName: '',
    email: '',
    phoneNumber: '',
    storeLocation: '',
    password: '',
    referralCode: '',
    // Level 2 fields
    businessName: '',
    businessType: '',
    ninNumber: '',
    cacNumber: '',
    ninSlip: null,       // File object
    cacCertificate: null, // File object
    profilePicture: null, // File object (from Level1, but could be updated later)
    storeBanner: null,    // File object (from Level1, but could be updated later)
    // Level 3 fields (and potentially "Upgrade Store" fields)
    storeVideo: null,
    hasPhysicalStore: false,
    storeAddress: {
        state: '',
        localGovernment: '',
        fullAddress: '',
        openingHours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ day, from: '', to: '' })),
    },
    deliveryPricing: [], // Array of delivery price objects
    selectedColor: '#FF0000', // This is the temporary color for registration
    selectedAddOnServices: [], // From your Register.jsx
    categories: [], // Assuming categories are also part of store setup from Level1
});

// Define the fields required for 100% profile completion
// IMPORTANT: Customize this list based on what truly makes a profile "100% complete" for your app.
// This list will determine the completion percentage.
const REQUIRED_PROFILE_FIELDS = [
    'email',
    'storeName',
    'phoneNumber',
    'storeLocation',
    'password', // Assuming password is required for initial registration
    'businessName',
    'businessType',
    'ninNumber',
    'cacNumber',
    'ninSlip',
    'cacCertificate',
    'profilePicture',
    'storeBanner',
    // 'storeVideo', // This might be optional if hasPhysicalStore is false
    'storeAddress', // This will be checked for its sub-fields in calculateCompletion
    'deliveryPricing',
    'selectedColor',
    'categories', // From Level1
];


// Create an async thunk for the API call
export const registerUser = createAsyncThunk(
    'registration/registerUser',
    async (formData, { rejectWithValue }) => {
        try {
            console.log('🟢 [registerUser] Raw formData received from frontend:', formData);

            const data = new FormData();

            for (const key in formData) {
                if (formData[key] !== null && formData[key] !== undefined) {
                    if (formData[key] instanceof File) {
                        data.append(key, formData[key]);
                    } else if (
                        typeof formData[key] === 'object' &&
                        !Array.isArray(formData[key])
                    ) {
                        // Handle nested objects like storeAddress
                        data.append(key, JSON.stringify(formData[key]));
                    } else if (Array.isArray(formData[key])) {
                        // Handle arrays like deliveryPricing, selectedAddOnServices, categories
                        data.append(key, JSON.stringify(formData[key]));
                    } else {
                        data.append(key, formData[key]);
                    }
                }
            }

            console.log('🧾 [registerUser] FormData being sent. (Note: FormData content cannot be easily logged directly):');
            // For debugging FormData content, you can iterate it like this:
            // for (let pair of data.entries()) {
            //     console.log(pair[0]+ ': ' + pair[1]);
            // }


            // --- IMPORTANT: Replace 'YOUR_API_ENDPOINT_HERE' with your actual backend API URL ---
            const response = await fetch('YOUR_API_ENDPOINT_HERE', {
                method: 'POST',
                body: data, // FormData correctly sets 'Content-Type: multipart/form-data'
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Registration failed');
            }

            const responseData = await response.json();
            console.log('✅ [registerUser] Registration successful:', responseData);

            return responseData; // This will be the action.payload on success
        } catch (error) {
            return rejectWithValue(error.message || 'Network error occurred.');
        }
    }
);

const registrationSlice = createSlice({
    name: 'registration',
    initialState: {
        formData: getInitialFormState(),
        currentStep: 1,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
        profileCompletion: 0, // NEW: Initial completion is 0
        requiredFields: REQUIRED_PROFILE_FIELDS, // NEW: Reference the defined required fields
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

            // NEW: Recalculate completion after every field update
            state.profileCompletion = calculateCompletion(state.formData, state.requiredFields);
        },
        setStep: (state, action) => {
            state.currentStep = action.payload;
        },
        resetRegistration: (state) => {
            state.formData = getInitialFormState();
            state.currentStep = 1;
            state.status = 'idle';
            state.error = null;
            state.profileCompletion = 0; // NEW: Reset completion too
        },
        // NEW: Action to explicitly set completion (useful if loading from backend)
        setProfileCompletion: (state, action) => {
            state.profileCompletion = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
                // NEW: Recalculate completion after successful registration
                state.profileCompletion = calculateCompletion(state.formData, state.requiredFields);
                // You might store a user token or user ID here if the backend returns it
                // state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'An unknown error occurred';
            });
    },
});

export const { updateField, setStep, resetRegistration, setProfileCompletion } = registrationSlice.actions;

export default registrationSlice.reducer;
