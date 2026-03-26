import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://policyforge.site"),
  title: {
    default: "PolicyForge — Generate Legal Pages in Minutes",
    template: "%s | PolicyForge",
  },
  description:
    "Generate comprehensive Privacy Policies, Terms of Service, Cookie Policies, and more. Free, fast, and built for modern businesses. GDPR, CCPA, PIPEDA compliant.",
  keywords: [
    "privacy policy generator",
    "terms of service generator",
    "cookie policy generator",
    "GDPR privacy policy",
    "free privacy policy",
    "legal page generator",
    "CCPA privacy policy",
    "cookie consent",
    "refund policy generator",
  ],
  openGraph: {
    title: "PolicyForge — Generate Legal Pages in Minutes",
    description:
      "Generate comprehensive Privacy Policies, Terms of Service, and more. Free and fast.",
    type: "website",
    siteName: "PolicyForge",
    url: "https://policyforge.site",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolicyForge — Generate Legal Pages in Minutes",
    description: "Free privacy policy, terms of service, and cookie policy generator. GDPR & CCPA compliant.",
  },
  alternates: {
    canonical: "https://policyforge.site",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PolicyForge",
  applicationCategory: "BusinessApplication",
  description: "Generate comprehensive privacy policies, terms of service, cookie policies, and more.",
  url: "https://policyforge.site",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
    },
    {
      "@type": "Offer",
      price: "9",
      priceCurrency: "USD",
      name: "Starter",
      priceValidUntil: "2027-12-31",
    },
    {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      name: "Business",
      priceValidUntil: "2027-12-31",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
