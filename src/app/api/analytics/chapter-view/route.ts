import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chapter, timestamp } = body;
    
    // Validate required fields
    if (typeof chapter !== 'number') {
      return NextResponse.json(
        { error: 'Chapter number is required' },
        { status: 400 }
      );
    }
    
    // Create the chapter view record
    const chapterView = await prisma.chapterView.create({
      data: {
        chapter,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        sessionId: request.headers.get('x-session-id') || null,
      },
    });
    
    return NextResponse.json(
      { success: true, id: chapterView.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking chapter view:', error);
    return NextResponse.json(
      { error: 'Failed to track chapter view' },
      { status: 500 }
    );
  }
} 