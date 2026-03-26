import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as redisModule from "@/lib/redis";
import {
  getClientIpFromHeaders,
  getIsoRateLimitConfig,
  rateLimitFixedWindow,
} from "@/lib/rateLimit";

vi.mock("@/lib/redis", () => ({
  getRedisClient: vi.fn(),
}));

function createMockRedisWithCounters() {
  const keyCounts = new Map<string, number>();

  return {
    multi() {
      let incrKey: string | null = null;
      return {
        incr(key: string) {
          incrKey = key;
          return this;
        },
        expire(_key: string, _ttl: number, _mode: string) {
          return this;
        },
        async exec() {
          if (!incrKey) {
            return [[null, 0], [null, 1]] as Array<[null, number]>;
          }
          const next = (keyCounts.get(incrKey) ?? 0) + 1;
          keyCounts.set(incrKey, next);
          return [[null, next], [null, 1]] as Array<[null, number]>;
        },
      };
    },
  };
}

describe("getClientIpFromHeaders", () => {
  it("usa el primer valor de x-forwarded-for", () => {
    const h = new Headers();
    h.set("x-forwarded-for", " 203.0.113.1 , 10.0.0.1 ");
    expect(getClientIpFromHeaders(h)).toBe("203.0.113.1");
  });

  it("usa x-real-ip si no hay x-forwarded-for", () => {
    const h = new Headers();
    h.set("x-real-ip", "198.51.100.2");
    expect(getClientIpFromHeaders(h)).toBe("198.51.100.2");
  });

  it("devuelve unknown-client si no hay IPs", () => {
    expect(getClientIpFromHeaders(new Headers())).toBe("unknown-client");
  });
});

describe("getIsoRateLimitConfig", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalEnabled = process.env.ISO_RATE_LIMIT_ENABLED;
  const originalWindow = process.env.ISO_RATE_LIMIT_WINDOW_MS;
  const originalMax = process.env.ISO_RATE_LIMIT_MAX_REQUESTS;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.ISO_RATE_LIMIT_ENABLED = originalEnabled;
    process.env.ISO_RATE_LIMIT_WINDOW_MS = originalWindow;
    process.env.ISO_RATE_LIMIT_MAX_REQUESTS = originalMax;
  });

  it("habilita con ISO_RATE_LIMIT_ENABLED=1 aunque NODE_ENV sea test", () => {
    process.env.NODE_ENV = "test";
    process.env.ISO_RATE_LIMIT_ENABLED = "1";
    process.env.ISO_RATE_LIMIT_WINDOW_MS = "30000";
    process.env.ISO_RATE_LIMIT_MAX_REQUESTS = "5";

    const cfg = getIsoRateLimitConfig();
    expect(cfg.enabled).toBe(true);
    expect(cfg.windowMs).toBe(30_000);
    expect(cfg.maxRequests).toBe(5);
  });

  it("usa valores por defecto cuando no hay env validas", () => {
    process.env.NODE_ENV = "test";
    process.env.ISO_RATE_LIMIT_ENABLED = "0";
    delete process.env.ISO_RATE_LIMIT_WINDOW_MS;
    delete process.env.ISO_RATE_LIMIT_MAX_REQUESTS;

    const cfg = getIsoRateLimitConfig();
    expect(cfg.enabled).toBe(false);
    expect(cfg.windowMs).toBe(60_000);
    expect(cfg.maxRequests).toBe(120);
  });
});

describe("rateLimitFixedWindow", () => {
  beforeEach(() => {
    vi.mocked(redisModule.getRedisClient).mockReset();
  });

  it("sin Redis permite todas las solicitudes (bypass)", async () => {
    vi.mocked(redisModule.getRedisClient).mockResolvedValue(null);

    const r1 = await rateLimitFixedWindow({ key: "k", windowMs: 60_000, max: 1 });
    const r2 = await rateLimitFixedWindow({ key: "k", windowMs: 60_000, max: 1 });

    expect(r1).toEqual({ allowed: true });
    expect(r2).toEqual({ allowed: true });
  });

  it("con Redis permite hasta max y bloquea en max+1", async () => {
    const mockRedis = createMockRedisWithCounters();
    vi.mocked(redisModule.getRedisClient).mockResolvedValue(mockRedis as unknown as Awaited<
      ReturnType<typeof redisModule.getRedisClient>
    >);

    const windowMs = 60_000;
    const now = Date.now();
    const windowId = Math.floor(now / windowMs);
    const key = `test:client:${windowId}`;

    const a = await rateLimitFixedWindow({ key, windowMs, max: 2 });
    const b = await rateLimitFixedWindow({ key, windowMs, max: 2 });
    const c = await rateLimitFixedWindow({ key, windowMs, max: 2 });

    expect(a.allowed).toBe(true);
    if (a.allowed) expect(a.remaining).toBe(1);

    expect(b.allowed).toBe(true);
    if (b.allowed) expect(b.remaining).toBe(0);

    expect(c.allowed).toBe(false);
    if (!c.allowed) {
      expect(c.retryAfterSec).toBeGreaterThanOrEqual(1);
      expect(c.remaining).toBe(0);
    }
  });

  it("ventanas distintas tienen contadores independientes (misma clave base, otro windowId)", async () => {
    const mockRedis = createMockRedisWithCounters();
    vi.mocked(redisModule.getRedisClient).mockResolvedValue(mockRedis as unknown as Awaited<
      ReturnType<typeof redisModule.getRedisClient>
    >);

    const windowMs = 60_000;
    const now = Date.now();
    const windowId = Math.floor(now / windowMs);
    const keyA = `iso:${windowId}`;
    const keyB = `iso:${windowId + 999}`;

    const r1 = await rateLimitFixedWindow({ key: keyA, windowMs, max: 1 });
    const r2 = await rateLimitFixedWindow({ key: keyB, windowMs, max: 1 });

    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    if (r1.allowed && r2.allowed) {
      expect(r1.remaining).toBe(0);
      expect(r2.remaining).toBe(0);
    }
  });
});
