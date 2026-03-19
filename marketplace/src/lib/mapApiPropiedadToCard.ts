import { IFeaturedPropertyDT } from "@/types/property-d-t";

export type ApiPropiedadItem = {
  idPublic: string;
  nombrePropiedad: string;
  referenciaCorta?: string | null;
  direccionPublica?: string | null;
  habitaciones?: number | null;
  banos?: number | null;
  parqueos?: number | null;
  metrosConstruccion?: number | null;
  metrosTerreno?: number | null;
  tipoOperacion?: { nombre: string } | null;
  zona?: { nombre: string } | null;
  vendedor?: { nombre: string } | null;
  precio?: { precio: number; moneda?: string } | null;
  imagenes?: Array< { url: string; esPortada?: boolean } >;
};

const DEFAULT_IMAGE = "/assets/img/rent/rent-thumb-1.jpg";

/** Genera un id numérico estable desde idPublic para Redux/wishlist. */
function idPublicToNumber(idPublic: string): number {
  let n = 0;
  for (let i = 0; i < idPublic.length; i++) {
    n = (n << 5) - n + idPublic.charCodeAt(i);
    n = n & n;
  }
  return Math.abs(n) || 1;
}

/**
 * Mapea un ítem de GET /api/propiedades al formato IFeaturedPropertyDT
 * usado por PropertySingleCardTwo y PropertyListCardItem.
 */
export function mapApiPropiedadToCardItem(api: ApiPropiedadItem): IFeaturedPropertyDT {
  const portada = api.imagenes?.find((i) => i.esPortada) ?? api.imagenes?.[0];
  const imageUrl = portada?.url ?? DEFAULT_IMAGE;
  const price = api.precio?.precio ?? 0;
  const isRenta = api.tipoOperacion?.nombre === "RENTA";
  const moneda = api.precio?.moneda ?? undefined;

  return {
    id: idPublicToNumber(api.idPublic),
    idPublic: api.idPublic,
    title: api.nombrePropiedad,
    address: api.direccionPublica ?? api.zona?.nombre ?? undefined,
    linkUrl: "property-details-2",
    image: imageUrl,
    userName: api.vendedor?.nombre,
    userRole: undefined,
    showTags: false,
    isForRent: isRenta,
    isFeatured: false,
    bedrooms: String(api.habitaciones ?? 0),
    bathrooms: String(api.banos ?? 0),
    livingArea: api.metrosConstruccion != null ? `${api.metrosConstruccion} m²` : "—",
    city: api.zona?.nombre ?? undefined,
    state: undefined,
    price,
    quantity: 1,
    moneda,
  };
}
