import DashboardInsights from "./components/DashboardInsights"
import DashboardLayout from "@/layouts/DashboardLayout"
import StatsCardGrid from "./components/StatsCardGrid"
import Link from "next/link"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrador - Bhumi Real Estate React NextJs Template",
};

export default function Administrador() {
  return (
    <>
      <DashboardLayout>
        <StatsCardGrid />
        <DashboardInsights />
        {/* Configuración Página */}
        <div className="tp-dashboard-new-property" style={{ marginTop: "40px" }}>
          <h5 className="tp-dashboard-new-title">Configuración Página</h5>
          <div className="tp-postbox-comment">
            <ul>
              <li>
                <Link href="/administrador/general" className="tp-dashboard-config-item">
                  <span>General</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
