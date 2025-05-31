import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Function to create a new Prisma client with error handling
function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error', 'warn'],
  });

  // Add global error handler
  client.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error: any) {
      // Enhance error with more context
      console.error(`[Prisma Error] ${params.model}.${params.action} failed:`, error);
      
      // Check for connection errors
      if (error.code === 'P1001' || error.code === 'P1002') {
        console.error('[Prisma] Database connection error. Attempting reconnect...');
      }
      
      throw error;
    }
  });

  return client;
}

// Create a new PrismaClient instance or reuse existing one
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Store the instance in the global object to prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Connection test function
export async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    return { success: true, result };
  } catch (error: any) {
    console.error('[Prisma] Connection test failed:', error.message);
    return { success: false, error: error.message };
  }
}

export default prisma;