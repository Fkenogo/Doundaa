import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-lg leading-6 font-bold text-gray-900">{title}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              {children}
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;