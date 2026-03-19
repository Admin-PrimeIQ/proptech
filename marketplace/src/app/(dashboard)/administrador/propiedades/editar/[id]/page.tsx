"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import PropertyForm from "../../../components/PropertyForm";

export default function EditarPropiedadPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  return (
    <DashboardLayout>
      <div className="tp-dashboard-profile-wrapper">
        <Link
          href="/administrador/propiedades"
          className="tp-btn tp-btn-border mb-4 d-inline-flex align-items-center"
          style={{ gap: "8px" }}
        >
          <i className="fa-light fa-arrow-left" />
          Regresar
        </Link>
        <AdminPageHeader
          title="Editar Propiedad"
          subtitle="Modifica los datos de la propiedad"
        />
        {id ? (
          <PropertyForm mode="edit" idPublic={id} submitLabel="Guardar cambios" />
        ) : (
          <div className="py-5 text-center">ID de propiedad no válido.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
