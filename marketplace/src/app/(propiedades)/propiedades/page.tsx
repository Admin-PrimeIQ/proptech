import PropertyTwoArea from "@/components/Propiedades/PropertyStyleTwo/PropertyTwoArea";
import PropertyLayout from "@/components/Layout/PropertyLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades - Marketplace Inmobiliario",
};

export default function PropiedadesPage() {
  return (
    <>
      <PropertyLayout>
        <PropertyTwoArea />
      </PropertyLayout>
    </>
  );
}
