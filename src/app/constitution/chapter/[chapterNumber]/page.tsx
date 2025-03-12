import { getChapterArticles, getChapters } from '@/lib/constitution';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toRomanNumeral } from '@/lib/utils';

export async function generateStaticParams() {
  const chapters = await getChapters();
  
  return chapters.map((chapter) => ({
    chapterNumber: chapter.number.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { chapterNumber: string } }) {
  const resolvedParams = await params;
  const chapterNumber = resolvedParams.chapterNumber;
  const chapterNum = parseInt(chapterNumber);
  const chapters = await getChapters();
  const chapter = chapters.find(c => c.number === chapterNum);
  
  if (!chapter) {
    return {
      title: 'Chapter Not Found',
      description: 'The requested chapter could not be found',
    };
  }
  
  return {
    title: `Chapter ${toRomanNumeral(chapterNum)} - ${chapter.title} | Constitution of Malta`,
    description: `Browse articles in Chapter ${toRomanNumeral(chapterNum)} - ${chapter.title} of the Constitution of Malta`,
  };
}

export default async function ChapterPage({ params }: { params: { chapterNumber: string } }) {
  const resolvedParams = await params;
  const chapterNumber = resolvedParams.chapterNumber;
  const chapterNum = parseInt(chapterNumber);
  const chapters = await getChapters();
  const chapter = chapters.find(c => c.number === chapterNum);
  
  if (!chapter) {
    notFound();
  }
  
  const articles = await getChapterArticles(chapterNum);

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Constitution',
            href: '/constitution',
          },
          {
            label: `Chapter ${toRomanNumeral(chapterNum)} - ${chapter.title}`,
            href: `/constitution/chapter/${chapterNum}`,
            active: true,
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-primary-DEFAULT mb-2">
          Chapter {toRomanNumeral(chapterNum)} - {chapter.title}
        </h1>
        <p className="text-gray-600">
          Browse all articles in this chapter of the Constitution of Malta.
        </p>
      </div>

      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.number} article={article} />
          ))
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No articles found in this chapter.</p>
            <Link href="/constitution" className="btn-primary">
              Return to Chapters
            </Link>
          </div>
        )}
      </div>
    </>
  );
} 