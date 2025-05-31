import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a new PrismaClient instance or reuse existing one
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

// Only log queries in development
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore - Prisma has issues with the type definitions for event listeners
  prisma.$on('query' as any, (e: any) => {
    console.log('[DB] Query:', e.query);
    console.log('[DB] Params:', e.params);
    console.log('[DB] Duration:', `${e.duration}ms`);
  });
}

// Store the instance in the global object to prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;