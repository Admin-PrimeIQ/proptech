import { getRedisClient } from "@/lib/redis";

type RateLimitResult =
  | { allowed: true; remaining?: number; resetAtMs?: number }
  | { allowed: false; retryAfterSec: number; remaining: 0; resetAtMs: number };

function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

export function getClientIpFromHeaders(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown-client";
}

export async function rateLimitFixedWindow(params: {
  key: string;
  windowMs: number;
  max: number;
}): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  if (!redis) return { allowed: true };

  const now = Date.now();
  const windowMs = Math.max(1000, Math.floor(params.windowMs));
  const max = Math.max(1, Math.floor(params.max));
  const windowId = Math.floor(now / windowMs);
  const redisKey = `rl:${params.key}:${windowId}`;

  const ttlSeconds = Math.ceil(windowMs / 1000) + 1;

  const multi = redis.multi();
  multi.incr(redisKey);
  multi.expire(redisKey, ttlSeconds, "NX");
  const results = (await multi.exec()) as Array<[Error | null, unknown]> | null;

  const countRaw = results?.[0]?.[1];
  const count = typeof countRaw === "number" ? countRaw : Number(countRaw);
  const currentCount = Number.isFinite(count) ? count : 1;

  const resetAtMs = (windowId + 1) * windowMs;
  const remaining = Math.max(0, max - currentCount);

  if (currentCount > max) {
    const retryAfterSec = Math.max(1, Math.ceil((resetAtMs - now) / 1000));
    return { allowed: false, retryAfterSec, remaining: 0, resetAtMs };
  }

  return { allowed: true, remaining, resetAtMs };
}

export function getIsoRateLimitConfig() {
  const enabled = process.env.ISO_RATE_LIMIT_ENABLED === "1" || process.env.NODE_ENV === "production";
  return {
    enabled,
    windowMs: toPositiveInt(process.env.ISO_RATE_LIMIT_WINDOW_MS, 60_000),
    maxRequests: toPositiveInt(process.env.ISO_RATE_LIMIT_MAX_REQUESTS, 120),
  };
}

