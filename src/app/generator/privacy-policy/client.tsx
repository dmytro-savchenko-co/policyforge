"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generatePrivacyPolicy } from "@/lib/policy-templates";

export function PrivacyPolicyClient() {
  return (
    <PolicyWizard
      policyType="privacy-policy"
      title="Privacy Policy"
      onGenerate={generatePrivacyPolicy}
    />
  );
}
