"use client";

import NavigateArrowSvg from "../SVG/NavigateArrowSvg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type DepartamentoDestacado = {
  idPublic: string;
  nombreDepartamento: string;
  /** idPublic del Departamento en BD; viene de la API cuando hay match por nombre normalizado. */
  departamentoIdPublic?: string | null;
  imagen: { idPublic: string; url: string } | null;
  orden: number;
  activo: boolean;
};

export default function HomePropertiesByCity() {
  const [departamentos, setDepartamentos] = useState<DepartamentoDestacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [departamentoIdPublicMap, setDepartamentoIdPublicMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Cargar departamentos destacados y todos los departamentos en paralelo
    Promise.all([
      fetch("/api/departamentos-destacados").then((r) => r.json()),
      fetch("/api/departamentos").then((r) => r.json()),
    ])
      .then(([destacadosRes, departamentosRes]) => {
        // Procesar departamentos destacados
        if (destacadosRes?.error) {
          console.error("Error al cargar departamentos destacados:", destacadosRes.error);
          return;
        }
        const destacadosData = destacadosRes?.data ?? destacadosRes ?? [];
        const activos = Array.isArray(destacadosData)
          ? destacadosData
              .filter((d: DepartamentoDestacado) => d.activo)
              .sort((a, b) => a.orden - b.orden)
          : [];
        setDepartamentos(activos);

        // Procesar todos los departamentos para crear el mapa de nombres a idPublic
        if (departamentosRes?.error) {
          console.error("Error al cargar departamentos:", departamentosRes.error);
          return;
        }
        const todosDepartamentos = departamentosRes?.data ?? departamentosRes ?? [];
        if (Array.isArray(todosDepartamentos)) {
          const normalize = (s: string) =>
            s
              .trim()
              .toLowerCase()
              .replace(/[áàäâã]/g, "a")
              .replace(/[éèëê]/g, "e")
              .replace(/[íìïî]/g, "i")
              .replace(/[óòöôõ]/g, "o")
              .replace(/[úùüû]/g, "u")
              .replace(/ñ/g, "n");
          const map: Record<string, string> = {};
          todosDepartamentos.forEach((dept: { idPublic: string; nombre: string }) => {
            map[dept.nombre] = dept.idPublic;
            map[normalize(dept.nombre)] = dept.idPublic;
          });
          setDepartamentoIdPublicMap(map);
        }
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /** Normaliza nombre para match (trim, minúsculas, sin acentos). */
  const normalizeNombreForMatch = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[áàäâã]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöôõ]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/ñ/g, "n");

  /** Construye la URL de propiedades siempre con departamentoIdPublic cuando esté disponible. */
  const getDepartamentoLink = (d: DepartamentoDestacado): string => {
    if (d.departamentoIdPublic?.trim()) {
      return `/propiedades?departamentoIdPublic=${encodeURIComponent(d.departamentoIdPublic.trim())}`;
    }
    const idPublic = departamentoIdPublicMap[d.nombreDepartamento]
      ?? departamentoIdPublicMap[normalizeNombreForMatch(d.nombreDepartamento)];
    if (idPublic) {
      return `/propiedades?departamentoIdPublic=${encodeURIComponent(idPublic)}`;
    }
    return "/propiedades";
  };

  if (loading) {
    return (
      <section className="tp-explore-area pt-140 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-explore-heading mb-55">
                <span className="tp-section-title-pre">PROPIEDADES EN EL PAÍS</span>
                <h3 className="tp-section-title">Explora departamentos</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 text-center py-5">
              <p>Cargando departamentos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (departamentos.length === 0) {
    return null; // No mostrar la sección si no hay departamentos
  }

  return (
    <section className="tp-explore-area pt-140 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-explore-heading mb-55">
              <span className="tp-section-title-pre">PROPIEDADES EN EL PAÍS</span>
              <h3 className="tp-section-title">Explora departamentos</h3>
            </div>
          </div>
        </div>
        <div className="row wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">
          {departamentos.map((departamento, index) => {
            // Mantener el mismo sistema de grid que tenía antes
            const gridClassMap: Record<number, string> = {
              0: "col-lg-6",
              1: "col-lg-3",
              2: "col-lg-3",
              3: "col-lg-4",
              4: "col-lg-5",
            };
            const gridClass = gridClassMap[index] || "col-lg-3";
            const imageUrl = departamento.imagen?.url || "/assets/img/explore/explore-thumb-1.jpg";
            const linkUrl = getDepartamentoLink(departamento);

            return (
              <div key={departamento.idPublic} className={gridClass}>
                <div className="tp-explore-item text-center mb-30">
                  <div className="tp-explore-thumb p-relative">
                    <Image 
                      src={imageUrl} 
                      alt={departamento.nombreDepartamento}
                      width={400}
                      height={300}
                      style={{ width: "100%", height: "auto", objectFit: "cover" }}
                      unoptimized={imageUrl.startsWith("http")}
                    />
                    <div className="tp-explore-content">
                      <h4 className="tp-explore-title">
                        <Link className="textline" href={linkUrl}>
                          {departamento.nombreDepartamento}
                        </Link>
                      </h4>
                      <span>Propiedades</span>
                    </div>
                    <div className="tp-explore-btn">
                      <Link href={linkUrl}>
                        <span>
                          <NavigateArrowSvg />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
