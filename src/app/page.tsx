"use client";

import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ConstitutionVisualization from '@/components/ConstitutionVisualization';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import LiveInsightsWidget from '@/components/LiveInsightsWidget';

// Loading components for better UX
function HeroSectionSkeleton() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-pulse text-center">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto"></div>
      </div>
    </div>
  );
}

function FeaturesSectionSkeleton() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualizationSkeleton() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-6">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Only run client-side code after component is mounted
  useEffect(() => {
    setIsMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
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
      icon: <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-DEFAULT dark:text-primary-400" />,
      color: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30"
    },
    {
      title: "Advanced Search",
      description: "Find exactly what you're looking for with our powerful search functionality.",
      icon: <MagnifyingGlassIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30"
    },
    {
      title: "Legal Cross-References",
      description: "Understand connections between different articles and legal concepts.",
      icon: <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />,
      color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30"
    },
    {
      title: "Visual Data Insights",
      description: "Visualize constitutional elements through interactive charts and graphs.",
      icon: <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30"
    }
  ];

  // Scroll-triggered animation for the constitution paper effect
  // Only calculate on client-side to avoid window reference errors
  // Simplify or disable on mobile and for reduced motion
  const parallaxY = isMounted && !prefersReducedMotion && window.innerWidth >= 768 ? -scrollY * 0.2 : 0;
  const rotateValue = isMounted && !prefersReducedMotion && window.innerWidth >= 768 ? scrollY * 0.01 : 0;

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Suspense for performance */}
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Constitution Visualization Section */}
      <Suspense fallback={<VisualizationSkeleton />}>
        <ConstitutionVisualization />
      </Suspense>

      {/* Features Section */}
      <Suspense fallback={<FeaturesSectionSkeleton />}>
        <FeaturesSection />
      </Suspense>

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
      <section className="py-8 sm:py-12 bg-gradient-to-r from-primary-600/80 to-primary-800/90 dark:from-primary-800/70 dark:to-primary-900/80 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-3 sm:mb-4">Begin Exploring the Constitution Now</h2>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-white/90">
              Discover the rights, principles, and framework that guide Malta's democracy.
            </p>
            <Link 
                href="/constitution" 
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform w-full sm:w-auto max-w-sm mx-auto"
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