"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useClickAway } from "react-use";

type VendedorOption = {
  idPublic: string;
  nombre: string;
};

interface VendedorAutocompleteProps {
  onSelect: (vendedor: VendedorOption | null) => void;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  active?: boolean;
}

export default function VendedorAutocomplete({
  onSelect,
  onSearchChange,
  placeholder = "Ingresa nombre compañía",
  className = "",
  value: controlledValue,
  active,
}: VendedorAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(controlledValue || "");
  const [vendedores, setVendedores] = useState<VendedorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/vendedores")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled || !Array.isArray(res)) return;
        setVendedores(res);
      })
      .catch(() => {
        if (!cancelled) setVendedores([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredVendedores = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    const seen = new Set<string>();
    return vendedores
      .filter((v) => v.nombre.toLowerCase().includes(term))
      .filter((v) => {
        const key = v.nombre.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 10);
  }, [searchTerm, vendedores]);

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
    (v: VendedorOption) => {
      setSearchTerm(v.nombre);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSelect(v);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredVendedores.length === 0) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredVendedores.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < filteredVendedores.length) {
            handleSelect(filteredVendedores[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, filteredVendedores, selectedIndex, handleSelect]
  );

  useClickAway(containerRef, () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  });

  useEffect(() => {
    if (searchTerm.trim() && filteredVendedores.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, filteredVendedores.length]);

  // Determinar la clase base según el contexto de uso
  const baseClass = className.includes("w-100") || className.includes("tp-team") 
    ? "tp-team-contact-input" 
    : "tp-hero-tab-input";

  return (
    <div
      ref={containerRef}
      className={`${baseClass} p-relative ${className} ${active ? "tp-filter-active" : ""}`.trim()}
      style={{ position: "relative", width: "100%" }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchTerm.trim() && filteredVendedores.length > 0) setIsOpen(true);
        }}
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
          {filteredVendedores.length > 0 ? (
            filteredVendedores.map((v, i) => (
              <li
                key={v.idPublic}
                role="option"
                aria-selected={i === selectedIndex}
                onClick={() => handleSelect(v)}
                style={{
                  padding: "12px 15px",
                  cursor: "pointer",
                  backgroundColor: i === selectedIndex ? "#f8f9fa" : "transparent",
                  borderBottom:
                    i < filteredVendedores.length - 1 ? "1px solid #eee" : "none",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {v.nombre}
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
              No se encontraron compañías
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
