import { createClient } from "@supabase/supabase-js";
import type { PolicyFormData } from "./policy-templates";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// --- Auth helpers ---

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export interface UserProfile {
  id: string;
  plan: "free" | "starter" | "business";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  generation_count: number;
  generation_reset_at: string;
  created_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as UserProfile;
}

// --- Policy helpers ---

export interface SavedPolicy {
  id: string;
  user_id: string;
  policy_type: string;
  title: string;
  business_name: string;
  website_url: string;
  form_data: PolicyFormData;
  generated_html: string;
  ai_generated: boolean;
  embed_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export async function saveGeneratedPolicy(
  userId: string,
  policyType: string,
  title: string,
  formData: PolicyFormData,
  generatedHtml: string,
  aiGenerated: boolean
): Promise<SavedPolicy | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("generated_policies")
    .insert({
      user_id: userId,
      policy_type: policyType,
      title,
      business_name: formData.businessName,
      website_url: formData.websiteUrl,
      form_data: formData,
      generated_html: generatedHtml,
      ai_generated: aiGenerated,
    })
    .select()
    .single();
  if (error) {
    console.error("Error saving policy:", error);
    return null;
  }
  return data as SavedPolicy;
}

export async function getUserPolicies(userId: string): Promise<SavedPolicy[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("generated_policies")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data || []) as SavedPolicy[];
}

export async function deletePolicy(policyId: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from("generated_policies")
    .delete()
    .eq("id", policyId);
  return !error;
}

// --- Usage helpers ---

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  business: Infinity,
};

export async function canUserGenerate(profile: UserProfile): Promise<boolean> {
  const limit = PLAN_LIMITS[profile.plan] ?? 1;

  // Check if we need to reset monthly count (for starter plan)
  if (profile.plan === "starter") {
    const resetDate = new Date(profile.generation_reset_at);
    const now = new Date();
    const monthsSinceReset =
      (now.getFullYear() - resetDate.getFullYear()) * 12 +
      (now.getMonth() - resetDate.getMonth());
    if (monthsSinceReset >= 1) {
      // Reset count
      if (supabase) {
        await supabase
          .from("profiles")
          .update({ generation_count: 0, generation_reset_at: now.toISOString() })
          .eq("id", profile.id);
      }
      return true;
    }
  }

  return profile.generation_count < limit;
}

export async function incrementGenerationCount(userId: string): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase
    .from("profiles")
    .select("generation_count")
    .eq("id", userId)
    .single();
  if (data) {
    await supabase
      .from("profiles")
      .update({
        generation_count: (data.generation_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  }
}
