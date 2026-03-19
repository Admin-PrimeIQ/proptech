import { NextRequest, NextResponse } from "next/server";

function cleanLibraries(raw: string | null): string {
  if (!raw) return "drawing,geometry";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => /^[a-z]+$/.test(item))
    .join(",");
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "No hay una API key de Google Maps configurada en variables de entorno." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const libraries = cleanLibraries(searchParams.get("libraries"));
  const language = searchParams.get("language") || "es";
  const region = searchParams.get("region") || "GT";
  const v = searchParams.get("v") || "weekly";

  const googleUrl = new URL("https://maps.googleapis.com/maps/api/js");
  googleUrl.searchParams.set("key", apiKey);
  googleUrl.searchParams.set("libraries", libraries);
  googleUrl.searchParams.set("language", language);
  googleUrl.searchParams.set("region", region);
  googleUrl.searchParams.set("v", v);

  const response = await fetch(googleUrl.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "No se pudo obtener el script de Google Maps." },
      { status: response.status }
    );
  }

  const script = await response.text();

  return new NextResponse(script, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}
