import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createLogger } from '@/lib/logger';
import { rateLimitMiddleware, analyticsRateLimiter } from '@/lib/rate-limit';

const logger = createLogger('API:Pageview');

export async function POST(request: Request) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(analyticsRateLimiter)(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { path, timestamp, referrer } = body;
    
    // Validate required fields
    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }
    
    // Create the page view record
    const pageView = await prisma.pageView.create({
      data: {
        path,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        referrer: referrer || null,
        sessionId: request.headers.get('x-session-id') || null,
      },
    });
    
    return NextResponse.json(
      { success: true, id: pageView.id },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
} 