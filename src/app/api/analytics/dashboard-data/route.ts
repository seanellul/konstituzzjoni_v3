import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'day';
    
    // Calculate the start date based on the timeframe
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
    
    // Calculate a timestamp from 5 minutes ago for active users
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
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
      
      // Unique visitors
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
      `
    ]);
    
    // Extract unique_visitors value, ensuring it's a regular number
    const uniqueVisitorsCount = uniqueVisitors[0]?.unique_visitors 
      ? Number(uniqueVisitors[0].unique_visitors) 
      : 0;
    
    // Prepare dashboard data
    const dashboardData = {
      topArticles: convertBigIntsToNumbers(topArticles),
      topChapters: convertBigIntsToNumbers(topChapters),
      topSearches: convertBigIntsToNumbers(topSearches),
      stats: {
        totalArticleViews: Number(totalArticleViews),
        totalChapterViews: Number(totalChapterViews),
        totalPageViews: Number(totalPageViews),
        totalSearches: Number(totalSearches),
        activeUserCount: Number(activeUserCount),
        uniqueVisitors: uniqueVisitorsCount
      },
      timeframe
    };
    
    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 