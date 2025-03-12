import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
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
    
    return NextResponse.json(
      { count: activeUserCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching active users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active user count' },
      { status: 500 }
    );
  }
} 