import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { PricingButton } from "@/components/pricing-button";

export const metadata: Metadata = {
  title: "Pricing — PolicyForge | Free Privacy Policy Generator",
  description:
    "Simple, transparent pricing for PolicyForge. Generate privacy policies, terms of service, and more. Start free, upgrade when you need more policies and jurisdictions.",
  openGraph: {
    title: "Pricing — PolicyForge",
    description: "Generate legal pages for your website. Free to start.",
  },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out PolicyForge",
    features: [
      "1 template-based policy",
      "Basic compliance (General)",
      "Copy as text",
      "Requires free account",
    ],
    cta: "Get Started Free",
    plan: "free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For small businesses and freelancers",
    features: [
      "3 AI-tailored policies per month",
      "Customized to your specific business",
      "All jurisdictions (GDPR, CCPA, PIPEDA)",
      "No watermark",
      "HTML, Text & PDF export",
      "Email support",
    ],
    cta: "Start 7-Day Free Trial",
    plan: "starter",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "For agencies and multi-site businesses",
    features: [
      "Unlimited AI-tailored policies",
      "Customized to your specific business",
      "Unlimited websites",
      "All jurisdictions",
      "Embeddable auto-updating script",
      "Custom branding (no PolicyForge mention)",
      "Priority updates when laws change",
      "Priority support",
    ],
    cta: "Start 7-Day Free Trial",
    plan: "business",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Is the free plan really free?",
    a: "Yes! You can generate one basic privacy policy completely free, forever. No credit card required.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Absolutely. You can change your plan at any time. If you downgrade, you'll keep access until the end of your billing period.",
  },
  {
    q: "Are these policies a substitute for legal advice?",
    a: "PolicyForge is not a law firm and does not provide legal advice. Our documents cover standard provisions typically found in legal policies for various jurisdictions. We strongly recommend having a qualified attorney review any generated document before publication.",
  },
  {
    q: "What happens when laws change?",
    a: "We continuously update our templates. Business plan users with embedded policies get automatic updates. Starter users are notified to regenerate.",
  },
  {
    q: "Do you offer lifetime deals?",
    a: "Yes! We occasionally offer lifetime deals. Follow us on social media or join our newsletter to be notified.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.",
  },
];

export default function PricingPage() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Start for free. Upgrade when you need more policies, jurisdictions,
            or features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-lg ring-2 ring-primary/20 relative"
                  : "border-border"
              } bg-white`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <div className="mt-3">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted text-sm">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <PricingButton
                plan={plan.plan}
                cta={plan.cta}
                highlighted={plan.highlighted}
              />
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="border border-border rounded-xl p-5 bg-white"
              >
                <h3 className="font-semibold text-sm">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
