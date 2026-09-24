import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { Analytics } from "@/components/analytics/Analytics";
import { Motion } from "@/components/art/Motion";
import { PageVeil } from "@/components/brand/PageVeil";
import { EnquiryDialog } from "@/components/enquiry/EnquiryDialog";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileEnquiryBar } from "@/components/layout/MobileEnquiryBar";
import { PreviewNotice } from "@/components/layout/PreviewNotice";
import { FilmViewer } from "@/components/voices/FilmViewer";
import { site } from "@/content/site";

const description =
  "Personal guidance with Narayani Garg, The Life Strategist. Numerology, vastu and astrology, with the mind first. 15+ years of experience and 10,000+ clients across 5+ countries.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Narayani Garg | Transformation with NNG",
    template: "%s | Narayani Garg, Transformation with NNG",
  },
  description,
  // The site stays out of search until SITE_INDEXABLE=true is set at launch.
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Narayani Garg | Transformation with NNG",
    description,
    images: [{ url: "/images/og-narayani-garg.jpg", width: 1200, height: 630, alt: "Narayani Garg, The Life Strategist" }],
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf7f1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PreviewNotice />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileEnquiryBar />
        <EnquiryDialog />
        <FilmViewer />
        <PageVeil />
        <Motion />
        <Analytics />
      </body>
    </html>
  );
}
