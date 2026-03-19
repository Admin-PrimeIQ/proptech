"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import PropertyForm from "../components/PropertyForm";

export default function AgregarNuevaPropiedad() {
  return (
    <DashboardLayout>
      <div className="tp-dashboard-profile-wrapper">
        <AdminPageHeader
          title="Agregar Nueva Propiedad"
          subtitle="Crea y gestiona nuevas propiedades"
        />
        <PropertyForm mode="create" />
      </div>
    </DashboardLayout>
  );
}
