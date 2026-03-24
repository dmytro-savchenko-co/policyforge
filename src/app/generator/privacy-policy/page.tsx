import type { Metadata } from "next";
import { PrivacyPolicyClient } from "./client";

export const metadata: Metadata = {
  title: "Free Privacy Policy Generator — GDPR, CCPA, PIPEDA Compliant | PolicyForge",
  description:
    "Generate a free, legally compliant privacy policy for your website or app in 2 minutes. GDPR, CCPA, PIPEDA compliant. No lawyer needed.",
  openGraph: {
    title: "Free Privacy Policy Generator — PolicyForge",
    description: "Generate a GDPR & CCPA compliant privacy policy in 2 minutes. Free.",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
