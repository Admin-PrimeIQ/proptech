"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useClickAway } from "react-use";
import LocationSvg from "@/components/SVG/BannerSvg/LocationSvg";

type DepartamentoOption = {
  idPublic: string;
  nombre: string;
};

interface DepartamentoAutocompleteProps {
  onSelect: (departamento: DepartamentoOption | null) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export default function DepartamentoAutocomplete({
  onSelect,
  placeholder = "Barrios",
  className = "",
  value: controlledValue,
}: DepartamentoAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(controlledValue || "");
  const [departamentos, setDepartamentos] = useState<DepartamentoOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar departamentos con búsqueda
  useEffect(() => {
    let cancelled = false;
    if (!searchTerm.trim()) {
      setDepartamentos([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      fetch(
        `/api/departamentos/autocomplete?search=${encodeURIComponent(searchTerm)}`
      )
        .then((r) => r.json())
        .then((res: { data?: DepartamentoOption[] }) => {
          if (cancelled) return;
          const list = Array.isArray(res?.data) ? res.data : [];
          setDepartamentos(list);
        })
        .catch(() => {
          if (!cancelled) setDepartamentos([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300); // Debounce de 300ms

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  // Filtrar departamentos (ya vienen sin duplicados del API)
  const filteredDepartamentos = useMemo(() => {
    return departamentos.slice(0, 10); // Máximo 10 resultados
  }, [departamentos]);

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
      if (!value.trim()) {
        setIsOpen(false);
        onSelect(null);
      }
    },
    [onSelect]
  );

  // Manejar selección de departamento
  const handleSelect = useCallback(
    (departamento: DepartamentoOption) => {
      setSearchTerm(departamento.nombre);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSelect(departamento);
    },
    [onSelect]
  );

  // Manejar teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredDepartamentos.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredDepartamentos.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (
            selectedIndex >= 0 &&
            selectedIndex < filteredDepartamentos.length
          ) {
            handleSelect(filteredDepartamentos[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, filteredDepartamentos, selectedIndex, handleSelect]
  );

  // Cerrar dropdown al hacer clic fuera
  useClickAway(containerRef, () => {
    setIsOpen(false);
    setSelectedIndex(-1);
  });

  // Actualizar estado de apertura cuando cambian los resultados filtrados
  useEffect(() => {
    if (searchTerm.trim() && filteredDepartamentos.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, filteredDepartamentos.length]);

  return (
    <div
      ref={containerRef}
      className={`tp-hero-tab-input p-relative ${className}`}
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
          if (searchTerm.trim() && filteredDepartamentos.length > 0) {
            setIsOpen(true);
          }
        }}
      />
      <span>
        <LocationSvg />
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
          {filteredDepartamentos.length > 0 ? (
            filteredDepartamentos.map((departamento, index) => (
              <li
                key={departamento.idPublic}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => handleSelect(departamento)}
                style={{
                  padding: "12px 15px",
                  cursor: "pointer",
                  backgroundColor:
                    index === selectedIndex ? "#f8f9fa" : "transparent",
                  borderBottom:
                    index < filteredDepartamentos.length - 1
                      ? "1px solid #eee"
                      : "none",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {departamento.nombre}
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
              No se encontraron departamentos
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
