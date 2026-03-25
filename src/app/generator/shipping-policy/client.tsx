"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateShippingPolicy } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function ShippingPolicyClient() {
  return (
    <AuthGate>
      {({ isPaid, userId, onGenerated }) => (
        <PolicyWizard
          policyType="shipping-policy"
          title="Shipping Policy"
          onGenerate={generateShippingPolicy}
          isPaid={isPaid}
          userId={userId}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
