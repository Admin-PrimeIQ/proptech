"use client";
import { useState, useEffect } from "react";

interface SocialLinks {
  facebook: string;
  instagram: string;
  whatsapp: string;
  twitter: string;
}

interface Configuracion {
  nombreEmpresa: string;
  esloganEmpresa: string;
  idLogoRecurso?: string | null;
  telefono?: string;
  email?: string;
  redesSociales?: SocialLinks;
  informacionTexto?: string;
  tituloSeo?: string;
  descripcionSeo?: string;
}

export function useConfiguracion() {
  const [configuracion, setConfiguracion] = useState<Configuracion>({
    nombreEmpresa: "Nombre de la Compañía",
    esloganEmpresa: "Tu eslogan aquí",
    telefono: "+624 423 26 72",
    email: "support@bhumi.com",
    redesSociales: {
      facebook: "https://www.facebook.com/",
      instagram: "https://www.instagram.com/",
      whatsapp: "+1234567890",
      twitter: "https://twitter.com/",
    },
    informacionTexto: "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.",
    tituloSeo: "",
    descripcionSeo: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfiguracion();
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const stored = localStorage.getItem("admin_configuracion_general");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Migrar informacionLinks (array) a informacionTexto (string) si existe
          const informacionTexto = parsed.informacionTexto 
            ? parsed.informacionTexto 
            : (parsed.informacionLinks ? migrateInformacionTexto(parsed.informacionLinks) : undefined);
          
          setConfiguracion({
            nombreEmpresa: parsed.nombreEmpresa || "Nombre de la Compañía",
            esloganEmpresa: parsed.esloganEmpresa || "Tu eslogan aquí",
            telefono: parsed.telefono || "+624 423 26 72",
            email: parsed.email || "support@bhumi.com",
            redesSociales: parsed.redesSociales || {
              facebook: "https://www.facebook.com/",
              instagram: "https://www.instagram.com/",
              whatsapp: "+1234567890",
              twitter: "https://twitter.com/",
            },
            informacionTexto: informacionTexto || "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.",
            tituloSeo: parsed.tituloSeo || "",
            descripcionSeo: parsed.descripcionSeo || "",
          });
          
          // Si hubo migración, guardar el formato nuevo
          if (parsed.informacionLinks && !parsed.informacionTexto) {
            const updatedConfig = {
              ...parsed,
              informacionTexto: informacionTexto,
            };
            delete updatedConfig.informacionLinks;
            localStorage.setItem("admin_configuracion_general", JSON.stringify(updatedConfig));
          }
        } catch (error) {
          console.error("Error parsing localStorage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // También escuchar cambios en la misma pestaña usando un evento personalizado
    window.addEventListener("configuracionUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("configuracionUpdated", handleStorageChange);
    };
  }, []);

  // Función para migrar datos antiguos (arrays/objetos) a nuevo formato (string)
  const migrateInformacionTexto = (data: any): string => {
    if (!data) {
      return "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.";
    }
    
    // Si es un string, retornar tal cual
    if (typeof data === 'string') {
      return data;
    }
    
    // Si es un array de strings, unirlos con saltos de línea
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.";
      }
      
      // Si el primer elemento es un objeto con 'label', extraer los labels
      if (typeof data[0] === 'object' && data[0] !== null && 'label' in data[0]) {
        return data.map((item: any) => item.label || "").filter(Boolean).join("\n");
      }
      
      // Si son strings, unirlos con saltos de línea
      return data.filter((item: any) => typeof item === 'string').join("\n");
    }
    
    return "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.";
  };

  const fetchConfiguracion = async () => {
    try {
      // Primero intentar leer de localStorage
      const stored = localStorage.getItem("admin_configuracion_general");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Migrar informacionLinks (array) a informacionTexto (string) si existe
          const informacionTexto = parsed.informacionTexto 
            ? parsed.informacionTexto 
            : (parsed.informacionLinks ? migrateInformacionTexto(parsed.informacionLinks) : undefined);
          
          setConfiguracion({
            nombreEmpresa: parsed.nombreEmpresa || "Nombre de la Compañía",
            esloganEmpresa: parsed.esloganEmpresa || "Tu eslogan aquí",
            telefono: parsed.telefono || "+624 423 26 72",
            email: parsed.email || "support@bhumi.com",
            redesSociales: parsed.redesSociales || {
              facebook: "https://www.facebook.com/",
              instagram: "https://www.instagram.com/",
              whatsapp: "+1234567890",
              twitter: "https://twitter.com/",
            },
            informacionTexto: informacionTexto || "Información sobre la empresa, servicios y más detalles relevantes para los visitantes del sitio web.",
            tituloSeo: parsed.tituloSeo || "",
            descripcionSeo: parsed.descripcionSeo || "",
          });
          
          // Si hubo migración, guardar el formato nuevo
          if (parsed.informacionLinks && !parsed.informacionTexto) {
            const updatedConfig = {
              ...parsed,
              informacionTexto: informacionTexto,
            };
            delete updatedConfig.informacionLinks;
            localStorage.setItem("admin_configuracion_general", JSON.stringify(updatedConfig));
          }
          
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing localStorage:", error);
        }
      }

      // Si no hay en localStorage, intentar desde API
      const response = await fetch("/api/configuracion");
      const data = await response.json();
      if (data.success && data.data) {
        setConfiguracion(data.data);
      }
    } catch (error) {
      console.error("Error obteniendo configuración:", error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarConfiguracion = async (updates: Partial<Configuracion>) => {
    try {
      const response = await fetch("/api/configuracion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setConfiguracion((prev) => ({ ...prev, ...data.data }));
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      console.error("Error actualizando configuración:", error);
      return { success: false, error: "Error al actualizar" };
    }
  };

  return {
    configuracion,
    loading,
    actualizarConfiguracion,
    refetch: fetchConfiguracion,
  };
}
