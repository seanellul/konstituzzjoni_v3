import { MetadataRoute } from 'next';
import { getChapters } from '@/lib/constitution';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const chapters = await getChapters();
  const now = new Date().toISOString();
  const domains = ['https://constitution.mt', 'https://kostituzzjoni.mt'];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for both domains
  const staticPages = [
    { path: '/', changeFrequency: 'monthly' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/search', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/constitution', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/analytics', changeFrequency: 'daily' as const, priority: 0.5 },
  ];

  for (const domain of domains) {
    for (const page of staticPages) {
      entries.push({
        url: `${domain}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // Chapter and article pages for both domains
  for (const chapter of chapters) {
    for (const domain of domains) {
      entries.push({
        url: `${domain}/constitution/chapter/${chapter.number}`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.8,
      });
    }

    if (chapter.articles) {
      for (const article of chapter.articles) {
        for (const domain of domains) {
          entries.push({
            url: `${domain}/constitution/chapter/${chapter.number}/article/${article.number}`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.7,
          });
        }
      }
    }
  }

  return entries;
}
