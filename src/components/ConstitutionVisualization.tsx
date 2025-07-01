'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LiveInsightsWidget from '@/components/LiveInsightsWidget';

export default function ConstitutionVisualization() {
  const [scrollY, setScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-triggered animation for the constitution paper effect
  const parallaxY = isMounted ? -scrollY * 0.2 : 0;
  const rotateValue = isMounted ? scrollY * 0.01 : 0;

  return (
    <section className="py-8 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Left side: Interactive Constitution Document */}
          <div className="relative h-[280px] sm:h-[400px]">
            {/* Chapter 1 Document (Foreground) */}
            <motion.div 
              className="absolute w-full max-w-[60%] sm:max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-6 z-40 left-[5%] sm:left-20"
              style={{ 
                y: scrollY > 200 ? parallaxY : 0,
                rotate: scrollY > 200 ? rotateValue : 0,
                transformPerspective: 1000,
                scale: isMounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 0.6 : 1
              }}
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-4 mb-2 sm:mb-4">
                <h3 className="text-base sm:text-xl font-serif font-bold text-primary-DEFAULT dark:text-primary-400">Chapter I</h3>
                <h4 className="text-sm sm:text-lg text-gray-700 dark:text-gray-300">The Republic of Malta</h4>
              </div>
              <div className="space-y-1 sm:space-y-3">
                <motion.p 
                  className="text-xs sm:text-base text-gray-800 dark:text-gray-300 py-1 sm:py-2 border-b border-gray-100 dark:border-gray-700"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <span className="font-bold mr-1 sm:mr-2">1.</span> 
                  Malta is a democratic republic founded on work and on respect for the fundamental rights and freedoms of the individual.
                </motion.p>
                <motion.p 
                  className="text-xs sm:text-base text-gray-800 dark:text-gray-300 py-1 sm:py-2 border-b border-gray-100 dark:border-gray-700"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <span className="font-bold mr-1 sm:mr-2">2.</span> 
                  The territories of Malta consist of those territories comprised in Malta immediately before the appointed day...
                </motion.p>
                <motion.p 
                  className="text-xs sm:text-base text-gray-800 dark:text-gray-300 py-1 sm:py-2 border-b border-gray-100 dark:border-gray-700"
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <span className="font-bold mr-1 sm:mr-2">3.</span> 
                  Malta is a neutral state actively pursuing peace, security and social progress among all nations...
                </motion.p>
              </div>
              <div className="mt-2 sm:mt-4 flex justify-end">
                <Link href="/constitution/chapter/1" className="text-xs sm:text-base text-primary-DEFAULT dark:text-primary-400 hover:underline flex items-center gap-1">
                  <span>Continue reading</span>
                  <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Chapter III Document - Fundamental Rights */}
            <motion.div 
              className="absolute w-full max-w-[55%] sm:max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3 sm:p-6 rotate-2 top-4 -left-4 sm:-left-8 z-30"
              style={{ 
                y: scrollY > 200 ? parallaxY * 0.85 : 0,
                rotate: scrollY > 200 ? rotateValue * 0.9 + 2 : 2,
                scale: isMounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 0.6 : 1
              }}
              initial={{ rotate: 2, opacity: 0 }}
              whileInView={{ opacity: 0.95 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-3 mb-2 sm:mb-3">
                <h3 className="text-base sm:text-xl font-serif font-bold text-amber-600 dark:text-amber-400">Chapter III</h3>
                <h4 className="text-sm sm:text-lg text-gray-700 dark:text-gray-300">Fundamental Rights and Freedoms</h4>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold mr-1 sm:mr-2">32.</span> 
                  Whereas every person in Malta is entitled to the fundamental rights and freedoms...
                </p>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold mr-1 sm:mr-2">33.</span> 
                  The right to life shall be protected by law...
                </p>
              </div>
            </motion.div>

            {/* Chapter IV Document (Executive) */}
            <motion.div 
              className="absolute w-full max-w-[50%] sm:max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3 sm:p-6 rotate-3 bottom-5 -left-4 sm:-left-10 z-50"
              style={{ 
                y: scrollY > 200 ? parallaxY * 0.7 : 0,
                rotate: scrollY > 200 ? rotateValue * 0.8 + 3 : 3,
                scale: isMounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 0.6 : 1
              }}
              initial={{ rotate: 3, opacity: 0 }}
              whileInView={{ opacity: 0.9 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-3 mb-2 sm:mb-3">
                <h3 className="text-base sm:text-xl font-serif font-bold text-blue-600 dark:text-blue-400">Chapter IV</h3>
                <h4 className="text-sm sm:text-lg text-gray-700 dark:text-gray-300">The Executive</h4>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold mr-1 sm:mr-2">79.</span> 
                  The executive authority of Malta is vested in the President.
                </p>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold mr-1 sm:mr-2">80.</span> 
                  There shall be a Cabinet for Malta which shall consist of the Prime Minister and such number of other Ministers...
                </p>
              </div>
            </motion.div>

            {/* Chapter VI Document - Parliament */}
            <motion.div 
              className="absolute w-full max-w-[45%] sm:max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3 sm:p-6 rotate-5 top-8 sm:top-16 right-1 sm:-right-0 z-20"
              style={{ 
                y: scrollY > 200 ? parallaxY * 0.6 : 0,
                rotate: scrollY > 200 ? rotateValue * -1.7 + 5 : 5,
                scale: isMounted && typeof window !== 'undefined' && window.innerWidth < 640 ? 0.6 : 1
              }}
              initial={{ rotate: 5, opacity: 0 }}
              whileInView={{ opacity: 0.85 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-3 mb-2 sm:mb-3">
                <h3 className="text-base sm:text-xl font-serif font-bold text-orange-600 dark:text-orange-400">Chapter VI</h3>
                <h4 className="text-sm sm:text-lg text-gray-700 dark:text-gray-300">Parliament</h4>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold mr-1 sm:mr-2">51.</span> 
                  There shall be a Parliament of Malta which shall consist of the President and a House of Representatives.
                </p>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-bold mr-1 sm:mr-2">52.</span> 
                  The House of Representatives shall consist of such number of members...
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right side: Text */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
              Bringing Malta's Constitution <br/>
              <span className="text-primary-DEFAULT dark:text-primary-400">to Life</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              More than just text, our interactive Constitution of Malta transforms legal language into an engaging, accessible experience for all citizens.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Discover the structure, principles and articles that form the foundation of Malta's democracy through a modern, user-friendly interface.
            </p>
            
            {/* Live Analytics Widget */}
            <div className="mb-6">
              <LiveInsightsWidget />
            </div>
            
            <Link 
              href="/about" 
              className="text-primary-DEFAULT dark:text-primary-400 font-medium hover:underline flex items-center gap-2 group"
            >
              <span>Learn more about this project</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}