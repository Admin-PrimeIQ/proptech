import { Metadata } from "next";
import MapaAbsorcionBody from "./components/MapaAbsorcionBody";

export const metadata: Metadata = {
  title: "Mapa de absorcion - Enterprise",
};

export default function MapaAbsorcionPage() {
  return <MapaAbsorcionBody />;
}
