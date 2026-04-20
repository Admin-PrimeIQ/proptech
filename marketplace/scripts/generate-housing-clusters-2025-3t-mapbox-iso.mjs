import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import intersect from "@turf/intersect";
import union from "@turf/union";
import { featureCollection } from "@turf/helpers";

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "docs", "reports", "clusters-2025-3t-mapbox-iso.json");

const YEAR = "2025";
const QUARTER = "3T";
const CLUSTER_RADIUS_METERS = 500;
const ISOCHONE_METERS = 500;
const MAPBOX_ISO_BASE_URL = "https://api.mapbox.com/isochrone/v1/mapbox";
const MAX_REFINEMENT_ITERATIONS = 10;

function toPriority(size) {
  if (size > 15) return "alta";
  if (size >= 5) return "media";
  return "baja";
}

function getMapboxToken() {
  const token =
    process.env.MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_ACCESS_TOKEN ||
    "";
  const trimmed = token.trim();
  return trimmed.length ? trimmed : null;
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function safeUnion(features) {
  if (!Array.isArray(features) || features.length === 0) return null;
  let acc = features[0];
  for (let i = 1; i < features.length; i += 1) {
    try {
      const merged = union(featureCollection([acc, features[i]]));
      if (merged) acc = merged;
    } catch {
      // Ignorar error puntual y continuar con geometria acumulada.
    }
  }
  return acc;
}

function sanitizePolygonFeatures(features) {
  if (!Array.isArray(features)) return [];
  return features.filter((feature) => {
    const gt = feature?.geometry?.type;
    return gt === "Polygon" || gt === "MultiPolygon";
  });
}

function signaturesEqual(aSet, bSet) {
  if (aSet.size !== bSet.size) return false;
  for (const v of aSet) {
    if (!bSet.has(v)) return false;
  }
  return true;
}

function chooseMedoid(memberIds, pointsById) {
  if (memberIds.length === 1) return memberIds[0];
  let bestId = memberIds[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidateId of memberIds) {
    const c = pointsById.get(candidateId);
    let score = 0;
    for (const otherId of memberIds) {
      if (otherId === candidateId) continue;
      const o = pointsById.get(otherId);
      score += haversineMeters(c.lat, c.lng, o.lat, o.lng);
    }
    if (score < bestScore || (score === bestScore && candidateId < bestId)) {
      bestScore = score;
      bestId = candidateId;
    }
  }

  return bestId;
}

async function fetchIsochroneMeters(point, token) {
  const url = new URL(`${MAPBOX_ISO_BASE_URL}/driving/${point.lng},${point.lat}`);
  url.searchParams.set("polygons", "true");
  url.searchParams.set("denoise", "1");
  url.searchParams.set("generalize", "10");
  url.searchParams.set("contours_meters", String(ISOCHONE_METERS));
  url.searchParams.set("access_token", token);

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Mapbox Isochrone fallo (${response.status}): ${details.slice(0, 200)}`);
  }

  const payload = await response.json();
  const polygons = sanitizePolygonFeatures(payload?.features);
  if (!polygons.length) return null;
  return safeUnion(polygons);
}

function intersectsIso(isoA, isoB) {
  if (!isoA || !isoB) return false;
  try {
    return Boolean(intersect(featureCollection([isoA, isoB])));
  } catch {
    return false;
  }
}

async function main() {
  const startedAt = Date.now();
  const token = getMapboxToken();
  if (!token) {
    throw new Error("Falta MAPBOX_ACCESS_TOKEN o NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN para generar isocronas.");
  }

  const rows = await prisma.$queryRaw`
    SELECT
      ROW_NUMBER() OVER (ORDER BY h.id ASC, h.latitud ASC, h.longitud ASC)::int AS point_id,
      h.id::bigint AS source_id,
      h.latitud::double precision AS latitud,
      h.longitud::double precision AS longitud
    FROM geo_subzonas.housing_universe h
    WHERE h.latitud IS NOT NULL
      AND h.longitud IS NOT NULL
      AND TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 1)) = ${YEAR}
      AND (
        CASE
          WHEN UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2))) IN ('3T', 'T3') THEN '3T'
          ELSE UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2)))
        END
      ) = ${QUARTER}
    ORDER BY h.id ASC
  `;

  const points = rows
    .map((row) => ({
      id: Number(row.point_id),
      sourceId: Number(row.source_id),
      lat: Number(row.latitud),
      lng: Number(row.longitud),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.id) &&
        Number.isFinite(point.sourceId) &&
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lng)
    );

  const pointsById = new Map(points.map((point) => [point.id, point]));
  const isoCache = new Map();
  const adjacency = new Map(points.map((point) => [point.id, new Set()]));
  let isoRequests = 0;
  let isoCacheHits = 0;

  const getIso = async (pointId) => {
    if (isoCache.has(pointId)) {
      isoCacheHits += 1;
      return isoCache.get(pointId);
    }
    const point = pointsById.get(pointId);
    const iso = await fetchIsochroneMeters(point, token);
    isoRequests += 1;
    isoCache.set(pointId, iso);
    return iso;
  };

  // Pre-filtro de pares por 500m y validación de intersección entre isocronas.
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const d = haversineMeters(a.lat, a.lng, b.lat, b.lng);
      if (d > CLUSTER_RADIUS_METERS) continue;

      const [isoA, isoB] = await Promise.all([getIso(a.id), getIso(b.id)]);
      if (intersectsIso(isoA, isoB)) {
        adjacency.get(a.id).add(b.id);
        adjacency.get(b.id).add(a.id);
      }
    }
  }

  const unassigned = new Set(points.map((point) => point.id));
  const clusters = [];
  let clusterCounter = 1;

  while (unassigned.size > 0) {
    const seed = [...unassigned][0];
    let baseId = seed;
    let previousMembers = new Set();
    let members = new Set([baseId]);

    for (let iteration = 0; iteration < MAX_REFINEMENT_ITERATIONS; iteration += 1) {
      const basePoint = pointsById.get(baseId);
      const neighborIds = adjacency.get(baseId) ?? new Set();

      const candidateMembers = new Set([baseId]);
      for (const neighborId of neighborIds) {
        if (!unassigned.has(neighborId)) continue;
        const candidate = pointsById.get(neighborId);
        const distanceToBase = haversineMeters(basePoint.lat, basePoint.lng, candidate.lat, candidate.lng);
        if (distanceToBase <= CLUSTER_RADIUS_METERS) {
          candidateMembers.add(neighborId);
        }
      }

      members = candidateMembers;
      const memberIds = [...members].sort((a, b) => a - b);
      const medoid = chooseMedoid(memberIds, pointsById);
      const hasSameMembers = signaturesEqual(previousMembers, members);
      const hasSameBase = medoid === baseId;

      previousMembers = new Set(members);
      baseId = medoid;

      if (hasSameMembers && hasSameBase) break;
    }

    const memberIds = [...members].sort((a, b) => a - b);
    for (const id of memberIds) unassigned.delete(id);

    clusters.push({
      clusterId: clusterCounter,
      basePropertyId: pointsById.get(baseId).sourceId,
      propiedadesEnCluster: memberIds.length,
      prioridad: toPriority(memberIds.length),
      pointIds: memberIds,
      propertyIds: memberIds.map((id) => pointsById.get(id).sourceId),
    });
    clusterCounter += 1;
  }

  clusters.sort((a, b) => {
    if (b.propiedadesEnCluster !== a.propiedadesEnCluster) {
      return b.propiedadesEnCluster - a.propiedadesEnCluster;
    }
    return a.clusterId - b.clusterId;
  });

  const byPriority = clusters.reduce(
    (acc, cluster) => {
      acc[cluster.prioridad] += 1;
      return acc;
    },
    { alta: 0, media: 0, baja: 0 }
  );

  const totalPropiedades = clusters.reduce((sum, cluster) => sum + cluster.propiedadesEnCluster, 0);
  const elapsedMs = Date.now() - startedAt;

  const report = {
    periodo: `${YEAR}-${QUARTER}`,
    clusterRadiusMeters: CLUSTER_RADIUS_METERS,
    isochroneMeters: ISOCHONE_METERS,
    isoProvider: "mapbox",
    isoSource: "mapbox-isochrone-api",
    rules: {
      base: "propiedad real (medoid del cluster)",
      membership: "dentro de 500m de la base y con intersección de isocrona con la base",
      alta: "> 15 propiedades",
      media: "entre 5 y 15 propiedades (incluye 5 y 15)",
      baja: "< 5 propiedades",
    },
    totals: {
      clusters: clusters.length,
      propiedades: totalPropiedades,
    },
    byPriority,
    metrics: {
      propertiesInput: points.length,
      isoRequests,
      isoCacheHits,
      elapsedMs,
    },
    clusters,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`Reporte generado: ${outputPath}`);
  console.log(`Clusters: ${report.totals.clusters} | Propiedades: ${report.totals.propiedades}`);
  console.log(`Alta: ${byPriority.alta} | Media: ${byPriority.media} | Baja: ${byPriority.baja}`);
  console.log(`Iso Requests: ${isoRequests} | Cache Hits: ${isoCacheHits} | Tiempo: ${elapsedMs}ms`);
}

main()
  .catch((error) => {
    console.error("Error generando clusters con Mapbox isocronas:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

