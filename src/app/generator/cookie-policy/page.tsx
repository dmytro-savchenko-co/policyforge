"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateCookiePolicy } from "@/lib/policy-templates";

export default function CookiePolicyPage() {
  return (
    <PolicyWizard
      policyType="cookie-policy"
      title="Cookie Policy"
      onGenerate={generateCookiePolicy}
    />
  );
}
