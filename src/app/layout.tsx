import './globals.css';
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import React from 'react';

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
  title: 'Kostituzzjoni.mt - Malta Constitution Interactive Reader',
  description: 'Explore the Constitution of Malta in an interactive and accessible format',
  keywords: ['Malta', 'Constitution', 'Law', 'Government', 'Legal', 'Interactive'],
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
      <body className="bg-secondary-light min-h-screen">
        <header className="bg-primary-DEFAULT text-white shadow-md">
          <div className="container mx-auto py-4 px-6">
            <h1 className="text-2xl font-bold font-serif">Kostituzzjoni ta' Malta</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 py-6 mt-auto">
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