export type SelectedPoint = {
  id: string;
  title: string;
  subtitle: string;
  active?: boolean;
};

export type LifestyleMatcherPointsData = {
  title: string;
  subtitle: string;
  progressPercent: number;
  selectedPoints: SelectedPoint[];
};

const STEP_TWO_MOCK: LifestyleMatcherPointsData = {
  title: "Configura tu Búsqueda Ideal",
  subtitle: "Paso 2 de 2: Ubica tus puntos de interés favoritos en el mapa.",
  progressPercent: 95,
  selectedPoints: [
    { id: "p1", title: "Trabajo", subtitle: "Configurando ubicación...", active: true },
    { id: "p2", title: "Supermercado", subtitle: "Sin ubicación" },
    { id: "p3", title: "Gimnasio", subtitle: "Sin ubicación" },
  ],
};

export async function getLifestyleMatcherPointsData(): Promise<LifestyleMatcherPointsData> {
  // TODO: Reemplazar por consumo real de API cuando backend esté disponible.
  // Ejemplo:
  // const response = await fetch("/api/enterprise/lifestyle-matcher/puntos");
  // if (!response.ok) throw new Error("No se pudo cargar el paso 2 de lifestyle matcher");
  // return response.json();
  return Promise.resolve(STEP_TWO_MOCK);
}
