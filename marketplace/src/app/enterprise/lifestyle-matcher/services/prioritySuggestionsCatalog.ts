export type PrioritySuggestionOption = {
  key: string;
  title: string;
  subtitle: string;
};

export const PRIORITY_SUGGESTIONS_CATALOG: PrioritySuggestionOption[] = [
  { key: "trabajo", title: "Trabajo", subtitle: "Oficinas y coworkings" },
  { key: "hospital", title: "Hospital", subtitle: "Clínicas y centros médicos" },
  { key: "colegio", title: "Colegio", subtitle: "Escuelas y universidades" },
  { key: "supermercado", title: "Supermercado", subtitle: "Tiendas de conveniencia" },
  { key: "gym", title: "Gym", subtitle: "Centros deportivos" },
  { key: "parque", title: "Parques", subtitle: "Zonas verdes y recreativas" },
  { key: "farmacia", title: "Farmacia", subtitle: "Servicios de salud cercanos" },
  { key: "restaurante", title: "Restaurante", subtitle: "Comida y ocio" },
  { key: "transporte", title: "Transporte público", subtitle: "Paradas y estaciones" },
  { key: "banco", title: "Banco", subtitle: "Servicios financieros" },
];
