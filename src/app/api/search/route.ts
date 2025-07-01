import { NextResponse } from 'next/server';
import { searchArticles } from '@/lib/constitution';
import { Article } from '@/types/constitution';
import { shouldFilterFromAnalytics } from '@/lib/content-filters';

// Enhanced search interface
export interface SearchResult extends Article {
  relevanceScore: number;
  matchType: 'title' | 'content' | 'tag' | 'cross-reference';
  matchedText?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  suggestions?: string[];
  facets?: {
    chapters: { number: number; title: string; count: number }[];
    tags: { tag: string; count: number }[];
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const chapter = searchParams.get('chapter');
  const includeMetadata = searchParams.get('metadata') === 'true';

  // Return empty results for inappropriate terms
  if (shouldFilterFromAnalytics(query)) {
    return NextResponse.json({
      results: [],
      total: 0,
      query,
      error: 'Search term filtered'
    });
  }

  if (!query.trim()) {
    return NextResponse.json({
      results: [],
      total: 0,
      query,
    });
  }

  try {
    // Get enhanced search results
    const enhancedResults = await enhancedSearch(query, {
      limit,
      chapterFilter: chapter ? parseInt(chapter) : undefined,
      includeMetadata
    });

    return NextResponse.json(enhancedResults);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [], total: 0, query },
      { status: 500 }
    );
  }
}

async function enhancedSearch(
  query: string,
  options: {
    limit?: number;
    chapterFilter?: number;
    includeMetadata?: boolean;
  } = {}
): Promise<SearchResponse> {
  const { limit = 20, chapterFilter, includeMetadata = false } = options;
  
  // Get all articles using existing function
  const basicResults = await searchArticles(query);
  
  // Filter by chapter if specified
  const filteredResults = chapterFilter 
    ? basicResults.filter(article => article.chapterNumber === chapterFilter)
    : basicResults;

  // Enhance results with relevance scoring
  const enhancedResults: SearchResult[] = filteredResults.map(article => {
    const { score, matchType, matchedText } = calculateRelevanceScore(article, query);
    
    return {
      ...article,
      relevanceScore: score,
      matchType,
      matchedText
    };
  });

  // Sort by relevance score (highest first)
  enhancedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Limit results
  const limitedResults = enhancedResults.slice(0, limit);

  const response: SearchResponse = {
    results: limitedResults,
    total: enhancedResults.length,
    query
  };

  // Add metadata if requested
  if (includeMetadata) {
    response.facets = generateFacets(enhancedResults);
    response.suggestions = generateSuggestions(query, enhancedResults);
  }

  return response;
}

function calculateRelevanceScore(
  article: Article, 
  query: string
): { score: number; matchType: SearchResult['matchType']; matchedText?: string } {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  let score = 0;
  let matchType: SearchResult['matchType'] = 'content';
  let matchedText: string | undefined;

  // Title matches (highest weight)
  if (article.title.toLowerCase().includes(queryLower)) {
    score += 100;
    matchType = 'title';
    matchedText = article.title;
  }

  // Exact phrase matches in title (bonus)
  if (article.title.toLowerCase() === queryLower) {
    score += 50;
  }

  // Word matches in title
  queryWords.forEach(word => {
    if (article.title.toLowerCase().includes(word)) {
      score += 20;
    }
  });

  // Tag matches
  if (article.tags) {
    article.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 30;
        matchType = 'tag';
        matchedText = tag;
      }
    });
  }

  // Content matches
  if (article.content) {
    const contentString = Array.isArray(article.content) 
      ? article.content.map(p => typeof p === 'string' ? p : (p as any).text || '').join(' ')
      : (article.content as string[]).join(' ');
    
    const contentLower = contentString.toLowerCase();
    
    // Exact phrase match in content
    if (contentLower.includes(queryLower)) {
      score += 15;
      matchedText = extractMatchedSnippet(contentString, query);
    }
    
    // Word frequency scoring
    queryWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = contentString.match(regex);
      if (matches) {
        score += matches.length * 5;
      }
    });
  }

  // Section content matches
  if (article.sections) {
    article.sections.forEach(section => {
      const sectionContent = section.content.join(' ');
      const sectionLower = sectionContent.toLowerCase();
      
      if (sectionLower.includes(queryLower)) {
        score += 10;
        if (!matchedText) {
          matchedText = extractMatchedSnippet(sectionContent, query);
        }
      }
      
      // Subsection matches
      section.subsections.forEach(subsection => {
        const subsectionContent = subsection.content.join(' ');
        if (subsectionContent.toLowerCase().includes(queryLower)) {
          score += 8;
        }
      });
    });
  }

  // Cross-reference matches
  if (article.crossReferences) {
    article.crossReferences.forEach(ref => {
      if (ref.description.toLowerCase().includes(queryLower)) {
        score += 5;
        matchType = 'cross-reference';
      }
    });
  }

  // Article number exact match (bonus)
  if (queryLower === article.number.toString()) {
    score += 200;
  }

  return { score: Math.max(score, 1), matchType, matchedText };
}

function extractMatchedSnippet(text: string, query: string, maxLength: number = 150): string {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(queryLower);
  
  if (index === -1) return text.substring(0, maxLength) + '...';
  
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 100);
  
  let snippet = text.substring(start, end);
  
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  return snippet;
}

function generateFacets(results: SearchResult[]) {
  // Generate chapter facets
  const chapterCounts = new Map<number, { title: string; count: number }>();
  const tagCounts = new Map<string, number>();

  results.forEach(result => {
    // Chapter facets
    const chapter = chapterCounts.get(result.chapterNumber) || { title: result.chapterTitle, count: 0 };
    chapter.count++;
    chapterCounts.set(result.chapterNumber, chapter);

    // Tag facets
    if (result.tags) {
      result.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  return {
    chapters: Array.from(chapterCounts.entries())
      .map(([number, data]) => ({ number, title: data.title, count: data.count }))
      .sort((a, b) => b.count - a.count),
    tags: Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  };
}

function generateSuggestions(query: string, results: SearchResult[]): string[] {
  // Simple suggestion generation based on query and results
  const suggestions: Set<string> = new Set();
  const queryWords = query.toLowerCase().split(/\s+/);
  
  // Add suggestions based on high-scoring results
  results.slice(0, 5).forEach(result => {
    if (result.tags) {
      result.tags.forEach(tag => {
        if (!queryWords.some(word => tag.toLowerCase().includes(word))) {
          suggestions.add(tag);
        }
      });
    }
    
    // Extract key terms from titles
    const titleWords = result.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 3 && !queryWords.includes(word) && !/^(the|and|of|in|to|for|with|by)$/.test(word)) {
        suggestions.add(word);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
}