import { EnterprisePlanUpgradeData } from "../types";

const PLAN_UPGRADE_MOCK: EnterprisePlanUpgradeData = {
  pageTitle: "Mi Plan",
  pageDescription: "Gestiona tu suscripción y descubre nuevas herramientas de análisis inmobiliario.",
  activePlanLabel: "SUSCRIPCIÓN ACTIVA",
  activePlanName: "Plan Básico",
  activePlanDescription: "Tu plan actual seleccionado para análisis de mercado estándar.",
  activePlanFeatures: [
    { label: "Mapa Dinámico Pro", included: true },
    { label: "Lifestyle Matcher (Activo)", included: true },
    { label: "Análisis Predictivo AI", included: false },
    { label: "Reportes Personalizados", included: false },
  ],
  nextBillingDate: "15 de Octubre, 2024",
  customSolutionTitle: "¿Necesitas algo a medida?",
  customSolutionDescription: "Ofrecemos soluciones personalizadas para proyectos de gran escala.",
  planOptions: [
    {
      id: "basico",
      name: "Básico",
      price: "$0",
      priceUnit: "/mes",
      description: "Esencial para empezar a explorar zonas.",
      ctaLabel: "Plan Actual",
      current: true,
      features: ["Hasta 3 búsquedas diarias", "Filtros básicos"],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49",
      priceUnit: "/mes",
      description: "Ideal para agentes inmobiliarios activos.",
      ctaLabel: "Seleccionar Premium",
      highlighted: true,
      features: ["Búsquedas ilimitadas", "Análisis Predictivo AI", "Exportación de PDFs", "Soporte prioritario"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$199",
      priceUnit: "/mes",
      description: "Potencia total para agencias y desarrolladoras.",
      ctaLabel: "Contactar Ventas",
      features: ["Todo lo de Premium", "Múltiples licencias (10+)", "API Access", "Data customizada"],
    },
  ],
};

export async function getEnterprisePlanUpgradeData(): Promise<EnterprisePlanUpgradeData> {
  // TODO: Reemplazar por consumo real de API cuando backend esté disponible.
  // Ejemplo futuro:
  // const response = await fetch("/api/enterprise/planes/mejorar");
  // if (!response.ok) throw new Error("No se pudo cargar la data de planes");
  // return response.json();
  return Promise.resolve(PLAN_UPGRADE_MOCK);
}
