import { searchArticles } from '@/lib/constitution';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { Article } from '@/types/constitution';

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
        <form action="/search" method="get" className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for articles, rights, principles..."
              className="search-input flex-grow"
              aria-label="Search query"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        {query && (
          <div className="mb-4">
            <p className="text-gray-600">
              {results.length === 0
                ? 'No results found'
                : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((article) => (
              <ArticleCard key={article.number} article={article} />
            ))
          ) : query ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">No articles found matching your search.</p>
              <p className="text-gray-500 mb-6">Try using different keywords or browse all chapters.</p>
              <Link href="/constitution" className="btn-primary">
                Browse All Chapters
              </Link>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">Enter a search term to find articles in the Constitution of Malta.</p>
              <p className="text-gray-500 mb-6">You can search by article title, content, or keywords.</p>
              <Link href="/constitution" className="btn-primary">
                Browse All Chapters
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 