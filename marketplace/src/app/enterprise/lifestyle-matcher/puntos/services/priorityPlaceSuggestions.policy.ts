/**
 * Prioridades que no deben disparar sugerencias de Google Places (ubicación libre en mapa).
 * Debe coincidir con el título mostrado al usuario (p. ej. "Trabajo").
 */
export function isPriorityTitleWithoutPlaceSuggestions(title: string): boolean {
  const t = title.trim().toLowerCase();
  return t === "trabajo";
}
