import { LRUCache } from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

const tokenCache = new LRUCache<string, number>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export default function rateLimit(limit: number, windowMs: number) {
  return async (req: NextRequest) => {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const key = `rate_limit_${ip}`;

    const requests = tokenCache.get(key) ?? 0;

    if (requests >= limit) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    tokenCache.set(key, requests + 1, { ttl: windowMs });

    return null; // No error, continue
  };
}


