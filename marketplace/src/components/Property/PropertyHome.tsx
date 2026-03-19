"use client"
import PropertySingleCard from "../Common/PropertySingleCard";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import React from "react";

// Import Swiper components and Pagination, Autoplay modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

export default function PropertyHome() {
  const { properties: propertyData, loading, error, refetch } = useFeaturedProperties();

  return (
    <section className="tp-rent-area p-relative pt-135 pb-110">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-rent-heading text-center mb-50">
              <span className="tp-section-title-pre">Propiedades Destacadas</span>
              <h3 className="tp-section-title">Propiedades en venta y alquiler</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="container container-1600">
        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">Cargando propiedades destacadas…</p>
            </div>
          ) : error ? (
            <div className="col-12 text-center py-5">
              <p className="text-danger mb-3">{error}</p>
              <button type="button" className="tp-btn" onClick={refetch}>
                Reintentar
              </button>
            </div>
          ) : propertyData.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">Aún no hay propiedades para mostrar.</p>
            </div>
          ) : (
            <div className="tp-rent-slider">
              <div className="tp-rent-slider-active pb-rent-slider swiper">
                <div className="pb-110 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    loop={propertyData.length > 2}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    breakpoints={{
                      1600: { slidesPerView: 5 },
                      1400: { slidesPerView: 4 },
                      1200: { slidesPerView: 3 },
                      992: { slidesPerView: 2 },
                      768: { slidesPerView: 2 },
                      0: { slidesPerView: 1 },
                    }}
                    pagination={{
                      el: ".tp-rent-slider-dot",
                      clickable: true,
                    }}
                  >
                    {propertyData.slice(0, 20).map((item) => (
                      <SwiperSlide key={item.idPublic ?? item.id}>
                        <PropertySingleCard item={item} compact />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="tp-rent-slider-dot"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
