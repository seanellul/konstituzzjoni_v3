import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Simple in-memory cache for active user count
let cachedCount: number | null = null;
let lastCacheTime: number = 0;
const CACHE_TTL = 15 * 1000; // 15 seconds cache TTL

export async function GET() {
  try {
    // Check if we have a recent cached count
    const now = Date.now();
    if (cachedCount !== null && now - lastCacheTime < CACHE_TTL) {
      return NextResponse.json(
        { count: cachedCount, cached: true },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=15',
            'X-Cache-Status': 'HIT'
          } 
        }
      );
    }

    // Check if database is available
    try {
      // Test database connection with a simple query
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // Return a fallback count if database is unavailable
      return NextResponse.json(
        { count: cachedCount || 1, cached: false, fallback: true },
        { status: 200 }
      );
    }

    // Calculate a timestamp from 5 minutes ago
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    // Count active users in the last 5 minutes
    const activeUserCount = await prisma.activeUser.count({
      where: {
        lastActive: {
          gte: fiveMinutesAgo
        }
      }
    });
    
    // Update cache
    cachedCount = activeUserCount;
    lastCacheTime = now;
    
    return NextResponse.json(
      { count: activeUserCount, cached: false },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=15',
          'X-Cache-Status': 'MISS'
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching active users:', error);
    
    // Return cached count on error if available
    if (cachedCount !== null) {
      return NextResponse.json(
        { count: cachedCount, cached: true, error: 'Using cached data due to error' },
        { status: 200 }
      );
    }
    
    // If no cached data, return a fallback count
    return NextResponse.json(
      { count: 1, fallback: true, error: 'Using fallback data due to error' },
      { status: 200 }
    );
  }
} 