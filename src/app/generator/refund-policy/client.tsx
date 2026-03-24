"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateRefundPolicy } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function RefundClient() {
  return (
    <AuthGate>
      {({ isPaid, onGenerated }) => (
        <PolicyWizard
          policyType="refund-policy"
          title="Refund Policy"
          onGenerate={generateRefundPolicy}
          isPaid={isPaid}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
