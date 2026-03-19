"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

export type AboutCarouselItem = {
  idPublic: string;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
};

type AboutInfoCarouselProps = {
  items: AboutCarouselItem[];
  intervalMs?: number;
  fallback: {
    titulo: string;
    descripcion: string;
    imagenUrl: string;
  };
  renderActions: React.ReactNode;
};

type SlideItem = {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
};

export default function AboutInfoCarousel({
  items,
  intervalMs = 5000,
  fallback,
  renderActions,
}: AboutInfoCarouselProps) {
  const [overlaySoft] = useState(false);
  const [forceTextureBg] = useState(false);
  const [staticMode] = useState(false);
  const [activeRealIndex, setActiveRealIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const slides = useMemo<SlideItem[]>(() => {
    if (items.length > 0) {
      return items.map((item) => ({
        id: item.idPublic,
        titulo: item.titulo || fallback.titulo,
        descripcion: item.descripcion || fallback.descripcion,
        imagenUrl: item.imagenUrl || fallback.imagenUrl,
      }));
    }

    return [
      {
        id: "fallback",
        titulo: fallback.titulo,
        descripcion: fallback.descripcion,
        imagenUrl: fallback.imagenUrl,
      },
    ];
  }, [items, fallback]);

  const renderedSlides = staticMode ? [slides[0]] : slides;
  const shouldLoop = !staticMode && renderedSlides.length > 1;
  const displaySlides = useMemo<SlideItem[]>(() => {
    if (!shouldLoop) return renderedSlides;

    const first = renderedSlides[0];
    const last = renderedSlides[renderedSlides.length - 1];

    return [
      { ...last, id: `${last.id}-clone-prev` },
      ...renderedSlides,
      { ...first, id: `${first.id}-clone-next` },
    ];
  }, [renderedSlides, shouldLoop]);

  const testTextureBg = "/assets/img/hero/home-2/hero-2-bg.jpg";

  useEffect(() => {
    setActiveRealIndex(0);
  }, [renderedSlides.length]);

  useEffect(() => {
    if (!shouldLoop) return;

    const intervalId = window.setInterval(() => {
      swiperRef.current?.slideNext(520);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, shouldLoop]);

  const getRealIndex = (activeIndex: number) => {
    if (!shouldLoop) return activeIndex;
    if (activeIndex === 0) return renderedSlides.length - 1;
    if (activeIndex === displaySlides.length - 1) return 0;
    return activeIndex - 1;
  };

  const handleLoopEdges = (swiper: SwiperType) => {
    if (!shouldLoop) return;

    const lastDisplayIndex = displaySlides.length - 1;
    if (swiper.activeIndex === 0) {
      swiper.slideTo(displaySlides.length - 2, 0, false);
    } else if (swiper.activeIndex === lastDisplayIndex) {
      swiper.slideTo(1, 0, false);
    }
  };

  return (
    <section className="tp-about-area p-relative pt-140 pb-140 tp-info-carousel-area">
      <div className="container tp-info-carousel-wrapper">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1.72}
          initialSlide={shouldLoop ? 1 : 0}
          slidesPerGroup={1}
          centeredSlides
          centeredSlidesBounds={false}
          centerInsufficientSlides={false}
          spaceBetween={16}
          loop={false}
          watchOverflow={false}
          observer
          observeParents
          updateOnWindowResize
          speed={520}
          onSlideChange={(swiper) => {
            setActiveRealIndex(getRealIndex(swiper.activeIndex));
          }}
          onTransitionEnd={handleLoopEdges}
          breakpoints={{
            0: { slidesPerView: 1.08, spaceBetween: 12 },
            576: { slidesPerView: 1.28, spaceBetween: 12 },
            768: { slidesPerView: 1.48, spaceBetween: 14 },
            1200: { slidesPerView: 1.72, spaceBetween: 16 },
          }}
          className="tp-info-carousel-swiper"
        >
          {displaySlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="tp-info-slide"
                style={{
                  backgroundImage: `url(${forceTextureBg ? testTextureBg : slide.imagenUrl})`,
                }}
              >
                <div
                  className={`tp-info-slide-overlay ${overlaySoft ? "tp-info-slide-overlay-soft" : ""}`}
                />
                <div className="tp-info-slide-inner">
                  <div
                    className="p-relative wow fadeInUp tp-info-content-layer"
                    data-wow-duration="1s"
                    data-wow-delay=".2s"
                  >
                    <div className="tp-info-heading">
                      <h3 className="tp-section-title">
                        {slide.titulo.split("\n").map((line, idx, arr) => (
                          <span key={idx}>
                            {line}
                            {idx < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </h3>
                    </div>
                    <div className="tp-info-slide-content">
                      <p>
                        {slide.descripcion.split("\n").map((line, idx, arr) => (
                          <span key={idx}>
                            {line}
                            {idx < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <div className="tp-about-btn d-flex">{renderActions}</div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="tp-info-carousel-dot">
          {renderedSlides.map((slide, index) => (
            <button
              key={`${slide.id}-dot`}
              type="button"
              className={`swiper-pagination-bullet ${activeRealIndex === index ? "swiper-pagination-bullet-active" : ""}`}
              onClick={() => swiperRef.current?.slideTo(shouldLoop ? index + 1 : index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .tp-info-carousel-area {
          padding-top: 48px !important;
          padding-bottom: 88px !important;
        }

        .tp-info-carousel-wrapper {
          position: relative;
          width: calc(100vw - 24px);
          max-width: calc(100vw - 24px) !important;
          padding-inline: 6px;
          overflow: visible;
          border-radius: 24px;
        }

        .tp-info-carousel-swiper {
          overflow: visible;
        }

        .tp-info-slide {
          position: relative;
          min-height: 560px;
          border-radius: 24px;
          overflow: hidden;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: scale(0.96);
          opacity: 0.9;
          box-shadow: 0 16px 36px rgba(15, 21, 35, 0.24);
          transition: transform 0.45s ease, opacity 0.45s ease, box-shadow 0.45s ease;
        }

        .tp-info-carousel-swiper :global(.swiper-slide-active) .tp-info-slide {
          transform: scale(1);
          opacity: 1;
          box-shadow: 0 22px 50px rgba(15, 21, 35, 0.22);
        }

        .tp-info-slide-overlay {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: transparent;
        }

        .tp-info-slide-inner {
          position: relative;
          z-index: 1;
          min-height: 560px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 24px;
        }

        .tp-info-content-layer {
          width: min(760px, 100%);
          margin-right: 0;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 16px;
          padding: 2rem !important;
        }

        .tp-info-content-layer::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          border-radius: inherit;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
          background: linear-gradient(
            239deg,
            rgba(18, 26, 44, 0.18) 17.93%,
            rgba(18, 26, 44, 0.06) 81.51%
          );
          background-color: rgba(18, 26, 44, 0.08);
        }

        .tp-info-heading {
          margin-bottom: 20px;
        }

        .tp-info-content-layer :global(.tp-section-title) {
          color: white;
          font-size: 40px;
          line-height: 1.3;
          margin-bottom: 18px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          font-weight: 700;
        }

        .tp-info-slide-content {
          padding-left: 0;
        }

        .tp-info-slide-content p {
          color: white;
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 28px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }

        .tp-info-content-layer > * {
          position: relative;
          z-index: 1;
        }

        .tp-info-carousel-dot {
          margin-top: 24px;
          text-align: center;
        }

        .tp-info-carousel-dot :global(.swiper-pagination-bullet),
        .tp-info-carousel-dot .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          opacity: 1;
          margin: 0 6px !important;
          border: none;
          border-radius: 50%;
          background: rgba(15, 21, 35, 0.22);
          cursor: pointer;
          padding: 0;
        }

        .tp-info-carousel-dot :global(.swiper-pagination-bullet-active),
        .tp-info-carousel-dot .swiper-pagination-bullet-active {
          background: #4f46e5;
        }

        @media (max-width: 991px) {
          .tp-info-carousel-area {
            padding-top: 24px !important;
            padding-bottom: 48px !important;
          }

          .tp-info-carousel-wrapper {
            width: calc(100vw - 16px);
            max-width: calc(100vw - 16px) !important;
            padding-inline: 4px;
            border-radius: 20px;
          }

          .tp-info-slide {
            min-height: 500px;
            border-radius: 20px;
          }

          .tp-info-slide-inner {
            min-height: 500px;
            justify-content: center;
            align-items: flex-end;
            padding: 18px;
          }

          .tp-info-content-layer {
            padding: 24px 20px;
          }

          .tp-info-content-layer :global(.tp-section-title) {
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}
