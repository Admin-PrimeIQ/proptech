import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import PaginaPrincipalForm from "./components/PaginaPrincipalForm";

export const metadata: Metadata = {
  title: "Página Principal - Administrador",
};

export default function PaginaPrincipal() {
  return (
    <DashboardLayout>
      <div className="tp-dashboard-profile-wrapper">
        <AdminPageHeader
          title="Página Principal"
          subtitle="Gestiona la configuración de la página principal"
        />
        <PaginaPrincipalForm />
      </div>
    </DashboardLayout>
  );
}
