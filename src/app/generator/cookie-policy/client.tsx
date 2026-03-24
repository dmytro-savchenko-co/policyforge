"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateCookiePolicy } from "@/lib/policy-templates";

export function CookieClient() {
  return (
    <PolicyWizard
      policyType="cookie-policy"
      title="Cookie Policy"
      onGenerate={generateCookiePolicy}
    />
  );
}
