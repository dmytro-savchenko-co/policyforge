"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Plus, FileText, Download, Trash2, Loader2, Sparkles, Crown } from "lucide-react";
import {
  supabase,
  isSupabaseConfigured,
  getCurrentUser,
  getUserProfile,
  getUserPolicies,
  deletePolicy,
  type UserProfile,
  type SavedPolicy,
} from "@/lib/supabase";

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

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  business: Infinity,
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [policies, setPolicies] = useState<SavedPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const [prof, pols] = await Promise.all([
        getUserProfile(user.id),
        getUserPolicies(user.id),
      ]);
      setProfile(prof);
      setPolicies(pols);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this policy? This cannot be undone.")) return;
    setDeleting(id);
    const ok = await deletePolicy(id);
    if (ok) {
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  };

  const handleDownload = (policy: SavedPolicy) => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${policy.title} - ${policy.business_name}</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;line-height:1.6;color:#1a1a1a}h1{font-size:28px;border-bottom:2px solid #e5e7eb;padding-bottom:12px}h2{font-size:20px;margin-top:32px;color:#1e40af}h3{font-size:16px;margin-top:24px}ul{padding-left:24px}li{margin-bottom:8px}a{color:#2563eb}p{margin:12px 0}</style>
</head><body>${policy.generated_html}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policy.policy_type}-${policy.business_name.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isSupabaseConfigured() || !profile) {
    return (
      <section className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Sign in to view your dashboard</h1>
          <p className="mt-2 text-muted">
            Log in or create an account to manage your generated policies.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/auth/login"
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="border border-border px-6 py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const limit = PLAN_LIMITS[profile.plan] ?? 1;
  const used = profile.generation_count;
  const isPaid = profile.plan !== "free";

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Policies</h1>
            <p className="mt-1 text-sm text-muted">
              Manage your generated legal documents
            </p>
          </div>
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> New Policy
          </Link>
        </div>

        {/* Plan + Usage Card */}
        <div className="border border-border rounded-2xl p-5 bg-white mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              {isPaid ? (
                <Crown className="w-5 h-5 text-primary" />
              ) : (
                <Shield className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold capitalize">{profile.plan} Plan</p>
              <p className="text-sm text-muted">
                {limit === Infinity
                  ? `${used} policies generated`
                  : `${used} / ${limit} generations used`}
                {profile.plan === "starter" && " this month"}
              </p>
            </div>
          </div>
          {!isPaid && (
            <Link
              href="/pricing"
              className="text-sm text-primary font-medium hover:underline"
            >
              Upgrade
            </Link>
          )}
        </div>

        {/* Policies List */}
        {policies.length === 0 ? (
          <div className="border border-border rounded-2xl p-12 text-center bg-white">
            <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
            <h2 className="text-lg font-semibold">No policies yet</h2>
            <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
              Generate your first policy to see it here.
            </p>
            <Link
              href="/generator"
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Generate Your First Policy
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="border border-border rounded-xl p-4 bg-white flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">
                      {POLICY_TYPE_LABELS[policy.policy_type] || policy.title}
                    </h3>
                    {policy.ai_generated && (
                      <span className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0">
                        <Sparkles className="w-3 h-3" /> AI
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted truncate">
                    {policy.business_name} &middot;{" "}
                    {new Date(policy.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(policy)}
                    className="p-2 text-muted hover:text-foreground transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(policy.id)}
                    disabled={deleting === policy.id}
                    className="p-2 text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === policy.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
