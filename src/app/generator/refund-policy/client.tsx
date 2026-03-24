"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateRefundPolicy } from "@/lib/policy-templates";

export function RefundClient() {
  return (
    <PolicyWizard
      policyType="refund-policy"
      title="Refund Policy"
      onGenerate={generateRefundPolicy}
    />
  );
}
