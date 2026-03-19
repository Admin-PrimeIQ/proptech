import { Metadata } from "next";
import EnterpriseProjectsBody from "./components/EnterpriseProjectsBody";

export const metadata: Metadata = {
  title: "Proyectos Enterprise - Marketplace Inmobiliario",
};

export default function EnterpriseProjectsPage() {
  return <EnterpriseProjectsBody />;
}
