import './globals.css';
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import React from 'react';
import Navigation from '@/components/Navigation';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="bg-secondary-light min-h-screen flex flex-col">
        <Navigation />
        <main className="container mx-auto px-6 py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-gray-100 py-6 mt-auto border-t border-gray-200">
          <div className="container mx-auto px-6">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} Kostituzzjoni.mt | An interactive reader for the Constitution of Malta
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
} 