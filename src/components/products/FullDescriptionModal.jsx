// src/components/products/FullDescriptionModal.jsx
import React from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const FullDescriptionModal = ({
    isOpen,                       // Boolean: modal open state
    onClose,                       // Function: close modal
    tempFullDescription,           // Object: temporary full description state
    handleFullDescriptionChange,   // Function: handle input changes
    handleSaveFullDescription,     // Function: save description to parent state
    mobileTypes = [],              // Array: fetched mobile types from API
    mobileBrands = [],             // Array: fetched mobile brands from API
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Full Description"
        >
            <div className="p-6 space-y-4">
                {/* Mobile Type */}
                <div>
                    <label htmlFor="mobileType" className="block text-sm font-medium text-gray-700 mb-1">Mobile Type</label>
                    <select
                        id="mobileType"
                        name="mobileType"
                        value={tempFullDescription.mobileType || ''}
                        onChange={handleFullDescriptionChange}
                        className="w-full h-12 px-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-xl shadow-sm"
                    >
                        <option value="">Select Mobile Type</option>
                        {mobileTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Mobile Brand */}
                <div>
                    <label htmlFor="mobileBrand" className="block text-sm font-medium text-gray-700 mb-1">Mobile Brand</label>
                    <select
                        id="mobileBrand"
                        name="mobileBrand"
                        value={tempFullDescription.mobileBrand || ''}
                        onChange={handleFullDescriptionChange}
                        className="w-full h-12 px-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-xl shadow-sm"
                    >
                        <option value="">Select Mobile Brand</option>
                        {mobileBrands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                {/* Model */}
                <Input
                    type="text"
                    name="model"
                    placeholder="Model e.g., iPhone 15 Pro Max"
                    value={tempFullDescription.model || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Storage */}
                <Input
                    type="text"
                    name="storage"
                    placeholder="Storage e.g., 256GB"
                    value={tempFullDescription.storage || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Resolution */}
                <Input
                    type="text"
                    name="resolution"
                    placeholder="Resolution e.g., 2796x1290 pixels"
                    value={tempFullDescription.resolution || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Color */}
                <Input
                    type="text"
                    name="color"
                    placeholder="Color e.g., Midnight"
                    value={tempFullDescription.color || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Display */}
                <Input
                    type="text"
                    name="display"
                    placeholder="Display e.g., Super Retina XDR"
                    value={tempFullDescription.display || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Screen Size */}
                <Input
                    type="text"
                    name="screenSize"
                    placeholder="Screen Size e.g., 6.7 inches"
                    value={tempFullDescription.screenSize || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Battery */}
                <Input
                    type="text"
                    name="battery"
                    placeholder="Battery e.g., 4,422 mAh"
                    value={tempFullDescription.battery || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Camera */}
                <Input
                    type="text"
                    name="camera"
                    placeholder="Camera e.g., 48MP Wide, 12MP Ultra Wide"
                    value={tempFullDescription.camera || ''}
                    onChange={handleFullDescriptionChange}
                    className="h-12 rounded-xl border border-gray-300 shadow-sm"
                />

                {/* Additional Details */}
                <div>
                    <label htmlFor="generalDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Details (Optional)
                    </label>
                    <textarea
                        name="generalDescription"
                        placeholder="Any additional details or features..."
                        value={tempFullDescription.generalDescription || ''}
                        onChange={handleFullDescriptionChange}
                        rows="3"
                        className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>

                <Button
                    onClick={handleSaveFullDescription}
                    className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                    Save Description
                </Button>
            </div>
        </Modal>
    );
};

export default FullDescriptionModal;
