import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Kostituzzjoni.mt - Interactive Constitution of Malta',
    template: '%s | Kostituzzjoni.mt - Constitution of Malta'
  },
  description: 'Explore the Constitution of Malta through an interactive, user-friendly interface. Access all chapters, articles, and amendments of Malta\'s constitutional law with advanced search and navigation features.',
  keywords: [
    // Primary keywords
    'Malta Constitution', 'Maltese Constitution', 'Constitution of Malta', 'Malta constitutional law',
    'Malta legal framework', 'Malta democracy', 'Malta government structure', 'Malta fundamental rights',
    'Malta parliament', 'Malta judiciary', 'Malta executive branch',
    
    // Long-tail keywords
    'Malta Constitution articles', 'Malta Constitution chapters', 'Malta constitutional amendments',
    'Malta fundamental rights and freedoms', 'Malta parliamentary system', 'Malta judicial system',
    'Malta citizenship laws', 'Malta local councils', 'Malta constitutional history',
    
    // Legal and government terms
    'Malta civil rights', 'Malta human rights', 'Malta legal system', 'Malta government',
    'Malta political system', 'Malta democracy principles', 'Malta constitutional reform',
    'Malta rule of law', 'Malta separation of powers', 'Malta checks and balances',
    
    // Interactive and educational
    'constitutional law education', 'Malta legal education', 'interactive constitution',
    'constitutional navigation', 'legal document search', 'Malta civics education',
    
    // Maltese language variants
    'Kostituzzjoni ta\' Malta', 'Kostituzzjoni Maltija', 'liġi kostituzzjonali Malta'
  ],
  authors: [{ name: 'Kostituzzjoni.mt Team' }],
  creator: 'Kostituzzjoni.mt Team',
  publisher: 'Kostituzzjoni.mt',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_MT',
    alternateLocale: ['mt_MT', 'en_US'],
    url: 'https://kostituzzjoni.mt',
    siteName: 'Kostituzzjoni.mt',
    title: 'Interactive Constitution of Malta - Kostituzzjoni.mt',
    description: 'Explore Malta\'s Constitution through an interactive digital platform. Access all constitutional articles, search legal provisions, and understand Malta\'s democratic framework.',
    images: [
      {
        url: '/og-image-malta-constitution.jpg',
        width: 1200,
        height: 630,
        alt: 'Constitution of Malta - Interactive Digital Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@KostituzzjoniMT',
    creator: '@KostituzzjoniMT',
    title: 'Interactive Constitution of Malta',
    description: 'Explore Malta\'s Constitution through an interactive digital platform with advanced search and navigation.',
    images: ['/twitter-card-malta-constitution.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://kostituzzjoni.mt',
    languages: {
      'en-MT': 'https://kostituzzjoni.mt',
      'mt-MT': 'https://kostituzzjoni.mt/mt',
    },
  },
  category: 'legal',
  classification: 'Legal Education, Government, Constitutional Law',
}; 