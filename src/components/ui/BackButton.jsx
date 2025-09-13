import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BackButton = ({
  fallback = '/',
  className = '',
  iconClassName = 'w-5 h-5',
  title = 'Back',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    try {
      // If history has entries, go back
      if (window.history && window.history.length > 1) {
        navigate(-1);
        return;
      }

      // If a route set `state.from`, respect it (good for PWA entry points)
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
        return;
      }

      // If referrer is same-origin, try back again (some PWA cases)
      const sameOriginReferrer =
        document.referrer && new URL(document.referrer).origin === window.location.origin;
      if (sameOriginReferrer) {
        navigate(-1);
        return;
      }

      // Otherwise, fallback (home, list page, etc.)
      navigate(fallback);
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