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
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
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
    
    // Query for top articles
    const topArticles = await prisma.$queryRaw`
      SELECT 
        chapter, 
        article, 
        COUNT(*) as views
      FROM "ArticleView"
      WHERE timestamp >= ${startDate}
      GROUP BY chapter, article
      ORDER BY views DESC
      LIMIT ${limit}
    `;
    
    // Convert BigInt values to regular numbers before returning
    const processedResults = convertBigIntsToNumbers(topArticles);
    
    return NextResponse.json(processedResults, { status: 200 });
  } catch (error) {
    console.error('Error fetching top articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top articles' },
      { status: 500 }
    );
  }
} 