import './globals.css';
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import React from 'react';
import Navigation from '@/components/Navigation';
import PageViewTracker from '@/components/PageViewTracker';
import PrivacyNotice from '@/components/PrivacyNotice';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

export const metadata: Metadata = {
  title: 'Kostituzzjoni.mt - Interactive Constitution of Malta',
  description: 'Explore the Constitution of Malta through an interactive, user-friendly interface with advanced search and navigation features.',
  keywords: ['Malta', 'Constitution', 'Law', 'Government', 'Legal', 'Interactive', 'Democracy', 'Rights'],
  authors: [{ name: 'Kostituzzjoni.mt Team' }],
  creator: 'Kostituzzjoni.mt Team',
  publisher: 'Kostituzzjoni.mt',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="bg-secondary-light dark:bg-gray-900 min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-grow max-w-full overflow-x-hidden">
          {children}
        </main>
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 sm:py-6 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              © {new Date().getFullYear()} Kostituzzjoni.mt | An interactive reader for the Constitution of Malta
            </p>
          </div>
        </footer>
        <PageViewTracker />
        <PrivacyNotice />
      </body>
    </html>
  );
} 