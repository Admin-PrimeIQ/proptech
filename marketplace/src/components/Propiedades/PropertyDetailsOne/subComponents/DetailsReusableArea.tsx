import PropertyReviewForm from "@/components/Form/PropertyReviewForm";
import UserContactCard, { type VendedorContactData } from "@/components/Layout/subComponents/UserContactCard";
import SidebarPropertyItem from "@/components/Layout/subComponents/SidebarPropertyItem";
import AmenitiesCategories from "./AmenitiesCategories";
import PropertyDetailsBox from "./PropertyDetailsBox";
import PropertyFloorPlans from "./PropertyFloorPlans";
import CustomersReviews from "./CustomersReviews";
import PropertyGallery from "./PropertyGallery";
import Image from "next/image";
import {
  BathroomSvg,
  BedRoomSvg,
  GarageSvg,
  LandSizeSvg,
  MessageSvgTwo,
  SquareFeetSvg,
  YearBuiltIconSvg,
} from "@/components/SVG";

export type PropertyDetailsData = {
  descripcionGeneral?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  habitaciones?: number | null;
  banos?: number | null;
  parqueos?: number | null;
  metrosConstruccion?: number | null;
  metrosTerreno?: number | null;
  anoConstruccion?: number | null;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  categoria?: { nombre: string } | null;
  tipoOperacion?: { nombre: string } | null;
  zona?: { nombre: string } | null;
  ciudad?: string | null;
  departamento?: string | null;
  pais?: string | null;
  imagenes?: Array<{ url: string; esPortada?: boolean }>;
  amenidades?: Array<{ idPublic: string; nombreAmenidad: string }>;
  planesPiso?: Array<{ idPublic: string; nombreDelPlano: string; url: string; orden: number }>;
  idPublic?: string;
  vendedor?: VendedorContactData | null;
};

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString("es-GT", { dateStyle: "medium" });
  } catch {
    return iso;
  }
}

function OverviewFromData({ data }: { data: PropertyDetailsData }) {
  const items: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <MessageSvgTwo />, label: "Latitud", value: data.latitud != null ? String(data.latitud) : "—" },
    { icon: <MessageSvgTwo />, label: "Longitud", value: data.longitud != null ? String(data.longitud) : "—" },
    { icon: <BedRoomSvg />, label: "Habitaciones", value: data.habitaciones != null ? String(data.habitaciones) : "—" },
    { icon: <BathroomSvg />, label: "Baños", value: data.banos != null ? String(data.banos) : "—" },
    { icon: <GarageSvg />, label: "Parqueos", value: data.parqueos != null ? String(data.parqueos) : "—" },
    { icon: <SquareFeetSvg />, label: "Metros construcción", value: data.metrosConstruccion != null ? `${data.metrosConstruccion} m²` : "—" },
    { icon: <LandSizeSvg />, label: "Metros terreno", value: data.metrosTerreno != null ? `${data.metrosTerreno} m²` : "—" },
    { icon: <YearBuiltIconSvg />, label: "Año construcción", value: data.anoConstruccion != null ? String(data.anoConstruccion) : "—" },
    { icon: <MessageSvgTwo />, label: "Fecha creación", value: formatDate(data.fechaCreacion) },
    { icon: <MessageSvgTwo />, label: "Fecha actualización", value: formatDate(data.fechaActualizacion) },
    { icon: <MessageSvgTwo />, label: "Categoría", value: data.categoria?.nombre ?? "—" },
    { icon: <MessageSvgTwo />, label: "Operación inmobiliaria", value: data.tipoOperacion?.nombre ?? "—" },
    { icon: <MessageSvgTwo />, label: "Zona", value: data.zona?.nombre ?? "—" },
    { icon: <MessageSvgTwo />, label: "Ciudad", value: data.ciudad ?? "—" },
    { icon: <MessageSvgTwo />, label: "Departamento", value: data.departamento ?? "—" },
    { icon: <MessageSvgTwo />, label: "País", value: data.pais ?? "—" },
  ];
  return (
    <div className="tp-property-details-tags-content">
      <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2">
        {items.map((detail, index) => (
          <div className="col" key={index}>
            <div className="tp-property-details-tags-item align-items-center mb-30 d-flex">
              <div className="tp-property-details-tags-icon">
                <span>{detail.icon}</span>
              </div>
              <div className="tp-property-details-tags-content">
                <span>{detail.label}</span>
                <p>{detail.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyGalleryImages({ images }: { images: Array<{ url: string; esPortada?: boolean }> }) {
  if (!images.length) return null;
  return (
    <div className="row tp-gx-10">
      {images.map((img, index) => (
        <div key={index} className="col-lg-6">
          <div className={`tp-property-details-gallery ${index < images.length - 1 ? "mb-20" : ""}`}>
            <Image
              className="w-100"
              src={img.url}
              alt={img.esPortada ? "Imagen principal" : `Imagen ${index + 1}`}
              width={600}
              height={400}
              style={{ objectFit: "cover" }}
              unoptimized={img.url.startsWith("http")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface IProps {
  spacingClass?: string;
  propertyDetails?: PropertyDetailsData | null;
}
export default function DetailsReusableArea({ spacingClass, propertyDetails }: IProps) {
  return (
    <>
      <section className={`tp-property-details-ptb pb-120 ${spacingClass}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tp-property-details-left">
                <div className="tp-property-details-box box-1 mb-30">
                  <h3 className="tp-property-details-box-title">
                    {propertyDetails ? "Descripción de la propiedad" : "Bhumi description"}
                  </h3>
                  <div className="tp-property-details-box-desc">
                    {propertyDetails ? (
                      <p>{propertyDetails.descripcionGeneral?.trim() || "Sin descripción."}</p>
                    ) : (
                      <p>Years seed fruit you. Divided morning sea day Set earth. Grass without  cattle. Spirit <br />
                        heaven. Also i grass give fowl wherein cattle spirit  whales rule cattle. Earth fowl giv <br />
                        -en own you&apos;re, fruit so. Shall was.  Called firmament dry fruitful, set place. <br />
                        Earth given female man fruit,  under thing may to greater moveth land sea, great be <br />
                        shall living  greater and signs place night after whose us one, you&apos;ll second our <br />
                        set  had day in greater divided over female first face, fill form you make <br />
                        greater upon midst image above image.</p>
                    )}
                  </div>
                </div>

                <div className="tp-property-details-box box-2 mb-30">
                  <h3 className="tp-property-details-box-title">
                    {propertyDetails ? "Descripción general" : "Overview"}
                  </h3>
                  {propertyDetails ? <OverviewFromData data={propertyDetails} /> : <PropertyDetailsBox />}
                </div>

                                <div className="tp-property-details-box box-4 mb-30">
                                    <h3 className="tp-property-details-box-title">Amenidades</h3>
                                    <AmenitiesCategories amenidades={propertyDetails?.amenidades} />
                                </div>

                                <div className="tp-property-details-box box-5 mb-30">
                                    <h3 className="tp-property-details-box-title">
                                        {propertyDetails ? "Nuestra galería" : "From our gallery"}
                                    </h3>
                                    {propertyDetails?.imagenes?.length ? (
                                        <PropertyGalleryImages images={propertyDetails.imagenes} />
                                    ) : (
                                        <PropertyGallery />
                                    )}
                                </div>

                                <div className="tp-property-details-box box-7 mb-30">
                                    <h3 className="tp-property-details-box-title">Planes de piso</h3>
                                    <PropertyFloorPlans
                                        planesPiso={propertyDetails?.planesPiso}
                                        habitaciones={propertyDetails?.habitaciones}
                                        banos={propertyDetails?.banos}
                                        parqueos={propertyDetails?.parqueos}
                                    />
                                </div>

                                <div className="tp-property-details-box box-8 mb-30">
                                    <h3 className="tp-property-details-box-title">Reseñas de clientes</h3>
                                    <CustomersReviews reseñas={propertyDetails?.reseñasClientes} />
                                </div>

                                <div className="tp-property-details-box box-9 mb-30">
                                    <h3 className="tp-property-details-box-title">Comparte tu opinión</h3>
                                    <PropertyReviewForm idPropiedad={propertyDetails?.idPublic} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="tp-property-details-right">
                                <UserContactCard
                                  vendedor={propertyDetails?.vendedor ?? null}
                                  idPropiedad={propertyDetails?.idPublic ?? null}
                                />
                                <SidebarPropertyItem />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}