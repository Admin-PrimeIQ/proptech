import AboutHomeMain from "@/components/About/AboutHomeMain";
import EnterprisePublicContent from "@/components/Enterprise/EnterprisePublicContent";
import { getPaginaInfoConfig } from "@/lib/pagina-info-config";
import { getInformacionPaginaItems } from "@/lib/informacion-pagina-items";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise - Marketplace Inmobiliario",
};

export default async function SolucionesEmpresarialesPage() {
  const [paginaInfo, infoItems] = await Promise.all([
    getPaginaInfoConfig(),
    getInformacionPaginaItems(),
  ]);

  return (
    <>
      <EnterprisePublicContent />
      <AboutHomeMain
        paginaInfo={paginaInfo}
        items={infoItems.map((item) => ({
          idPublic: item.idPublic,
          titulo: item.titulo,
          descripcion: item.descripcion,
          imagenUrl: item.imagen?.url ?? null,
        }))}
      />
    </>
  );
}
