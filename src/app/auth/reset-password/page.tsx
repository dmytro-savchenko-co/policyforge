"use client";

import { useState, useEffect } from "react";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase handles the token from the URL automatically
    // when the user clicks the reset link
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <section className="py-20">
        <div className="max-w-sm mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Coming Soon</h1>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="py-20">
        <div className="max-w-sm mx-auto px-4 text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Password updated</h1>
          <p className="mt-2 text-muted">
            Your password has been changed. Redirecting to dashboard...
          </p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase!.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="mt-1 text-sm text-muted">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Min. 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Repeat password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
