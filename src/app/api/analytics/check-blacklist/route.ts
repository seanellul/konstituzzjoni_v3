import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Blacklist model will be added to the schema if needed

/**
 * API endpoint to check if a session ID is blacklisted
 * This is called by the client to determine if analytics should be disabled
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Currently we're assuming no sessions are blacklisted
    // If you implement a blacklist model, add the actual check here
    const blacklisted = false;
    
    /* 
    // Example implementation if you add a Blacklist model to the schema
    const blacklisted = await prisma.blacklistedSession.findUnique({
      where: { sessionId }
    }) !== null;
    */
    
    return NextResponse.json({ blacklisted });
  } catch (error) {
    console.error('Error checking blacklist status:', error);
    return NextResponse.json(
      { error: 'Failed to check blacklist status' },
      { status: 500 }
    );
  }
} 