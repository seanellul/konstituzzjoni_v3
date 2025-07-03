import { NextResponse } from 'next/server';
import { getChapters } from '@/lib/constitution';
import { shouldFilterFromAnalytics } from '@/lib/content-filters';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '8');

  if (!query.trim() || shouldFilterFromAnalytics(query)) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await generateSearchSuggestions(query, limit);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}

async function generateSearchSuggestions(query: string, limit: number): Promise<string[]> {
  const queryLower = query.toLowerCase();
  const suggestions: Set<string> = new Set();
  
  try {
    // Get all chapters and articles
    const chapters = await getChapters();
    
    // Common constitutional terms that might match
    const commonTerms = [
      'fundamental rights', 'freedom of expression', 'right to life', 
      'due process', 'equality', 'discrimination', 'parliament', 
      'president', 'prime minister', 'cabinet', 'elections', 
      'judiciary', 'constitutional court', 'amendment', 'referendum',
      'citizenship', 'emergency powers', 'public service', 'finance',
      'executive authority', 'legislative power', 'judicial review'
    ];
    
    // Add matching common terms
    commonTerms.forEach(term => {
      if (term.includes(queryLower) && suggestions.size < limit) {
        suggestions.add(term);
      }
    });
    
    // Add matching article titles
    chapters.forEach(chapter => {
      chapter.articles.forEach(article => {
        if (article.title.toLowerCase().includes(queryLower) && suggestions.size < limit) {
          suggestions.add(article.title);
        }
        
        // Add matching tags if available
        if (article.tags) {
          article.tags.forEach(tag => {
            if (tag.toLowerCase().includes(queryLower) && suggestions.size < limit) {
              suggestions.add(tag);
            }
          });
        }
      });
    });
    
    // Add chapter titles
    chapters.forEach(chapter => {
      if (chapter.title.toLowerCase().includes(queryLower) && suggestions.size < limit) {
        suggestions.add(chapter.title);
      }
    });
    
  } catch (error) {
    console.error('Error generating suggestions:', error);
  }
  
  return Array.from(suggestions).slice(0, limit);
}