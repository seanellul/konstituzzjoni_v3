import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyEnvironment } from '@/lib/db-safeguard';

/**
 * Scheduled API route to handle data retention policies
 * This should be called by a cron job weekly or monthly
 */
export async function POST(request: Request) {
  try {
    // Verify authorization (simple API key for this demo)
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.ANALYTICS_RETENTION_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Calculate retention dates
    const retentionPeriod = parseInt(process.env.ANALYTICS_RETENTION_DAYS || '365');
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - retentionPeriod);

    // Process analytics data for anonymization and deletion
    const [
      deletedPageViews,
      deletedArticleViews,
      deletedChapterViews,
      deletedSearchQueries,
      anonymizedSessions
    ] = await Promise.all([
      // Delete old page views
      prisma.pageView.deleteMany({
        where: { timestamp: { lt: retentionDate } }
      }),

      // Delete old article views
      prisma.articleView.deleteMany({
        where: { timestamp: { lt: retentionDate } }
      }),

      // Delete old chapter views
      prisma.chapterView.deleteMany({
        where: { timestamp: { lt: retentionDate } }
      }),

      // Delete old search queries
      prisma.searchQuery.deleteMany({
        where: { timestamp: { lt: retentionDate } }
      }),

      // Delete inactive users (90 days)
      prisma.activeUser.deleteMany({
        where: {
          lastActive: {
            lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Data retention policy executed successfully',
      stats: {
        deletedPageViews: deletedPageViews.count,
        deletedArticleViews: deletedArticleViews.count,
        deletedChapterViews: deletedChapterViews.count,
        deletedSearchQueries: deletedSearchQueries.count,
        anonymizedSessions: anonymizedSessions.count
      }
    });
  } catch (error) {
    console.error('Error executing data retention policy:', error);
    return NextResponse.json(
      { error: 'Failed to execute data retention policy' },
      { status: 500 }
    );
  }
} 