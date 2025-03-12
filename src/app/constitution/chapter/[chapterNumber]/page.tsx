// Server Component (default)
import { getChapterArticles, getChapters } from '@/lib/constitution';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toRomanNumeral } from '@/lib/utils';
import ChapterContent from './ChapterContent';
import { Chapter, Article } from '@/types/constitution';

export async function generateStaticParams() {
  const chapters = await getChapters();
  return chapters.map((chapter: Chapter) => ({
    chapterNumber: chapter.number.toString(),
  }));
}

export async function getChapter(chapterNum: number): Promise<Chapter> {
  const chapters = await getChapters();
  const chapter = chapters.find(
    (c: Chapter) => c.number === chapterNum
  );
  if (!chapter) {
    notFound();
  }
  return chapter;
}

export async function generateMetadata({
  params,
}: {
  params: { chapterNumber: string };
}): Promise<Metadata> {
  // In Next.js 15, we need to await params even though they're not actually Promises
  params = await params;
  const chapterNum = parseInt(params.chapterNumber, 10);
  const chapter = await getChapter(chapterNum);

  return {
    title: `Chapter ${toRomanNumeral(chapterNum)} - ${chapter.title} | Constitution of Malta`,
    description: `Browse articles in Chapter ${toRomanNumeral(chapterNum)} - ${chapter.title} of the Constitution of Malta`,
  };
}

export default async function ChapterPage({ params }: { params: { chapterNumber: string } }) {
  // In Next.js 15, we need to await params even though they're not actually Promises
  params = await params;
  const chapterNum = parseInt(params.chapterNumber, 10);
  const chapter = await getChapter(chapterNum);
  const articles = await getChapterArticles(chapterNum);

  return <ChapterContent 
    chapter={chapter} 
    articles={articles as any[]} 
    chapterNum={chapterNum} 
  />;
} 