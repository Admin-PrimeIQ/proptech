import DashboardInsights from "./components/DashboardInsights"
import DashboardLayout from "@/layouts/DashboardLayout"
import StatsCardGrid from "./components/StatsCardGrid"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Bhumi Real Estate React NextJs Template",
};

export default function Dashboard() {
  return (
    <>
      <DashboardLayout>
        <StatsCardGrid />
        <DashboardInsights />
      </DashboardLayout>
    </>
  )
}