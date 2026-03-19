import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import VendedorForm from "./components/VendedorForm";

export const metadata: Metadata = {
  title: "Agregar Vendedor - Administrador",
};

export default function AgregarVendedor() {
  return (
    <DashboardLayout>
      <div className="tp-dashboard-profile-wrapper">
        <AdminPageHeader
          title="Agregar Vendedor"
          subtitle="Gestiona y agrega nuevos vendedores al sistema"
        />
        <VendedorForm />
      </div>
    </DashboardLayout>
  );
}
