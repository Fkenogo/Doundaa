import React, { useState } from 'react';
import { User } from '../types';

export interface BookingDetails {
    name: string;
    email: string;
    phone: string;
    pax: number;
    message: string;
}

interface BookingFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: BookingDetails) => void;
    activityTitle: string;
    providerName: string;
    groupSize: { min: number; max: number };
    user: User;
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, onSubmit, activityTitle, providerName, groupSize, user }) => {
    const [pax, setPax] = useState(groupSize.min);
    const [message, setMessage] = useState('');
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, email, phone, pax, message });
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-md w-full transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-left">
                    <h3 className="text-xl leading-6 font-bold text-gray-900">Join this Doundaa</h3>
                    <p className="text-sm text-gray-500 mt-1">for <span className="font-semibold text-teal-600">{activityTitle}</span> with {providerName}</p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="pax" className="block text-sm font-medium text-gray-700">Number of People</label>
                                <input 
                                    type="number" 
                                    id="pax" 
                                    value={pax}
                                    onChange={e => setPax(parseInt(e.target.value))}
                                    min={groupSize.min} 
                                    max={groupSize.max} 
                                    required 
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+250 7..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                        </div>
                        
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (optional)</label>
                            <textarea 
                                id="message" 
                                rows={3}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Any questions or special requests for the provider?"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                                Let's Doundaa!
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;