"use client";

import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { StaticImageData } from "next/image";

// Interfaz extendida para propiedades en localStorage (imágenes como string)
export interface IPropertyStorage {
  id: number;
  title: string;
  address?: string;
  linkUrl?: string;
  image: string; // URL o path como string
  userImage?: string;
  showTags?: boolean;
  isForRent?: boolean;
  isFeatured?: boolean;
  userName?: string;
  userRole?: string;
  bedrooms: string;
  bathrooms: string;
  livingArea: string;
  city?: string;
  state?: string;
  wowAnimation?: boolean;
  wowDelay?: string;
  description?: string;
  spacing?: boolean;
  price: number;
  quantity: number;
  // Campos adicionales del formulario
  referenciaCorta?: string;
  categoria?: string;
  operacionInmobiliaria?: string;
  zona?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  direccionPublica?: string;
  latitud?: string;
  longitud?: string;
  habitaciones?: string;
  banos?: string;
  parqueos?: string;
  metroConstruccion?: string;
  metrosTerreno?: string;
  anoConstruccion?: string;
  vendedorNombre?: string;
  vendedorFoto?: string;
  moneda?: string;
  precioPorM2Construccion?: string;
  mantenimiento?: string;
}

const STORAGE_KEY = "user_properties";

// Convertir propiedad de localStorage a formato compatible con IFeaturedPropertyDT
export function convertStorageToProperty(
  storageProp: IPropertyStorage,
  defaultImage: StaticImageData
): IFeaturedPropertyDT {
  return {
    ...storageProp,
    image: defaultImage, // Usar imagen por defecto temporalmente
    userImage: storageProp.userImage ? (storageProp.userImage as any) : undefined,
  };
}

// Guardar propiedad en localStorage
export function savePropertyToStorage(property: IPropertyStorage): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getPropertiesFromStorage();
    const updated = [...existing, property];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error guardando propiedad en localStorage:", error);
  }
}

// Obtener propiedades de localStorage
export function getPropertiesFromStorage(): IPropertyStorage[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error leyendo propiedades de localStorage:", error);
    return [];
  }
}

// Eliminar propiedad de localStorage
export function removePropertyFromStorage(id: number): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getPropertiesFromStorage();
    const updated = existing.filter((prop) => prop.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error eliminando propiedad de localStorage:", error);
  }
}

// Obtener siguiente ID disponible
export function getNextPropertyId(): number {
  const stored = getPropertiesFromStorage();
  const maxId = stored.length > 0 ? Math.max(...stored.map((p) => p.id)) : 0;
  // Asegurar que el ID sea mayor que los IDs estáticos (que empiezan en 1)
  return Math.max(maxId + 1, 10000);
}
