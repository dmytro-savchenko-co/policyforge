import type { Metadata } from "next";
import { AcceptableUseClient } from "./client";

export const metadata: Metadata = {
  title: "Free Acceptable Use Policy Generator | PolicyForge",
  description:
    "Generate a free Acceptable Use Policy (AUP) for your website, app, or platform. Define what users can and cannot do on your service.",
  openGraph: {
    title: "Free Acceptable Use Policy Generator — PolicyForge",
    description: "Generate a professional AUP for your platform in minutes. Free.",
  },
};

export default function AcceptableUsePage() {
  return <AcceptableUseClient />;
}
