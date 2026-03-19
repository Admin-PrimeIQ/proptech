import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import AcercaDeNosotrosForm from "./components/AcercaDeNosotrosForm";

export const metadata: Metadata = {
  title: "Acerca de nosotros - Administrador",
};

export default function AcercaDeNosotrosPage() {
  return (
    <DashboardLayout>
      <div className="tp-dashboard-profile-wrapper">
        <AdminPageHeader
          title="Acerca de nosotros"
          subtitle="Gestiona el contenido de la página institucional Acerca de nosotros"
        />
        <AcercaDeNosotrosForm />
      </div>
    </DashboardLayout>
  );
}
