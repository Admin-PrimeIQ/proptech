"use client";

import GoogleMapAdapter from "./GoogleMapAdapter";
import type { MapComponentProps } from "./mapEngine.types";

export default function MapContainer(props: MapComponentProps) {
  return <GoogleMapAdapter {...props} />;
}
