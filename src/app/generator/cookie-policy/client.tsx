"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generateCookiePolicy } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function CookieClient() {
  return (
    <AuthGate>
      {({ isPaid, onGenerated }) => (
        <PolicyWizard
          policyType="cookie-policy"
          title="Cookie Policy"
          onGenerate={generateCookiePolicy}
          isPaid={isPaid}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
