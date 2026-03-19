"use client";

import PropertySingleCard from "@/components/Common/PropertySingleCard";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface IPropsWrapperCls {
  wrapperCls?: string;
  customClass?: string;
}

export default function SidebarPropertyItem({ wrapperCls, customClass }: IPropsWrapperCls) {
  const { properties, loading, error } = useFeaturedProperties(10);

  return (
    <div className={`${wrapperCls ? wrapperCls : "tp-team-details-widget"} mb-40`}>
      <div className={customClass ? customClass : ""}>
        <h4 className="tp-team-details-item-title">Propiedades destacadas</h4>
        {loading ? (
          <p className="text-muted small">Cargando…</p>
        ) : error ? (
          <p className="text-danger small">{error}</p>
        ) : properties.length === 0 ? (
          <p className="text-muted small">No hay propiedades para mostrar.</p>
        ) : (
          <div className="tp-rent-slider">
            <div className="tp-rent-slider-active pb-rent-slider swiper">
              <div className="pb-110">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={20}
                  loop={properties.length > 1}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    1200: { slidesPerView: 1 },
                    992: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    0: { slidesPerView: 1 },
                  }}
                  pagination={{
                    el: ".tp-rent-slider-dot-sidebar",
                    clickable: true,
                  }}
                >
                  {properties.map((item) => (
                    <SwiperSlide key={item.idPublic ?? item.id}>
                      <PropertySingleCard item={item} compact />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="tp-rent-slider-dot tp-rent-slider-dot-sidebar"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}