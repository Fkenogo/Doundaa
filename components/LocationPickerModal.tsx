
import React, { useState } from 'react';
import { Location } from '../types';
import { MapPinIcon, NavigationIcon, ChevronRightIcon } from './icons';

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: Location) => void;
}

const mockSuggestedLocations: Location[] = [
    { name: 'Kigali Convention Centre', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Kigali+Convention+Centre' },
    { name: 'Nyamirambo Stadium', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Nyamirambo+Stadium' },
    { name: 'Kigali Heights', mapUrl: 'https://www.google.com/maps/dir/?api=1&destination=Kigali+Heights' },
];

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose, onLocationSelect }) => {
    const [name, setName] = useState('');
    const [googleMapsUrl, setGoogleMapsUrl] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (name.trim()) {
            onLocationSelect({
                name: name.trim(),
                googleMapsUrl: googleMapsUrl.trim(),
                mapUrl: googleMapsUrl.trim() || undefined
            });
            setName('');
            setGoogleMapsUrl('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[200] transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-[40px] shadow-2xl p-8 m-4 max-w-sm w-full transform transition-all duration-300 animate-fade-in-up flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center space-y-2 mb-8">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Select Location</h3>
                    <p className="text-xs font-medium text-gray-400">Where are we meeting?</p>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Place Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Inema Arts Center" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm" 
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Google Maps Link (Optional)</label>
                        <input 
                            type="url" 
                            placeholder="Paste map link here..." 
                            value={googleMapsUrl}
                            onChange={e => setGoogleMapsUrl(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm" 
                        />
                    </div>

                    <button 
                        onClick={handleConfirm}
                        disabled={!name.trim()}
                        className="w-full bg-teal-600 text-white font-black py-4 rounded-[20px] shadow-xl shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        <span>Set Location</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Suggested</p>
                    <div className="space-y-2">
                        {mockSuggestedLocations.map(loc => (
                            <button 
                                key={loc.name}
                                onClick={() => onLocationSelect(loc)}
                                className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-2xl transition-colors group"
                            >
                                <div className="p-2 bg-gray-100 rounded-xl mr-3 group-hover:bg-teal-50 transition-colors">
                                    <MapPinIcon className="w-4 h-4 text-gray-500 group-hover:text-teal-600"/>
                                </div>
                                <span className="text-sm font-bold text-gray-700">{loc.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPickerModal;
