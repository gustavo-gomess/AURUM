import LRUCache from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

const options = {
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
};

const tokenCache = new LRUCache(options);

export default function rateLimit(limit: number, windowMs: number) {
  return async (req: NextRequest) => {
    const ip = req.ip || '127.0.0.1';
    const key = `rate_limit_${ip}`;

    const requests = tokenCache.get(key) || 0;

    if (requests >= limit) {
      return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
    }

    tokenCache.set(key, requests + 1, { ttl: windowMs });

    return null; // No error, continue
  };
}


