import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful — PolicyForge",
};

export default function SuccessPage() {
  return (
    <section className="py-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-4 text-lg text-muted">
          Thank you for subscribing to PolicyForge. You now have access to all
          the features in your plan.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/generator"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
          >
            Start Generating Policies <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="border border-border px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
