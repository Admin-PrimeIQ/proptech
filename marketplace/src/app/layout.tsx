import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import GlobalVideoModal from "@/components/Popup/GlobalVideoModal";
import { VideoProvider } from "@/provider/VideoProvider";
import AppProvider from "@/provider/AppProvider";
import ReduxProvider from "@/redux/provider";
import SessionProvider from "@/provider/SessionProvider";
import SEOHead from "@/components/SEO/SEOHead";
import "slick-carousel/slick/slick.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "swiper/css/bundle";
import "./globals.scss";
import LayoutStripDebug from "@/components/Common/LayoutStripDebug";


// Load Plus Jakarta Sans from Google Fonts
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Load Inter (sans) & JetBrains Mono — reemplazan Geist/Geist_Mono (no disponibles en next/font)
const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhumi - Real Estate React NextJs Template",
  description: "Bhumi is a modern, highly customizable Next.js theme designed for real estate businesses, agencies, and property listings, offering a seamless and user-friendly experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${plusJakartaSans.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <SEOHead />
        <ReduxProvider>
          <SessionProvider>
            <VideoProvider>
              <AppProvider>
                {children}
                <LayoutStripDebug />
              </AppProvider>
              <Toaster position="top-center" richColors />
              <GlobalVideoModal />
            </VideoProvider>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
