"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useClickAway } from "react-use";

type CiudadOption = {
  idPublic: string;
  nombre: string;
};

interface CiudadAutocompleteProps {
  onSelect: (ciudad: CiudadOption | null) => void;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  active?: boolean;
}

export default function CiudadAutocomplete({
  onSelect,
  onSearchChange,
  placeholder = "Ciudad",
  className = "",
  value: controlledValue,
  active,
}: CiudadAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(controlledValue || "");
  const [ciudades, setCiudades] = useState<CiudadOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce para evitar demasiadas llamadas a la API
  useEffect(() => {
    if (!searchTerm.trim()) {
      setCiudades([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      let cancelled = false;
      setLoading(true);
      fetch(`/api/ciudades/autocomplete?search=${encodeURIComponent(searchTerm)}`)
        .then((r) => r.json())
        .then((res) => {
          if (cancelled) return;
          const list = Array.isArray(res) ? res : res?.data ?? [];
          setCiudades(Array.isArray(list) ? list : []);
        })
        .catch(() => {
          if (!cancelled) setCiudades([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredCiudades = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    const seen = new Set<string>();
    return ciudades
      .filter((c) => c.nombre.toLowerCase().includes(term))
      .filter((c) => {
        const key = c.nombre.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10);
  }, [searchTerm, ciudades]);

  useEffect(() => {
    if (controlledValue !== undefined) setSearchTerm(controlledValue);
  }, [controlledValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      setSelectedIndex(-1);
      onSearchChange?.(value);
      if (!value.trim()) {
        setIsOpen(false);
        onSelect(null);
      }
    },
    [onSelect, onSearchChange]
  );

  const handleSelect = useCallback(
    (c: CiudadOption) => {
      setSearchTerm(c.nombre);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSelect(c);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredCiudades.length === 0) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCiudades.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < filteredCiudades.length) {
            handleSelect(filteredCiudades[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, filteredCiudades, selectedIndex, handleSelect]
  );

  useClickAway(containerRef, () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  });

  useEffect(() => {
    if (searchTerm.trim() && filteredCiudades.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, filteredCiudades.length]);

  return (
    <div
      ref={containerRef}
      className={`tp-team-contact-input p-relative ${className} ${active ? "tp-filter-active" : ""}`.trim()}
      style={{ position: "relative" }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchTerm.trim() && filteredCiudades.length > 0) setIsOpen(true);
        }}
      />
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M7.99992 8.95334C9.14867 8.95334 10.0799 8.02209 10.0799 6.87334C10.0799 5.72458 9.14867 4.79333 7.99992 4.79333C6.85117 4.79333 5.91992 5.72458 5.91992 6.87334C5.91992 8.02209 6.85117 8.95334 7.99992 8.95334Z"
            stroke="#262B35"
            strokeWidth="1.5"
          ></path>
          <path
            d="M2.41379 5.66001C3.72712 -0.113322 12.2805 -0.106655 13.5871 5.66668C14.3538 9.05335 12.2471 11.92 10.4005 13.6933C9.06046 14.9867 6.94046 14.9867 5.59379 13.6933C3.75379 11.92 1.64712 9.04668 2.41379 5.66001Z"
            stroke="#262B35"
            strokeWidth="1.5"
          ></path>
        </svg>
      </span>
      {isOpen && (
        <ul
          className="list"
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "4px",
            marginTop: "4px",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            listStyle: "none",
            padding: 0,
          }}
        >
          {filteredCiudades.length > 0 ? (
            filteredCiudades.map((c, i) => (
              <li
                key={c.idPublic}
                role="option"
                aria-selected={i === selectedIndex}
                onClick={() => handleSelect(c)}
                style={{
                  padding: "12px 15px",
                  cursor: "pointer",
                  backgroundColor: i === selectedIndex ? "#f8f9fa" : "transparent",
                  borderBottom:
                    i < filteredCiudades.length - 1 ? "1px solid #eee" : "none",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {c.nombre}
              </li>
            ))
          ) : searchTerm.trim() && !loading ? (
            <li
              style={{
                padding: "12px 15px",
                color: "#666",
                fontStyle: "italic",
              }}
            >
              No se encontraron ciudades
            </li>
          ) : null}
        </ul>
      )}
      {loading && searchTerm.trim() && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            padding: "12px 15px",
            backgroundColor: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: "4px",
            marginTop: "4px",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            color: "#666",
          }}
        >
          Cargando...
        </div>
      )}
    </div>
  );
}
