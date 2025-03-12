"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <motion.nav 
      aria-label="Breadcrumb" 
      className="py-3 px-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.2 }}
    >
      <ol className="flex flex-wrap items-center text-sm">
        <motion.li 
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/" 
            className="text-gray-500 hover:text-primary-DEFAULT transition-colors duration-200 flex items-center"
          >
            <HomeIcon className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
        </motion.li>
        
        {items.map((item, index) => (
          <motion.li 
            key={index}
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + (index * 0.1) }}
          >
            {index !== items.length - 1 ? (
              <>
                <Link 
                  href={item.href} 
                  className="text-gray-500 hover:text-primary-DEFAULT transition-colors duration-200"
                >
                  {item.label}
                </Link>
                <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" aria-hidden="true" />
              </>
            ) : (
              <span className="text-primary-DEFAULT font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  );
};

export default Breadcrumbs; 