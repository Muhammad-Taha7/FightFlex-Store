import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title = 'Success!', message = 'Operation completed successfully.', autoCloseDelay = 3000 }) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />
      
      {/* Card */}
      <div className="relative bg-white border border-gray-200 shadow-2xl rounded-3xl w-full max-w-sm p-6 text-center z-10 transform transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-transparent border-none p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Animated Green Tick */}
        <div className="flex justify-center mb-2">
          <svg className="checkmark-wrapper" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        {/* Info */}
        <h3 className="text-xl font-black text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed px-2">
          {message}
        </p>

        {/* Action button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/25 cursor-pointer border-none transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
