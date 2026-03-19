"use client";
import { useEffect } from "react";
import { useConfiguracionGeneral } from "@/hooks/useConfiguracionGeneral";

/**
 * Componente que actualiza dinámicamente los metadatos SEO
 * basándose en la configuración guardada en la base de datos
 */
export default function SEOHead() {
  const { configuracion } = useConfiguracionGeneral();

  useEffect(() => {
    // Actualizar título de la página
    if (configuracion.tituloSeo && configuracion.tituloSeo.trim() !== "") {
      document.title = configuracion.tituloSeo;
    }

    // Actualizar meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    
    if (configuracion.descripcionSeo && configuracion.descripcionSeo.trim() !== "") {
      metaDescription.setAttribute("content", configuracion.descripcionSeo);
    }

    // Actualizar Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    if (configuracion.tituloSeo && configuracion.tituloSeo.trim() !== "") {
      ogTitle.setAttribute("content", configuracion.tituloSeo);
    }

    // Actualizar Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }
    if (configuracion.descripcionSeo && configuracion.descripcionSeo.trim() !== "") {
      ogDescription.setAttribute("content", configuracion.descripcionSeo);
    }

    // Actualizar Twitter Card title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement("meta");
      twitterTitle.setAttribute("name", "twitter:title");
      document.head.appendChild(twitterTitle);
    }
    if (configuracion.tituloSeo && configuracion.tituloSeo.trim() !== "") {
      twitterTitle.setAttribute("content", configuracion.tituloSeo);
    }

    // Actualizar Twitter Card description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement("meta");
      twitterDescription.setAttribute("name", "twitter:description");
      document.head.appendChild(twitterDescription);
    }
    if (configuracion.descripcionSeo && configuracion.descripcionSeo.trim() !== "") {
      twitterDescription.setAttribute("content", configuracion.descripcionSeo);
    }
  }, [configuracion.tituloSeo, configuracion.descripcionSeo]);

  return null; // Este componente no renderiza nada
}
