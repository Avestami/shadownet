import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for traces (in production, use a database)
const traces: Record<string, Array<{
  userId: string;
  username: string;
  timestamp: number;
  hint: string;
}>> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const levelId = searchParams.get('level');
  
  if (!levelId) {
    return NextResponse.json({ error: 'Level ID required' }, { status: 400 });
  }
  
  const levelTraces = traces[levelId] || [];
  const traceCount = levelTraces.length;
  const recentTraces = levelTraces.slice(-5); // Get last 5 traces
  
  // Calculate success rate based on number of traces
  const successRate = Math.min(Math.floor((traceCount / 10) * 100), 90);
  
  // Generate hints based on traces
  const hints = recentTraces.map(trace => trace.hint).filter(Boolean);
  
  return NextResponse.json({
    traceCount,
    successRate,
    hints,
    lastActivity: recentTraces.length > 0 ? 
      Math.floor((Date.now() - recentTraces[recentTraces.length - 1].timestamp) / (1000 * 60)) : 
      null
  });
}

export async function POST(request: NextRequest) {
  try {
    const { levelId, userId, username, hint } = await request.json();
    
    if (!levelId || !userId || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Initialize traces for level if not exists
    if (!traces[levelId]) {
      traces[levelId] = [];
    }
    
    // Add new trace
    traces[levelId].push({
      userId,
      username,
      timestamp: Date.now(),
      hint: hint || `Agent ${username} successfully decrypted this level`
    });
    
    // Keep only last 50 traces per level to prevent memory issues
    if (traces[levelId].length > 50) {
      traces[levelId] = traces[levelId].slice(-50);
    }
    
    return NextResponse.json({ success: true, traceCount: traces[levelId].length });
  } catch (error) {
    console.error('Error saving trace:', error);
    return NextResponse.json({ error: 'Failed to save trace' }, { status: 500 });
  }
} 