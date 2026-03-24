import type { PolicyFormData } from "./policy-templates";

export async function generatePolicyWithAI(
  policyType: string,
  formData: PolicyFormData
): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ policyType, formData }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to generate policy");
  }

  const data = await res.json();
  return data.html;
}
