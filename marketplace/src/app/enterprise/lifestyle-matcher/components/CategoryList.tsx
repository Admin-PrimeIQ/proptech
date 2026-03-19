"use client";

import { useEffect, useMemo, useState } from "react";
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

type CategoryListProps = {
  initialItems: Category[];
  searchTerm: string;
};

export default function CategoryList({ initialItems, searchTerm }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(initialItems);

  useEffect(() => {
    setCategories(initialItems);
  }, [initialItems]);

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

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((item) => {
      return item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query);
    });
  }, [categories, searchTerm]);

  const filteredIds = useMemo(() => filteredCategories.map((item) => item.id), [filteredCategories]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCategories((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleRemove = (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filteredIds} strategy={verticalListSortingStrategy}>
        <div className={styles.priorityList}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((item, index) => (
              <CategoryItem key={item.id} item={item} isActive={index === 0} onRemove={handleRemove} />
            ))
          ) : (
            <div className={styles.emptyState}>No hay coincidencias para tu búsqueda.</div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
