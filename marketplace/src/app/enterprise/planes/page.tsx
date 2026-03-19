import { Metadata } from "next";
import EnterprisePlansDashboardBody from "./components/EnterprisePlansDashboardBody";

export const metadata: Metadata = {
  title: "Planes Enterprise - Marketplace Inmobiliario",
};

export default function EnterprisePlansPage() {
  return <EnterprisePlansDashboardBody />;
}
