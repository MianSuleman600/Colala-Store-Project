// src/features/registration/hooks/useRegistration.js
import { useDispatch, useSelector } from 'react-redux';
import { updateStepField, loadFormData, loadFromIndexedDB } from '../features/auth/registrationSlice';
import { useEffect } from 'react';

export const useRegistration = () => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.registration.formData);

  // Load formData from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const savedData = await loadFromIndexedDB();
      if (savedData) dispatch(loadFormData(savedData));
    })();
  }, [dispatch]);

  // --- Handles regular field change ---
  const handleStepFieldChange = ({ step, name, value }) => {
    dispatch(updateStepField({ step, name, value }));
  };

  // --- Handles file inputs ---
  const handleFileChange = (e, step = 'step2') => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];
    dispatch(updateStepField({ step, name, value: file }));
  };

  return {
    formData,
    handleStepFieldChange,
    handleFileChange,
  };
};
