"use client";

import { useEffect, useState } from "react";
import styles from "./SubzonaAutocomplete.module.scss";

export type SearchSubzonaResult = {
  id: string;
  id_public: string;
  zona_primaria: string | null;
  nombre_subzona?: string | null;
};

type SubzonaAutocompleteProps = {
  selectedZonaPrimaria: string | null;
  onZonaSelected: (zonaPrimaria: string | null, item?: SearchSubzonaResult) => void;
  placeholder?: string;
};

function formatZonaForDisplay(value: string | null): string {
  if (!value) return "";
  const normalized = value.trim();

  const compactMatch = normalized.match(/^z(?:ona)?\s*0*(\d{1,2})$/i);
  if (compactMatch) {
    return `Zona ${Number(compactMatch[1])}`;
  }

  const numericMatch = normalized.match(/^0*(\d{1,2})$/);
  if (numericMatch) {
    return `Zona ${Number(numericMatch[1])}`;
  }

  return normalized
    .replace(/^zona\b/i, "Zona")
    .replace(/^z\b/i, "Zona");
}

export default function SubzonaAutocomplete({
  selectedZonaPrimaria,
  onZonaSelected,
  placeholder = "Escribe zona (ej: zona 10, z10, 10)",
}: SubzonaAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(formatZonaForDisplay(selectedZonaPrimaria));
  const [suggestions, setSuggestions] = useState<SearchSubzonaResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectionLocked, setSelectionLocked] = useState(false);

  useEffect(() => {
    setSearchTerm(formatZonaForDisplay(selectedZonaPrimaria));
    setSelectionLocked(Boolean(selectedZonaPrimaria));
  }, [selectedZonaPrimaria]);

  useEffect(() => {
    if (selectionLocked) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    const query = searchTerm.trim();
    if (query.length < 1) {
      setSuggestions([]);
      setSearching(false);
      setSearchError(null);
      return;
    }

    let active = true;
    setSearching(true);
    setSearchError(null);

    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/subzonas?q=${encodeURIComponent(query)}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.error || "No se pudo cargar sugerencias de subzonas.");
        }

        const payload = await res.json();
        if (!active) return;
        const results = Array.isArray(payload?.results) ? payload.results : [];
        setSuggestions(results as SearchSubzonaResult[]);
      } catch (err: unknown) {
        if (!active) return;
        setSearchError(err instanceof Error ? err.message : "Error desconocido buscando subzonas.");
        setSuggestions([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchTerm, selectionLocked]);

  const applySuggestion = (item: SearchSubzonaResult) => {
    const zona = item.zona_primaria?.trim() || null;
    setSearchTerm(formatZonaForDisplay(zona));
    setSuggestions([]);
    setSelectionLocked(true);
    onZonaSelected(zona, item);
  };

  const clearZonaFilter = () => {
    setSearchTerm("");
    setSuggestions([]);
    setSearchError(null);
    setSelectionLocked(false);
    onZonaSelected(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.searchBar}>
        <i className="fa-regular fa-magnifying-glass" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(event) => {
            setSelectionLocked(false);
            setSearchTerm(event.target.value);
          }}
        />
        {selectedZonaPrimaria ? (
          <button type="button" className={styles.clearBtn} onClick={clearZonaFilter} aria-label="Limpiar zona">
            <i className="fa-regular fa-xmark" />
          </button>
        ) : null}
      </div>

      {searching ? <p className={styles.feedback}>Buscando zonas...</p> : null}
      {searchError ? <p className={styles.feedbackError}>{searchError}</p> : null}
      {suggestions.length > 0 ? (
        <ul className={styles.suggestions} role="listbox" aria-label="Sugerencias de zonas">
          {suggestions.map((item) => (
            <li key={item.id_public}>
              <button type="button" onClick={() => applySuggestion(item)}>
                <strong>{formatZonaForDisplay(item.zona_primaria) || "Sin zona"}</strong>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
