import { getArticle, getChapterArticles, getChapters } from '@/lib/constitution';
import Navigation from '@/components/Navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';
import { Paragraph, Section } from '@/types/constitution';
import ArticleContent from './ArticleContent';
import { toRomanNumeral } from '@/lib/utils';

export async function generateStaticParams() {
  const chapters = await getChapters();
  const paths = [];
  
  for (const chapter of chapters) {
    const articles = await getChapterArticles(chapter.number);
    
    for (const article of articles) {
      paths.push({
        chapterNumber: chapter.number.toString(),
        articleNumber: article.number.toString(),
      });
    }
  }
  
  return paths;
}

export async function generateMetadata({ params }: { params: { chapterNumber: string, articleNumber: string } }) {
  const resolvedParams = await params;
  const chapterNumber = resolvedParams.chapterNumber;
  const articleNumber = resolvedParams.articleNumber;
  const chapterNum = parseInt(chapterNumber);
  const articleNum = parseInt(articleNumber);
  
  const article = await getArticle(chapterNum, articleNum);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found',
    };
  }
  
  return {
    title: `Article ${articleNum} - ${article.title} | Constitution of Malta`,
    description: `Read Article ${articleNum} from Chapter ${toRomanNumeral(chapterNum)} of the Constitution of Malta`,
  };
}

export default async function ArticlePage({ params }: { params: { chapterNumber: string, articleNumber: string } }) {
  const resolvedParams = await params;
  const chapterNumber = resolvedParams.chapterNumber;
  const articleNumber = resolvedParams.articleNumber;
  const chapterNum = parseInt(chapterNumber);
  const articleNum = parseInt(articleNumber);
  
  const article = await getArticle(chapterNum, articleNum);
  
  if (!article) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <Breadcrumbs
        items={[
          {
            label: 'Constitution',
            href: '/constitution',
          },
          {
            label: `Chapter ${toRomanNumeral(chapterNum)}`,
            href: `/constitution/chapter/${chapterNum}`,
          },
          {
            label: `Article ${articleNum}`,
            href: `/constitution/chapter/${chapterNum}/article/${articleNum}`,
            active: true,
          },
        ]}
      />

      <ArticleContent 
        article={article} 
      />
    </>
  );
} 