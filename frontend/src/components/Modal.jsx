import React from 'react';
import Timeline from './Timeline';
import { getStatusBadge, formatDate } from '../utils/statusHelpers';

const Modal = ({ isOpen, onClose, title, children, wide = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity modal-overlay"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-darker rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full modal-content">
          {wide && (
            <div className="hidden sm:block sm:max-w-2xl sm:w-full">
              <div className="inline-block align-bottom bg-darker rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <ModalContent title={title} onClose={onClose}>
                  {children}
                </ModalContent>
              </div>
            </div>
          )}
          
          {!wide && (
            <ModalContent title={title} onClose={onClose}>
              {children}
            </ModalContent>
          )}
        </div>
      </div>
    </div>
  );
};

const ModalContent = ({ title, onClose, children }) => (
  <>
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-200 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Content */}
    <div className="p-6">
      {children}
    </div>
  </>
);

export default Modal;
