import { searchArticles } from '@/lib/constitution';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Article } from '@/types/constitution';
import SearchClient from './SearchClient';

export const metadata = {
  title: 'Search the Constitution of Malta',
  description: 'Search for articles and content within the Constitution of Malta',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const results: Article[] = query ? await searchArticles(query) : [];

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Search',
            href: '/search',
            active: true,
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-primary-DEFAULT mb-4">Search the Constitution</h1>
        <SearchClient query={query} results={results} />
      </div>
    </>
  );
} 