import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { shouldFilterFromAnalytics } from '@/lib/content-filters';

export async function POST(request: Request) {
  console.log('Search API endpoint called');

  try {
    const body = await request.json();
    console.log('Search API received body:', body);

    const { term, timestamp } = body;

    // Log headers for debugging
    console.log('Search API headers:', {
      'content-type': request.headers.get('content-type'),
      'x-session-id': request.headers.get('x-session-id')
    });

    // Validate required fields
    if (!term || typeof term !== 'string') {
      console.error('Search API validation error: Invalid term', term);
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Normalize the search term to lowercase for consistent analytics
    const normalizedTerm = term.toLowerCase().trim();

    // Server-side content filtering - reject inappropriate terms
    if (shouldFilterFromAnalytics(normalizedTerm)) {
      console.log('Search term filtered server-side:', normalizedTerm);
      return NextResponse.json(
        { success: true, filtered: true },
        { status: 200 }
      );
    }

    console.log('Search API attempting to create record for term:', normalizedTerm);

    // Create the search query record
    const searchQuery = await prisma.searchQuery.create({
      data: {
        term: normalizedTerm, // Store the normalized version
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        sessionId: request.headers.get('x-session-id') || null,
      },
    });

    console.log('Search API successfully created record with ID:', searchQuery.id);

    return NextResponse.json(
      { success: true, id: searchQuery.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking search query:', error);
    return NextResponse.json(
      { error: 'Failed to track search query' },
      { status: 500 }
    );
  }
}
