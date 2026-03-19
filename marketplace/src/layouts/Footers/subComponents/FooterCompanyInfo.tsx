"use client";
import React from "react";
import Link from "next/link";
import { useConfiguracionGeneral } from "@/hooks/useConfiguracionGeneral";

// Columna 2: información de la empresa
export default function FooterCompanyInfo() {
  const { configuracion, loading } = useConfiguracionGeneral();
  const informacionTexto = configuracion.informacionTexto || "";

  return (
    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
      <div className="tp-footer-widget tp-footer-col-2 mb-50">
        <h3 className="tp-footer-widget-title">Información de la empresa</h3>
        <div className="tp-footer-widget-content">
          {loading ? (
            <p>Cargando...</p>
          ) : informacionTexto ? (
            <p style={{ margin: 0, lineHeight: "1.6" }}>{informacionTexto}</p>
          ) : (
            <p>Sin información disponible</p>
          )}
          <div style={{ marginTop: "16px" }}>
            <Link href="/about" className="tp-btn">
              <span className="btn-wrap">
                <b className="text-1">Acerca de nosotros</b>
                <b className="text-2">Acerca de nosotros</b>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

