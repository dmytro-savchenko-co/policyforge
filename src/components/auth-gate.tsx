"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getLocalGenerationCount, canGenerate } from "@/lib/usage";
import { UpgradePrompt } from "./upgrade-prompt";
import type { User } from "@supabase/supabase-js";

interface AuthGateProps {
  children: (props: { isPaid: boolean; onGenerated: () => void }) => React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [genCount, setGenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [overLimit, setOverLimit] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured() || !supabase) {
        // Supabase not configured — fall back to localStorage tracking
        const count = getLocalGenerationCount();
        setGenCount(count);
        setOverLimit(!canGenerate("free", count));
        setLoading(false);
        return;
      }

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        // TODO: fetch plan from Supabase profiles table when it exists
        // For now, default to "free" plan for all authenticated users
        const userPlan = "free";
        setPlan(userPlan);
        const count = getLocalGenerationCount();
        setGenCount(count);
        setOverLimit(!canGenerate(userPlan, count));
      }
      setLoading(false);
    }

    checkAuth();
  }, []);

  const handleGenerated = () => {
    const newCount = genCount + 1;
    setGenCount(newCount);
    if (!canGenerate(plan, newCount)) {
      setOverLimit(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // If Supabase is configured and user not logged in, show signup prompt
  if (isSupabaseConfigured() && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Sign up to generate policies</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Create a free account to generate your first policy. It only takes a minute.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/signup"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
          >
            Sign Up Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login"
            className="border border-border px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors text-center"
          >
            Log In
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted">
          Free plan includes 1 template-based policy generation.
        </p>
      </div>
    );
  }

  // Over limit
  if (overLimit) {
    return <UpgradePrompt />;
  }

  const isPaid = plan === "starter" || plan === "business";
  return <>{children({ isPaid, onGenerated: handleGenerated })}</>;
}
