'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useActiveUsersStore } from '@/lib/activeUsersStore';

export default function ActiveUsersCounter() {
  const [loading, setLoading] = useState<boolean>(true);
  const prevCount = useRef<number>(0);
  const [pulsing, setPulsing] = useState<boolean>(false);
  
  // Use the shared store for active users count
  const { count: activeUsers, fetch } = useActiveUsersStore();

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      await fetch();
      setLoading(false);
    };
    
    fetchData();
    
    // No need for interval here since it's handled by the store
  }, [fetch]);
  
  // Handle count changes for animation
  useEffect(() => {
    if (!loading && prevCount.current !== activeUsers) {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 1000);
      prevCount.current = activeUsers;
    }
  }, [activeUsers, loading]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 px-2 py-1 rounded-full"
      title="People reading right now"
    >
      <motion.div 
        animate={{ 
          scale: pulsing ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <UserGroupIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span 
          key={activeUsers}
          className="text-green-600 dark:text-green-400 font-semibold text-sm min-w-[1rem] text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? "..." : activeUsers}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
} 