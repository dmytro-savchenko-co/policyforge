import Link from "next/link";
import { Shield, FileText, Globe, RefreshCw, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Legal Page Generator — PolicyForge",
  description: "Generate Privacy Policies, Terms of Service, Cookie Policies, and Refund Policies for free. GDPR, CCPA, PIPEDA compliant.",
};

const generators = [
  {
    title: "Privacy Policy Generator",
    description: "Generate a comprehensive privacy policy compliant with GDPR, CCPA, PIPEDA, and other major regulations. Perfect for websites, apps, and SaaS products.",
    href: "/generator/privacy-policy",
    icon: Shield,
    tags: ["GDPR", "CCPA", "PIPEDA"],
  },
  {
    title: "Terms of Service Generator",
    description: "Create professional terms and conditions that protect your business. Covers user accounts, intellectual property, liability, and more.",
    href: "/generator/terms-of-service",
    icon: FileText,
    tags: ["User Accounts", "Liability", "IP Protection"],
  },
  {
    title: "Cookie Policy Generator",
    description: "Generate an EU cookie law compliant policy. Covers essential, analytics, functional, and marketing cookies with browser instructions.",
    href: "/generator/cookie-policy",
    icon: Globe,
    tags: ["EU Cookie Law", "GDPR", "Consent"],
  },
  {
    title: "Refund Policy Generator",
    description: "Create clear refund and return policies for e-commerce stores, SaaS subscriptions, and service businesses.",
    href: "/generator/refund-policy",
    icon: RefreshCw,
    tags: ["E-Commerce", "SaaS", "Services"],
  },
];

export default function GeneratorPage() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">Legal Page Generators</h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Choose the policy you need. Answer a few questions and get a professionally written,
            legally compliant document in under 2 minutes.
          </p>
        </div>

        <div className="space-y-4">
          {generators.map((gen) => (
            <Link
              key={gen.title}
              href={gen.href}
              className="group flex items-start gap-5 border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all bg-white"
            >
              <gen.icon className="w-10 h-10 text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
              <div className="flex-1">
                <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {gen.title}
                </h2>
                <p className="mt-1 text-sm text-muted leading-relaxed">{gen.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {gen.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary-light text-primary text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary shrink-0 mt-2 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
