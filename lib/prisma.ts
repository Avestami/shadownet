import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 
        `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
    }
  },
  log: [
    {
<<<<<<< HEAD
      emit: 'event',
=======
      emit: 'stdout',
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
      level: 'query',
    },
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

<<<<<<< HEAD
// Add logging for all database operations
prisma.$on('query', (e) => {
  console.log('[DB] Query:', e.query);
  console.log('[DB] Params:', e.params);
  console.log('[DB] Duration:', `${e.duration}ms`);
});

=======
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}