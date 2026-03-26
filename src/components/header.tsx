"use client";

import Link from "next/link";
import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="w-7 h-7 text-primary" />
          <span>
            Policy<span className="text-primary">Forge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/generator"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Generator
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/consent-banner"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Consent Banner
          </Link>
          <Link
            href="/generator"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Get Started Free
          </Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          <Link
            href="/generator"
            className="block text-sm text-muted hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Generator
          </Link>
          <Link
            href="/pricing"
            className="block text-sm text-muted hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="block text-sm text-muted hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/consent-banner"
            className="block text-sm text-muted hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Consent Banner
          </Link>
          <Link
            href="/generator"
            className="block bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
            onClick={() => setMobileOpen(false)}
          >
            Get Started Free
          </Link>
        </div>
      )}
    </header>
  );
}
