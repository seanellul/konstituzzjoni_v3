import { MetadataRoute } from 'next';
import { getConstitutionStructure, getChapterArticles } from '@/lib/constitution';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://constitution.mt';
  const baseMaltese = 'https://kostituzzjoni.mt';
  const lastModified = new Date();

  const constitution = await getConstitutionStructure();

  const staticPages: MetadataRoute.Sitemap = [
    // Homepage - Both domains
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          'en-MT': `${baseUrl}/`,
          'mt-MT': `${baseMaltese}/`,
          'x-default': `${baseUrl}/`,
        },
      },
    },
    {
      url: `${baseMaltese}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    // About page
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseMaltese}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Search page
    {
      url: `${baseUrl}/search`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseMaltese}/search`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Analytics page
    {
      url: `${baseUrl}/analytics`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.5,
    },
    // Constitution main page
    {
      url: `${baseUrl}/constitution`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseMaltese}/constitution`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Privacy page
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // Terms page
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // Contact page
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Generate chapter pages
  const chapterPages: MetadataRoute.Sitemap = constitution.chapters.map((chapter) => {
    // Determine priority based on chapter importance
    let priority = 0.7;
    if (chapter.number === 4) priority = 0.9; // Fundamental Rights
    if (chapter.number === 1) priority = 0.85; // The Republic
    if (chapter.number === 6) priority = 0.8; // Parliament

    return {
      url: `${baseMaltese}/constitution/chapter/${chapter.number}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority,
    };
  });

  // Generate article pages for all chapters
  const articlePages: MetadataRoute.Sitemap = [];
  for (const chapter of constitution.chapters) {
    const articles = await getChapterArticles(chapter.number);

    for (const article of articles) {
      // Higher priority for key constitutional articles
      let priority = 0.6;
      if (article.number === 1) priority = 0.9; // Article 1 - The Republic
      if (article.number >= 32 && article.number <= 47) priority = 0.85; // Fundamental rights articles
      if (article.number === 51) priority = 0.8; // President
      if (article.number === 66) priority = 0.75; // Parliament

      articlePages.push({
        url: `${baseMaltese}/constitution/chapter/${chapter.number}/article/${article.number}`,
        lastModified,
        changeFrequency: 'yearly',
        priority,
      });
    }
  }

  return [...staticPages, ...chapterPages, ...articlePages];
}
