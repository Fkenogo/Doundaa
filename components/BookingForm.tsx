import React, { useState } from 'react';
import { User } from '../types';
import { ChevronRightIcon, UsersIcon, CreditCardIcon } from './icons';

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
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-end sm:items-center z-[120] transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden"></div>
                
                <div className="text-left space-y-2 mb-8">
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">Ready to Show Up?</h3>
                    <p className="text-sm font-medium text-gray-500">
                        Joining <span className="font-black text-teal-600">{activityTitle}</span> with {providerName}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-sm font-bold" />
                        </div>
                         <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Squad Size</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={pax}
                                    onChange={e => setPax(parseInt(e.target.value))}
                                    min={groupSize.min} 
                                    max={groupSize.max} 
                                    required 
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-sm font-bold"
                                />
                                <UsersIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-sm font-bold" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp / Phone</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+250 7..." className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-sm font-bold" />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Special Vibe Requests</label>
                        <textarea 
                            rows={3}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Tell the host anything..."
                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-sm font-medium resize-none"
                        ></textarea>
                    </div>

                    <div className="flex flex-col space-y-3 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#111827] text-white font-black py-5 px-6 rounded-[24px] text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-3 group"
                        >
                            <CreditCardIcon className="w-6 h-6" />
                            <span>Confirm Signup</span>
                            <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-4 text-xs font-black text-gray-400 uppercase tracking-[2px] hover:text-gray-600 transition-colors"
                        >
                            Cancel Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;