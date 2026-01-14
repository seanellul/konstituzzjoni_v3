import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Kostituzzjoni.mt',
  description: 'Terms and conditions for using Kostituzzjoni.mt, the interactive Constitution of Malta platform.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
        Terms of Service
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          <strong>Last Updated:</strong> January 2026
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing and using Kostituzzjoni.mt ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            2. Educational Purpose
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Kostituzzjoni.mt is provided for educational and informational purposes only. While we strive for accuracy:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>This Platform is NOT a substitute for official legal documentation</li>
            <li>For official legal reference, consult the{' '}
              <a
                href="https://legislation.mt/eli/const/eng/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-DEFAULT hover:underline"
              >
                official Constitution of Malta
              </a>
            </li>
            <li>The Platform should not be used as the sole basis for legal decisions</li>
            <li>We are not responsible for any decisions made based on information from this Platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            3. Accuracy and Updates
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We make reasonable efforts to ensure the constitutional content is accurate and up-to-date. However:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Constitutional amendments may not be reflected immediately</li>
            <li>We do not guarantee the completeness or timeliness of information</li>
            <li>Users should verify information with official government sources</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            4. Acceptable Use
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You agree to use the Platform only for lawful purposes. You must NOT:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Attempt to interfere with or disrupt the Platform's functionality</li>
            <li>Use automated systems to scrape or download content excessively</li>
            <li>Attempt to gain unauthorized access to our systems or databases</li>
            <li>Use the Platform to transmit malware, viruses, or harmful code</li>
            <li>Engage in any activity that could harm other users or the Platform</li>
            <li>Submit inappropriate, offensive, or illegal search queries</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Constitutional Content:</strong> The Constitution of Malta is a public domain document. The text of the Constitution belongs to the people of Malta and is freely accessible.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Platform Design and Code:</strong> The website design, layout, features, and source code are protected by copyright. You may not reproduce, distribute, or create derivative works without permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            To the fullest extent permitted by law:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>The Platform is provided "AS IS" without warranties of any kind</li>
            <li>We are not liable for any direct, indirect, incidental, or consequential damages</li>
            <li>We do not guarantee uninterrupted or error-free operation</li>
            <li>Your use of the Platform is at your own risk</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            7. Third-Party Links
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The Platform may contain links to external websites (such as official government sites). We are not responsible for the content, privacy practices, or availability of third-party websites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            8. Service Availability
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>Modify, suspend, or discontinue the Platform at any time</li>
            <li>Update these Terms of Service without prior notice</li>
            <li>Restrict access to certain features or users</li>
            <li>Perform maintenance that may temporarily interrupt service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            9. Privacy
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your use of the Platform is also governed by our{' '}
            <Link href="/privacy" className="text-primary-DEFAULT hover:underline">
              Privacy Policy
            </Link>. Please review it to understand how we handle data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            10. Governing Law
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            These Terms of Service are governed by the laws of Malta. Any disputes arising from the use of this Platform shall be subject to the exclusive jurisdiction of the courts of Malta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            11. Severability
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions shall continue in full force and effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            12. Contact Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have questions about these Terms of Service, please visit our{' '}
            <Link href="/contact" className="text-primary-DEFAULT hover:underline">
              Contact page
            </Link>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            13. Acknowledgment
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            By using Kostituzzjoni.mt, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
