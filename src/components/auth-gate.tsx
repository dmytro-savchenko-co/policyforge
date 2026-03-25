"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import {
  supabase,
  isSupabaseConfigured,
  getUserProfile,
  canUserGenerate,
  type UserProfile,
} from "@/lib/supabase";
import { getLocalGenerationCount, canGenerate } from "@/lib/usage";
import { UpgradePrompt } from "./upgrade-prompt";
import type { User } from "@supabase/supabase-js";

interface AuthGateProps {
  children: (props: {
    isPaid: boolean;
    userId: string | null;
    onGenerated: () => void;
  }) => React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [overLimit, setOverLimit] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured() || !supabase) {
        // Supabase not configured — fall back to localStorage tracking
        const count = getLocalGenerationCount();
        setOverLimit(!canGenerate("free", count));
        setLoading(false);
        return;
      }

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);

        if (userProfile) {
          const allowed = await canUserGenerate(userProfile);
          setOverLimit(!allowed);
        }
      }
      setLoading(false);
    }

    checkAuth();
  }, []);

  const handleGenerated = () => {
    if (profile) {
      setProfile({ ...profile, generation_count: profile.generation_count + 1 });
      const limit =
        profile.plan === "business"
          ? Infinity
          : profile.plan === "starter"
            ? 3
            : 1;
      if (profile.generation_count + 1 >= limit) {
        setOverLimit(true);
      }
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
          Create a free account to generate your first policy. It only takes a
          minute.
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

  const isPaid =
    profile?.plan === "starter" || profile?.plan === "business";
  return (
    <>
      {children({
        isPaid,
        userId: user?.id || null,
        onGenerated: handleGenerated,
      })}
    </>
  );
}
