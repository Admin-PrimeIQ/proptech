import { LifestyleMatcherData } from "../types";

const LIFESTYLE_MATCHER_MOCK: LifestyleMatcherData = {
  title: "Configura tu Búsqueda Ideal",
  subtitle: "Personaliza tus criterios para encontrar la ubicación perfecta.",
  stepLabel: "PASO 1 DE 2: LIFESTYLE MATCHER",
  progressPercent: 50,
  etaOptions: ["15 min", "30 min", "45 min", "60 min"],
  selectedEta: "30 min",
  averageSpeed: 40,
  trafficEnabled: true,
  priorities: [
    { id: "p1", name: "Trabajo", subtitle: "Oficinas y coworkings", active: true },
    { id: "p2", name: "Supermercado", subtitle: "Tiendas de conveniencia" },
    { id: "p3", name: "Gimnasio", subtitle: "Centros deportivos" },
    { id: "p4", name: "Parques", subtitle: "Zonas verdes y recreativas" },
  ],
};

export async function getLifestyleMatcherData(): Promise<LifestyleMatcherData> {
  // TODO: Reemplazar por consumo real de API cuando backend esté disponible.
  // Ejemplo:
  // const response = await fetch("/api/enterprise/lifestyle-matcher");
  // if (!response.ok) throw new Error("No se pudo cargar lifestyle matcher");
  // return response.json();
  return Promise.resolve(LIFESTYLE_MATCHER_MOCK);
}
