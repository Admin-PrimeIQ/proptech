"use client";

import { useState, useEffect, useMemo } from "react";
import { propertyData } from "@/data/propertyData";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import {
  getPropertiesFromStorage,
  convertStorageToProperty,
  IPropertyStorage,
} from "../lib/propertyStorage";

/**
 * Hook que combina propertyData estático con propiedades de localStorage
 * Mantiene compatibilidad con la arquitectura existente
 */
export function usePropertyData(): IFeaturedPropertyDT[] {
  const [storageProperties, setStorageProperties] = useState<IPropertyStorage[]>([]);

  useEffect(() => {
    // Cargar propiedades de localStorage al montar
    const stored = getPropertiesFromStorage();
    setStorageProperties(stored);

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const updated = getPropertiesFromStorage();
      setStorageProperties(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // También escuchar eventos personalizados para cambios en la misma pestaña
    window.addEventListener("propertyStorageUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("propertyStorageUpdated", handleStorageChange);
    };
  }, []);

  // Combinar propertyData estático con propiedades de localStorage
  const combinedProperties = useMemo(() => {
    // Usar la primera imagen de propertyData como fallback (ignorar imágenes por ahora)
    const defaultImage = propertyData.length > 0 ? propertyData[0].image : null;
    
    if (!defaultImage) {
      // Si no hay propiedades estáticas, retornar solo las de localStorage sin imagen
      return propertyData;
    }

    // Convertir propiedades de localStorage al formato compatible
    const convertedStorage = storageProperties.map((storageProp) =>
      convertStorageToProperty(storageProp, defaultImage)
    );

    // Combinar: primero las estáticas, luego las de localStorage
    return [...propertyData, ...convertedStorage];
  }, [storageProperties]);

  return combinedProperties;
}

/**
 * Función para notificar cambios en localStorage (misma pestaña)
 */
export function notifyPropertyStorageUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("propertyStorageUpdated"));
  }
}
