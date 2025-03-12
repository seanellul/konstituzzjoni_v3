'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode !== null) {
      // Use saved preference
      setDarkMode(savedMode === 'true');
    } else {
      // Otherwise check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode changes to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
      whileTap={{ scale: 0.9 }}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative w-5 h-5"
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-400 absolute" />
        ) : (
          <MoonIcon className="w-5 h-5 text-blue-800 absolute" />
        )}
      </motion.div>
    </motion.button>
  );
} 