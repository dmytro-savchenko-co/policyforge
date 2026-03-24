"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generatePrivacyPolicy } from "@/lib/policy-templates";

export default function PrivacyPolicyPage() {
  return (
    <PolicyWizard
      policyType="privacy-policy"
      title="Privacy Policy"
      onGenerate={generatePrivacyPolicy}
    />
  );
}
