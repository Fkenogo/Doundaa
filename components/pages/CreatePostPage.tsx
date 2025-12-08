import React, { useState } from 'react';
import { currentUser } from '../../constants';
import Modal from '../Modal';
import { User, Location } from '../../types';
import LocationPickerModal from '../LocationPickerModal';
import { MapPinIcon } from '../icons';

interface CreatePostPageProps {
  onPostCreated: () => void;
}

const verificationLevels = [
  { level: 1, name: 'New', color: 'bg-gray-400' },
  { level: 2, name: 'Bronze', color: 'bg-orange-400' },
  { level: 3, name: 'Silver', color: 'bg-gray-500' },
  { level: 4, name: 'Gold', color: 'bg-yellow-500' },
  { level: 5, name: 'Partner', color: 'bg-teal-500' },
];

const VerificationProgress: React.FC<{ currentLevel: number }> = ({ currentLevel }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700">Your Verification Level</h3>
      <div className="mt-2 flex items-stretch space-x-1">
        {verificationLevels.map((item, index) => (
          <div key={item.level} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                className={`h-2 rounded-full ${currentLevel >= item.level ? item.color : 'bg-gray-200'}`}
                ></div>
            </div>
            <p className={`mt-1 text-xs text-center ${currentLevel >= item.level ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const KYC_REQUIREMENTS: { [key: number]: string } = {
  2: 'To reach Bronze level, please provide your full name, email, and phone number.',
  3: 'To reach Silver, connect your social media accounts (coming soon).',
  4: 'To reach Gold, submit your business documents (coming soon).',
  5: 'Become an official partner by contacting our team.',
};


const KYCForm: React.FC<{ onSubmit: () => void, currentLevel: number }> = ({ onSubmit, currentLevel }) => {
    const nextLevel = currentLevel + 1;
    const requirementText = KYC_REQUIREMENTS[nextLevel] || 'You are at the highest level!';
    
    return (
        <div className="p-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <VerificationProgress currentLevel={currentLevel} />
            <h2 className="text-xl font-bold text-gray-800">Complete Your Profile</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">{requirementText}</p>
            {currentLevel < 2 && (
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="fullName" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telephone Number</label>
                        <input type="tel" id="phone" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                    </div>
                    <button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">Submit for Bronze Verification</button>
                </form>
            )}
          </div>
        </div>
    );
};


const PostForm: React.FC<{ onSubmit: () => void, user: User }> = ({ onSubmit, user }) => {
    const [isScheduled, setIsScheduled] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [location, setLocation] = useState<Location | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };
    
    const handleLocationSelect = (selectedLocation: Location) => {
        setLocation(selectedLocation);
        setIsLocationPickerOpen(false);
    };

    return (
        <>
            <div className="p-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900">Create a New Doundaa</h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">Fill in the details below to host a new doundaa.</p>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" required placeholder="e.g., Sunrise Hike on Mount Kigali" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Caption</label>
                        <textarea id="description" rows={3} required placeholder="Tell everyone about this amazing doundaa..." className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <button type="button" onClick={() => setIsLocationPickerOpen(true)} className="mt-1 flex items-center w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                            <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                            {location ? <span className="text-gray-900">{location.name}</span> : <span className="text-gray-500">Select a location</span>}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">From</label>
                            <div className="flex gap-2 mt-1">
                                <input type="date" id="start-date" required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                                <input type="time" id="start-time" required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">To</label>
                            <div className="flex gap-2 mt-1">
                                <input type="date" id="end-date" required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                                <input type="time" id="end-time" required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <input id="is-recurring" name="is-recurring" type="checkbox" className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                        <label htmlFor="is-recurring" className="ml-2 block text-sm text-gray-900">This is a recurring doundaa</label>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Images</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <label htmlFor="file-upload" className="cursor-pointer bg-teal-50 text-teal-700 font-semibold py-2 px-4 rounded-full hover:bg-teal-100 transition-colors">
                                Choose Files
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} required/>
                            {selectedFiles.length > 0 && (
                                <div className="text-sm text-gray-600">
                                    {selectedFiles.map(file => file.name).join(', ')}
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="border-gray-200" />
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input id="schedule-post" name="schedule-post" type="checkbox" checked={isScheduled} onChange={(e) => setIsScheduled(e.target.checked)} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                            <label htmlFor="schedule-post" className="ml-2 block text-sm text-gray-900">Schedule for later</label>
                        </div>
                        {isScheduled && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                 <div>
                                    <label htmlFor="publish-date" className="block text-sm font-medium text-gray-700">Publish Date</label>
                                    <input type="date" id="publish-date" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                                </div>
                                 <div>
                                    <label htmlFor="publish-time" className="block text-sm font-medium text-gray-700">Publish Time</label>
                                    <input type="time" id="publish-time" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors text-base shadow-md">
                        {isScheduled ? 'Schedule Doundaa' : 'Publish Doundaa'}
                    </button>
                </form>
              </div>
            </div>
            <LocationPickerModal
                isOpen={isLocationPickerOpen}
                onClose={() => setIsLocationPickerOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
        </>
    );
}

const CreatePostPage: React.FC<CreatePostPageProps> = ({ onPostCreated }) => {
  const [user, setUser] = useState(currentUser);
  const [step, setStep] = useState((user.verificationLevel || 1) >= 2 ? 'form' : 'kyc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKycSubmit = () => {
    // In a real app, you'd send this data to a backend.
    // Here, we'll just simulate verification and move to the next step.
    setUser({ ...user, verificationLevel: 2 });
    setStep('form');
  };
  
  const handlePostSubmit = () => {
      // In a real app, you'd upload the form data.
      setIsModalOpen(true);
  }

  const modalMessage = (user.verificationLevel || 1) >= 2 
    ? "Your doundaa has been submitted and will be reviewed shortly. As a verified provider, your posts are prioritized."
    : "Your doundaa has been submitted! Our team will review it and you'll be notified once it's live.";
  
  const modalTitle = "Doundaa Submitted!";

  return (
    <div className="max-w-md mx-auto">
        {step === 'kyc' && <KYCForm onSubmit={handleKycSubmit} currentLevel={user.verificationLevel || 1} />}
        {step === 'form' && <PostForm onSubmit={handlePostSubmit} user={user} />}
        <Modal 
            isOpen={isModalOpen}
            onClose={() => {
                setIsModalOpen(false);
                onPostCreated();
            }}
            title={modalTitle}
        >
           {modalMessage}
        </Modal>
    </div>
  );
};

export default CreatePostPage;