import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Notification({ message, type = 'success', onClose }) {
  const bgColor = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700'
  }[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 p-4 rounded-lg border ${bgColor} shadow-lg z-50`}
      >
        <div className="flex items-center gap-2">
          <span>{message}</span>
          <button 
            onClick={onClose}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 