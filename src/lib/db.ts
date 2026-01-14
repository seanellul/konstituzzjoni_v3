import { PrismaClient } from '@prisma/client';

// Add prisma to the global type
declare global {
  var prisma: PrismaClient | undefined;
}

// Configuration for Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
  });
};

// Prevent multiple instances of Prisma Client in development
export const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((e: unknown) => {
    console.error('Failed to connect to database:', e);
  });

export default prisma; 