import Link from 'next/link';
import { getChapters } from '@/lib/constitution';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Chapter } from '@/types/constitution';
import { toRomanNumeral } from '@/lib/utils';

export const metadata = {
  title: 'Constitution of Malta - Chapters',
  description: 'Browse all chapters of the Constitution of Malta',
};

export default async function ConstitutionPage() {
  const chapters = await getChapters();

  return (
    <>
      <Navigation />
      <Breadcrumbs
        items={[
          {
            label: 'Constitution',
            href: '/constitution',
            active: true,
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold font-serif text-primary-DEFAULT mb-2">Constitution of Malta</h1>
        <p className="text-gray-600 text-lg">
          Explore the chapters and articles of the Constitution of Malta in an interactive format.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter: Chapter) => (
          <Link 
            href={`/constitution/chapter/${chapter.number}`}
            key={chapter.number}
            className="chapter-card group"
          >
            <h2 className="text-2xl font-bold font-serif text-primary-DEFAULT group-hover:text-primary-dark transition-colors">
              Chapter {toRomanNumeral(chapter.number)}
            </h2>
            <h3 className="text-xl text-gray-700 mb-4">{chapter.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                {chapter.articles?.length || 0} Articles
              </span>
              <span className="text-primary-DEFAULT group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
} 