"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useClickAway } from "react-use";

type PropertyOption = {
  idPublic: string;
  nombrePropiedad: string;
};

interface PropertyAutocompleteProps {
  onSelect: (propertyName: string | null) => void;
  onSearchChange?: (text: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  scope?: "admin" | "public";
}

export default function PropertyAutocomplete({
  onSelect,
  onSearchChange,
  placeholder = "Buscar por nombre de propiedad",
  className = "",
  value: controlledValue,
  scope = "public",
}: PropertyAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(controlledValue || "");
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar todas las propiedades al montar
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const scopeParam = scope === "admin" ? "&scope=admin" : "";
    fetch(`/api/propiedades?limit=100${scopeParam}`)
      .then((r) => r.json())
      .then((res: { data?: Array<{ idPublic: string; nombrePropiedad: string }> }) => {
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setProperties(
          list.map((p) => ({
            idPublic: p.idPublic,
            nombrePropiedad: p.nombrePropiedad,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filtrar propiedades basado en el término de búsqueda (sin duplicados por nombre)
  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    const seen = new Set<string>();
    return properties
      .filter((p) => p.nombrePropiedad.toLowerCase().includes(term))
      .filter((p) => {
        const key = p.nombrePropiedad.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10); // Máximo 10 resultados
  }, [searchTerm, properties]);

  // Sincronizar valor controlado
  useEffect(() => {
    if (controlledValue !== undefined) {
      setSearchTerm(controlledValue);
    }
  }, [controlledValue]);

  // Manejar cambio en el input
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

  // Manejar selección de propiedad
  const handleSelect = useCallback(
    (property: PropertyOption) => {
      setSearchTerm(property.nombrePropiedad);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSelect(property.nombrePropiedad);
      onSearchChange?.(property.nombrePropiedad);
    },
    [onSelect, onSearchChange]
  );

  // Manejar teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredProperties.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredProperties.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < filteredProperties.length) {
            handleSelect(filteredProperties[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, filteredProperties, selectedIndex, handleSelect]
  );

  // Cerrar dropdown al hacer clic fuera
  useClickAway(containerRef, () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  });

  // Actualizar estado de apertura cuando cambian los resultados filtrados
  useEffect(() => {
    if (searchTerm.trim() && filteredProperties.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, filteredProperties.length]);

  return (
    <div
      ref={containerRef}
      className={`tp-dashboard-property-search p-relative ${className}`}
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
          if (searchTerm.trim() && filteredProperties.length > 0) {
            setIsOpen(true);
          }
        }}
        className="w-100"
        style={{ width: "100%" }}
      />
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
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <li
                key={property.idPublic}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => handleSelect(property)}
                style={{
                  padding: "12px 15px",
                  cursor: "pointer",
                  backgroundColor:
                    index === selectedIndex ? "#f8f9fa" : "transparent",
                  borderBottom: index < filteredProperties.length - 1 ? "1px solid #eee" : "none",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {property.nombrePropiedad}
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
              No se encontraron propiedades
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
