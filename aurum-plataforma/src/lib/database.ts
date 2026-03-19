import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

interface PrismaCache {
  conn: PrismaClient | null;
}

declare global {
  var prisma: PrismaCache | undefined;
}

let cached = global.prisma;

if (!cached) {
  cached = global.prisma = { conn: null };
}

function dbConnect(): PrismaClient {
  if (cached!.conn) {
    return cached!.conn;
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  cached!.conn = new PrismaClient({ adapter });

  return cached!.conn;
}

export default dbConnect;
