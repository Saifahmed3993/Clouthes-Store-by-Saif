import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/utils/cn";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Clouthes | Premium T-Shirt Store",
    template: "%s | Clouthes"
  },
  description: "Premium everyday t-shirts, responsibly sourced and built for real life.",
  applicationName: "Clouthes",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Clouthes",
    title: "Clouthes | Premium T-Shirt Store",
    description: "Premium everyday t-shirts, responsibly sourced and built for real life.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Premium white t-shirt on a model"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Clouthes | Premium T-Shirt Store",
    description: "Premium everyday t-shirts, responsibly sourced and built for real life."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, spaceGrotesk.variable, "font-sans antialiased")}>
        <Providers>
          <JsonLd />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
