import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

/**
 * Health check endpoint for Railway deployment
 * Tests database connectivity and returns app status
 */
export async function GET() {
  try {
    // Basic app health check
    const appStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
      databaseStatus: 'unknown',
    };
    
    // Test database connection
    try {
      // Attempt a simple database query
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      appStatus.databaseStatus = 'connected';
    } catch (dbError: any) {
      console.error('Health check - Database connection error:', dbError.message);
      appStatus.databaseStatus = 'error';
      // Still return 200 as the app itself is running
    } finally {
      // Disconnect to avoid keeping connections open
      await prisma.$disconnect();
    }
    
    // Return health status
    return NextResponse.json(appStatus, { status: 200 });
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        status: 'error', 
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString() 
      }, 
      { status: 500 }
    );
  }
} 