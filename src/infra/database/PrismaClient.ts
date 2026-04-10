import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

export async function initDatabase() {
  const prisma = getPrisma();
  try {
    await prisma.$connect();
    console.log('[Prisma] Connected to database');
  } catch (error) {
    console.error('[Prisma] Connection failed:', error);
    throw error;
  }
}

export async function closeDatabase() {
  if (prismaClient) {
    await prismaClient.$disconnect();
    console.log('[Prisma] Disconnected from database');
  }
}
