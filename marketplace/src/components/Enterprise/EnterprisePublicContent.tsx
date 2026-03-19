"use client";

import { useEffect, useMemo, useState } from "react";
import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type RecursoImagen = {
  idPublic: string;
  url: string;
} | null;

type SolucionEnterprise = {
  idPublic: string;
  tituloHero: string;
  tituloSeccionInformacion: string | null;
  contextoSeccionInformacion: string | null;
  imagen: RecursoImagen;
};

type ServicioEnterprise = {
  idPublic: string;
  tituloServicio: string;
  descripcion: string;
  orden: number;
  activo: boolean;
  imagen: RecursoImagen;
};

type PlanEnterprise = {
  idPublic: string;
  titulo: string;
  montoQuetzales: string;
  montoDolares: string;
  orden: number;
  activo: boolean;
};

type BeneficioEnterprise = {
  idPublic: string;
  idPlanPublic: string;
  planTitulo: string;
  tituloVentaja: string;
  orden: number;
  activo: boolean;
};

export default function EnterprisePublicContent() {
  const { status } = useSession();
  const router = useRouter();
  const isLoggedIn = status === "authenticated";
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<SolucionEnterprise | null>(null);
  const [servicios, setServicios] = useState<ServicioEnterprise[]>([]);
  const [planes, setPlanes] = useState<PlanEnterprise[]>([]);
  const [beneficios, setBeneficios] = useState<BeneficioEnterprise[]>([]);

  useEffect(() => {
    let cancelled = false;

    const preloadImage = (url: string) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = url;
      });

    const loadData = async () => {
      try {
        setLoading(true);
        const [heroRes, serviciosRes, planesRes, beneficiosRes] = await Promise.all([
          fetch("/api/soluciones-empresariales"),
          fetch("/api/servicios-empresariales"),
          fetch("/api/planes"),
          fetch("/api/beneficios-plan"),
        ]);

        const heroData = heroRes.ok ? await heroRes.json() : [];
        const serviciosData = serviciosRes.ok ? await serviciosRes.json() : [];
        const planesData = planesRes.ok ? await planesRes.json() : [];
        const beneficiosData = beneficiosRes.ok ? await beneficiosRes.json() : [];

        if (cancelled) return;

        const heroList: SolucionEnterprise[] = Array.isArray(heroData) ? heroData : heroData?.data ?? [];
        const serviciosList: ServicioEnterprise[] = Array.isArray(serviciosData)
          ? serviciosData
          : serviciosData?.data ?? [];
        const planesList: PlanEnterprise[] = Array.isArray(planesData) ? planesData : planesData?.data ?? [];
        const beneficiosList: BeneficioEnterprise[] = Array.isArray(beneficiosData)
          ? beneficiosData
          : beneficiosData?.data ?? [];

        const heroItem = heroList[0] ?? null;
        const serviciosActivos = serviciosList.filter((item) => item.activo);

        const urlsToPreload = [
          heroItem?.imagen?.url ?? null,
          ...serviciosActivos.map((item) => item.imagen?.url ?? null),
        ].filter((url): url is string => Boolean(url));

        if (urlsToPreload.length > 0) {
          await Promise.all(urlsToPreload.map((url) => preloadImage(url)));
        }

        if (cancelled) return;

        setHero(heroItem);
        setServicios(serviciosActivos);
        setPlanes(planesList.filter((item) => item.activo));
        setBeneficios(beneficiosList.filter((item) => item.activo));
      } catch {
        if (!cancelled) {
          setHero(null);
          setServicios([]);
          setPlanes([]);
          setBeneficios([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const beneficiosByPlan = useMemo(() => {
    return beneficios.reduce<Record<string, BeneficioEnterprise[]>>((acc, item) => {
      if (!acc[item.idPlanPublic]) acc[item.idPlanPublic] = [];
      acc[item.idPlanPublic].push(item);
      return acc;
    }, {});
  }, [beneficios]);
  const plansDashboardHref = "/enterprise/planes";
  const startHref = isLoggedIn
    ? plansDashboardHref
    : `/sign-in?callbackUrl=${encodeURIComponent(plansDashboardHref)}`;

  if (loading) {
    return (
      <>
        <section className="tp-counter-4-ptb p-relative z-index-1 pt-140 pb-120">
          <div className="container">
            <p className="mb-0">Cargando Enterprise...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BreadcrumbArea
        title={hero?.tituloHero?.trim() || "Enterprise"}
        backgroundImageUrl={hero?.imagen?.url ?? null}
      />

      <section className="tp-counter-4-ptb p-relative z-index-1 pt-40 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-counter-4-heading text-center mb-50">
                <h4 className="tp-section-title">
                  {(hero?.tituloSeccionInformacion || "Enterprise para empresas inmobiliarias").trim()}
                </h4>
                <p>
                  {(hero?.contextoSeccionInformacion ||
                    "Automatiza tu operacion comercial y mejora la conversion con planes y servicios especializados.").trim()}
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="tp-counter-4-item-box d-flex justify-content-center flex-wrap">
                {servicios.length > 0 ? (
                  servicios.map((item) => (
                    <div className="tp-counter-4-item text-center mb-30" key={item.idPublic}>
                      <h4 className="tp-counter-4-item-title">{item.tituloServicio}</h4>
                      <p>{item.descripcion}</p>
                      {item.imagen?.url ? (
                        <div className="tp-counter-4-item-image">
                          <img
                            src={item.imagen.url}
                            alt={item.tituloServicio}
                            width={400}
                            height={280}
                            style={{
                              width: "100%",
                              maxWidth: "400px",
                              height: "auto",
                              aspectRatio: "400 / 280",
                              objectFit: "cover",
                              borderRadius: "8px",
                              margin: "0 auto",
                              display: "block",
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="mb-0 text-center">No hay servicios empresariales disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tp-pricing-ptb pt-130 pb-100" style={{ backgroundColor: "#262B35" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-pricing-heading mb-50">
                <span className="tp-section-title-pre">PLANES EMPRESARIALES</span>
                <h4 className="tp-section-title">
                  Elige el plan ideal para tu operacion
                  <br />
                  y escala tu negocio inmobiliario
                </h4>
              </div>
            </div>
          </div>
          <div className="row">
            {planes.length > 0 ? (
              planes.map((plan, index) => {
                const planBeneficios = beneficiosByPlan[plan.idPublic] ?? [];
                const isActiveCard = index === 1 || (index === 0 && planes.length === 1);

                return (
                  <div className="col-lg-4 col-md-6" key={plan.idPublic}>
                    <div
                      className={`tp-pricing-item p-relative mb-30 ${isActiveCard ? "active" : ""}`}
                      onClick={() => router.push(startHref)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(startHref);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="tp-pricing-item-heading">
                        <span>{plan.titulo}</span>
                        <h4 className="tp-pricing-item-title">
                          Q {plan.montoQuetzales} <span>/mes</span>
                        </h4>
                        <p style={{ marginTop: 10, marginBottom: 0, color: "#fff" }}>${plan.montoDolares} USD / mes</p>
                      </div>

                      <div className="tp-pricing-item-btn">
                        <Link className="tp-btn" href={startHref}>
                          <span className="btn-wrap">
                            <b className="text-1">Comenzar</b>
                            <b className="text-2">Comenzar</b>
                          </span>
                        </Link>
                        <p>{isActiveCard ? "Plan recomendado" : "Plan empresarial"}</p>
                      </div>

                      <div className="tp-pricing-item-list">
                        <ul>
                          {planBeneficios.length > 0 ? (
                            planBeneficios.map((beneficio) => (
                              <li key={beneficio.idPublic}>
                                <span>
                                  <i className="fa-solid fa-check"></i>
                                </span>{" "}
                                {beneficio.tituloVentaja}
                              </li>
                            ))
                          ) : (
                            <li>
                              <span>
                                <i className="fa-solid fa-check"></i>
                              </span>{" "}
                              Beneficios en configuracion
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-lg-12">
                <p className="mb-0" style={{ color: "#fff" }}>
                  No hay planes empresariales disponibles.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
