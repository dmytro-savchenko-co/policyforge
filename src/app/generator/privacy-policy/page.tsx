import type { Metadata } from "next";
import { PrivacyPolicyClient } from "./client";

export const metadata: Metadata = {
  title: "Free Privacy Policy Generator — GDPR, CCPA, PIPEDA Compliant | PolicyForge",
  description:
    "Generate a privacy policy for your website or app in 2 minutes. Covers GDPR, CCPA, PIPEDA provisions. Attorney review recommended.",
  openGraph: {
    title: "Free Privacy Policy Generator — PolicyForge",
    description: "Generate a GDPR & CCPA compliant privacy policy in 2 minutes. Free.",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
