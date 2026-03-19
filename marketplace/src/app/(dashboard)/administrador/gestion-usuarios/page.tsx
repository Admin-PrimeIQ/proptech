import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import GestionUsuariosContent from "./components/GestionUsuariosContent";

export const metadata: Metadata = {
  title: "Gestión de usuarios - Administrador",
};

export default function GestionUsuariosPage() {
  return (
    <DashboardLayout>
      <GestionUsuariosContent />
    </DashboardLayout>
  );
}
