import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, timestamp } = body;
    
    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Check if database is available
    try {
      // Test database connection with a simple query
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // Return success even if database is unavailable to prevent client errors
      return NextResponse.json(
        { success: true, fallback: true },
        { status: 200 }
      );
    }
    
    // Update or create the active user record
    const activeUser = await prisma.activeUser.upsert({
      where: { sessionId },
      update: {
        lastActive: timestamp ? new Date(timestamp) : new Date(),
      },
      create: {
        sessionId,
        lastActive: timestamp ? new Date(timestamp) : new Date(),
      },
    });
    
    return NextResponse.json(
      { success: true, id: activeUser.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking active user:', error);
    // Return success even on error to prevent client errors
    return NextResponse.json(
      { success: true, fallback: true, error: 'Error occurred but continuing' },
      { status: 200 }
    );
  }
} 