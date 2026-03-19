"use client";

import styles from "./SubzonaChecklist.module.scss";

export type SubzonaChecklistItem = {
  id: string;
  idPublic: string;
  nombreSubzona: string;
  zonaPrimaria: string | null;
};

type SubzonaChecklistProps = {
  subzonas: SubzonaChecklistItem[];
  selectedIds: Set<string>;
  onToggle: (idPublic: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
  hideToolbar?: boolean;
};

function formatZonaText(value: string): string {
  const raw = value.trim();
  if (!raw) return raw;
  return raw.replace(/^z\s*/i, "Zona ");
}

export default function SubzonaChecklist({
  subzonas,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
  loading = false,
  error = null,
  disabled = false,
  hideToolbar = false,
}: SubzonaChecklistProps) {
  const total = subzonas.length;
  const selectedCount = selectedIds.size;

  if (disabled) {
    return <p className={styles.feedback}>Seleccione una zona para ver subzonas.</p>;
  }

  if (loading) {
    return <p className={styles.feedback}>Cargando subzonas...</p>;
  }

  if (error) {
    return <p className={styles.feedbackError}>{error}</p>;
  }

  if (total === 0) {
    return <p className={styles.feedback}>No hay subzonas para esta zona.</p>;
  }

  return (
    <div className={styles.root}>
      {!hideToolbar ? (
        <div className={styles.toolbar}>
          <p className={styles.count}>
            {selectedCount} de {total} seleccionadas
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={onSelectAll}>
              Seleccionar todas
            </button>
            <button type="button" className={styles.actionBtn} onClick={onClearAll}>
              Quitar todas
            </button>
          </div>
        </div>
      ) : null}

      <ul className={styles.list} role="listbox" aria-label="Subzonas">
        {subzonas.map((item) => {
          const checked = selectedIds.has(item.idPublic);
          return (
            <li key={item.idPublic} className={styles.item}>
              <label className={styles.label}>
                <input type="checkbox" checked={checked} onChange={() => onToggle(item.idPublic)} />
                <span>
                  {formatZonaText(item.nombreSubzona)}
                  <span className={styles.subLabel}>{formatZonaText(item.id)}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
