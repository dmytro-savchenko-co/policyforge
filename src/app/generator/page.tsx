import Link from "next/link";
import { Shield, FileText, Globe, RefreshCw, ArrowRight, Scale, AlertTriangle, BookOpen, Truck, Accessibility } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Legal Page Generator — PolicyForge",
  description: "Generate Privacy Policies, Terms of Service, Cookie Policies, Refund Policies, EULAs, Disclaimers, and more for free. GDPR, CCPA, PIPEDA compliant.",
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
  {
    title: "EULA Generator",
    description: "Generate a comprehensive End-User License Agreement for your software, app, or SaaS product. Define usage rights and protect your IP.",
    href: "/generator/eula",
    icon: Scale,
    tags: ["Software", "License", "IP Protection"],
  },
  {
    title: "Disclaimer Generator",
    description: "Create a professional disclaimer to limit your liability. Covers general, professional, and external links disclaimers.",
    href: "/generator/disclaimer",
    icon: AlertTriangle,
    tags: ["Liability", "Legal Protection"],
  },
  {
    title: "Acceptable Use Policy Generator",
    description: "Define what users can and cannot do on your platform. Essential for SaaS, community sites, and user-generated content platforms.",
    href: "/generator/acceptable-use",
    icon: BookOpen,
    tags: ["User Conduct", "Content Standards", "Platform Rules"],
  },
  {
    title: "Shipping Policy Generator",
    description: "Create a clear shipping policy for your e-commerce store. Cover delivery times, costs, international shipping, and tracking.",
    href: "/generator/shipping-policy",
    icon: Truck,
    tags: ["E-Commerce", "Delivery", "International"],
  },
  {
    title: "Accessibility Statement Generator",
    description: "Demonstrate your commitment to digital accessibility with a professional ADA and WCAG compliance statement.",
    href: "/generator/accessibility",
    icon: Accessibility,
    tags: ["ADA", "WCAG 2.1", "Section 508"],
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
