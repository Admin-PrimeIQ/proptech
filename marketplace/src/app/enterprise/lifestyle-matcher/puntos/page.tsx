import { Metadata } from "next";
import LifestyleMatcherPointsBody from "./components/LifestyleMatcherPointsBody";

export const metadata: Metadata = {
  title: "Lifestyle Matcher - Paso 2",
};

export default function LifestyleMatcherPointsPage() {
  return <LifestyleMatcherPointsBody />;
}
