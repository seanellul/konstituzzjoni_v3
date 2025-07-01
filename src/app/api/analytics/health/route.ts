import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  timestamp: string;
  database: {
    connected: boolean;
    responseTime: number;
  };
  analytics: {
    tablesExist: boolean;
    dataCount: {
      pageViews: number;
      articleViews: number;
      chapterViews: number;
      searchQueries: number;
      activeUsers: number;
    };
    recentActivity: {
      lastPageView: string | null;
      lastSearch: string | null;
      sessionCount24h: number;
    };
  };
  performance: {
    apiResponseTime: number;
  };
  issues: string[];
}

export async function GET(request: Request) {
  const startTime = Date.now();
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      responseTime: 0
    },
    analytics: {
      tablesExist: false,
      dataCount: {
        pageViews: 0,
        articleViews: 0,
        chapterViews: 0,
        searchQueries: 0,
        activeUsers: 0
      },
      recentActivity: {
        lastPageView: null,
        lastSearch: null,
        sessionCount24h: 0
      }
    },
    performance: {
      apiResponseTime: 0
    },
    issues: []
  };

  try {
    // Test database connection
    const dbStartTime = Date.now();
    await prisma.$connect();
    result.database.connected = true;
    result.database.responseTime = Date.now() - dbStartTime;

    // Test if analytics tables exist and get counts
    const [
      pageViewCount,
      articleViewCount,
      chapterViewCount,
      searchQueryCount,
      activeUserCount
    ] = await Promise.all([
      prisma.pageView.count().catch(() => 0),
      prisma.articleView.count().catch(() => 0),
      prisma.chapterView.count().catch(() => 0),
      prisma.searchQuery.count().catch(() => 0),
      prisma.activeUser.count().catch(() => 0)
    ]);

    result.analytics.tablesExist = true;
    result.analytics.dataCount = {
      pageViews: pageViewCount,
      articleViews: articleViewCount,
      chapterViews: chapterViewCount,
      searchQueries: searchQueryCount,
      activeUsers: activeUserCount
    };

    // Get recent activity
    const [lastPageView, lastSearch] = await Promise.all([
      prisma.pageView.findFirst({
        orderBy: { timestamp: 'desc' },
        select: { timestamp: true }
      }).catch(() => null),
      prisma.searchQuery.findFirst({
        orderBy: { timestamp: 'desc' },
        select: { timestamp: true }
      }).catch(() => null)
    ]);

    result.analytics.recentActivity.lastPageView = lastPageView?.timestamp.toISOString() || null;
    result.analytics.recentActivity.lastSearch = lastSearch?.timestamp.toISOString() || null;

    // Count unique sessions in last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const sessionCount = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(DISTINCT "sessionId") as count
      FROM (
        SELECT "sessionId" FROM "PageView" WHERE timestamp >= ${yesterday} AND "sessionId" IS NOT NULL
        UNION
        SELECT "sessionId" FROM "ArticleView" WHERE timestamp >= ${yesterday} AND "sessionId" IS NOT NULL
        UNION
        SELECT "sessionId" FROM "ChapterView" WHERE timestamp >= ${yesterday} AND "sessionId" IS NOT NULL
        UNION
        SELECT "sessionId" FROM "SearchQuery" WHERE timestamp >= ${yesterday} AND "sessionId" IS NOT NULL
      ) as combined_views
    `.catch(() => [{ count: BigInt(0) }]);

    result.analytics.recentActivity.sessionCount24h = Number(sessionCount[0]?.count || 0);

    // Health checks and warnings
    const totalEvents = pageViewCount + articleViewCount + chapterViewCount + searchQueryCount;
    
    if (totalEvents === 0) {
      result.status = 'warning';
      result.issues.push('No analytics data found - analytics may not be tracking properly');
    } else if (totalEvents < 10) {
      result.status = 'warning';
      result.issues.push('Very low analytics data volume detected');
    }

    if (!lastPageView || new Date(lastPageView.timestamp).getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      result.status = 'warning';
      result.issues.push('No page views recorded in the last 24 hours');
    }

    if (result.analytics.recentActivity.sessionCount24h === 0) {
      result.status = 'warning';
      result.issues.push('No unique sessions detected in the last 24 hours');
    }

    if (activeUserCount === 0) {
      result.issues.push('No active users currently tracked (this may be normal)');
    }

  } catch (error) {
    result.status = 'error';
    result.issues.push(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('[Analytics Health] Database error:', error);
  }

  result.performance.apiResponseTime = Date.now() - startTime;

  // Log health check results
  console.log(`[Analytics Health] Status: ${result.status}, Issues: ${result.issues.length}, Response time: ${result.performance.apiResponseTime}ms`);

  return NextResponse.json(result, {
    status: result.status === 'error' ? 500 : 200,
    headers: {
      'Cache-Control': 'no-store', // Don't cache health checks
    }
  });
}