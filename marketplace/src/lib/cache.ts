import { createHash } from "crypto";
import { getRedisClient } from "@/lib/redis";

export type CacheGetResult<T> = { hit: true; value: T } | { hit: false };

export function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

export function sha256Base64Url(input: string): string {
  return createHash("sha256").update(input).digest("base64url");
}

export function buildCacheKey(params: { prefix: string; version?: string; payload?: unknown }): string {
  const version = params.version?.trim() || "v1";
  const payload = params.payload === undefined ? "" : stableStringify(params.payload);
  const hash = sha256Base64Url(payload);
  return `${params.prefix}:${version}:${hash}`;
}

export async function cacheGetJson<T>(key: string): Promise<CacheGetResult<T>> {
  const redis = await getRedisClient();
  if (!redis) return { hit: false };

  const raw = await redis.get(key);
  if (!raw) return { hit: false };

  try {
    return { hit: true, value: JSON.parse(raw) as T };
  } catch {
    return { hit: false };
  }
}

export async function cacheSetJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;
  const ttl = Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? Math.floor(ttlSeconds) : 60;
  await redis.set(key, JSON.stringify(value), { EX: ttl });
}

export async function withCacheJson<T>(params: {
  key: string;
  ttlSeconds: number;
  compute: () => Promise<T>;
}): Promise<{ value: T; cache: "hit" | "miss" | "bypass" }> {
  const redis = await getRedisClient();
  if (!redis) {
    return { value: await params.compute(), cache: "bypass" };
  }

  const existing = await redis.get(params.key);
  if (existing) {
    try {
      return { value: JSON.parse(existing) as T, cache: "hit" };
    } catch {
      // continue as miss
    }
  }

  const value = await params.compute();
  await cacheSetJson(params.key, value, params.ttlSeconds);
  return { value, cache: "miss" };
}

