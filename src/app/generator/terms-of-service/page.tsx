"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateTermsOfService } from "@/lib/policy-templates";

export default function TermsOfServicePage() {
  return (
    <PolicyWizard
      policyType="terms-of-service"
      title="Terms of Service"
      onGenerate={generateTermsOfService}
    />
  );
}
