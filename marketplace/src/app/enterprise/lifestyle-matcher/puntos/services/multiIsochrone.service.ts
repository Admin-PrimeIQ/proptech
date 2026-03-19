import type { MultiIsochroneRequest, MultiIsochroneResponse } from "@/types/isochrones";

export async function createMultiIsochrone(
  payload: MultiIsochroneRequest
): Promise<MultiIsochroneResponse> {
  const response = await fetch("/api/enterprise/lifestyle-matcher/isochrones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    const message =
      typeof result?.error === "string" ? result.error : "No se pudo generar el isocrono múltiple.";
    throw new Error(message);
  }

  return result as MultiIsochroneResponse;
}
