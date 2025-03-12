'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InappropriateSearchNoticeProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function InappropriateSearchNotice({ 
  isVisible, 
  onClose 
}: InappropriateSearchNoticeProps) {
  // Auto-close the popup after 6 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 9000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-md"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">Hmm, are you trolling?</h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>
                    'Sup. Looks like you searched for something inappropriate.
                    <br />
                    Are you really trying to search for this term?
                    <br />
                    Inappropriate searches are tracked. 
                    <br />
                    You've been warned.
                  </p>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm font-medium text-orange-800 hover:text-orange-600 focus:outline-none"
                  >
                    Understood.
                  </button>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={onClose}
                  className="-mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex text-orange-500 hover:bg-orange-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 