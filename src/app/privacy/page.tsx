import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Kostituzzjoni.mt',
  description: 'Learn about how Kostituzzjoni.mt collects, uses, and protects your data while you explore the Constitution of Malta.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
        Privacy Policy
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          <strong>Last Updated:</strong> January 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Introduction
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Kostituzzjoni.mt is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our interactive Constitution of Malta platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Information We Collect
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            1. Anonymous Analytics Data
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We collect anonymized usage data to improve our platform:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>Pages viewed and articles accessed</li>
            <li>Search queries (excluding inappropriate terms)</li>
            <li>Session duration and navigation patterns</li>
            <li>Browser type and device information</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            2. Session Identifiers
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use randomly generated session IDs that:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>Are NOT linked to personal information</li>
            <li>Rotate automatically every 24 hours</li>
            <li>Do NOT track your identity across sessions</li>
            <li>Are stored only in your browser's local storage</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            What We Do NOT Collect
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We respect your privacy and explicitly do NOT collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Your name, email address, or contact information</li>
            <li>IP addresses or precise location data</li>
            <li>Personally identifiable information (PII)</li>
            <li>Cross-site tracking or advertising data</li>
            <li>Financial or payment information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            How We Use Your Data
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Anonymous analytics data helps us:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Understand which constitutional articles are most accessed</li>
            <li>Improve search functionality and user experience</li>
            <li>Identify technical issues and performance bottlenecks</li>
            <li>Make informed decisions about feature development</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Data Retention
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            All analytics data is automatically deleted after <strong>365 days</strong>. We do not retain historical data beyond this period.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Cookies and Local Storage
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use browser local storage for:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Session ID (anonymous identifier)</li>
            <li>Dark mode preference</li>
            <li>Privacy notice acceptance</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            No third-party cookies are used for tracking or advertising.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Third-Party Services
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use the following third-party services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li><strong>Vercel Analytics:</strong> Privacy-friendly performance monitoring (no personal data collected)</li>
            <li><strong>Google Fonts:</strong> Typography loading (does not track users)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Clear your browser's local storage at any time</li>
            <li>Use the platform without providing any personal information</li>
            <li>Request information about data we collect (limited to anonymous analytics)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Data Security
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We implement industry-standard security measures including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure database hosting with access controls</li>
            <li>Regular security audits and updates</li>
            <li>Content Security Policy to prevent XSS attacks</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have questions about this Privacy Policy, please visit our{' '}
            <Link href="/contact" className="text-primary-DEFAULT hover:underline">
              Contact page
            </Link>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="text-primary-DEFAULT hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
