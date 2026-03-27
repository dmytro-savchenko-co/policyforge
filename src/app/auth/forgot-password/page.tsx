"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

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

  if (sent) {
    return (
      <section className="py-20">
        <div className="max-w-sm mx-auto px-4 text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-muted">
            We sent a password reset link to <strong>{email}</strong>.
            Click the link in the email to set a new password.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-primary font-medium hover:underline text-sm"
          >
            Back to login
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
