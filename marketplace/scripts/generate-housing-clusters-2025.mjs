import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "docs", "reports", "clusters-2025.json");

const YEAR = "2025";
const QUARTER = "3T";
const CLUSTER_RADIUS_METERS = 500;

function toPriority(size) {
  if (size > 15) return "alta";
  if (size >= 5) return "media";
  return "baja";
}

async function main() {
  const rows = await prisma.$queryRaw`
    WITH base AS (
      SELECT
        h.id,
        ST_Transform(
          ST_SetSRID(
            ST_MakePoint(h.longitud::double precision, h.latitud::double precision),
            4326
          ),
          3857
        ) AS geom
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
    ),
    tagged AS (
      SELECT
        id,
        ST_ClusterDBSCAN(geom, eps => ${CLUSTER_RADIUS_METERS}, minpoints => 1) OVER () AS cluster_id
      FROM base
    ),
    grouped AS (
      SELECT
        cluster_id,
        COUNT(*)::int AS propiedades_en_cluster
      FROM tagged
      GROUP BY cluster_id
    )
    SELECT
      cluster_id::int AS cluster_id,
      propiedades_en_cluster
    FROM grouped
    ORDER BY propiedades_en_cluster DESC, cluster_id ASC
  `;

  const clusters = rows.map((row) => {
    const clusterId = Number(row.cluster_id);
    const size = Number(row.propiedades_en_cluster);
    return {
      clusterId,
      propiedadesEnCluster: size,
      prioridad: toPriority(size),
    };
  });

  const byPriority = clusters.reduce(
    (acc, cluster) => {
      acc[cluster.prioridad] += 1;
      return acc;
    },
    { alta: 0, media: 0, baja: 0 }
  );

  const totalPropiedades = clusters.reduce((sum, cluster) => sum + cluster.propiedadesEnCluster, 0);

  const report = {
    periodo: `${YEAR}-${QUARTER}`,
    clusterRadiusMeters: CLUSTER_RADIUS_METERS,
    rules: {
      alta: "> 15 propiedades",
      media: "entre 5 y 15 propiedades (incluye 5 y 15)",
      baja: "< 5 propiedades",
    },
    totals: {
      clusters: clusters.length,
      propiedades: totalPropiedades,
    },
    byPriority,
    clusters,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`Reporte generado: ${outputPath}`);
  console.log(`Clusters totales: ${report.totals.clusters}`);
  console.log(`Alta: ${report.byPriority.alta} | Media: ${report.byPriority.media} | Baja: ${report.byPriority.baja}`);
}

main()
  .catch((error) => {
    console.error("Error generando reporte de clusters:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

