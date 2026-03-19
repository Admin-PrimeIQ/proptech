import { Metadata } from "next";
import EnterpriseDashboardBody from "./components/EnterpriseDashboardBody";

export const metadata: Metadata = {
  title: "Dashboard Enterprise - Marketplace Inmobiliario",
};

export default function EnterpriseDashboardPage() {
  return <EnterpriseDashboardBody />;
}
