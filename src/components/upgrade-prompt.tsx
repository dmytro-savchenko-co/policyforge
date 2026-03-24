import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export function UpgradePrompt() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold">You&apos;ve Used Your Free Generation</h2>
      <p className="mt-3 text-muted leading-relaxed max-w-md mx-auto">
        Upgrade to unlock AI-tailored policies that are customized specifically to your
        business, industry, and jurisdiction — not generic templates.
      </p>

      <div className="mt-8 border border-border rounded-2xl p-6 bg-white text-left">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-semibold">What you get with a paid plan</span>
        </div>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">+</span>
            AI-generated policies tailored to your specific business
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">+</span>
            Professional legal language customized to your industry
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">+</span>
            Full jurisdiction-specific compliance (GDPR, CCPA, PIPEDA)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">+</span>
            Multiple policies, PDF export, no watermark
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/pricing"
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
        >
          View Plans <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
