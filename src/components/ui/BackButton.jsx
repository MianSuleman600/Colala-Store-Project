// src/components/ui/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BackButton = ({
  fallback = '/',
  className = '',
  iconClassName = 'w-5 h-5',
  title = 'Back',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    try {
      if (window.history && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(fallback);
      }
    } catch {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow border border-gray-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 ${className}`}
      aria-label={title}
      title={title}
    >
      <ArrowLeftIcon className={iconClassName} />
      <span className="text-sm">Back</span>
    </button>
  );
};

export default BackButton;