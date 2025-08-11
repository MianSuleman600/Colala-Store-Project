import React, { useState } from 'react';
import Input from '../ui/Input'; // Assuming Input component is in the same directory or accessible
import Button from '../ui/Button'; // Assuming Button component is in the same directory or accessible
import { XMarkIcon, MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Importing necessary icons

/**
 * LocationSelectModal Component
 * A modal for selecting a state from a list, with search and popular locations.
 *
 * @param {object} props
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSelectLocation - Function to call with the selected location string.
 * @param {string} props.title - Title for the modal (e.g., "State" or "Local Government").
 * @param {string} [props.currentValue=''] - The currently selected value, to pre-populate search.
 * @param {Array<string>} [props.locations=[]] - Array of all available locations/states.
 * @param {Array<string>} [props.popularLocations=[]] - Array of popular locations/states.
 */
const LocationSelectModal = ({ onClose, onSelectLocation, title, currentValue = '', locations = [], popularLocations = [] }) => {
    const [searchTerm, setSearchTerm] = useState(currentValue);

    // Dummy data for demonstration purposes
    const allStates = locations.length > 0 ? locations : [
        'Abia State', 'Adamawa State', 'Akwa Ibom State', 'Anambra State', 'Bauchi State',
        'Bayelsa State', 'Benue State', 'Borno State', 'Cross River State', 'Delta State',
        'Ebonyi State', 'Edo State', 'Ekiti State', 'Enugu State', 'FCT, Abuja',
        'Gombe State', 'Imo State', 'Jigawa State', 'Kaduna State', 'Kano State',
        'Katsina State', 'Kebbi State', 'Kogi State', 'Kwara State', 'Lagos State',
        'Nasarawa State', 'Niger State', 'Ogun State', 'Ondo State', 'Osun State',
        'Oyo State', 'Plateau State', 'Rivers State', 'Sokoto State', 'Taraba State',
        'Yobe State', 'Zamfara State'
    ];

    const popularDummyLocations = popularLocations.length > 0 ? popularLocations : [
        'Lagos State', 'Oyo State', 'FCT, Abuja', 'Rivers State'
    ];


    const filteredStates = allStates.filter(state =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (location) => {
        onSelectLocation(location);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-lg transform transition-all scale-100 opacity-100 animate-slide-in-up md:max-h-[80vh] overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

                {/* Search Input */}
                <div className="relative mb-4">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-160px)] custom-scrollbar"> {/* Adjusted max-height */}
                    {/* Popular Locations */}
                    {popularDummyLocations.length > 0 && searchTerm === '' && (
                        <div className="mb-6">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Popular Locations</h3>
                            <ul className="space-y-2">
                                {popularDummyLocations.map((location, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-colala-btn rounded-2xl cursor-pointer hover:bg-gray-100" onClick={() => handleSelect(location)}>
                                        <span className="text-sm font-medium text-gray-800">{location}</span>
                                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* All States/Locations */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-2">{searchTerm === '' ? 'All States' : 'Search Results'}</h3>
                        <ul className="space-y-2">
                            {filteredStates.length > 0 ? (
                                filteredStates.map((location, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-colala-btn rounded-2xl cursor-pointer hover:bg-gray-100" onClick={() => handleSelect(location)}>
                                        <span className="text-sm font-medium text-gray-800">{location}</span>
                                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No results found.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationSelectModal;
