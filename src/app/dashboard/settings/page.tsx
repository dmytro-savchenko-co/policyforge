"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, Key, Trash2, AlertTriangle, LogOut } from "lucide-react";
import {
  supabase,
  isSupabaseConfigured,
  getCurrentUser,
  getUserProfile,
  type UserProfile,
} from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }
      const u = await getCurrentUser();
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.id);
        setProfile(p);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleResetPassword = async () => {
    if (!supabase || !user?.email) return;
    setResetLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      user.email,
      { redirectTo: `${window.location.origin}/auth/reset-password` }
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
    setResetLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE" || !supabase || !user) return;
    setDeleteLoading(true);
    setError("");

    try {
      // Sign out and delete via API
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }
      await supabase.auth.signOut();
      router.push("/?deleted=true");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isSupabaseConfigured() || !user) {
    return (
      <section className="py-20">
        <div className="max-w-sm mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Sign in required</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Account Info */}
        <div className="border border-border rounded-2xl p-6 bg-white mb-6">
          <h2 className="font-semibold mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Plan</span>
              <span className="capitalize font-medium">{profile?.plan || "free"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Member since</span>
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Reset Password */}
        <div className="border border-border rounded-2xl p-6 bg-white mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-muted" />
            <h2 className="font-semibold">Password</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            We&apos;ll send a password reset link to your email.
          </p>
          {resetSent ? (
            <p className="text-sm text-success font-medium">
              Reset link sent to {user.email}. Check your inbox.
            </p>
          ) : (
            <button
              onClick={handleResetPassword}
              disabled={resetLoading}
              className="text-sm bg-secondary border border-border px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {resetLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              Send Reset Link
            </button>
          )}
        </div>

        {/* Sign Out */}
        <div className="border border-border rounded-2xl p-6 bg-white mb-6">
          <div className="flex items-center gap-2 mb-2">
            <LogOut className="w-4 h-4 text-muted" />
            <h2 className="font-semibold">Sign Out</h2>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm bg-secondary border border-border px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Delete Account */}
        <div className="border border-red-200 rounded-2xl p-6 bg-red-50/30">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="w-4 h-4 text-red-500" />
            <h2 className="font-semibold text-red-700">Delete Account</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            Permanently delete your account and all generated policies. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete my account
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  This will permanently delete your account, all generated policies,
                  and cancel any active subscription. Type <strong>DELETE</strong> to confirm.
                </p>
              </div>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder='Type "DELETE" to confirm'
                className="w-full border border-red-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || deleteLoading}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {deleteLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Permanently Delete
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                  className="text-sm border border-border px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
