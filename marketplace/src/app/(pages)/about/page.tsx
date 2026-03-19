import AboutTopFavoritosSection from "@/components/PropertyFeature/AboutTopFavoritosSection";
import RealEstateHighlights from "@/components/Property/RealEstateHighlights";
import BreadcrumbArea from "../../../components/Breadcrumb/BreadcrumbArea";
import HomeTestimonialArea from "@/components/Testimonial/HomeTestimonialArea";
import AboutHomeFive from "@/components/About/ReusableAboutArea";
import AboutPointArea from "@/components/About/AboutPointArea";
import TeamAgentsArea from "@/components/Agent/TeamAgentsArea";
import { Metadata } from "next";
import { getAcercaDeNosotrosConfig } from "@/lib/acerca-de-nosotros-config";

export const metadata: Metadata = {
  title: "Acerca de nosotros",
};

export default async function About() {
  let data;
  try {
    data = await getAcercaDeNosotrosConfig();
  } catch {
    data = null;
  }

  const titulo = data?.titulo?.trim() || "Acerca de nosotros";
  const imagenPrincipalUrl = data?.imagenPrincipal?.url ?? null;

  return (
    <>
      {/* breadcrumb area */}
      <BreadcrumbArea title={titulo} backgroundImageUrl={imagenPrincipalUrl} />
      {/* breadcrumb area end */}
      {/* about area */}
      <AboutHomeFive
        tituloSeccionRazones={data?.tituloSeccionRazones ?? undefined}
        textoSeccionRazones={data?.textoSeccionRazones ?? undefined}
        imagenPrincipalRazonesUrl={data?.imagenPrincipalRazones?.url ?? undefined}
        imagenSecundariaRazonesUrl={data?.imagenSecundariaRazones?.url ?? undefined}
      />
      {/* about area end */}
      {/* feature section */}
      <RealEstateHighlights
        sectionClass="tp-feature-5-ptb"
        paddingClass="pt-90"
        bgColor="#F0F4FD"
        imagenEncuentraTuFuturoUrl={data?.imagenEncuentraTuFuturo?.url ?? undefined}
        imagenCompraAlquilaUrl={data?.imagenCompraAlquila?.url ?? undefined}
        imagenListaTuPropiedadUrl={data?.imagenListaTuPropiedad?.url ?? undefined}
      />
      {/* feature section end */}
      {/* about point area */}
      <AboutPointArea
        informacionExcelencia={data?.informacionExcelencia ?? undefined}
        informacionLogros={data?.informacionLogros ?? undefined}
        informacionCalidad={data?.informacionCalidad ?? undefined}
        informacionTransparencia={data?.informacionTransparencia ?? undefined}
      />
      {/* about point area end */}
      {/* team area */}
      <TeamAgentsArea />
      {/* team area end*/}
      {/* Cómo hacemos esto fácil: texto + 3 propiedades con más favoritos */}
      <AboutTopFavoritosSection
        introText={data?.informacionExcelencia ?? undefined}
      />
      {/* realestate area end */}
      {/* testimonial area - misma sección que página principal (lo que dice la gente de nosotros) */}
      <HomeTestimonialArea backgroundImageUrl={imagenPrincipalUrl} />
      {/* testimonial area end */}
    </>
  );
}
