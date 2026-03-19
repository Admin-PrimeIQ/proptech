"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import TeamAgentItem from "./Single/TeamAgentItem";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";

type AdministradorPublico = {
  idPublic: string;
  nombre: string;
  puesto: string;
  imagen: { idPublic: string; url: string } | null;
  orden: number;
  activo: boolean;
};

export default function TeamAgentsArea() {
  const [administradores, setAdministradores] = useState<AdministradorPublico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/administradores-publicos")
      .then((r) => r.json())
      .then((res) => {
        if (res?.error) {
          console.error("Error al cargar administradores:", res.error);
          setAdministradores([]);
          return;
        }
        const data = res?.data ?? res ?? [];
        const activos = Array.isArray(data)
          ? data
              .filter((item: AdministradorPublico) => item.activo)
              .sort((a: AdministradorPublico, b: AdministradorPublico) => a.orden - b.orden)
          : [];
        setAdministradores(activos);
      })
      .catch((err) => {
        console.error("Error al cargar administradores:", err);
        setAdministradores([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!loading && administradores.length === 0) {
    return null; // No mostrar la sección si no hay administradores
  }

  return (
    <section className="tp-team-area pt-90 pb-80" style={{ backgroundColor: "#F0F4FD" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="tp-team-heading mb-40 text-center">
              <span className="tp-section-title-pre">Nuestro equipo</span>
              <h3 className="tp-section-title">Conoce a nuestros miembros</h3>
            </div>
          </div>
        </div>
        {/* Renders a responsive swiper slider for team agents. */}
        {loading ? (
          <div className="row">
            <div className="col-lg-12 text-center py-5">
              <p>Cargando equipo...</p>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="tp-team-slider wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">
              <div className="tp-team-active swiper">
                <div className="pb-70">
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    loop={administradores.length > 4}
                    autoplay={{
                      delay: 3500,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      1400: { slidesPerView: 4 },
                      1200: { slidesPerView: 3 },
                      992: { slidesPerView: 2 },
                      768: { slidesPerView: 2 },
                      0: { slidesPerView: 1 },
                    }}
                    pagination={{ el: ".tp-team-slider-dot", clickable: true }}
                  >
                    {administradores.map((admin, index) => {
                      const imageUrl = admin.imagen?.url || "/assets/img/team/team-thumb-1.jpg";
                      const isExternalImage = imageUrl.startsWith("http");
                      
                      return (
                        <SwiperSlide key={admin.idPublic}>
                          <TeamAgentItem
                            id={index + 1}
                            image={imageUrl as any}
                            name={admin.nombre}
                            designation={admin.puesto}
                            socialLinks={{
                              facebookLink: "",
                              linkedinLink: "",
                            }}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
                <div className="tp-team-slider-dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
