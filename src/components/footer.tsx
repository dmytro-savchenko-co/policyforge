import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Shield className="w-5 h-5 text-primary" />
              <span>
                Policy<span className="text-primary">Forge</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted">
              Generate professional policies for your website or app in minutes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Generators</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/generator/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/generator/terms-of-service" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/generator/cookie-policy" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/generator/refund-policy" className="hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/generator/eula" className="hover:text-foreground transition-colors">
                  EULA
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">More Generators</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/generator/disclaimer" className="hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/generator/acceptable-use" className="hover:text-foreground transition-colors">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <Link href="/generator/shipping-policy" className="hover:text-foreground transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/generator/accessibility" className="hover:text-foreground transition-colors">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="mailto:support@policyforge.co" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/disclaimer" className="hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} PolicyForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
