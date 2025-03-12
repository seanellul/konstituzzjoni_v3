import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chapter, article, timestamp } = body;
    
    // Validate required fields
    if (typeof chapter !== 'number' || typeof article !== 'number') {
      return NextResponse.json(
        { error: 'Chapter and article numbers are required' },
        { status: 400 }
      );
    }
    
    // Create the article view record
    const articleView = await prisma.articleView.create({
      data: {
        chapter,
        article,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        sessionId: request.headers.get('x-session-id') || null,
      },
    });
    
    return NextResponse.json(
      { success: true, id: articleView.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking article view:', error);
    return NextResponse.json(
      { error: 'Failed to track article view' },
      { status: 500 }
    );
  }
} 