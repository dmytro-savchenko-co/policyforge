"use client";

import Link from "next/link";
import { Shield, Plus, FileText } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <section className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Dashboard Coming Soon</h1>
          <p className="mt-2 text-muted">
            The dashboard for managing your saved policies is coming soon. For
            now, generate and download your policies directly.
          </p>
          <Link
            href="/generator"
            className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Generate a Policy
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
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

        <div className="border border-border rounded-2xl p-12 text-center bg-white">
          <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
          <h2 className="text-lg font-semibold">No policies yet</h2>
          <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
            Generate your first policy to see it here. You can save, edit, and
            download your policies anytime.
          </p>
          <Link
            href="/generator"
            className="mt-6 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Generate Your First Policy
          </Link>
        </div>
      </div>
    </section>
  );
}
