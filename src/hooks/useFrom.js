// src/hooks/useForm.js
import { useState } from 'react';

const useForm = (initialState) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setFormData(initialState);
    };

    return {
        formData,
        handleChange,
        resetForm,
        setFormData, // Expose setFormData if you need to manually set values
    };
};

export default useForm;