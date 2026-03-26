/**
 * Obtiene una muestra real de Distance Matrix (Zona 1 → Zona 10, Ciudad de Guatemala)
 * y escribe docs/examples/distance-matrix-response-zona1-zona10.json
 * Uso: node scripts/fetch-distance-matrix-sample.mjs
 * Requiere una API key en .env (misma prioridad que isochrone-corrected/route.ts).
 */
import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) {
    console.error("No se encontró .env en la raíz del marketplace.");
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[k] = v;
  }
  return env;
}

function getKey(env) {
  return (
    env.GOOGLE_DISTANCE_MATRIX_API_KEY ||
    env.GOOGLE_MAPS_API_KEY_SERVER ||
    env.GOOGLE_MAPS_API_KEY ||
    env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    ""
  ).trim();
}

// Puntos aproximados (centroides de referencia): Zona 1 (centro) → Zona 10
const ZONA_1 = { lat: 14.6425, lng: -90.5132, label: "Zona 1 (centro aprox.)" };
const ZONA_10 = { lat: 14.5855, lng: -90.4792, label: "Zona 10 (aprox.)" };

const MATRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

async function main() {
  const env = loadEnv();
  const apiKey = getKey(env);
  if (!apiKey) {
    console.error("No hay clave de Google (GOOGLE_DISTANCE_MATRIX_API_KEY / GOOGLE_MAPS_* ) en .env");
    process.exit(1);
  }

  const url = new URL(MATRIX_URL);
  url.searchParams.set("origins", `${ZONA_1.lat},${ZONA_1.lng}`);
  url.searchParams.set("destinations", `${ZONA_10.lat},${ZONA_10.lng}`);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("departure_time", "now");
  url.searchParams.set("traffic_model", "pessimistic");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store", headers: { Accept: "application/json" } });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("Respuesta no JSON:", text.slice(0, 500));
    process.exit(1);
  }

  const outDir = path.join(root, "docs", "examples");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "distance-matrix-response-zona1-zona10.json");

  const payload = {
    _comment:
      "Muestra generada con scripts/fetch-distance-matrix-sample.mjs. Origen/destino: Ciudad de Guatemala Zona 1 → Zona 10 (coordenadas aproximadas).",
    request: {
      origins: `${ZONA_1.lat},${ZONA_1.lng}`,
      destinations: `${ZONA_10.lat},${ZONA_10.lng}`,
      mode: "driving",
      departure_time: "now",
      traffic_model: "pessimistic",
    },
    points: { zona1: ZONA_1, zona10: ZONA_10 },
    httpStatus: res.status,
    googleResponse: json,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
  console.log("Guardado:", outPath);
  console.log("status raíz:", json.status);
  if (json.rows?.[0]?.elements?.[0]) {
    const el = json.rows[0].elements[0];
    console.log("element.status:", el.status);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
