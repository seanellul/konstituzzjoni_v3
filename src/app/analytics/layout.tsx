import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Constitution of Malta',
  description: 'Real-time analytics and insights into how the Constitution of Malta is being accessed and explored by users.',
  alternates: {
    canonical: 'https://constitution.mt/analytics',
    languages: {
      'en-MT': 'https://constitution.mt/analytics',
      'mt-MT': 'https://kostituzzjoni.mt/analytics',
    },
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
