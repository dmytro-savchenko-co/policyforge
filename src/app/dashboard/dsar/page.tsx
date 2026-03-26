"use client";

import { useState } from "react";
import { ClipboardList, Copy, Check, ExternalLink, Code } from "lucide-react";

export default function DSARPage() {
  const [copied, setCopied] = useState<string | null>(null);

  // Generate a simple form ID based on timestamp
  const formId = "pf-dsar-default";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://policyforge.site";
  const formUrl = `${baseUrl}/api/dsar/${formId}`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0" style="border:none;max-width:600px;"></iframe>`;

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">DSAR Form</h1>
          <p className="mt-1 text-sm text-muted">
            Data Subject Access Request form for GDPR, CCPA, and other privacy laws.
            Embed this form on your website to let visitors exercise their data rights.
          </p>
        </div>

        {/* Preview */}
        <div className="border border-border rounded-2xl overflow-hidden bg-white mb-8">
          <div className="px-4 py-3 bg-secondary border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Form Preview</span>
            </div>
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Open in new tab <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <iframe
            src={formUrl}
            className="w-full border-0"
            height={550}
            title="DSAR Form Preview"
          />
        </div>

        {/* Embed Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Embed on Your Website</h2>

          {/* iframe embed */}
          <div className="border border-border rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium">Embed Code (iframe)</span>
              </div>
              <button
                onClick={() => handleCopy(embedCode, "embed")}
                className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                {copied === "embed" ? (
                  <><Check className="w-3 h-3" /> Copied!</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy</>
                )}
              </button>
            </div>
            <pre className="bg-gray-50 border border-border rounded-lg p-3 text-xs overflow-x-auto">
              <code>{embedCode}</code>
            </pre>
          </div>

          {/* Direct link */}
          <div className="border border-border rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium">Direct Link</span>
              </div>
              <button
                onClick={() => handleCopy(formUrl, "link")}
                className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                {copied === "link" ? (
                  <><Check className="w-3 h-3" /> Copied!</>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy</>
                )}
              </button>
            </div>
            <code className="block bg-gray-50 border border-border rounded-lg p-3 text-xs break-all">
              {formUrl}
            </code>
          </div>
        </div>

        <div className="mt-8 p-4 bg-primary-light rounded-xl">
          <p className="text-sm text-primary font-medium">
            Business plan feature: Customize the form fields, colors, and receive
            submissions directly to your email with audit logging.
          </p>
        </div>
      </div>
    </section>
  );
}
