import type { Metadata } from "next";
import { EULAClient } from "./client";

export const metadata: Metadata = {
  title: "Free EULA Generator — Software License Agreement | PolicyForge",
  description:
    "Generate a free End-User License Agreement (EULA) for your software, app, or SaaS product. Protect your intellectual property and define usage terms.",
  openGraph: {
    title: "Free EULA Generator — PolicyForge",
    description: "Generate a professional EULA for your software in minutes. Free.",
  },
};

export default function EULAPage() {
  return <EULAClient />;
}
