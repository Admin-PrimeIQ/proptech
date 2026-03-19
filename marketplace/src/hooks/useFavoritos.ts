"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggle_wishlist, set_favoritos_from_backend } from "@/redux/slices/wishlistSlice";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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

/**
 * Hook para gestionar favoritos sincronizados con el backend
 */
export function useFavoritos() {
  const dispatch = useDispatch();
  const wishlistRedux = useSelector((state: RootState) => state.wishlist.wishlistProducts);
  const { status } = useSession();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [favoritosIds, setFavoritosIds] = useState<Set<string>>(new Set());
  const [cargandoInicial, setCargandoInicial] = useState(true);

  /**
   * Carga los favoritos desde el backend y sincroniza con Redux
   */
  const cargarFavoritos = useCallback(async () => {
    // Evitar requests innecesarios cuando no hay sesión.
    if (status !== "authenticated") {
      setFavoritosIds(new Set());
      dispatch(set_favoritos_from_backend([]));
      setCargandoInicial(false);
      return;
    }

    try {
      setCargandoInicial(true);
      const response = await fetch("/api/favoritos");
      
      if (!response.ok) {
        // 401 = no logueado: es esperado, no loguear como error
        if (response.status !== 401) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData?.error || `Error ${response.status}: ${response.statusText}`;
          console.error("Error al cargar favoritos:", errorMessage);
        }
        setFavoritosIds(new Set());
        dispatch(set_favoritos_from_backend([]));
        return;
      }

      const result = await response.json();
      const favoritos: FavoritoResponse[] = Array.isArray(result?.data) 
        ? result.data 
        : Array.isArray(result) 
        ? result 
        : [];

      // Crear Set de IDs de propiedades en favoritos (filtrar valores válidos)
      const idsSet = new Set(
        favoritos
          .map((f) => f?.idPropiedadPublic)
          .filter((id): id is string => !!id)
      );
      setFavoritosIds(idsSet);

      // Convertir a formato IFeaturedPropertyDT para Redux (filtrar favoritos inválidos)
      const propiedadesFormateadas: IFeaturedPropertyDT[] = favoritos
        .filter((favorito) => favorito?.propiedad?.idPublic) // Solo procesar si tiene idPublic
        .map((favorito) => {
          const prop = favorito.propiedad;
          // Usar función similar a mapApiPropiedadToCard para generar ID numérico
          let idNumerico = 0;
          if (prop.idPublic) {
            for (let i = 0; i < prop.idPublic.length; i++) {
              idNumerico = (idNumerico << 5) - idNumerico + prop.idPublic.charCodeAt(i);
              idNumerico = idNumerico & idNumerico;
            }
            idNumerico = Math.abs(idNumerico) || 1;
          }

          return {
            id: idNumerico,
            idPublic: prop.idPublic,
            title: prop.nombre || "Sin título",
            address: prop.referenciaCorta || "",
            image: prop.imagen || "/assets/img/rent/rent-thumb-1.jpg",
            price: prop.precio || 0,
            bedrooms: "",
            bathrooms: "",
            livingArea: "",
            quantity: 1,
            moneda: prop.moneda || "USD",
            linkUrl: "property-details-2",
          };
        });

      // Sincronizar con Redux
      dispatch(set_favoritos_from_backend(propiedadesFormateadas));
    } catch (error: any) {
      console.error("Error al cargar favoritos:", error?.message || error);
      // En caso de error, establecer estado vacío para evitar errores en UI
      setFavoritosIds(new Set());
      dispatch(set_favoritos_from_backend([]));
    } finally {
      setCargandoInicial(false);
    }
  }, [dispatch, status]);

  /**
   * Verifica si una propiedad está en favoritos (síncrono basado en estado local)
   */
  const esFavorito = useCallback(
    (idPropiedadPublic: string): boolean => {
      return favoritosIds.has(idPropiedadPublic);
    },
    [favoritosIds]
  );

  /**
   * Agrega o elimina una propiedad de favoritos
   */
  const toggleFavorito = useCallback(
    async (propiedad: IFeaturedPropertyDT) => {
      // Priorizar idPublic, si no existe intentar obtenerlo de otra forma
      let idPropiedadPublic = propiedad.idPublic;
      
      // Si no tiene idPublic, no podemos agregarlo a favoritos (necesita venir de la API)
      if (!idPropiedadPublic) {
        console.warn("Propiedad sin idPublic:", propiedad);
        toast.error("Esta propiedad no puede ser agregada a favoritos. Debe venir del sistema.");
        return;
      }

      console.log("Toggle favorito - idPropiedadPublic:", idPropiedadPublic);

      // Optimistic update: actualizar UI inmediatamente
      const esFavoritoActual = favoritosIds.has(idPropiedadPublic);
      const nuevoSet = new Set(favoritosIds);

      setLoading((prev) => ({ ...prev, [idPropiedadPublic]: true }));

      try {
        if (esFavoritoActual) {
          // Eliminar de favoritos
          console.log("Eliminando de favoritos...");
          nuevoSet.delete(idPropiedadPublic);
          setFavoritosIds(nuevoSet);

          const response = await fetch(`/api/favoritos?idPropiedadPublic=${encodeURIComponent(idPropiedadPublic)}`, {
            method: "DELETE",
          });

          const responseData = await response.json().catch(() => ({}));
          console.log("DELETE response:", response.status, responseData);

          if (!response.ok) {
            // Revertir cambio si falla
            nuevoSet.add(idPropiedadPublic);
            setFavoritosIds(nuevoSet);
            throw new Error(responseData?.error || "Error al eliminar de favoritos");
          }

          // Actualizar Redux
          dispatch(toggle_wishlist(propiedad));
          toast.success("Propiedad eliminada de favoritos");
        } else {
          // Agregar a favoritos
          console.log("Agregando a favoritos...");
          nuevoSet.add(idPropiedadPublic);
          setFavoritosIds(nuevoSet);

          const response = await fetch("/api/favoritos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idPropiedadPublic }),
          });

          const responseData = await response.json().catch(() => ({}));
          console.log("POST response:", response.status, responseData);

          if (!response.ok) {
            // Revertir cambio si falla
            nuevoSet.delete(idPropiedadPublic);
            setFavoritosIds(nuevoSet);
            throw new Error(responseData?.error || "Error al agregar a favoritos");
          }

          // Actualizar Redux
          dispatch(toggle_wishlist(propiedad));
          toast.success("Propiedad agregada a favoritos");
          
          // Recargar favoritos para sincronizar
          await cargarFavoritos();
        }
      } catch (error: any) {
        console.error("Error al toggle favorito:", error);
        toast.error(error?.message || "Error al actualizar favoritos");
      } finally {
        setLoading((prev) => {
          const nuevo = { ...prev };
          delete nuevo[idPropiedadPublic];
          return nuevo;
        });
      }
    },
    [favoritosIds, dispatch, cargarFavoritos]
  );

  /**
   * Carga favoritos al montar el componente
   */
  useEffect(() => {
    if (status === "loading") return;
    cargarFavoritos();
  }, [cargarFavoritos, status]);

  return {
    favoritosIds,
    esFavorito: (idPropiedadPublic: string) => favoritosIds.has(idPropiedadPublic),
    toggleFavorito,
    cargarFavoritos,
    loading: (idPropiedadPublic: string) => loading[idPropiedadPublic] || false,
  };
}
