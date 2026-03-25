"use client";

import { PolicyWizard } from "@/components/policy-wizard";
import { generatePrivacyPolicy } from "@/lib/policy-templates";
import { AuthGate } from "@/components/auth-gate";

export function PrivacyPolicyClient() {
  return (
    <AuthGate>
      {({ isPaid, userId, onGenerated }) => (
        <PolicyWizard
          policyType="privacy-policy"
          title="Privacy Policy"
          onGenerate={generatePrivacyPolicy}
          isPaid={isPaid}
          userId={userId}
          onGenerated={onGenerated}
        />
      )}
    </AuthGate>
  );
}
