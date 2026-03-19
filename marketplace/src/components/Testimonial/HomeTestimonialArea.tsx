"use client"
import { useEffect, useState } from "react";
import HomeTestimonialItem from "./subComponents/HomeTestimonialItem";
import { ITestimonialIDT } from "@/types/testimonial-d-t";

// Import Swiper components and Pagination module
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

type HomeTestimonialAreaProps = {
  backgroundImageUrl?: string | null;
};

type ComentarioPersona = {
  idPublic: string;
  nombrePersonaComentario: string;
  puesto: string;
  comentario: string;
  imagen: { idPublic: string; url: string } | null;
};

export default function HomeTestimonialArea({ backgroundImageUrl }: HomeTestimonialAreaProps) {
  const [comentarios, setComentarios] = useState<ITestimonialIDT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comentarios-personas")
      .then((r) => r.text())
      .then((text) => {
        if (text.trimStart().startsWith("<")) {
          setComentarios([]);
          return;
        }
        try {
          const res = JSON.parse(text);
          if (res?.error) {
            console.error("Error al cargar comentarios:", res.error);
            setComentarios([]);
            return;
          }
          const data = res?.data ?? res ?? [];
          const comentariosFormateados: any[] = Array.isArray(data)
            ? data.map((item: ComentarioPersona, index: number) => ({
                id: index + 1,
                description: item.comentario,
                name: item.nombrePersonaComentario,
                role: item.puesto,
                image: item.imagen?.url || "/assets/img/rent/rent-user-2.png",
              }))
            : [];
          setComentarios(comentariosFormateados);
        } catch {
          setComentarios([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar comentarios:", err);
        setComentarios([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Si no hay comentarios, no mostrar la sección
  if (!loading && comentarios.length === 0) {
    return null;
  }

  const bgImage = backgroundImageUrl || "/assets/img/testimonial/testimonail-bg.png";

  return (
    <section
      className="tp-testimonial-area pt-140 pb-135 include-bg"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Overlay oscuro para mejorar legibilidad del texto */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-testimonial-heading text-center">
              <h3
                className="tp-section-title"
                style={{
                  color: "white",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 16px rgba(0, 0, 0, 0.7)",
                }}
              >
                Lo que la gente dice sobre <br /> nuestras propiedades
              </h3>
            </div>
          </div>
        </div>

        {/* Swiper Slider */}
        {loading ? (
          <div className="row">
            <div className="col-lg-12 text-center py-5">
              <p style={{ color: "white" }}>Cargando comentarios...</p>
            </div>
          </div>
        ) : (
          <div className="tp-testimonial-slider-active swiper">
            <div className="pb-80">
              <Swiper
                modules={[Pagination]}
                spaceBetween={30}
                loop={comentarios.length > 3}
                breakpoints={{
                  "1400": { slidesPerView: 3 },
                  "1200": { slidesPerView: 3 },
                  "768": { slidesPerView: 2 },
                  "576": { slidesPerView: 1 },
                  "0": { slidesPerView: 1 },
                }}
                pagination={{
                  el: ".tp-testimonial-slider-dot",
                  clickable: true,
                }}
              >
                {comentarios.map((item) => (
                  <SwiperSlide key={item.id}>
                    <HomeTestimonialItem {...item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="tp-testimonial-slider-dot"></div>
          </div>
        )}
      </div>
    </section>
  );
}
