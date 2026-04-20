import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const sourceReportPath = path.join(rootDir, "docs", "reports", "clusters-2025-3t-mapbox-iso.json");
const outputPath = path.join(__dirname, "data", "clusters-map-data.json");

const YEAR = "2025";
const QUARTER = "3T";

function readJson(filepath) {
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function main() {
  if (!fs.existsSync(sourceReportPath)) {
    throw new Error(`No existe el reporte fuente: ${sourceReportPath}`);
  }

  const report = readJson(sourceReportPath);
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
    ORDER BY point_id ASC
  `;

  const pointLookup = new Map(
    rows.map((row) => [
      Number(row.point_id),
      {
        pointId: Number(row.point_id),
        propertyId: Number(row.source_id),
        lat: toNumber(row.latitud),
        lng: toNumber(row.longitud),
      },
    ])
  );

  const clusters = (report.clusters ?? []).map((cluster) => {
    const pointIds = Array.isArray(cluster.pointIds) ? cluster.pointIds.map(Number) : [];
    const points = pointIds
      .map((id) => pointLookup.get(id))
      .filter((point) => point && point.lat !== null && point.lng !== null);

    const center =
      points.length > 0
        ? {
            lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
            lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length,
          }
        : null;

    return {
      clusterId: Number(cluster.clusterId),
      prioridad: String(cluster.prioridad ?? "baja"),
      basePropertyId: Number(cluster.basePropertyId),
      propiedadesEnCluster: Number(cluster.propiedadesEnCluster ?? 0),
      center,
      points,
    };
  });

  const data = {
    periodo: report.periodo ?? `${YEAR}-${QUARTER}`,
    radiusMeters: Number(report.clusterRadiusMeters ?? 500),
    totals: report.totals ?? { clusters: clusters.length, propiedades: 0 },
    byPriority: report.byPriority ?? { alta: 0, media: 0, baja: 0 },
    clusters,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`Archivo generado: ${outputPath}`);
  console.log(`Clusters: ${clusters.length}`);
}

main()
  .catch((error) => {
    console.error("Error construyendo datos para el mapa de prueba:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

