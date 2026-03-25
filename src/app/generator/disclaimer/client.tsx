"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateDisclaimer } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function DisclaimerClient() {
  return (
    <AuthGate>
      {({ isPaid, userId, onGenerated }) => (
        <PolicyWizard
          policyType="disclaimer"
          title="Disclaimer"
          onGenerate={generateDisclaimer}
          isPaid={isPaid}
          userId={userId}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
