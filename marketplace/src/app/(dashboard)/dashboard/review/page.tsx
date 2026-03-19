import DashboardLayout from "@/layouts/DashboardLayout";
import { Metadata } from "next";
import SolicitudesContent from "./components/SolicitudesContent";

export const metadata: Metadata = {
  title: "Solicitudes - Bhumi Real Estate React NextJs Template",
};

export default function DashboardReview() {
  return (
    <DashboardLayout>
      <SolicitudesContent />
    </DashboardLayout>
  );
}
