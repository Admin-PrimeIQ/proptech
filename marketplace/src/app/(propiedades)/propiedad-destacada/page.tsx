"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DestacadaItem = {
  idPublic?: string;
};

export default function PropiedadDestacadaPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Buscando propiedad destacada...");

  useEffect(() => {
    let cancelled = false;

    const go = async () => {
      try {
        const res = await fetch("/api/propiedades/destacadas?limit=1", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("No se pudo cargar la propiedad destacada");
        }

        const data = (await res.json()) as DestacadaItem[];
        const idPublic = data?.[0]?.idPublic;

        if (!idPublic) {
          if (!cancelled) {
            setStatus("No hay propiedades destacadas. Redirigiendo a propiedades...");
            router.replace("/propiedades");
          }
          return;
        }

        if (!cancelled) {
          router.replace(`/property-details-2/${idPublic}`);
        }
      } catch {
        if (!cancelled) {
          setStatus("Error al cargar destacada. Redirigiendo a propiedades...");
          router.replace("/propiedades");
        }
      }
    };

    go();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="tp-property-ptb pt-140 pb-120">
      <div className="container">
        <div className="tp-section-title-wrapper text-center">
          <h3 className="tp-section-title">{status}</h3>
        </div>
      </div>
    </main>
  );
}
