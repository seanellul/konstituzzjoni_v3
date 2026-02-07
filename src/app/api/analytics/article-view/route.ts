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

    // sessionId is intentionally allowed to be null here for backwards compatibility
    // with existing data that may not have a session ID attached
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
