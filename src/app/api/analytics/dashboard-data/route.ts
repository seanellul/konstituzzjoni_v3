import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Helper function to convert BigInt values to regular numbers
function convertBigIntsToNumbers(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(convertBigIntsToNumbers);
    }
    
    const converted: Record<string, any> = {};
    for (const key in obj) {
      converted[key] = convertBigIntsToNumbers(obj[key]);
    }
    return converted;
  }
  
  return obj;
}

// Helper function to get article title from JSON file
async function getArticleTitle(chapter: number, article: number): Promise<string | null> {
  try {
    const articlesDirectory = path.join(process.cwd(), 'articles');
    const articlePath = path.join(articlesDirectory, `chapter_${chapter}`, `article_${article}.json`);
    
    if (!fs.existsSync(articlePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    const articleData = JSON.parse(fileContent);
    return articleData.title || null;
  } catch (error) {
    console.error(`Error fetching title for article ${article} in chapter ${chapter}:`, error);
    return null;
  }
}

// Helper function to validate timeframe parameter
function validateTimeframe(timeframe: string): string {
  const validTimeframes = ['day', 'week', 'month', 'year', 'all'];
  return validTimeframes.includes(timeframe) ? timeframe : 'day';
}

// Helper function to calculate date range
function getDateRange(timeframe: string): Date {
  const startDate = new Date();
  switch (timeframe) {
    case 'day':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
      // No date filtering for all-time stats
      startDate.setFullYear(2000);
      break;
    default:
      startDate.setDate(startDate.getDate() - 1); // Default to 1 day
  }
  return startDate;
}

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const rawTimeframe = searchParams.get('timeframe') || 'day';
    const timeframe = validateTimeframe(rawTimeframe);
    
    console.log(`[Analytics API] Fetching dashboard data for timeframe: ${timeframe}`);
    
    // Calculate the start date based on the timeframe
    const startDate = getDateRange(timeframe);
    
    // Calculate a timestamp from 5 minutes ago for active users
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    console.log(`[Analytics API] Date range: ${startDate.toISOString()} to ${new Date().toISOString()}`);
    
    // Execute all queries in parallel for better performance
    const [
      topArticles,
      topChapters,
      topSearches,
      totalArticleViews,
      totalChapterViews,
      totalPageViews,
      totalSearches,
      activeUserCount,
      uniqueVisitors
    ] = await Promise.all([
      // Top 10 articles
      prisma.$queryRaw`
        SELECT chapter, article, COUNT(*) as views
        FROM "ArticleView"
        WHERE timestamp >= ${startDate}
        GROUP BY chapter, article
        ORDER BY views DESC
        LIMIT 10
      `,
      
      // Top 5 chapters
      prisma.$queryRaw`
        SELECT chapter, COUNT(*) as views
        FROM "ChapterView"
        WHERE timestamp >= ${startDate}
        GROUP BY chapter
        ORDER BY views DESC
        LIMIT 5
      `,
      
      // Top 10 searches
      prisma.$queryRaw`
        SELECT term, COUNT(*) as count
        FROM "SearchQuery"
        WHERE timestamp >= ${startDate}
        GROUP BY term
        ORDER BY count DESC
        LIMIT 10
      `,
      
      // Total article views
      prisma.articleView.count({
        where: { timestamp: { gte: startDate } }
      }),
      
      // Total chapter views
      prisma.chapterView.count({
        where: { timestamp: { gte: startDate } }
      }),
      
      // Total page views
      prisma.pageView.count({
        where: { timestamp: { gte: startDate } }
      }),
      
      // Total searches
      prisma.searchQuery.count({
        where: { timestamp: { gte: startDate } }
      }),
      
      // Current active users
      prisma.activeUser.count({
        where: { lastActive: { gte: fiveMinutesAgo } }
      }),
      
      // Unique visitors with better error handling
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT "sessionId") as unique_visitors
        FROM (
          SELECT "sessionId" FROM "PageView" WHERE timestamp >= ${startDate} AND "sessionId" IS NOT NULL
          UNION
          SELECT "sessionId" FROM "ArticleView" WHERE timestamp >= ${startDate} AND "sessionId" IS NOT NULL
          UNION
          SELECT "sessionId" FROM "ChapterView" WHERE timestamp >= ${startDate} AND "sessionId" IS NOT NULL
          UNION
          SELECT "sessionId" FROM "SearchQuery" WHERE timestamp >= ${startDate} AND "sessionId" IS NOT NULL
        ) as combined_views
      `.catch(error => {
        console.error('[Analytics API] Error in unique visitors query:', error);
        return [{ unique_visitors: 0 }];
      })
    ]);
    
    // Extract unique_visitors value with better error handling
    const uniqueVisitorsCount = Array.isArray(uniqueVisitors) && uniqueVisitors[0]?.unique_visitors !== undefined
      ? Number(uniqueVisitors[0].unique_visitors)
      : 0;
    
    console.log(`[Analytics API] Unique visitors calculated: ${uniqueVisitorsCount}`);
    
    // Convert BigInt values to regular numbers
    const processedResults = {
      topArticles: convertBigIntsToNumbers(topArticles),
      topChapters: convertBigIntsToNumbers(topChapters),
      topSearches: convertBigIntsToNumbers(topSearches),
      stats: {
        totalArticleViews,
        totalChapterViews,
        totalPageViews,
        totalSearches,
        activeUserCount,
        uniqueVisitors: uniqueVisitorsCount // Fixed: Use the extracted count, not the raw query result
      },
      timeframe
    };
    
    // Add article titles to topArticles with concurrent fetching
    const topArticlesWithTitles = await Promise.all(
      processedResults.topArticles.map(async (article: any) => {
        const title = await getArticleTitle(article.chapter, article.article);
        return {
          ...article,
          title: title || `Article ${article.article}`
        };
      })
    );
    
    // Update the processed results with article titles
    processedResults.topArticles = topArticlesWithTitles;
    
    const responseTime = Date.now() - startTime;
    console.log(`[Analytics API] Dashboard data fetched successfully in ${responseTime}ms`);
    
    // Add metadata to response
    const response = {
      ...processedResults,
      metadata: {
        responseTime,
        timestamp: new Date().toISOString(),
        dateRange: {
          from: startDate.toISOString(),
          to: new Date().toISOString()
        }
      }
    };
    
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', // Cache for 1 minute
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Analytics API] Error fetching dashboard data:', error);
    console.error('[Analytics API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 