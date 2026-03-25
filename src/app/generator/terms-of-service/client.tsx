"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateTermsOfService } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function TermsClient() {
  return (
    <AuthGate>
      {({ isPaid, userId, onGenerated }) => (
        <PolicyWizard
          policyType="terms-of-service"
          title="Terms of Service"
          onGenerate={generateTermsOfService}
          isPaid={isPaid}
          userId={userId}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
