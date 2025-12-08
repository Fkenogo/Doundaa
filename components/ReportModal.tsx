import React, { useState } from 'react';

export interface ReportDetails {
    reason: string;
    comments: string;
}

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: ReportDetails) => void;
    activityTitle: string;
}

const reportReasons = [
    "It's spam",
    "Inappropriate content or language",
    "Misleading or fraudulent information",
    "Safety concern",
    "Other",
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, activityTitle }) => {
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason) {
            onSubmit({ reason, comments });
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-md w-full transform transition-all duration-300 opacity-0 animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-left">
                    <h3 className="text-xl leading-6 font-bold text-gray-900">Report this Doundaa</h3>
                    <p className="text-sm text-gray-500 mt-1">Reporting: <span className="font-semibold text-teal-600">{activityTitle}</span></p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Why are you reporting this?</label>
                            <fieldset className="space-y-2">
                                {reportReasons.map(r => (
                                    <div key={r} className="flex items-center">
                                        <input
                                            id={r}
                                            name="report-reason"
                                            type="radio"
                                            value={r}
                                            checked={reason === r}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                                        />
                                        <label htmlFor={r} className="ml-3 block text-sm text-gray-800">{r}</label>
                                    </div>
                                ))}
                            </fieldset>
                        </div>
                        <div>
                            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Additional Comments (optional)</label>
                            <textarea 
                                id="comments" 
                                rows={3}
                                value={comments}
                                onChange={e => setComments(e.target.value)}
                                placeholder="Provide more details..."
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
                                disabled={!reason}
                                className="px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
                            >
                                Submit Report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;