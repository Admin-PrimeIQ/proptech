"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import styles from "./LifestyleMatcherBody.module.scss";

export type Category = {
  id: string;
  title: string;
  subtitle: string;
};

type CategoryItemProps = {
  item: Category;
  isActive: boolean;
  onRemove: (id: string) => void;
};

export default function CategoryItem({ item, isActive, onRemove }: CategoryItemProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.id,
    });

  const itemStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={itemStyle}
      className={`${styles.priorityItem} ${isActive ? styles.priorityActive : ""} ${
        isDragging ? styles.priorityDragging : ""
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className={styles.dragHandle}
        aria-label={`Mover ${item.title}`}
        onTouchStart={(event) => event.preventDefault()}
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>

      <div className={styles.priorityInfo}>
        <strong>{item.title}</strong>
      </div>

      <div className={styles.priorityActions}>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => onRemove(item.id)}
          aria-label={`Eliminar ${item.title}`}
        >
          ×
        </button>
        <span className={styles.moreIcon}>⋮</span>
      </div>
    </article>
  );
}
