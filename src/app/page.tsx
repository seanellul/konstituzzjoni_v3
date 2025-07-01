"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import LiveInsightsWidget from '@/components/LiveInsightsWidget';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only run client-side code after component is mounted
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      title: "Interactive Navigation",
      description: "Easily browse through chapters and articles with an intuitive interface.",
      icon: <DocumentTextIcon className="w-8 h-8 text-primary-DEFAULT dark:text-primary-400" />,
      color: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30"
    },
    {
      title: "Advanced Search",
      description: "Find exactly what you're looking for with our powerful search functionality.",
      icon: <MagnifyingGlassIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30"
    },
    {
      title: "Legal Cross-References",
      description: "Understand connections between different articles and legal concepts.",
      icon: <BookOpenIcon className="w-8 h-8 text-green-600 dark:text-green-400" />,
      color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30"
    },
    {
      title: "Visual Data Insights",
      description: "Visualize constitutional elements through interactive charts and graphs.",
      icon: <ChartBarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30"
    }
  ];

  // Scroll-triggered animation for the constitution paper effect
  // Only calculate on client-side to avoid window reference errors
  const parallaxY = isMounted ? -scrollY * 0.2 : 0;
  const rotateValue = isMounted ? scrollY * 0.01 : 0;

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center relative overflow-hidden">
        {/* Background with subtle animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-secondary-light dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 z-0">
          <motion.div 
            className="absolute w-full h-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="absolute w-[600px] h-[600px] rounded-full bg-primary-100 dark:bg-primary-900/30 blur-3xl opacity-20 -top-64 -right-64"></div>
            <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-3xl opacity-20 top-1/2 -left-64"></div>
            <div className="absolute w-[700px] h-[700px] rounded-full bg-secondary-200 dark:bg-gray-800 blur-3xl opacity-10 -bottom-96 right-1/3"></div>
          </motion.div>
        </div>

        {/* Flying paper elements - Added more for interest */}
        <motion.div 
          className="absolute w-40 h-60 bg-white dark:bg-gray-800 rounded shadow-md opacity-10 z-10"
          initial={{ x: -100, y: -200, rotate: 10 }}
          animate={{ 
            x: [-100, 50, -70, 20],
            y: [-200, -250, -150, -180],
            rotate: [10, -5, 8, -3],
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
        />
        
        <motion.div 
          className="absolute w-32 h-48 bg-white dark:bg-gray-800 rounded shadow-md opacity-10 z-10 right-20 top-40"
          initial={{ x: 100, y: 0, rotate: -5 }}
          animate={{ 
            x: [100, 20, 70, 30],
            y: [0, 30, -20, 10],
            rotate: [-5, 8, -10, 4],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        />

        <motion.div 
          className="absolute w-28 h-40 bg-white dark:bg-gray-800 rounded shadow-md opacity-10 z-10 left-20 bottom-40"
          initial={{ x: -50, y: 50, rotate: 8 }}
          animate={{ 
            x: [-50, 20, -30, 10],
            y: [50, 20, 60, 30],
            rotate: [8, -3, 12, 2],
          }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Hero content */}
        <div className="container mx-auto px-6 relative z-20 mb-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6"
              variants={heroTextVariants}
            >
              The <span className="text-primary-DEFAULT dark:text-primary-400">Constitution</span> of Malta
              <br />
              <span className="text-3xl md:text-4xl">Interactive Edition</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              variants={itemVariants}
            >
              Explore Malta's constitution through an intuitive, modern interface that brings legal text to life.
            </motion.p>

            <motion.div 
              className="flex flex-col md:flex-row justify-center gap-4 mt-8"
              variants={itemVariants}
            >
              <Link 
                href="/constitution" 
                className="btn-primary text-lg px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Browse Chapters</span>
              </Link>
              
              <Link 
                href="/search" 
                className="btn-secondary text-lg px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Search Articles</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Constitution preview teaser - new section */}
        <div className="relative h-[100px] sm:h-[150px] mb-0 overflow-hidden mx-auto max-w-4xl">
          <motion.div 
            className="absolute w-48 sm:w-64 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-2 sm:p-3 rotate-3 left-[20%] z-30"
            initial={{ y: 100, opacity: 0, rotate: 3 }}
            animate={{ y: 0, opacity: 0.9, rotate: 3 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <div className="border-b border-gray-200 dark:border-gray-700 pb-1 sm:pb-2 mb-1 sm:mb-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-primary-DEFAULT dark:text-primary-400">Chapter I</h3>
              <h4 className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">The Republic of Malta</h4>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-800 dark:text-gray-300">
              <span className="font-bold">1.</span> Malta is a democratic republic founded on work...
            </p>
          </motion.div>

          <motion.div 
            className="absolute w-48 sm:w-64 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-2 sm:p-3 -rotate-2 right-[20%] z-20"
            initial={{ y: 100, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 0.85, rotate: -2 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            <div className="border-b border-gray-200 dark:border-gray-700 pb-1 sm:pb-2 mb-1 sm:mb-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-blue-600 dark:text-blue-400">Chapter IV</h3>
              <h4 className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">The Executive</h4>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-800 dark:text-gray-300">
              <span className="font-bold">79.</span> The executive authority of Malta is vested in the President.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator - moved up closer to the content */}
        <motion.div 
          className="mx-auto mt-0 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">Scroll to explore</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Constitution Visualization Section */}
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
                  scale: isMounted && window.innerWidth < 640 ? 0.6 : 1
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
                  scale: isMounted && window.innerWidth < 640 ? 0.6 : 1
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
                  scale: isMounted && window.innerWidth < 640 ? 0.6 : 1
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
                  scale: isMounted && window.innerWidth < 640 ? 0.6 : 1
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

              {/* Act IV Document */}
              <motion.div 
                className="absolute w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 -rotate-4 bottom-40 -left-12 z-10"
                style={{ 
                  y: scrollY > 200 ? parallaxY * 0.5 : 0,
                  rotate: scrollY > 200 ? rotateValue * 0.9 - 4 : -4,
                }}
                initial={{ rotate: -4, opacity: 0 }}
                whileInView={{ opacity: 0.9 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                  <h3 className="text-xl font-serif font-bold text-green-600 dark:text-green-400">Act IV of 1987</h3>
                  <h4 className="text-lg text-gray-700 dark:text-gray-300">1987-07-23</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-800 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-700 text-sm">
                    <span className="font-bold mr-1">109.</span> 
                    Addition of neutrality provisions (subsection 3)
                  </p>
                </div>
              </motion.div>

              {/* Chapter X Document (Finance) */}
              <motion.div 
                className="absolute w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 rotate-6 top-32 right-0 z-0"
                style={{ 
                  y: scrollY > 200 ? parallaxY * 0.3 : 0,
                  rotate: scrollY > 200 ? rotateValue * -1.3 + 6 : 6,
                }}
                initial={{ rotate: 6, opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                  <h3 className="text-xl font-serif font-bold text-purple-600 dark:text-purple-400">Chapter X</h3>
                  <h4 className="text-lg text-gray-700 dark:text-gray-300">Finance</h4>
                </div>
                <div>
                  <p className="text-gray-800 dark:text-gray-300 py-1 text-sm">
                    <span className="font-bold mr-1">102.</span> 
                    All revenues and other moneys raised or received by Malta...
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

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
              Explore the Constitution in New Ways
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our platform offers unique tools and features to help you understand and navigate Malta's founding document.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6 ${feature.color} hover:shadow-md transition-shadow transform scale-[0.6] sm:scale-100`}
                variants={itemVariants}
              >
                <div className="mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 dark:text-gray-100">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SEO Content Section - Malta Constitution Information */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
                Understanding Malta's Constitutional Law
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                The Constitution of Malta serves as the supreme law of the Republic, establishing the framework for democratic governance, fundamental rights, and the separation of powers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Fundamental Rights */}
              <motion.div 
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  🛡️ Fundamental Rights & Freedoms
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4 text-sm">
                  Chapter IV of Malta's Constitution guarantees essential human rights including freedom of expression, assembly, movement, and protection from discrimination.
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Right to Life (Article 33)</li>
                  <li>• Freedom of Expression (Article 41)</li>
                  <li>• Protection from Discrimination (Article 45)</li>
                  <li>• Freedom of Movement (Article 44)</li>
                </ul>
                <Link href="/constitution/chapter/4" className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm">
                  Read Chapter IV →
                </Link>
              </motion.div>

              {/* Government Structure */}
              <motion.div 
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">
                  🏛️ Government Structure
                </h3>
                <p className="text-red-800 dark:text-red-200 mb-4 text-sm">
                  Malta's parliamentary democracy features clear separation of powers between the executive (President & Cabinet), legislative (Parliament), and judicial branches.
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Parliamentary System (Chapter VI)</li>
                  <li>• Executive Authority (Chapter VII)</li>
                  <li>• Independent Judiciary (Chapter VIII)</li>
                  <li>• Local Government (Chapter XA)</li>
                </ul>
                <Link href="/constitution/chapter/6" className="inline-block mt-4 text-red-600 hover:underline font-medium text-sm">
                  Explore Parliament →
                </Link>
              </motion.div>

              {/* Constitutional Principles */}
              <motion.div 
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
                  ⚖️ Constitutional Principles
                </h3>
                <p className="text-green-800 dark:text-green-200 mb-4 text-sm">
                  Malta's Constitution establishes core democratic principles including the rule of law, constitutional supremacy, and neutrality in international affairs.
                </p>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Democratic Republic (Article 1)</li>
                  <li>• Constitutional Supremacy (Article 6)</li>
                  <li>• Neutrality (Article 1.3)</li>
                  <li>• Rule of Law & Equality</li>
                </ul>
                <Link href="/constitution/chapter/1" className="inline-block mt-4 text-green-600 hover:underline font-medium text-sm">
                  Read Chapter I →
                </Link>
              </motion.div>
            </div>

            {/* Key Facts Section */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Malta Constitution: Key Facts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">1964</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Constitution Established</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">11</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Main Chapters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">124</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Constitutional Articles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">2</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Official Languages</div>
                </div>
              </div>
              <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Access both <strong>constitution.mt</strong> and <strong>kostituzzjoni.mt</strong> for comprehensive constitutional information in Malta's bilingual legal framework.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600/80 to-primary-800/90 dark:from-primary-800/70 dark:to-primary-900/80 text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-serif mb-4">Begin Exploring the Constitution Now</h2>
            <p className="text-xl mb-6 text-white/90">
              Discover the rights, principles, and framework that guide Malta's democracy.
            </p>
            <Link 
                href="/constitution" 
                className="btn-secondary text-lg px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform w-1/2 mx-auto"
              >
                <BookOpenIcon className="w-5 h-5" />
                <span>Start Reading</span>
              </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 