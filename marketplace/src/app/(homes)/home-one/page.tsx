import AboutHomeMain from '@/components/About/AboutHomeMain';
import HomeApartmentArea from '@/components/Apartment/HomeApartment';
import HomeApartmentTypes from '@/components/Apartment/HomeApartmentTypes';
import BrandAreaOne from '@/components/Barnd/BarndAreaOne';
import HeroBannerOne from '@/components/HeroBanner/HeroBannerOne';
import HomePropertiesByCity from '@/components/Neighborhood/HomePropertiesByCity';
import FeatureShowcaseCategory from '@/components/Property/FeatureShowcaseCategory';
import PropertyHome from '@/components/Property/PropertyHome';
import HomeTestimonialArea from '@/components/Testimonial/HomeTestimonialArea';
import TextSlide from '@/components/Features/TextSlide';
import { getHomeConfig } from '@/lib/home-config';
import { getPaginaInfoConfig } from '@/lib/pagina-info-config';
import { getMultimediaHomeConfig } from '@/lib/multimedia-home-config';
import { getInformacionPaginaItems } from '@/lib/informacion-pagina-items';
import React from 'react';

export default async function HomeOnePage() {
    const [heroConfig, paginaInfo, multimedia, infoItems] = await Promise.all([
        getHomeConfig(),
        getPaginaInfoConfig(),
        getMultimediaHomeConfig(),
        getInformacionPaginaItems(),
    ]);
    return (
        <>
            {/* hero banner  */}
            <HeroBannerOne heroConfig={heroConfig} />
            {/* hero banner end */}
            {/*feature area*/}
            <FeatureShowcaseCategory />
            {/*feature area end*/}
            {/* about area  */}
            <AboutHomeMain
                paginaInfo={paginaInfo}
                items={infoItems.map((item) => ({
                    idPublic: item.idPublic,
                    titulo: item.titulo,
                    descripcion: item.descripcion,
                    imagenUrl: item.imagen?.url ?? null,
                }))}
            />
            {/* about area end */}
            {/* apartment area type*/}
            <HomeApartmentTypes />
            {/*apartment area type end */}
            {/* rent area */}
            <PropertyHome />
            {/* rent area end */}
            {/* apartment area*/}
            <HomeApartmentArea backgroundImageUrl={multimedia?.imagen?.url ?? null} />
            {/* apartment area end*/}
            {/* explore area */}
            <HomePropertiesByCity />
            {/* explore area end */}
            {/* text slide */}
            <TextSlide />
            {/* text slide end*/}
            {/* testimonial area */}
            <HomeTestimonialArea backgroundImageUrl={heroConfig?.imagenHero?.url ?? null} />
            {/* testimonial area end */}
            {/* barnd area */}
            <BrandAreaOne />
            {/* barnd area end */}

        </>
    );
};
