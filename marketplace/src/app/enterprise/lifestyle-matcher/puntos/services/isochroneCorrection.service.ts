import type {
  GravitationalIsochroneProperties,
  IsoContourUnit,
  IsoTrafficProfile,
  MultiIsochroneResponse,
} from "@/types/isochrones";

type CorrectionRequest = {
  center: { lat: number; lng: number };
  target_time_minutes: number;
  mapbox_geojson: {
    type: "FeatureCollection";
    features: MultiIsochroneResponse["features"];
  };
};

type CorrectionResponse = {
  corrected_geojson?: {
    type?: "FeatureCollection";
    features?: MultiIsochroneResponse["features"];
  };
  metadata?: {
    fallback?: boolean;
  };
};

type CorrectIsochronesOptions = {
  response: MultiIsochroneResponse;
  contourUnit: IsoContourUnit;
  trafficProfile: IsoTrafficProfile;
  center: { lat: number; lng: number };
};

function shouldCorrectFeature(params: {
  contourUnit: IsoContourUnit;
  trafficProfile: IsoTrafficProfile;
  properties: GravitationalIsochroneProperties | undefined;
}): boolean {
  const { contourUnit, trafficProfile, properties } = params;
  if (trafficProfile !== "con-trafico") return false;
  if (!properties) return false;
  if (properties.contourParam !== "contours_minutes") return false;
  if (properties.layerId === "distance") return false;

  // En hibrido: solo capa "time". En calculada con trafico: "calculated".
  if (contourUnit === "hibrido") {
    return properties.layerId === "time";
  }
  if (contourUnit === "calculada") {
    return properties.layerId === "calculated";
  }
  return properties.layerId === "time";
}

async function requestCorrection(payload: CorrectionRequest): Promise<CorrectionResponse | null> {
  try {
    const response = await fetch("/api/isochrone-corrected", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    const result = (await response.json()) as CorrectionResponse;
    return result;
  } catch {
    return null;
  }
}

export async function correctIsochronesWithTrafficMatrix(
  options: CorrectIsochronesOptions
): Promise<MultiIsochroneResponse> {
  const { response, contourUnit, trafficProfile, center } = options;

  const correctedFeatures = await Promise.all(
    response.features.map(async (feature) => {
      const properties = feature.properties;
      if (!shouldCorrectFeature({ contourUnit, trafficProfile, properties })) {
        return feature;
      }

      const targetMinutesRaw = properties?.contourValue;
      const targetMinutes =
        typeof targetMinutesRaw === "number" ? targetMinutesRaw : Number(Array.isArray(targetMinutesRaw) ? targetMinutesRaw[0] : targetMinutesRaw);
      if (!Number.isFinite(targetMinutes) || targetMinutes <= 0) {
        return feature;
      }

      const correction = await requestCorrection({
        center,
        target_time_minutes: targetMinutes,
        mapbox_geojson: {
          type: "FeatureCollection",
          features: [feature],
        },
      });

      const correctedFeature = correction?.corrected_geojson?.features?.[0];
      if (!correctedFeature?.geometry) {
        return feature;
      }

      return {
        ...feature,
        geometry: correctedFeature.geometry,
      };
    })
  );

  return {
    ...response,
    features: correctedFeatures,
  };
}
