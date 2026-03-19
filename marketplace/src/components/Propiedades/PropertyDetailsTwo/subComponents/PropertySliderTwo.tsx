"use client";

import smallThumb1 from "../../../../../public/assets/img/property/property-details-2/property-thumb-small-1.jpg";
import smallThumb2 from "../../../../../public/assets/img/property/property-details-2/property-thumb-small-2.jpg";
import smallThumb3 from "../../../../../public/assets/img/property/property-details-2/property-thumb-small-3.jpg";
import smallThumb4 from "../../../../../public/assets/img/property/property-details-2/property-thumb-small-4.jpg";
import thumb1 from "../../../../../public/assets/img/property/property-details-2/property-thumb-big-1.jpg";
import thumb2 from "../../../../../public/assets/img/property/property-details-2/property-thumb-big-2.jpg";
import thumb3 from "../../../../../public/assets/img/property/property-details-2/property-thumb-big-3.jpg";
import thumb4 from "../../../../../public/assets/img/property/property-details-2/property-thumb-big-4.jpg";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { formatPrice } from "@/components/Utils/formatPrice";
import Image, { StaticImageData } from "next/image";
import { useRef, useEffect, useMemo } from "react";
import Slider from "react-slick";

type SliderItem = {
    imageUrl?: string;
    bigImg?: StaticImageData;
    title: string;
    address: string | undefined;
    price: number;
    moneda?: string;
};

const STATIC_THUMBS = [thumb1, thumb2, thumb3, thumb4];
const STATIC_SMALL = [smallThumb1, smallThumb2, smallThumb3, smallThumb4];

export default function PropertySliderTwo({
    property = {} as IFeaturedPropertyDT,
    imagenes,
}: {
    property?: IFeaturedPropertyDT;
    imagenes?: Array<{ url: string }>;
}) {
    const useApiImages = Array.isArray(imagenes) && imagenes.length > 0;
    const slides: SliderItem[] = useMemo(() => {
        const base = {
            title: property?.title ?? "",
            address: property?.address,
            price: property?.price ?? 0,
            moneda: property?.moneda,
        };
        if (useApiImages) {
            return imagenes!.map((im) => ({ ...base, imageUrl: im.url }));
        }
        return STATIC_THUMBS.map((bigImg) => ({ ...base, bigImg }));
    }, [useApiImages, imagenes, property?.title, property?.address, property?.price, property?.moneda]);

    const thumbnails: (StaticImageData | string)[] = useApiImages
        ? imagenes!.map((im) => im.url)
        : STATIC_SMALL;

    const mainSliderRef = useRef<Slider>(null);
    const thumbSliderRef = useRef<Slider>(null);

    // **Main Slider Settings**
    const mainSliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: thumbSliderRef.current || undefined
    };

    // **Thumbnail Slider Settings**
    const thumbnailSliderSettings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: mainSliderRef.current || undefined,
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        centerPadding: "5px",
        arrows: false,
        responsive: [
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerPadding: "15px",
                },
            },
        ],
    };

    // Handle thumbnail click
    const handleThumbClick = (index: number) => {
        if (mainSliderRef.current) {
            mainSliderRef.current.slickGoTo(index);
        }
    };

    // Sync sliders after component mounts
    useEffect(() => {
        if (mainSliderRef.current && thumbSliderRef.current) {
            // Force re-render of sliders to ensure proper sync
            mainSliderRef.current.slickGoTo(0);
            thumbSliderRef.current.slickGoTo(0);
        }
    }, []);

    return (
        <>
            {/* Main Slider */}
            <Slider
                ref={mainSliderRef}
                {...mainSliderSettings}
                className="tp-slider-5-active"
            >
                {slides.map((slide, index) => (
                    <div key={index}>
                        <div
                            className="tp-slider-5-bg"
                            style={{
                                backgroundImage: `url(${slide.imageUrl ?? (slide.bigImg as StaticImageData)?.src})`,
                            }}
                        >
                            <div className="container container-custom">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="tp-slider-5-wrapper d-flex align-items-end pb-140">
                                            <div className="tp-slider-5-heading p-relative z-index-1">
                                                <h4 className="tp-slider-5-title">{slide.title}</h4>
                                                <span>{slide.address}</span>
                                                <h4 className="tp-slider-5-price">
                                                    {formatPrice(slide.price, false, slide.moneda)}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Thumbnail Slider */}
            <div className="slider tp-slider-5-arrow">
                <Slider
                    ref={thumbSliderRef}
                    {...thumbnailSliderSettings}
                >
                    {thumbnails.map((thumb, index) => (
                        <div key={index} className="tp-slider-5-next">
                            <div className="tp-slider-5-thumb-sm" onClick={() => handleThumbClick(index)} style={{ cursor: "pointer" }}>
                                <Image
                                    src={thumb}
                                    alt={`property thumbnail ${index + 1}`}
                                    width={120}
                                    height={90}
                                    style={{ objectFit: "cover" }}
                                    unoptimized={typeof thumb === "string" && /^https?:\/\//i.test(thumb)}
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
}