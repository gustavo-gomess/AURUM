import { PrismaClient } from '@prisma/client';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/aurum_db?schema=public";

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

  cached!.conn = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  });

  return cached!.conn;
}

export default dbConnect;

