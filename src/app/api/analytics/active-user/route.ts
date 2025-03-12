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
    return NextResponse.json(
      { error: 'Failed to track active user' },
      { status: 500 }
    );
  }
} 