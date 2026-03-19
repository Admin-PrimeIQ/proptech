"use client";
import { useState, useEffect } from "react";

interface SocialLinks {
  facebook: string;
  instagram: string;
  whatsapp: string;
  twitter: string;
}

export interface ConfiguracionGeneral {
  nombreEmpresa: string;
  esloganEmpresa: string;
  logoPreview?: string | null;
  telefono: string;
  email: string;
  redesSociales: SocialLinks;
  informacionTexto: string;
  tituloSeo?: string;
  descripcionSeo?: string;
}

const DEFAULT_CONFIG: ConfiguracionGeneral = {
  nombreEmpresa: "Nombre de la Compañía",
  esloganEmpresa: "Tu eslogan aquí",
  logoPreview: null,
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
};

export function useConfiguracionGeneral() {
  const [configuracion, setConfiguracion] = useState<ConfiguracionGeneral>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfiguracion = async () => {
    try {
      setLoading(true);
      const [configGeneral, footer, seo] = await Promise.all([
        fetch("/api/configuracion-general").then((res) => res.json()),
        fetch("/api/footer").then((res) => res.json()),
        fetch("/api/seo").then((res) => res.json()),
      ]);

      if (configGeneral.error || footer.error || seo.error) {
        console.error("Error fetching configuration:", configGeneral.error || footer.error || seo.error);
        return;
      }

      // Obtener URL del logo si existe idLogoRecurso
      let logoUrl = null;
      if (configGeneral.idLogoRecurso) {
        try {
          const recursoResponse = await fetch(`/api/recursos/${configGeneral.idLogoRecurso}`).then((res) => res.json());
          if (recursoResponse && !recursoResponse.error) {
            logoUrl = recursoResponse.url;
          }
        } catch (error) {
          console.error("Error fetching logo resource:", error);
        }
      }

      setConfiguracion({
        nombreEmpresa: configGeneral.nombreEmpresa || DEFAULT_CONFIG.nombreEmpresa,
        esloganEmpresa: footer.esloganEmpresa || DEFAULT_CONFIG.esloganEmpresa,
        logoPreview: logoUrl,
        telefono: footer.telefono || DEFAULT_CONFIG.telefono,
        email: footer.email || DEFAULT_CONFIG.email,
        redesSociales: footer.redesSociales || DEFAULT_CONFIG.redesSociales,
        informacionTexto: footer.informacionTexto || DEFAULT_CONFIG.informacionTexto,
        tituloSeo: seo.tituloSeo || "",
        descripcionSeo: seo.descripcionSeo || "",
      });
    } catch (error) {
      console.error("Error fetching configuration:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguracion();

    // Escuchar eventos de actualización
    const handleUpdate = () => {
      fetchConfiguracion();
    };
    window.addEventListener("configuracionUpdated", handleUpdate);

    return () => {
      window.removeEventListener("configuracionUpdated", handleUpdate);
    };
  }, []);

  const updateConfiguracion = async (updates: Partial<ConfiguracionGeneral>) => {
    try {
      const updatesToSend: any = {};

      // Actualizar configuración general (nombreEmpresa)
      if (updates.nombreEmpresa !== undefined) {
        const response = await fetch("/api/configuracion-general", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombreEmpresa: updates.nombreEmpresa }),
        });
        if (!response.ok) throw new Error("Error al actualizar configuración general");
      }

      // Actualizar SEO
      if (updates.tituloSeo !== undefined || updates.descripcionSeo !== undefined) {
        const response = await fetch("/api/seo", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tituloSeo: updates.tituloSeo,
            descripcionSeo: updates.descripcionSeo,
          }),
        });
        if (!response.ok) throw new Error("Error al actualizar SEO");
      }

      // Actualizar Footer
      const footerUpdates: any = {};
      if (updates.esloganEmpresa !== undefined) footerUpdates.esloganEmpresa = updates.esloganEmpresa;
      if (updates.informacionTexto !== undefined) footerUpdates.informacionTexto = updates.informacionTexto;
      if (updates.telefono !== undefined) footerUpdates.telefono = updates.telefono;
      if (updates.email !== undefined) footerUpdates.email = updates.email;
      if (updates.redesSociales !== undefined) footerUpdates.redesSociales = updates.redesSociales;

      if (Object.keys(footerUpdates).length > 0) {
        const response = await fetch("/api/footer", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(footerUpdates),
        });
        if (!response.ok) throw new Error("Error al actualizar footer");
      }

      // Refetch para obtener los datos actualizados de la base de datos
      await fetchConfiguracion();

      // Disparar evento para actualizar otros componentes
      window.dispatchEvent(new Event("configuracionUpdated"));

      return true;
    } catch (error) {
      console.error("Error updating configuration:", error);
      throw error;
    }
  };

  return {
    configuracion,
    loading,
    updateConfiguracion,
    refetch: fetchConfiguracion,
  };
}
