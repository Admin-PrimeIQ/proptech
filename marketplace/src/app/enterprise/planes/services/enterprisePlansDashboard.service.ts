import { EnterprisePlansDashboardData } from "../types";

const DASHBOARD_DATA_MOCK: EnterprisePlansDashboardData = {
  userName: "Carlos Mendoza",
  dateLabel: "Lunes, 24 de mayo de 2024",
  subscriptionLabel: "PREMIUM",
  subscriptionTitle: "Tu Suscripción: Plan Actual",
  subscriptionDescription:
    "Disfruta de todas las herramientas premium para potenciar tu análisis de datos con reportes ilimitados y acceso a IA avanzada.",
  lifestyleGrowthLabel: "+12.5%",
  lifestyleMatchPercent: 84.2,
  lifestyleMonths: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL"],
  lifestyleSeries: [32, 44, 38, 46, 51, 84, 58],
};

export async function getEnterprisePlansDashboardData(): Promise<EnterprisePlansDashboardData> {
  // TODO: Reemplazar por consumo real de API cuando backend esté disponible.
  // Ejemplo futuro:
  // const response = await fetch("/api/enterprise/planes/dashboard");
  // if (!response.ok) throw new Error("No se pudo cargar el dashboard de planes");
  // return response.json();
  return Promise.resolve(DASHBOARD_DATA_MOCK);
}
