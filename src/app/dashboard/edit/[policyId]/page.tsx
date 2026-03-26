"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Sparkles, FileText, Check } from "lucide-react";
import {
  supabase,
  isSupabaseConfigured,
  getCurrentUser,
  type SavedPolicy,
} from "@/lib/supabase";
import { PolicyEditor } from "@/components/policy-editor";

export default function PolicyEditPage() {
  const params = useParams();
  const policyId = params.policyId as string;

  const [policy, setPolicy] = useState<SavedPolicy | null>(null);
  const [editedHtml, setEditedHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured() || !supabase) {
        setError("Supabase not configured");
        setLoading(false);
        return;
      }

      const user = await getCurrentUser();
      if (!user) {
        setError("Please sign in to edit policies");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("generated_policies")
        .select("*")
        .eq("id", policyId)
        .eq("user_id", user.id)
        .single();

      if (fetchError || !data) {
        setError("Policy not found");
        setLoading(false);
        return;
      }

      setPolicy(data as SavedPolicy);
      setEditedHtml(data.generated_html);
      setLoading(false);
    }
    load();
  }, [policyId]);

  const handleSave = async () => {
    if (!supabase || !policy) return;
    setSaving(true);
    setSaved(false);

    const { error: updateError } = await supabase
      .from("generated_policies")
      .update({
        generated_html: editedHtml,
        updated_at: new Date().toISOString(),
      })
      .eq("id", policy.id);

    setSaving(false);

    if (updateError) {
      setError("Failed to save. Please try again.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <section className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">{error || "Policy not found"}</h1>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  const POLICY_TYPE_LABELS: Record<string, string> = {
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service",
    "cookie-policy": "Cookie Policy",
    "refund-policy": "Refund Policy",
    eula: "EULA",
    disclaimer: "Disclaimer",
    "acceptable-use": "Acceptable Use Policy",
    "shipping-policy": "Shipping Policy",
    accessibility: "Accessibility Statement",
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">
              Edit: {POLICY_TYPE_LABELS[policy.policy_type] || policy.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted">{policy.business_name}</p>
              {policy.ai_generated ? (
                <span className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> AI-Tailored
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-muted text-xs font-medium px-2 py-0.5 rounded-full">
                  <FileText className="w-3 h-3" /> Basic Template
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>

        {/* Editor */}
        <PolicyEditor html={editedHtml} onChange={setEditedHtml} />
      </div>
    </section>
  );
}
