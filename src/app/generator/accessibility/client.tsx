"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateAccessibility } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function AccessibilityClient() {
  return (
    <AuthGate>
      {({ isPaid, userId, onGenerated }) => (
        <PolicyWizard
          policyType="accessibility"
          title="Accessibility Statement"
          onGenerate={generateAccessibility}
          isPaid={isPaid}
          userId={userId}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
