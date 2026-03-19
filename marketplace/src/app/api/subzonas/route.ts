import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

type SubzonaRow = {
  id: bigint;
  id_public: string;
  codigo_subzona: string;
  nombre: string | null;
  nombre_descriptivo: string;
  zona_primaria: string | null;
  origen_fid: number | null;
  origen_layer: string | null;
  origen_path: string | null;
  flag_nombre_previo: string | null;
  codigo_reeval_geom: string | null;
  created_at: Date;
  updated_at: Date;
  geom_geojson: unknown | null;
};

type SubzonaCountRow = { total: bigint };

function normalizeText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  return out.length > 0 ? out : null;
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function mapSubzonaRow(row: SubzonaRow) {
  return {
    id: row.id.toString(),
    idPublic: row.id_public,
    codigoSubzona: row.codigo_subzona,
    nombre: row.nombre,
    nombreDescriptivo: row.nombre_descriptivo,
    zonaPrimaria: row.zona_primaria,
    origenFid: row.origen_fid,
    origenLayer: row.origen_layer,
    origenPath: row.origen_path,
    flagNombrePrevio: row.flag_nombre_previo,
    codigoReevalGeom: row.codigo_reeval_geom,
    geom: row.geom_geojson,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybe = error as { code?: string; meta?: { code?: string } };
  return maybe.code === "P2010" && maybe.meta?.code === "23505";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPublic = normalizeText(searchParams.get("idPublic"));
    const zonaPrimaria = normalizeText(searchParams.get("zonaPrimaria")) ?? normalizeText(searchParams.get("zona"));
    const codigoSubzona = normalizeText(searchParams.get("codigoSubzona"));
    const q = normalizeText(searchParams.get("q"));
    const includeGeom = searchParams.get("includeGeom") !== "false";

    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "50"), 1), 200);
    const offset = (page - 1) * limit;

    if (idPublic) {
      if (!isValidUuid(idPublic)) {
        return NextResponse.json({ error: "idPublic no es un UUID válido" }, { status: 400 });
      }

      const rows = await prisma.$queryRaw<SubzonaRow[]>`
        SELECT
          s.id,
          s.id_public,
          s.codigo_subzona,
          s.nombre,
          s.nombre_descriptivo,
          s.zona_primaria,
          s.origen_fid,
          s.origen_layer,
          s.origen_path,
          s.flag_nombre_previo,
          s.codigo_reeval_geom,
          s.created_at,
          s.updated_at,
          CASE
            WHEN ${includeGeom}::boolean IS TRUE AND s.geom IS NOT NULL THEN ST_AsGeoJSON(s.geom)::jsonb
            ELSE NULL
          END AS geom_geojson
        FROM geo_subzonas.subzona s
        WHERE s.id_public = ${idPublic}::uuid
        LIMIT 1
      `;

      if (!rows.length) {
        return NextResponse.json({ error: "Subzona no encontrada" }, { status: 404 });
      }

      return successResponse(mapSubzonaRow(rows[0]));
    }

    const rows = await prisma.$queryRaw<SubzonaRow[]>`
      SELECT
        s.id,
        s.id_public,
        s.codigo_subzona,
        s.nombre,
        s.nombre_descriptivo,
        s.zona_primaria,
        s.origen_fid,
        s.origen_layer,
        s.origen_path,
        s.flag_nombre_previo,
        s.codigo_reeval_geom,
        s.created_at,
        s.updated_at,
        CASE
          WHEN ${includeGeom}::boolean IS TRUE AND s.geom IS NOT NULL THEN ST_AsGeoJSON(s.geom)::jsonb
          ELSE NULL
        END AS geom_geojson
      FROM geo_subzonas.subzona s
      WHERE
        (${zonaPrimaria}::text IS NULL OR s.zona_primaria = ${zonaPrimaria})
        AND (${codigoSubzona}::text IS NULL OR s.codigo_subzona = ${codigoSubzona})
        AND (
          ${q}::text IS NULL
          OR s.codigo_subzona ILIKE '%' || ${q} || '%'
          OR COALESCE(s.nombre, '') ILIKE '%' || ${q} || '%'
          OR s.nombre_descriptivo ILIKE '%' || ${q} || '%'
        )
      ORDER BY s.zona_primaria ASC NULLS LAST, s.codigo_subzona ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countRows = await prisma.$queryRaw<SubzonaCountRow[]>`
      SELECT COUNT(*)::bigint AS total
      FROM geo_subzonas.subzona s
      WHERE
        (${zonaPrimaria}::text IS NULL OR s.zona_primaria = ${zonaPrimaria})
        AND (${codigoSubzona}::text IS NULL OR s.codigo_subzona = ${codigoSubzona})
        AND (
          ${q}::text IS NULL
          OR s.codigo_subzona ILIKE '%' || ${q} || '%'
          OR COALESCE(s.nombre, '') ILIKE '%' || ${q} || '%'
          OR s.nombre_descriptivo ILIKE '%' || ${q} || '%'
        )
    `;

    const total = Number(countRows[0]?.total || 0n);
    const data = rows.map(mapSubzonaRow);

    return successResponse({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const codigoSubzona = normalizeText(body?.codigoSubzona);
    const nombreDescriptivo = normalizeText(body?.nombreDescriptivo);

    if (!codigoSubzona) {
      return NextResponse.json({ error: "codigoSubzona es requerido" }, { status: 400 });
    }
    if (!nombreDescriptivo) {
      return NextResponse.json({ error: "nombreDescriptivo es requerido" }, { status: 400 });
    }

    const nombre = normalizeText(body?.nombre);
    const zonaPrimaria = normalizeText(body?.zonaPrimaria);
    const origenFid = body?.origenFid === null || body?.origenFid === undefined ? null : Number(body.origenFid);
    const origenLayer = normalizeText(body?.origenLayer);
    const origenPath = normalizeText(body?.origenPath);
    const flagNombrePrevio = normalizeText(body?.flagNombrePrevio);
    const codigoReevalGeom = normalizeText(body?.codigoReevalGeom);

    if (flagNombrePrevio && !["Y", "N"].includes(flagNombrePrevio)) {
      return NextResponse.json({ error: "flagNombrePrevio debe ser 'Y' o 'N'" }, { status: 400 });
    }

    const geom = body?.geom ?? null;
    const geomText = geom ? JSON.stringify(geom) : null;

    const rows = await prisma.$queryRaw<SubzonaRow[]>`
      INSERT INTO geo_subzonas.subzona (
        codigo_subzona,
        nombre,
        nombre_descriptivo,
        zona_primaria,
        origen_fid,
        origen_layer,
        origen_path,
        flag_nombre_previo,
        codigo_reeval_geom,
        geom
      ) VALUES (
        ${codigoSubzona},
        ${nombre},
        ${nombreDescriptivo},
        ${zonaPrimaria},
        ${origenFid},
        ${origenLayer},
        ${origenPath},
        ${flagNombrePrevio},
        ${codigoReevalGeom},
        CASE
          WHEN ${geomText}::text IS NULL THEN NULL
          ELSE ST_Multi(ST_SetSRID(ST_MakeValid(ST_GeomFromGeoJSON(${geomText})), 4326))
        END
      )
      RETURNING
        id,
        id_public,
        codigo_subzona,
        nombre,
        nombre_descriptivo,
        zona_primaria,
        origen_fid,
        origen_layer,
        origen_path,
        flag_nombre_previo,
        codigo_reeval_geom,
        created_at,
        updated_at,
        CASE WHEN geom IS NOT NULL THEN ST_AsGeoJSON(geom)::jsonb ELSE NULL END AS geom_geojson
    `;

    return successResponse(mapSubzonaRow(rows[0]), 201);
  } catch (error: unknown) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "Ya existe una subzona con ese codigoSubzona o nombreDescriptivo" },
        { status: 409 }
      );
    }
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const idPublic = normalizeText(body?.idPublic);

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }
    if (!isValidUuid(idPublic)) {
      return NextResponse.json({ error: "idPublic no es un UUID válido" }, { status: 400 });
    }

    const existingRows = await prisma.$queryRaw<SubzonaRow[]>`
      SELECT
        id,
        id_public,
        codigo_subzona,
        nombre,
        nombre_descriptivo,
        zona_primaria,
        origen_fid,
        origen_layer,
        origen_path,
        flag_nombre_previo,
        codigo_reeval_geom,
        created_at,
        updated_at,
        CASE WHEN geom IS NOT NULL THEN ST_AsGeoJSON(geom)::jsonb ELSE NULL END AS geom_geojson
      FROM geo_subzonas.subzona
      WHERE id_public = ${idPublic}::uuid
      LIMIT 1
    `;

    if (!existingRows.length) {
      return NextResponse.json({ error: "Subzona no encontrada" }, { status: 404 });
    }

    const current = existingRows[0];

    const hasCodigoSubzona = Object.prototype.hasOwnProperty.call(body, "codigoSubzona");
    const hasNombreDescriptivo = Object.prototype.hasOwnProperty.call(body, "nombreDescriptivo");

    const codigoSubzona = hasCodigoSubzona ? normalizeText(body.codigoSubzona) : current.codigo_subzona;
    const nombreDescriptivo = hasNombreDescriptivo
      ? normalizeText(body.nombreDescriptivo)
      : current.nombre_descriptivo;

    if (!codigoSubzona) {
      return NextResponse.json({ error: "codigoSubzona no puede quedar vacío" }, { status: 400 });
    }
    if (!nombreDescriptivo) {
      return NextResponse.json({ error: "nombreDescriptivo no puede quedar vacío" }, { status: 400 });
    }

    const nombre = Object.prototype.hasOwnProperty.call(body, "nombre") ? normalizeText(body.nombre) : current.nombre;
    const zonaPrimaria = Object.prototype.hasOwnProperty.call(body, "zonaPrimaria")
      ? normalizeText(body.zonaPrimaria)
      : current.zona_primaria;
    const origenFid = Object.prototype.hasOwnProperty.call(body, "origenFid")
      ? body.origenFid === null || body.origenFid === undefined
        ? null
        : Number(body.origenFid)
      : current.origen_fid;
    const origenLayer = Object.prototype.hasOwnProperty.call(body, "origenLayer")
      ? normalizeText(body.origenLayer)
      : current.origen_layer;
    const origenPath = Object.prototype.hasOwnProperty.call(body, "origenPath")
      ? normalizeText(body.origenPath)
      : current.origen_path;
    const flagNombrePrevio = Object.prototype.hasOwnProperty.call(body, "flagNombrePrevio")
      ? normalizeText(body.flagNombrePrevio)
      : current.flag_nombre_previo;
    const codigoReevalGeom = Object.prototype.hasOwnProperty.call(body, "codigoReevalGeom")
      ? normalizeText(body.codigoReevalGeom)
      : current.codigo_reeval_geom;

    if (flagNombrePrevio && !["Y", "N"].includes(flagNombrePrevio)) {
      return NextResponse.json({ error: "flagNombrePrevio debe ser 'Y' o 'N'" }, { status: 400 });
    }

    const hasGeom = Object.prototype.hasOwnProperty.call(body, "geom");
    let geomAction: "preserve" | "clear" | "set" = "preserve";
    let geomText: string | null = null;
    if (hasGeom) {
      if (body.geom === null) {
        geomAction = "clear";
      } else {
        geomAction = "set";
        geomText = JSON.stringify(body.geom);
      }
    }

    const updatedRows = await prisma.$queryRaw<SubzonaRow[]>`
      UPDATE geo_subzonas.subzona
      SET
        codigo_subzona = ${codigoSubzona},
        nombre = ${nombre},
        nombre_descriptivo = ${nombreDescriptivo},
        zona_primaria = ${zonaPrimaria},
        origen_fid = ${origenFid},
        origen_layer = ${origenLayer},
        origen_path = ${origenPath},
        flag_nombre_previo = ${flagNombrePrevio},
        codigo_reeval_geom = ${codigoReevalGeom},
        geom = CASE
          WHEN ${geomAction} = 'preserve' THEN geom
          WHEN ${geomAction} = 'clear' THEN NULL
          ELSE ST_Multi(ST_SetSRID(ST_MakeValid(ST_GeomFromGeoJSON(${geomText})), 4326))
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id_public = ${idPublic}::uuid
      RETURNING
        id,
        id_public,
        codigo_subzona,
        nombre,
        nombre_descriptivo,
        zona_primaria,
        origen_fid,
        origen_layer,
        origen_path,
        flag_nombre_previo,
        codigo_reeval_geom,
        created_at,
        updated_at,
        CASE WHEN geom IS NOT NULL THEN ST_AsGeoJSON(geom)::jsonb ELSE NULL END AS geom_geojson
    `;

    return successResponse(mapSubzonaRow(updatedRows[0]));
  } catch (error: unknown) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "Ya existe una subzona con ese codigoSubzona o nombreDescriptivo" },
        { status: 409 }
      );
    }
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPublic = normalizeText(searchParams.get("idPublic"));

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }
    if (!isValidUuid(idPublic)) {
      return NextResponse.json({ error: "idPublic no es un UUID válido" }, { status: 400 });
    }

    const deleted = await prisma.$queryRaw<{ id_public: string }[]>`
      DELETE FROM geo_subzonas.subzona
      WHERE id_public = ${idPublic}::uuid
      RETURNING id_public
    `;

    if (!deleted.length) {
      return NextResponse.json({ error: "Subzona no encontrada" }, { status: 404 });
    }

    return successResponse({ message: "Subzona eliminada correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
