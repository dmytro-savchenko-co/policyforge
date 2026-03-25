"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateEULA } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function EULAClient() {
  return (
    <AuthGate>
      {({ isPaid, userId, onGenerated }) => (
        <PolicyWizard
          policyType="eula"
          title="End-User License Agreement"
          onGenerate={generateEULA}
          isPaid={isPaid}
          userId={userId}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
