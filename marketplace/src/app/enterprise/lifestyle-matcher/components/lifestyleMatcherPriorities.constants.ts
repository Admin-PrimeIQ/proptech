import type { Category } from "./CategoryItem";

export const PRIORITY_LIST_PAGE_SIZE = 5;
export const PRIORITY_LIST_MAX_ITEMS = 10;

export function serializePriorities(items: Category[]): string {
  return JSON.stringify(items.map((item) => [item.id, item.title, item.subtitle]));
}
