import { createClient, type RedisClientType } from "redis";

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: RedisClientType | undefined;
}

function getRedisUrl(): string | null {
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  return url;
}

function buildClient(): RedisClientType | null {
  const url = getRedisUrl();
  if (!url) return null;

  const client = createClient({
    url,
  });

  client.on("error", (err) => {
    // Mantenerlo como log: Redis es opcional y no debe tumbar el server.
    console.error("Redis client error:", err);
  });

  return client;
}

export async function getRedisClient(): Promise<RedisClientType | null> {
  if (globalThis.__redisClient) {
    if (!globalThis.__redisClient.isOpen) {
      await globalThis.__redisClient.connect();
    }
    return globalThis.__redisClient;
  }

  const client = buildClient();
  if (!client) return null;

  await client.connect();
  globalThis.__redisClient = client;
  return client;
}

