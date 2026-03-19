import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import PropiedadesContent from "./components/PropiedadesContent";

export const metadata: Metadata = {
  title: "Propiedades - Administrador",
};

export default function Propiedades() {
  return (
    <DashboardLayout>
      <PropiedadesContent />
    </DashboardLayout>
  );
}
