import Link from "next/link";
import {
  Shield,
  Zap,
  Globe,
  FileText,
  CheckCircle,
  ArrowRight,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react";

const policyTypes = [
  {
    title: "Privacy Policy",
    description: "GDPR, CCPA, PIPEDA compliant privacy policies for any website or app.",
    href: "/generator/privacy-policy",
    icon: Shield,
  },
  {
    title: "Terms of Service",
    description: "Protect your business with comprehensive terms and conditions.",
    href: "/generator/terms-of-service",
    icon: FileText,
  },
  {
    title: "Cookie Policy",
    description: "EU cookie law compliant policies with consent banner code.",
    href: "/generator/cookie-policy",
    icon: Globe,
  },
  {
    title: "Refund Policy",
    description: "Clear return and refund policies for e-commerce and SaaS.",
    href: "/generator/refund-policy",
    icon: RefreshCw,
  },
];

const features = [
  {
    icon: Zap,
    title: "Ready in 2 Minutes",
    description: "Answer a few questions about your business and get a complete, legally-worded policy instantly.",
  },
  {
    icon: Globe,
    title: "Multi-Jurisdiction",
    description: "Compliant with GDPR (EU), CCPA (California), PIPEDA (Canada), CalOPPA, and more.",
  },
  {
    icon: Download,
    title: "Copy, Download, or Embed",
    description: "Get your policy as HTML, plain text, or PDF. Or embed it with our auto-updating script.",
  },
  {
    icon: RefreshCw,
    title: "Always Up to Date",
    description: "Laws change. Your policies update automatically when regulations are amended.",
  },
  {
    icon: Clock,
    title: "No Lawyer Needed",
    description: "Save $500-$2,000 per policy. Our templates are crafted by legal professionals.",
  },
  {
    icon: Shield,
    title: "Compliance Dashboard",
    description: "Track which policies you have, which sites they cover, and when they were last updated.",
  },
];

const stats = [
  { value: "50,000+", label: "Policies Generated" },
  { value: "2 min", label: "Average Generation Time" },
  { value: "12", label: "Jurisdictions Covered" },
  { value: "$0", label: "To Get Started" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-primary-light/40 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-1.5 text-sm text-muted mb-6">
            <CheckCircle className="w-4 h-4 text-success" />
            Trusted by 10,000+ businesses worldwide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Generate Legal Pages
            <br />
            <span className="text-primary">in Minutes, Not Hours</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Privacy Policies, Terms of Service, Cookie Policies — all legally compliant
            with GDPR, CCPA, and more. No lawyer needed. Free to start.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generator"
              className="bg-primary text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              Generate Your Policy Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="border border-border bg-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-secondary transition-colors text-center"
            >
              View Pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            No credit card required. Free policy available instantly.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Types */}
      <section className="py-20" id="generators">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Choose Your Policy</h2>
            <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
              Select the type of legal document you need. Each one is customized to your specific business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {policyTypes.map((policy) => (
              <Link
                key={policy.title}
                href={policy.href}
                className="group border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all bg-white"
              >
                <policy.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg">{policy.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{policy.description}</p>
                <div className="mt-4 text-primary text-sm font-medium inline-flex items-center gap-1">
                  Generate now <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Why PolicyForge?</h2>
            <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
              Everything you need to stay legally compliant, without the legal bills.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white border border-border rounded-2xl p-6">
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Answer Questions",
                description: "Tell us about your business, what data you collect, and which jurisdictions you operate in.",
              },
              {
                step: "2",
                title: "Generate Instantly",
                description: "Our engine creates a customized, legally-worded policy tailored to your specific needs.",
              },
              {
                step: "3",
                title: "Copy & Publish",
                description: "Copy the HTML, download as PDF, or use our embed script for auto-updating policies.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Get Compliant?</h2>
          <p className="mt-4 text-lg opacity-90">
            Join thousands of businesses that trust PolicyForge for their legal pages.
            Start for free — no credit card required.
          </p>
          <Link
            href="/generator"
            className="mt-8 inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Generate Your First Policy
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
