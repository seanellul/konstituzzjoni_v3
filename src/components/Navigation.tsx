"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/constitution" className="text-primary-DEFAULT hover:text-primary-dark font-bold text-lg">
              Kostituzzjoni.mt
            </Link>
          </div>
          <div className="flex space-x-4 md:space-x-8">
            <Link
              href="/constitution"
              className={`${
                pathname?.startsWith('/constitution')
                  ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT'
                  : 'text-gray-700 hover:text-primary-DEFAULT'
              } font-medium transition-colors`}
            >
              Constitution
            </Link>
            <Link
              href="/search"
              className={`${
                pathname?.startsWith('/search')
                  ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT'
                  : 'text-gray-700 hover:text-primary-DEFAULT'
              } font-medium transition-colors`}
            >
              Search
            </Link>
            <Link
              href="/about"
              className={`${
                pathname?.startsWith('/about')
                  ? 'text-primary-DEFAULT border-b-2 border-primary-DEFAULT'
                  : 'text-gray-700 hover:text-primary-DEFAULT'
              } font-medium transition-colors`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 