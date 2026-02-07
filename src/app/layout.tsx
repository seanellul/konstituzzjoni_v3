import './globals.css';
import { Inter, Merriweather } from 'next/font/google';
import React from 'react';
import Navigation from '@/components/Navigation';
import PageViewTracker from '@/components/PageViewTracker';
import PrivacyNotice from '@/components/PrivacyNotice';
import LayoutClient from './LayoutClient';
import { Analytics } from '@vercel/analytics/react';
import { metadata as siteMetadata } from './metadata';

export { siteMetadata as metadata };

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

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://constitution.mt/#website",
      "url": "https://constitution.mt/",
      "name": "Kostituzzjoni.mt - Interactive Constitution of Malta",
      "description": "Interactive digital platform for exploring and understanding the Constitution of Malta with advanced search and navigation features.",
      "publisher": {
        "@id": "https://kostituzzjoni.mt/#organization"
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://constitution.mt/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": ["en-MT", "mt-MT"]
    },
    {
      "@type": "Organization",
      "@id": "https://constitution.mt/#organization",
      "name": "Constitution of Malta",
      "url": "https://constitution.mt/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kostituzzjoni.mt/logo.png",
        "width": 600,
        "height": 200
      },
      "sameAs": [
        "https://twitter.com/KostituzzjoniMT"
      ]
    },
    {
      "@type": "GovernmentService",
      "name": "Constitution of Malta Interactive Reader",
      "serviceType": "Legal Information Service",
      "description": "Digital access to Malta's Constitution with interactive navigation and search capabilities",
      "provider": {
        "@id": "https://constitution.mt/#organization"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Malta"
      },
      "availableLanguage": ["English", "Maltese"]
    },
    {
      "@type": "LegalDocument",
      "name": "Constitution of Malta",
      "description": "The supreme law of Malta, establishing the framework of government and fundamental rights",
      "legislationDate": "1964-09-21",
      "legislationJurisdiction": {
        "@type": "Country",
        "name": "Malta"
      },
      "legislationType": "Constitution"
    }
  ]
};

const currentYear = new Date().getFullYear();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-MT" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#BD0F1F" />
        <meta name="application-name" content="Constitution.mt" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Constitution.mt" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#BD0F1F" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Performance hints */}
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <link rel="dns-prefetch" href="//vercel-analytics.com" />

        {/* Alternate Language Versions */}
        <link rel="alternate" hrefLang="en-MT" href="https://constitution.mt/" />
        <link rel="alternate" hrefLang="mt-MT" href="https://kostituzzjoni.mt/" />
        <link rel="alternate" hrefLang="x-default" href="https://constitution.mt/" />
      </head>
      <body className="bg-secondary-light dark:bg-gray-900 min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary-DEFAULT text-white p-2 z-50">
          Skip to main content
        </a>

        <header role="banner">
          <Navigation />
        </header>

        <main id="main-content" role="main" className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-grow max-w-full overflow-x-hidden">
          {children}
        </main>

        <footer role="contentinfo" className="bg-gray-100 dark:bg-gray-800 py-4 sm:py-6 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                © {currentYear} Kostituzzjoni.mt | An interactive reader for the Constitution of Malta
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Educational use only. For official legal reference, consult the{' '}
                <a
                  href="https://legislation.mt/eli/const/eng/pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-DEFAULT hover:underline"
                >
                  official Constitution of Malta
                </a>
              </p>
              <nav className="flex justify-center space-x-4 text-xs">
                <a href="/about" className="text-gray-500 hover:text-primary-DEFAULT">About</a>
                <a href="/privacy" className="text-gray-500 hover:text-primary-DEFAULT">Privacy</a>
                <a href="/terms" className="text-gray-500 hover:text-primary-DEFAULT">Terms</a>
                <a href="/contact" className="text-gray-500 hover:text-primary-DEFAULT">Contact</a>
              </nav>
            </div>
          </div>
        </footer>

        {/* Client-side components */}
        <LayoutClient />
        <PageViewTracker />
        <PrivacyNotice />
        <Analytics />
      </body>
    </html>
  );
}
