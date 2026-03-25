"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateAcceptableUse } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function AcceptableUseClient() {
  return (
    <AuthGate>
      {({ isPaid, userId, onGenerated }) => (
        <PolicyWizard
          policyType="acceptable-use"
          title="Acceptable Use Policy"
          onGenerate={generateAcceptableUse}
          isPaid={isPaid}
          userId={userId}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
