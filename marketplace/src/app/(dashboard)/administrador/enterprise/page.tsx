import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import EnterpriseContent from "./components/EnterpriseContent";

export const metadata: Metadata = {
  title: "Enterprise - Administrador",
};

export default function EnterprisePage() {
  return (
    <DashboardLayout>
      <div className="tp-dashboard-profile-wrapper">
        <AdminPageHeader
          title="Enterprise"
          subtitle="Gestiona hero, servicios, planes y beneficios"
        />
        <EnterpriseContent />
      </div>
    </DashboardLayout>
  );
}
