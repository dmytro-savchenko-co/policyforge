import type { Metadata } from "next";
import { AccessibilityClient } from "./client";

export const metadata: Metadata = {
  title: "Free Accessibility Statement Generator — ADA/WCAG | PolicyForge",
  description:
    "Generate a free accessibility statement for your website. Demonstrate your commitment to ADA and WCAG compliance.",
  openGraph: {
    title: "Free Accessibility Statement Generator — PolicyForge",
    description: "Generate an ADA/WCAG accessibility statement in minutes. Free.",
  },
};

export default function AccessibilityPage() {
  return <AccessibilityClient />;
}
