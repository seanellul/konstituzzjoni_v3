"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-gradient-to-r from-white via-white to-gray-50 border-b border-gray-200 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              {/* You can add a small logo here if available */}
              <span className="text-primary-DEFAULT font-serif font-bold text-xl group-hover:text-primary-700 transition-colors duration-200">
                Kostituzzjoni.mt
              </span>
            </Link>
          </div>
          <div className="flex space-x-6 md:space-x-10">
            <Link
              href="/"
              className={`${
                pathname === '/'
                  ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT font-semibold'
                  : 'text-gray-700 hover:text-primary-DEFAULT hover:border-b-2 hover:border-primary-200'
              } pb-1 font-medium transition-all duration-200`}
            >
              Home
            </Link>
            <Link
              href="/constitution"
              className={`${
                pathname?.startsWith('/constitution')
                  ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT font-semibold'
                  : 'text-gray-700 hover:text-primary-DEFAULT hover:border-b-2 hover:border-primary-200'
              } pb-1 font-medium transition-all duration-200`}
            >
              Constitution
            </Link>
            <Link
              href="/search"
              className={`${
                pathname?.startsWith('/search')
                  ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT font-semibold'
                  : 'text-gray-700 hover:text-primary-DEFAULT hover:border-b-2 hover:border-primary-200'
              } pb-1 font-medium transition-all duration-200`}
            >
              Search
            </Link>
            <Link
              href="/about"
              className={`${
                pathname?.startsWith('/about')
                  ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT font-semibold'
                  : 'text-gray-700 hover:text-primary-DEFAULT hover:border-b-2 hover:border-primary-200'
              } pb-1 font-medium transition-all duration-200`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation; 