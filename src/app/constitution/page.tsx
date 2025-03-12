import Link from 'next/link';
import { getChapters } from '@/lib/constitution';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Chapter } from '@/types/constitution';
import { toRomanNumeral } from '@/lib/utils';
import ConstitutionContent from './ConstitutionContent';

export const metadata = {
  title: 'Constitution of Malta - Chapters',
  description: 'Browse all chapters of the Constitution of Malta',
};

export default async function ConstitutionPage() {
  const chapters = await getChapters();

  return (
    <>
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

      <ConstitutionContent chapters={chapters} />
    </>
  );
} 