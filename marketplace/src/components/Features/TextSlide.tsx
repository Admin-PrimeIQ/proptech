"use client";

import { useEffect, useState } from "react";

export default function TextSlide() {
  const [palabrasClave, setPalabrasClave] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/palabras-clave")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) {
          console.error("Error al cargar palabras clave:", res.error);
          setPalabrasClave([]);
          return;
        }
        const data = res?.data ?? res ?? [];
        const palabras = Array.isArray(data)
          ? data.map((item: { palabraClave: string }) => item.palabraClave)
          : [];
        setPalabrasClave(palabras);
      })
      .catch((err) => {
        console.error("Error al cargar palabras clave:", err);
        setPalabrasClave([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Si no hay palabras clave, usar valores por defecto
  const palabrasParaMostrar =
    palabrasClave.length > 0
      ? palabrasClave
      : [
          "Apartamentos de Lujo",
          "Propiedades Residenciales",
          "Casas Modernas",
          "Propiedad",
          "Residencial",
          "Moderno",
          "Casa",
        ];

  // Crear texto repetido para el scroll infinito (primera línea)
  const textoScroll1 = palabrasParaMostrar
    .map((palabra) => palabra)
    .join(" ")
    .repeat(5);

  return (
    <section
      className="tp-text-area p-relative"
      style={{ paddingTop: "84px", paddingBottom: "64px" }}
    >
      <div className="container-fluid gx-0">
        <div className="row gx-0">
          <div className="col-lg-12">
            <div className="tp-text-sliding mb-30">
              <div className="tp-text-scroll-hr">
                <div className="tp-text-scroll-wrap">
                  <h2 className="tp-text-title">{textoScroll1}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="tp-text-sliding-2">
              <div className="tp-text-scroll-hr-2">
                <div className="tp-text-scroll-wrap-2">
                  <h2 className="tp-text-title-2">
                    {palabrasParaMostrar.map((palabra, index) => (
                      <span key={index}>{palabra}</span>
                    ))}
                    {/* Repetir para efecto infinito */}
                    {palabrasParaMostrar.map((palabra, index) => (
                      <span key={`repeat-${index}`}>{palabra}</span>
                    ))}
                    {palabrasParaMostrar.map((palabra, index) => (
                      <span key={`repeat2-${index}`}>{palabra}</span>
                    ))}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
