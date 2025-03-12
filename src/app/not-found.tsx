"use client";

import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function NotFound() {
  return (
    <>
      <Navigation />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-primary-DEFAULT mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/constitution" className="btn-primary">
          Return to Constitution
        </Link>
      </div>
    </>
  );
} 