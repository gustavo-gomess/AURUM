// Redis desabilitado para ambiente local. Mantido aqui para reativação futura:
// import { createClient } from 'redis';
// const redisClient = createClient({
//   url: process.env.REDIS_URL || 'redis://localhost:6379',
// });
// redisClient.on('error', (err) => console.error('Redis Client Error', err));
// async function connectRedis() {
//   if (!redisClient.isOpen) {
//     await redisClient.connect();
//     console.log('Connected to Redis');
//   }
// }
// export { redisClient, connectRedis };

// Implementação em memória local para desenvolvimento
type ExpireOptions = { EX?: number } | undefined;

const inMemoryStore = new Map<string, { value: string; expiresAt?: number }>();

async function connectRedis() {
  // no-op em memória
}

const redisClient = {
  async get(key: string): Promise<string | null> {
    const entry = inMemoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      inMemoryStore.delete(key);
      return null;
    }
    return entry.value;
  },

  async set(key: string, value: string, opts: ExpireOptions = undefined): Promise<'OK'> {
    const expiresAt = opts?.EX ? Date.now() + opts.EX * 1000 : undefined;
    inMemoryStore.set(key, { value, expiresAt });
    return 'OK';
  },

  async del(key: string): Promise<number> {
    const existed = inMemoryStore.delete(key);
    return existed ? 1 : 0;
  },
};

export { redisClient, connectRedis };


