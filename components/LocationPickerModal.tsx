import React from 'react';
import { Location } from '../types';
import { MapPinIcon, NavigationIcon } from './icons';

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: Location) => void;
}

const mockLocations: Location[] = [
    { name: 'Kigali Convention Centre', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Kigali+Convention+Centre' },
    { name: 'Nyamirambo Stadium', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Nyamirambo+Stadium' },
    { name: 'Kigali Heights', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Kigali+Heights' },
    { name: 'Simba Supermarket (Downtown)', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Simba+Supermarket+Kigali' },
    { name: 'Kigali Genocide Memorial', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Kigali+Genocide+Memorial' },
    { name: 'Inema Arts Center', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Inema+Arts+Center' },
];

const mockCurrentLocation: Location = {
    name: 'Near Kigali Business Center',
    mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Kigali+Business+Center'
};


const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose, onLocationSelect }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full transform transition-all duration-300 opacity-0 animate-fade-in-up flex flex-col h-[70vh]"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Select Location</h3>
                
                {/* Mock Search Bar */}
                <div className="mb-4">
                    <input type="text" placeholder="Search for a place or address" className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:ring-teal-500 focus:border-teal-500" />
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <button 
                        onClick={() => onLocationSelect(mockCurrentLocation)}
                        className="w-full flex items-center p-3 text-left text-teal-600 font-semibold hover:bg-gray-50 rounded-lg"
                    >
                        <NavigationIcon className="w-5 h-5 mr-3" />
                        Share My Current Location
                    </button>
                    
                    <div className="border-t my-2"></div>

                    <ul>
                        {mockLocations.map(location => (
                            <li key={location.name}>
                                <button 
                                    onClick={() => onLocationSelect(location)}
                                    className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg"
                                >
                                    <div className="p-2 bg-gray-100 rounded-full mr-3">
                                        <MapPinIcon className="w-5 h-5 text-gray-500"/>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{location.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LocationPickerModal;