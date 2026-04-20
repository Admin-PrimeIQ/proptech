const CLUSTER_COLOR = {
  alta: "#ef4444",
  media: "#f59e0b",
  baja: "#10b981",
};

function updatePanel(data) {
  document.getElementById("periodo").textContent = data.periodo ?? "-";
  document.getElementById("totalClusters").textContent = String(data.totals?.clusters ?? 0);
  document.getElementById("totalProps").textContent = String(data.totals?.propiedades ?? 0);
  document.getElementById("radius").textContent = `${data.radiusMeters ?? 500}m`;
  document.getElementById("alta").textContent = String(data.byPriority?.alta ?? 0);
  document.getElementById("media").textContent = String(data.byPriority?.media ?? 0);
  document.getElementById("baja").textContent = String(data.byPriority?.baja ?? 0);
}

function createClusterCircles(map, clusters, radiusMeters) {
  const circles = [];
  clusters.forEach((cluster) => {
    if (!cluster.center) return;
    const color = CLUSTER_COLOR[cluster.prioridad] ?? "#6b7280";
    const circle = new google.maps.Circle({
      map,
      center: cluster.center,
      radius: radiusMeters,
      strokeColor: color,
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.12,
    });
    circles.push(circle);
  });
  return circles;
}

function createPropertyMarkers(map, clusters) {
  const markers = [];
  clusters.forEach((cluster) => {
    (cluster.points ?? []).forEach((point) => {
      const marker = new google.maps.Circle({
        map,
        center: { lat: point.lat, lng: point.lng },
        radius: 12,
        strokeColor: "#1e67ff",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: "#1e67ff",
        fillOpacity: 0.95,
      });
      markers.push(marker);
    });
  });
  return markers;
}

function fitMap(map, clusters) {
  const bounds = new google.maps.LatLngBounds();
  let hasPoints = false;
  clusters.forEach((cluster) => {
    (cluster.points ?? []).forEach((point) => {
      bounds.extend({ lat: point.lat, lng: point.lng });
      hasPoints = true;
    });
  });
  if (hasPoints) {
    map.fitBounds(bounds, 60);
    return;
  }
  map.setCenter({ lat: 14.62, lng: -90.52 });
  map.setZoom(11);
}

async function loadGoogleMaps() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("key");
  if (!key) {
    throw new Error("Falta API key. Abre: /prueba/index.html?key=TU_GOOGLE_MAPS_API_KEY");
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("No se pudo cargar Google Maps JS API."));
    document.head.appendChild(script);
  });
}

async function main() {
  await loadGoogleMaps();
  const response = await fetch("./data/clusters-map-data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("No se pudo cargar prueba/data/clusters-map-data.json");
  }
  const data = await response.json();

  updatePanel(data);

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 14.62, lng: -90.52 },
    zoom: 11,
    mapTypeControl: false,
    streetViewControl: false,
  });

  createClusterCircles(map, data.clusters ?? [], Number(data.radiusMeters ?? 500));
  createPropertyMarkers(map, data.clusters ?? []);
  fitMap(map, data.clusters ?? []);
}

main().catch((error) => {
  // Mensaje visible para evitar fallo silencioso.
  const panel = document.getElementById("panel");
  const p = document.createElement("p");
  p.style.color = "#b91c1c";
  p.textContent = `Error: ${error instanceof Error ? error.message : String(error)}`;
  panel.appendChild(p);
  console.error(error);
});

