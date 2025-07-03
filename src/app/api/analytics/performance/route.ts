import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { metrics, errors, engagementMetrics, sessionId } = body;
    
    // For now, just log the performance data
    // In a real implementation, you would store this in a database
    if (metrics?.length > 0) {
      console.log('[Performance API] Received metrics:', {
        count: metrics.length,
        sessionId,
        types: metrics.map((m: any) => m.name)
      });
    }
    
    if (errors?.length > 0) {
      console.error('[Performance API] Received errors:', {
        count: errors.length,
        sessionId,
        messages: errors.map((e: any) => e.message)
      });
    }
    
    if (engagementMetrics?.length > 0) {
      console.log('[Performance API] Received engagement metrics:', {
        count: engagementMetrics.length,
        sessionId,
        types: engagementMetrics.map((e: any) => e.type)
      });
    }
    
    return NextResponse.json(
      { success: true, received: { metrics: metrics?.length || 0, errors: errors?.length || 0, engagementMetrics: engagementMetrics?.length || 0 } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Performance API] Error processing performance data:', error);
    return NextResponse.json(
      { error: 'Failed to process performance data' },
      { status: 500 }
    );
  }
}