import { Metadata } from "next";
import MapaDinamicoBody from "./components/MapaDinamicoBody";

export const metadata: Metadata = {
  title: "Mapa dinamico - Enterprise",
};

export default function MapaDinamicoPage() {
  return <MapaDinamicoBody />;
}
