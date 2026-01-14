import { Metadata } from 'next';
import Link from 'next/link';
import { EnvelopeIcon, ChatBubbleLeftRightIcon, BugAntIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Contact Us - Kostituzzjoni.mt',
  description: 'Get in touch with the Kostituzzjoni.mt team for questions, feedback, or to report issues.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
        Contact Us
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          We welcome your feedback, questions, and suggestions to help improve Kostituzzjoni.mt.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
            How Can We Help?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* General Questions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                    General Questions
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Have questions about the Constitution of Malta or how to use the platform? We're here to help.
                  </p>
                </div>
              </div>
            </div>

            {/* Report Issues */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <BugAntIcon className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
                    Report Issues
                  </h3>
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    Found a bug, error in the content, or technical problem? Let us know so we can fix it.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Suggestions */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <LightBulbIcon className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                    Feature Suggestions
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Have ideas for new features or improvements? We'd love to hear your suggestions.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Corrections */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <EnvelopeIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                    Content Corrections
                  </h3>
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    Notice an error or outdated information in the constitutional text? Please inform us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Get in Touch
          </h2>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Email:</strong>{' '}
              <a
                href="mailto:info@kostituzzjoni.mt"
                className="text-primary-DEFAULT hover:underline"
              >
                info@kostituzzjoni.mt
              </a>
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>GitHub Issues:</strong>{' '}
              For technical issues or feature requests, you can also{' '}
              <a
                href="https://github.com/yourusername/konstituzzjoni_v3/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-DEFAULT hover:underline"
              >
                open an issue on GitHub
              </a>
              {' '}(if the repository is public).
            </p>

            <p className="text-gray-600 dark:text-gray-400 text-sm mt-6">
              We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Official Constitutional Resources
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For official legal matters or authoritative constitutional information, please consult:
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li>
              <a
                href="https://legislation.mt/eli/const/eng/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-DEFAULT hover:underline"
              >
                Official Constitution of Malta (legislation.mt)
              </a>
            </li>
            <li>
              <a
                href="https://legislation.mt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-DEFAULT hover:underline"
              >
                Malta Legislation Database
              </a>
            </li>
            <li>
              <a
                href="https://gov.mt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-DEFAULT hover:underline"
              >
                Government of Malta Official Website
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                Is this the official Constitution of Malta?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                No, this is an educational platform. For official legal reference, always consult the{' '}
                <a
                  href="https://legislation.mt/eli/const/eng/pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-DEFAULT hover:underline"
                >
                  official Constitution document
                </a>.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                How often is the content updated?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                We strive to update the constitutional text whenever amendments are enacted. However, there may be a delay between official amendments and updates to this platform.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                Can I use this content for my research or education?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Yes! The Constitution of Malta is public domain. This platform is designed for educational use. However, please cite official sources for academic or legal work.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                Do you collect my personal data?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                No. We only collect anonymous analytics data to improve the platform. See our{' '}
                <Link href="/privacy" className="text-primary-DEFAULT hover:underline">
                  Privacy Policy
                </Link>{' '}
                for details.
              </p>
            </div>
          </div>
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
