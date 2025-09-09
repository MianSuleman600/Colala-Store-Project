import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const CodeInputModal = ({ isOpen, onClose, onProceed, brandColor, contrastTextColor }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleProceed = () => {
    if (code.trim() === '') {
      setError('Please enter a code.');
      return;
    }
    setError('');
    onProceed(code);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Input Customer Code"
      className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="p-6 space-y-6">
        <label htmlFor="customer-code" className="sr-only sm:not-sr-only sm:text-sm">
          Customer Code
        </label>

        <input
          id="customer-code"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError('');
          }}
          placeholder="Enter code here"
          className={`w-full p-4 md:p-6 text-center text-3xl md:text-4xl lg:text-5xl border-2 rounded-xl transition-colors focus:outline-none focus:ring-4 ${
            error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400 focus:ring-opacity-50'
          }`}
        />
        {error && <p className="text-red-500 text-sm md:text-base text-center font-medium">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button onClick={onClose} className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            Go Back
          </Button>
          <Button
            onClick={handleProceed}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-lg"
            style={{ backgroundColor: brandColor, color: contrastTextColor }}
          >
            Proceed
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CodeInputModal;