import { Metadata } from "next";
import LifestyleMatcherBody from "./components/LifestyleMatcherBody";

export const metadata: Metadata = {
  title: "Lifestyle Matcher - Marketplace Inmobiliario",
};

export default function LifestyleMatcherPage() {
  return <LifestyleMatcherBody />;
}
