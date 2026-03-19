import LeaveMessageForm from "@/components/Form/LeaveMessageForm";
import { CallThreeSvg, TeamEmailSvg } from "@/components/SVG";
import UserAvatarPlaceholder from "@/components/UI/UserAvatarPlaceholder";
import Image from "next/image";
import Link from "next/link";

export type VendedorContactData = {
  nombre: string;
  fotoUrl?: string | null;
  telefono?: string | null;
  correo?: string | null;
  propiedadesCount?: number;
};

interface UserContactCardProps {
  vendedor?: VendedorContactData | null;
  idPropiedad?: string | null;
}

export default function UserContactCard({ vendedor, idPropiedad }: UserContactCardProps) {
  const showVendedor = !!vendedor?.nombre;
  const fotoUrl = showVendedor && vendedor.fotoUrl ? vendedor.fotoUrl : null;
  const propiedadesText =
    showVendedor && vendedor.propiedadesCount != null
      ? vendedor.propiedadesCount === 1
        ? "1 propiedad"
        : `${vendedor.propiedadesCount} propiedades`
      : null;
  const nombre = showVendedor ? vendedor.nombre : "Contactar";
  const telefono = showVendedor && vendedor.telefono ? vendedor.telefono : null;
  const correo = showVendedor && vendedor.correo ? vendedor.correo : null;

  return (
    <div className="tp-team-details-widget mb-40">
      <div className="tp-team-details-info-box">
        <div className="tp-team-details-info-top">
          <div className="tp-team-details-info-user d-flex align-items-center">
            <div className="tp-team-details-info-user-thumb">
              {fotoUrl ? (
                <Image
                  src={fotoUrl}
                  alt={nombre}
                  width={80}
                  height={80}
                  style={{ objectFit: "cover" }}
                  unoptimized={fotoUrl.startsWith("http")}
                />
              ) : (
                <UserAvatarPlaceholder size={80} />
              )}
            </div>
            <div className="tp-team-details-info-user-content">
              <h4>{nombre}</h4>
              {propiedadesText != null ? <p>{propiedadesText}</p> : <p className="text-muted mb-0">—</p>}
            </div>
          </div>
        </div>
        <div className="tp-team-details-info-content">
          <div className="tp-team-details-info-contact">
            {telefono ? (
              <Link href={`tel:${telefono.replace(/\s/g, "")}`}>
                <span><CallThreeSvg width="16" height="16" /></span>
                {telefono}
              </Link>
            ) : (
              <span className="text-muted"><CallThreeSvg width="16" height="16" /> —</span>
            )}
            {correo ? (
              <Link href={`mailto:${correo}`}>
                <span><TeamEmailSvg /></span>
                {correo}
              </Link>
            ) : (
              <span className="text-muted"><TeamEmailSvg /> —</span>
            )}
          </div>
          <div className="tp-team-details-info-form">
            <h3 className="tp-team-details-info-form-title">Contáctanos!</h3>
            <LeaveMessageForm idPropiedad={idPropiedad ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
