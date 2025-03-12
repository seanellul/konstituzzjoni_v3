import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import { HeartIcon, LightBulbIcon } from '@heroicons/react/24/outline';

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
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            Kostituzzjoni.mt is dedicated to making the Constitution of Malta accessible to everyone. 
            We believe that understanding the fundamental laws that govern our nation is essential for 
            an informed and engaged citizenry.
          </p>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            Our interactive platform allows users to easily navigate, search, and understand the 
            Constitution of Malta in a user-friendly format.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-400">
            <li>Browse the Constitution by chapters and articles</li>
            <li>Search for specific content within the Constitution</li>
            <li>View amendment history and cross-references</li>
            <li>Modern, responsive design for all devices</li>
            <li>Accessible interface following web accessibility standards</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">Disclaimer</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            While we strive for accuracy, the content on Kostituzzjoni.mt is provided for informational 
            purposes only and should not be considered legal advice. For official legal matters, please 
            consult the official publications of the Constitution of Malta or seek professional legal counsel.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200 flex items-center">
            A Personal Note    <LightBulbIcon className="w-6 h-6 ml-2 text-primary-DEFAULT" />
          </h2>

          <p className="text-gray-700 dark:text-gray-400 mb-4">
            I created Kostituzzjoni.mt as a passion project born from my belief that legal texts shouldn't be intimidating. 
            As a Maltese citizen, I found myself wanting a simple way to navigate our Constitution and understand my rights and 
            responsibilities.
          </p>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            My hope is that this tool makes our Constitution more approachable and empowers you to better understand 
            the fundamental principles that shape our nation. Knowledge of our rights is the first step toward 
            active and informed citizenship.
          </p>

          {/* <p className="text-gray-700 dark:text-gray-400 italic">
            "The liberties of a people never were, nor ever will be, secure, when the transactions of their rulers may be concealed from them." 
            <span className="block text-right">— Patrick Henry</span>
          </p> */}
                    <p className="text-gray-700 dark:text-gray-400 mb-4">
            I strongly believe that constitutional reform is something upcoming generations need to seriously consider. 
            Our Constitution must evolve alongside our society, and tools like this are an important first step in 
            empowering Maltese citizens to engage in informed discussions about potential reforms. By making these 
            foundational texts more accessible, we're laying the groundwork for a more engaged democracy where citizens 
            can meaningfully participate in shaping the future of our governance.
          </p>
                      <span className="text-gray-700 dark:text-gray-400 italic block text-center">Sean Ellul</span>

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