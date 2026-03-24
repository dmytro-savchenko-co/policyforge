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
  title: "PolicyForge — Generate Legal Pages in Minutes",
  description:
    "Generate legally compliant Privacy Policies, Terms of Service, Cookie Policies, and more. Free, fast, and built for modern businesses. GDPR, CCPA, PIPEDA compliant.",
  keywords: [
    "privacy policy generator",
    "terms of service generator",
    "cookie policy generator",
    "GDPR privacy policy",
    "free privacy policy",
    "legal page generator",
  ],
  openGraph: {
    title: "PolicyForge — Generate Legal Pages in Minutes",
    description:
      "Generate legally compliant Privacy Policies, Terms of Service, and more. Free and fast.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
