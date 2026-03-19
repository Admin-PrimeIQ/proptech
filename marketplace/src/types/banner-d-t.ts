
import type React from "react";

// Define the interface with 'tabLabel' as optional
export interface ITabContentProps {
    id: string;
    tabLabel?: string;
    isActive: boolean;
    onSortChange: () => void;
    // Filtros (siempre "por todo", sin venta/alquiler)
    onCategoriaSelect?: (categoria: { idPublic: string; nombre: string; slug?: string } | null) => void;
    onDepartamentoSelect?: (departamento: { idPublic: string; nombre: string } | null) => void;
    onVendedorSelect?: (vendedor: { idPublic: string; nombre: string } | null) => void;
    onSearch?: (search: string) => void;
    onSearchClick?: () => void;
    // Valores iniciales desde URL (p. ej. al llegar desde home con filtros)
    initialSearch?: string | null;
    initialCategoriaIdPublic?: string | null;
    initialDepartamentoIdPublic?: string | null;
    // Nodo opcional extra para filtros (ej. tipo de operación)
    tipoOperacionNode?: React.ReactNode;
    // Nodo opcional entre departamento y botón Buscar (ej. botón Búsqueda avanzada en móvil)
    extraEndNode?: React.ReactNode;
}
// Define the interface hero from props
export interface IHeroFormProps {
    onSortChange: () => void;
};