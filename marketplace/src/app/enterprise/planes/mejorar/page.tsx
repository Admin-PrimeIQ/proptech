import { Metadata } from "next";
import EnterprisePlanUpgradeBody from "./components/EnterprisePlanUpgradeBody";

export const metadata: Metadata = {
  title: "Mejorar Plan Enterprise - Marketplace Inmobiliario",
};

export default function EnterprisePlanUpgradePage() {
  return <EnterprisePlanUpgradeBody />;
}
