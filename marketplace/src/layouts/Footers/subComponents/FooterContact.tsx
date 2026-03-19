"use client";
import Link from "next/link";
import { useConfiguracionGeneral } from "@/hooks/useConfiguracionGeneral";
import DynamicLogo from "@/components/Logo/DynamicLogo";

// Columna 1: nombre compañía, eslogan, redes sociales
export default function FooterContact() {
  const { configuracion, loading } = useConfiguracionGeneral();

  const getWhatsAppUrl = (phoneNumber: string): string => {
    if (!phoneNumber) return "";
    const cleaned = phoneNumber.replace(/\s/g, "").replace(/-/g, "").replace(/^\+/, "");
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
      <div className="tp-footer-widget tp-footer-col-1 mb-50">
        <div className="tp-footer-logo mb-35">
          <Link href="/" className="d-flex align-items-center">
            <DynamicLogo variant="white" width={150} height={60} />
            {!loading && configuracion.nombreEmpresa && (
              <span className="ms-1" style={{ fontSize: "18px", fontWeight: "600", color: "white" }}>
                {configuracion.nombreEmpresa}
              </span>
            )}
          </Link>
        </div>
        <div className="tp-footer-widget-content mb-30">
          <p style={{ margin: 0 }}>
            {loading ? "Cargando..." : (configuracion.esloganEmpresa || "The home and elements needed to create beautiful products.")}
          </p>
        </div>
        <div className="tp-footer-widget-social">
          {configuracion.redesSociales && (
            <>
              {configuracion.redesSociales.facebook && (
                <Link href={configuracion.redesSociales.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </Link>
              )}{" "}
              {configuracion.redesSociales.instagram && (
                <Link href={configuracion.redesSociales.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              )}{" "}
              {configuracion.redesSociales.whatsapp && (
                <Link href={getWhatsAppUrl(configuracion.redesSociales.whatsapp)} target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-whatsapp"></i>
                </Link>
              )}{" "}
              {configuracion.redesSociales.twitter && (
                <Link href={configuracion.redesSociales.twitter} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
