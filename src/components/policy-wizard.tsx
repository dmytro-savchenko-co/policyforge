"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Copy, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PolicyFormData } from "@/lib/policy-templates";

interface PolicyWizardProps {
  policyType: "privacy-policy" | "terms-of-service" | "cookie-policy" | "refund-policy";
  title: string;
  onGenerate: (data: PolicyFormData) => string;
}

const businessTypes = [
  { value: "website", label: "Website" },
  { value: "app", label: "Mobile App" },
  { value: "saas", label: "SaaS / Web App" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "blog", label: "Blog / Content" },
] as const;

const jurisdictionOptions = [
  { value: "gdpr", label: "GDPR (European Union)" },
  { value: "ccpa", label: "CCPA (California, USA)" },
  { value: "pipeda", label: "PIPEDA (Canada)" },
  { value: "general", label: "General / Other" },
];

const dataOptions = [
  { value: "name", label: "Names" },
  { value: "email", label: "Email Addresses" },
  { value: "phone", label: "Phone Numbers" },
  { value: "address", label: "Physical Addresses" },
  { value: "payment", label: "Payment Information" },
  { value: "cookies", label: "Cookies" },
  { value: "location", label: "Location Data" },
  { value: "content", label: "User-Generated Content" },
];

const serviceOptions = [
  { value: "google-analytics", label: "Google Analytics" },
  { value: "stripe", label: "Stripe" },
  { value: "mailchimp", label: "Mailchimp" },
  { value: "intercom", label: "Intercom" },
  { value: "facebook-pixel", label: "Facebook/Meta Pixel" },
  { value: "hotjar", label: "Hotjar" },
  { value: "sentry", label: "Sentry" },
  { value: "cloudflare", label: "Cloudflare" },
  { value: "aws", label: "AWS" },
  { value: "google-ads", label: "Google Ads" },
];

const cookieTypeOptions = [
  { value: "essential", label: "Essential (login, security)" },
  { value: "analytics", label: "Analytics (usage tracking)" },
  { value: "functional", label: "Functional (preferences)" },
  { value: "marketing", label: "Marketing (advertising)" },
];

export function PolicyWizard({ policyType, title, onGenerate }: PolicyWizardProps) {
  const [step, setStep] = useState(0);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<PolicyFormData>({
    businessName: "",
    websiteUrl: "",
    businessType: "website",
    contactEmail: "",
    country: "",
    jurisdictions: [],
    dataCollected: [],
    thirdPartyServices: [],
    cookieTypes: ["essential"],
    hasUserAccounts: false,
    sellsProducts: false,
    refundDays: 30,
  });

  const updateField = <K extends keyof PolicyFormData>(key: K, value: PolicyFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: "jurisdictions" | "dataCollected" | "thirdPartyServices" | "cookieTypes", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const showCookieStep = policyType === "cookie-policy" || policyType === "privacy-policy";
  const showRefundStep = policyType === "refund-policy";

  const steps = [
    { title: "Business Info", subtitle: "Tell us about your business" },
    { title: "Jurisdictions", subtitle: "Where do your users come from?" },
    { title: "Data Collection", subtitle: "What data do you collect?" },
    { title: "Third-Party Services", subtitle: "Which services do you use?" },
    ...(showCookieStep ? [{ title: "Cookies", subtitle: "What cookies do you use?" }] : []),
    ...(showRefundStep ? [{ title: "Refund Details", subtitle: "Your refund terms" }] : []),
  ];

  const totalSteps = steps.length;

  const handleGenerate = () => {
    const html = onGenerate(formData);
    setGeneratedHtml(html);
  };

  const handleCopyHtml = async () => {
    if (!generatedHtml) return;
    await navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyText = async () => {
    if (!generatedHtml) return;
    const tmp = document.createElement("div");
    tmp.innerHTML = generatedHtml;
    await navigator.clipboard.writeText(tmp.textContent || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    if (!generatedHtml) return;
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${formData.businessName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #1a1a1a; }
    h1 { font-size: 28px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; }
    h2 { font-size: 20px; margin-top: 32px; color: #1e40af; }
    h3 { font-size: 16px; margin-top: 24px; }
    ul { padding-left: 24px; }
    li { margin-bottom: 8px; }
    a { color: #2563eb; }
    p { margin: 12px 0; }
  </style>
</head>
<body>
${generatedHtml}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policyType}-${formData.businessName.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (generatedHtml) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted text-sm mt-1">Generated for {formData.businessName}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopyHtml}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy HTML"}
            </button>
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Text
            </button>
            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
        <div
          className="prose prose-sm max-w-none border border-border rounded-2xl p-8 bg-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:border-b [&_h1]:border-border [&_h1]:pb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mt-8 [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: generatedHtml }}
        />
        <div className="mt-8 text-center">
          <button
            onClick={() => { setGeneratedHtml(null); setStep(0); }}
            className="text-primary text-sm font-medium hover:underline"
          >
            Generate another policy
          </button>
        </div>
      </div>
    );
  }

  const canProceed = () => {
    if (step === 0) return formData.businessName && formData.websiteUrl && formData.contactEmail;
    if (step === 1) return formData.jurisdictions.length > 0;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-center mb-2">{title} Generator</h1>
      <p className="text-muted text-center mb-8">Answer a few questions to generate your customized policy.</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.title} className="flex-1 flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                i === step ? "bg-primary text-white" : i < step ? "bg-success text-white" : "bg-gray-200 text-muted"
              )}
            >
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-xs text-muted mt-1 hidden sm:block">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="border border-border rounded-2xl p-6 sm:p-8 bg-white min-h-[320px]">
        <h2 className="text-lg font-semibold mb-1">{steps[step].title}</h2>
        <p className="text-sm text-muted mb-6">{steps[step].subtitle}</p>

        {/* Step 0: Business Info */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Business Name *</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                placeholder="Acme Inc."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Website URL *</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => updateField("websiteUrl", e.target.value)}
                placeholder="https://example.com"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Contact Email *</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                placeholder="contact@example.com"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Business Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {businessTypes.map((bt) => (
                  <button
                    key={bt.value}
                    onClick={() => updateField("businessType", bt.value)}
                    className={cn(
                      "border rounded-lg px-3 py-2 text-sm transition-colors",
                      formData.businessType === bt.value
                        ? "border-primary bg-primary-light text-primary font-medium"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="United States"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasUserAccounts}
                  onChange={(e) => updateField("hasUserAccounts", e.target.checked)}
                  className="rounded"
                />
                Users can create accounts
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sellsProducts}
                  onChange={(e) => updateField("sellsProducts", e.target.checked)}
                  className="rounded"
                />
                Sells products/services
              </label>
            </div>
          </div>
        )}

        {/* Step 1: Jurisdictions */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted">Select all jurisdictions that apply to your users:</p>
            {jurisdictionOptions.map((j) => (
              <button
                key={j.value}
                onClick={() => toggleArrayItem("jurisdictions", j.value)}
                className={cn(
                  "w-full text-left border rounded-lg px-4 py-3 text-sm transition-colors",
                  formData.jurisdictions.includes(j.value)
                    ? "border-primary bg-primary-light text-primary font-medium"
                    : "border-border hover:border-primary/50"
                )}
              >
                {j.label}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Data Collection */}
        {step === 2 && (
          <div className="space-y-2">
            <p className="text-sm text-muted mb-4">Select all types of data you collect:</p>
            <div className="grid grid-cols-2 gap-2">
              {dataOptions.map((d) => (
                <button
                  key={d.value}
                  onClick={() => toggleArrayItem("dataCollected", d.value)}
                  className={cn(
                    "text-left border rounded-lg px-3 py-2.5 text-sm transition-colors",
                    formData.dataCollected.includes(d.value)
                      ? "border-primary bg-primary-light text-primary font-medium"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Third Party */}
        {step === 3 && (
          <div className="space-y-2">
            <p className="text-sm text-muted mb-4">Select third-party services you use:</p>
            <div className="grid grid-cols-2 gap-2">
              {serviceOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => toggleArrayItem("thirdPartyServices", s.value)}
                  className={cn(
                    "text-left border rounded-lg px-3 py-2.5 text-sm transition-colors",
                    formData.thirdPartyServices.includes(s.value)
                      ? "border-primary bg-primary-light text-primary font-medium"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cookie Step */}
        {showCookieStep && step === 4 && (
          <div className="space-y-2">
            <p className="text-sm text-muted mb-4">What types of cookies does your site use?</p>
            {cookieTypeOptions.map((c) => (
              <button
                key={c.value}
                onClick={() => toggleArrayItem("cookieTypes", c.value)}
                className={cn(
                  "w-full text-left border rounded-lg px-4 py-3 text-sm transition-colors",
                  formData.cookieTypes.includes(c.value)
                    ? "border-primary bg-primary-light text-primary font-medium"
                    : "border-border hover:border-primary/50"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* Refund Step */}
        {showRefundStep && step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Refund Window (days)</label>
              <input
                type="number"
                value={formData.refundDays}
                onChange={(e) => updateField("refundDays", parseInt(e.target.value) || 30)}
                min={0}
                max={365}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            step === 0 ? "text-gray-300 cursor-not-allowed" : "text-muted hover:text-foreground"
          )}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {step < totalSteps - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors",
              canProceed()
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Generate Policy <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
