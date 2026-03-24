"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import styles from "./LifestyleMatcherBody.module.scss";
import CategoryItem, { Category } from "./CategoryItem";
import { PRIORITY_LIST_PAGE_SIZE, serializePriorities } from "./lifestyleMatcherPriorities.constants";

type CategoryListProps = {
  initialItems: Category[];
  onChange?: (items: Category[]) => void;
};

export default function CategoryList({ initialItems, onChange }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(initialItems);
  const [listPage, setListPage] = useState(1);
  const previousLengthRef = useRef(initialItems.length);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const initialFingerprint = useMemo(() => serializePriorities(initialItems), [initialItems]);

  useEffect(() => {
    setCategories((previous) =>
      serializePriorities(previous) === initialFingerprint ? previous : initialItems
    );
  }, [initialFingerprint, initialItems]);

  useEffect(() => {
    if (categories.length > previousLengthRef.current) {
      const lastPage = Math.max(1, Math.ceil(categories.length / PRIORITY_LIST_PAGE_SIZE));
      setListPage(lastPage);
    }
    previousLengthRef.current = categories.length;
  }, [categories.length]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(categories.length / PRIORITY_LIST_PAGE_SIZE)),
    [categories.length]
  );

  useEffect(() => {
    setListPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  const safePage = Math.min(listPage, totalPages);
  const pageStart = (safePage - 1) * PRIORITY_LIST_PAGE_SIZE;
  const pageCategories = categories.slice(pageStart, pageStart + PRIORITY_LIST_PAGE_SIZE);
  const pageSortableIds = pageCategories.map((item) => item.id);
  const placeholderCount = Math.max(0, PRIORITY_LIST_PAGE_SIZE - pageCategories.length);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 4,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCategories((prev) => {
      const totalP = Math.max(1, Math.ceil(prev.length / PRIORITY_LIST_PAGE_SIZE));
      const currentPage = Math.min(listPage, totalP);
      const start = (currentPage - 1) * PRIORITY_LIST_PAGE_SIZE;
      const end = Math.min(start + PRIORITY_LIST_PAGE_SIZE, prev.length);
      const slice = prev.slice(start, end);
      const oldIndex = slice.findIndex((item) => item.id === active.id);
      const newIndex = slice.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const reorderedSlice = arrayMove(slice, oldIndex, newIndex);
      const next = [...prev.slice(0, start), ...reorderedSlice, ...prev.slice(end)];
      queueMicrotask(() => onChangeRef.current?.(next));
      return next;
    });
  };

  const handleRemove = useCallback((id: string) => {
    setCategories((prev) => {
      const next = prev.filter((item) => item.id !== id);
      queueMicrotask(() => onChangeRef.current?.(next));
      return next;
    });
  }, []);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className={styles.priorityListViewport}>
        <SortableContext items={pageSortableIds} strategy={verticalListSortingStrategy}>
          <div className={styles.priorityList}>
            {pageCategories.map((item, index) => (
              <CategoryItem
                key={item.id}
                item={item}
                isActive={pageStart + index === 0}
                onRemove={handleRemove}
              />
            ))}
            {Array.from({ length: placeholderCount }).map((_, index) => (
              <div
                key={`priority-slot-empty-${safePage}-${index}`}
                className={styles.prioritySlotEmpty}
                aria-hidden
              />
            ))}
          </div>
        </SortableContext>
      </div>

      {totalPages > 1 ? (
        <div className={styles.priorityListPagination} role="navigation" aria-label="Paginacion de prioridades">
          <button
            type="button"
            className={styles.priorityPaginationBtn}
            disabled={safePage <= 1}
            onClick={() => setListPage((p) => Math.max(1, p - 1))}
            aria-label="Pagina anterior"
          >
            ‹
          </button>
          <span className={styles.priorityPaginationMeta}>
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            className={styles.priorityPaginationBtn}
            disabled={safePage >= totalPages}
            onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Pagina siguiente"
          >
            ›
          </button>
        </div>
      ) : null}
    </DndContext>
  );
}
