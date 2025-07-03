// SEO utility functions for constitutional content

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
}

export function generateConstitutionalSEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-image-malta-constitution.jpg',
}: Partial<SEOData> & { title: string; description: string }): SEOData {
  const defaultKeywords = [
    'Malta Constitution',
    'Maltese Constitution', 
    'Constitution of Malta',
    'Malta constitutional law',
    'Malta legal framework',
    'Malta democracy',
  ];

  return {
    title: `${title} | Kostituzzjoni.mt - Constitution of Malta`,
    description,
    keywords: [...defaultKeywords, ...keywords],
    canonicalUrl: canonicalUrl || 'https://kostituzzjoni.mt',
    ogImage,
  };
}

export function ConstitutionalArticleStructuredData(
  articleNumber: number,
  title: string,
  content: string,
  chapterName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalDocument",
    "name": `Article ${articleNumber}: ${title}`,
    "description": content.substring(0, 200) + "...",
    "legislationType": "Constitutional Article",
    "legislationJurisdiction": {
      "@type": "Country",
      "name": "Malta"
    },
    "isPartOf": {
      "@type": "LegalDocument",
      "name": `${chapterName} - Constitution of Malta`,
      "legislationType": "Constitutional Chapter"
    },
    "legislationDate": "1964-09-21",
    "inLanguage": "en-MT",
    "url": `https://kostituzzjoni.mt/constitution/article/${articleNumber}`
  };
}

export function ConstitutionalChapterStructuredData(
  chapterNumber: string,
  title: string,
  description: string,
  articles: Array<{number: number, title: string}>
) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalDocument",
    "name": `Chapter ${chapterNumber}: ${title}`,
    "description": description,
    "legislationType": "Constitutional Chapter",
    "legislationJurisdiction": {
      "@type": "Country",
      "name": "Malta"
    },
    "isPartOf": {
      "@type": "LegalDocument",
      "name": "Constitution of Malta",
      "legislationType": "Constitution"
    },
    "hasPart": articles.map(article => ({
      "@type": "LegalDocument",
      "name": `Article ${article.number}: ${article.title}`,
      "legislationType": "Constitutional Article",
      "url": `https://kostituzzjoni.mt/constitution/article/${article.number}`
    })),
    "legislationDate": "1964-09-21",
    "inLanguage": "en-MT",
    "url": `https://kostituzzjoni.mt/constitution/chapter/${chapterNumber}`
  };
}