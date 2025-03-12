import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const metadata = {
  title: 'About Kostituzzjoni.mt',
  description: 'Learn about the Kostituzzjoni.mt project and its mission to make the Constitution of Malta accessible to everyone',
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'About',
            href: '/about',
            active: true,
          },
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-serif text-primary-DEFAULT mb-6">About Kostituzzjoni.mt</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Kostituzzjoni.mt is dedicated to making the Constitution of Malta accessible to everyone. 
            We believe that understanding the fundamental laws that govern our nation is essential for 
            an informed and engaged citizenry.
          </p>
          <p className="text-gray-700 mb-4">
            Our interactive platform allows users to easily navigate, search, and understand the 
            Constitution of Malta in a user-friendly format.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Browse the Constitution by chapters and articles</li>
            <li>Search for specific content within the Constitution</li>
            <li>View amendment history and cross-references</li>
            <li>Modern, responsive design for all devices</li>
            <li>Accessible interface following web accessibility standards</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            While we strive for accuracy, the content on Kostituzzjoni.mt is provided for informational 
            purposes only and should not be considered legal advice. For official legal matters, please 
            consult the official publications of the Constitution of Malta or seek professional legal counsel.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="text-gray-700 mb-4">
            For questions, feedback, or suggestions, please contact us at:
          </p>
          <p className="text-primary-DEFAULT">info@kostituzzjoni.mt</p>
        </section>

        <div className="mt-10 text-center">
          <Link href="/constitution" className="btn-primary">
            Explore the Constitution
          </Link>
        </div>
      </div>
    </>
  );
} 