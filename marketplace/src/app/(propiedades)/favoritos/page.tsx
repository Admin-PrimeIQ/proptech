"use client";

import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import PropertySingleCard from "@/components/Common/PropertySingleCard";
import { useFavoritos } from "@/hooks/useFavoritos";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HomeConfigResponse = {
  imagenHero?: { url: string } | null;
};

type FavoritoResponse = {
  idPublic: string;
  idPropiedadPublic: string;
  fechaCreacion: string;
  propiedad: {
    idPublic: string;
    nombre: string;
    referenciaCorta: string | null;
    descripcionGeneral: string | null;
    imagen: string | null;
    categoria: string | null;
    tipoOperacion: string | null;
    precio: number | null;
    moneda: string | null;
  };
};

const SIGN_IN_URL = "/sign-in";
const FAVORITOS_PATH = "/favoritos";

export default function FavoritosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cargarFavoritos } = useFavoritos();
  const [favoritos, setFavoritos] = useState<IFeaturedPropertyDT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Redirigir a iniciar sesión si no está autenticado; tras login vuelve a favoritos
  useEffect(() => {
    if (status === "unauthenticated") {
      const callbackUrl = encodeURIComponent(FAVORITOS_PATH);
      router.replace(`${SIGN_IN_URL}?callbackUrl=${callbackUrl}`);
      return;
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/home-configuracion")
      .then((r) => r.json())
      .then((res: HomeConfigResponse) => {
        if (res?.imagenHero?.url) setHeroImageUrl(res.imagenHero.url);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setFavoritos([]);
      setError(null);
      return;
    }

    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/favoritos");

        if (response.status === 401) {
          setFavoritos([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Error al cargar favoritos");
        }

        const result = await response.json();
        const favoritosData: FavoritoResponse[] = result?.data || result || [];

        // Convertir a formato IFeaturedPropertyDT
        const propiedadesFormateadas: IFeaturedPropertyDT[] = favoritosData.map((favorito) => {
          const prop = favorito.propiedad;
          const idNumerico = parseInt(prop.idPublic.replace(/-/g, "").substring(0, 8), 16) % 1000000;

          return {
            id: idNumerico,
            idPublic: prop.idPublic,
            title: prop.nombre,
            address: prop.referenciaCorta || "",
            image: prop.imagen || "",
            price: prop.precio || 0,
            bedrooms: "",
            bathrooms: "",
            livingArea: "",
            quantity: 1,
            moneda: prop.moneda || "USD",
            linkUrl: "property-details-2",
            spacing: true,
          };
        });

        setFavoritos(propiedadesFormateadas);
        cargarFavoritos();
      } catch (err: any) {
        console.error("Error al cargar favoritos:", err);
        setError(err?.message || "Error al cargar favoritos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [isAuthenticated, cargarFavoritos]);

  // Mientras no está autenticado, redirigimos; mostrar mensaje breve
  if (status === "unauthenticated") {
    return (
      <>
        <BreadcrumbArea title="Favoritos" backgroundImageUrl={heroImageUrl} />
        <section className="tp-property-ptb pt-140 pb-120">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center py-5">
                <p className="text-muted">Redirigiendo a inicio de sesión...</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BreadcrumbArea title="Favoritos" backgroundImageUrl={heroImageUrl} />
      <section className="tp-property-ptb pt-140 pb-120">
        <div className="container">
          {loading ? (
            <div className="row">
              <div className="col-lg-12 text-center">
                <p>Cargando favoritos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="row">
              <div className="col-lg-12 text-center">
                <p className="text-danger">{error}</p>
              </div>
            </div>
          ) : favoritos.length === 0 ? (
            <div className="row">
              <div className="col-lg-12 text-center py-5">
                <div className="tp-empty-state">
                  <h4 className="mb-3">Todavía no hay favoritos</h4>
                  <p className="text-muted mb-4">
                    Cuando agregues propiedades a tus favoritos, aparecerán aquí.
                  </p>
                  <Link href="/propiedades" className="tp-btn">
                    Explorar Propiedades
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {favoritos.map((property) => (
                <div className="col-xxl-3 col-xl-4 col-md-6" key={property.idPublic || property.id}>
                  <PropertySingleCard item={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
