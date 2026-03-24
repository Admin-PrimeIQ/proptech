"use client";

import type { PriorityPlaceSuggestion } from "./lifestyleMatcherPoints.types";
import styles from "./LifestyleMatcherPointsBody.module.scss";

type Props = {
  visible: boolean;
  centerLabel: string;
  loading: boolean;
  error: string | null;
  suggestions: PriorityPlaceSuggestion[];
  onSelect: (suggestion: PriorityPlaceSuggestion) => void;
};

export default function PriorityPlaceSuggestionsPanel(props: Props) {
  const { visible, centerLabel, loading, error, suggestions, onSelect } = props;

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.prioritySuggestionsPanel} role="region" aria-label="Sugerencias de ubicación">
      <div className={styles.prioritySuggestionsHeader}>
        <span className={styles.prioritySuggestionsTitle}>Sugerencias</span>
        <span className={styles.prioritySuggestionsSubtitle}>{centerLabel}</span>
      </div>
      {loading ? (
        <p className={styles.prioritySuggestionsMessage}>Buscando lugares cercanos…</p>
      ) : error ? (
        <p className={styles.prioritySuggestionsMessage}>{error}</p>
      ) : suggestions.length === 0 ? (
        <p className={styles.prioritySuggestionsMessage}>Sugerencias no encontradas</p>
      ) : (
        <ul className={styles.prioritySuggestionsList}>
          {suggestions.map((item) => (
            <li key={item.placeId} className={styles.prioritySuggestionsItem}>
              <div className={styles.prioritySuggestionsItemText}>
                <strong>{item.name}</strong>
                {item.vicinity ? <span>{item.vicinity}</span> : null}
              </div>
              <button type="button" className={styles.prioritySuggestionsUseBtn} onClick={() => onSelect(item)}>
                Usar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
