"use client";

import type { Category } from "../components/CategoryItem";
import type { SelectedPoint } from "../puntos/services/lifestyleMatcherPoints.service";

const PRIORITIES_CACHE_KEY = "lifestyleMatcher:priorities:v1";

type CachedPriority = {
  id: string;
  title: string;
  subtitle: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isValidPriority(value: unknown): value is CachedPriority {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.subtitle === "string" &&
    row.id.trim().length > 0 &&
    row.title.trim().length > 0
  );
}

export function loadCachedPriorities(): Category[] | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(PRIORITIES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter(isValidPriority);
    if (valid.length === 0) return null;
    return valid.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
    }));
  } catch {
    return null;
  }
}

export function saveCachedPriorities(priorities: Category[]): void {
  if (!canUseStorage()) return;
  try {
    const normalized = priorities.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
    }));
    window.localStorage.setItem(PRIORITIES_CACHE_KEY, JSON.stringify(normalized));
  } catch {
    // Evita romper UI si localStorage falla (modo privado/cuota).
  }
}

export function toSelectedPoints(priorities: Category[]): SelectedPoint[] {
  return priorities.map((priority, index) => ({
    id: priority.id,
    title: priority.title,
    subtitle: "Sin ubicación",
    active: index === 0,
  }));
}
