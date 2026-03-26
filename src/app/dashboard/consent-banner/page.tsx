"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  Loader2,
  Search,
  Copy,
  Check,
  ArrowLeft,
  Eye,
  Cookie,
  RefreshCw,
} from "lucide-react";
import {
  supabase,
  isSupabaseConfigured,
  getCurrentUser,
} from "@/lib/supabase";

interface DetectedCookie {
  name: string;
  category: "essential" | "analytics" | "marketing" | "functional";
  service: string;
  description: string;
}

interface BannerConfig {
  position: "bottom" | "top";
  primaryColor: string;
  bgColor: string;
  textColor: string;
  headline: string;
  description: string;
  acceptText: string;
  rejectText: string;
  customizeText: string;
}

const DEFAULT_CONFIG: BannerConfig = {
  position: "bottom",
  primaryColor: "#2563eb",
  bgColor: "#1e293b",
  textColor: "#f1f5f9",
  headline: "We value your privacy",
  description:
    'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
  acceptText: "Accept All",
  rejectText: "Reject All",
  customizeText: "Customize",
};

const CATEGORY_COLORS: Record<string, string> = {
  essential: "bg-green-100 text-green-700",
  analytics: "bg-blue-100 text-blue-700",
  marketing: "bg-purple-100 text-purple-700",
  functional: "bg-amber-100 text-amber-700",
};

export default function ConsentBannerPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [siteUrl, setSiteUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cookies, setCookies] = useState<DetectedCookie[]>([]);
  const [scanError, setScanError] = useState("");
  const [config, setConfig] = useState<BannerConfig>({ ...DEFAULT_CONFIG });
  const [copied, setCopied] = useState(false);
  const [siteId, setSiteId] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured() || !supabase) {
        // Allow usage without auth in dev
        setAuthed(true);
        return;
      }
      const user = await getCurrentUser();
      setAuthed(!!user);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    // Generate a site ID from the URL
    if (siteUrl) {
      try {
        let clean = siteUrl.trim();
        if (!/^https?:\/\//i.test(clean)) clean = "https://" + clean;
        const hostname = new URL(clean).hostname.replace(/^www\./, "");
        setSiteId(hostname.replace(/[^a-z0-9]/g, "-"));
      } catch {
        setSiteId("my-site");
      }
    }
  }, [siteUrl]);

  const handleScan = async () => {
    if (!siteUrl.trim()) return;
    setScanning(true);
    setScanError("");
    setCookies([]);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: siteUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setScanError(data.error || "Scan failed");
      } else {
        setCookies(data.cookies || []);
      }
    } catch {
      setScanError("Network error. Please try again.");
    }
    setScanning(false);
  };

  const updateCategory = (index: number, category: DetectedCookie["category"]) => {
    setCookies((prev) =>
      prev.map((c, i) => (i === index ? { ...c, category } : c))
    );
  };

  const getEmbedCode = useCallback(() => {
    const params = new URLSearchParams();
    if (config.position !== "bottom") params.set("position", config.position);
    if (config.primaryColor !== DEFAULT_CONFIG.primaryColor)
      params.set("primaryColor", config.primaryColor);
    if (config.bgColor !== DEFAULT_CONFIG.bgColor)
      params.set("bgColor", config.bgColor);
    if (config.textColor !== DEFAULT_CONFIG.textColor)
      params.set("textColor", config.textColor);
    if (config.headline !== DEFAULT_CONFIG.headline)
      params.set("headline", config.headline);
    if (config.description !== DEFAULT_CONFIG.description)
      params.set("description", config.description);
    if (config.acceptText !== DEFAULT_CONFIG.acceptText)
      params.set("acceptText", config.acceptText);
    if (config.rejectText !== DEFAULT_CONFIG.rejectText)
      params.set("rejectText", config.rejectText);
    if (config.customizeText !== DEFAULT_CONFIG.customizeText)
      params.set("customizeText", config.customizeText);
    const qs = params.toString();
    const base = typeof window !== "undefined" ? window.location.origin : "https://policyforge.com";
    return `<script src="${base}/api/banner/${siteId || "my-site"}${qs ? "?" + qs : ""}" defer></script>`;
  }, [config, siteId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = getEmbedCode();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (authed === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <section className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Sign in to create consent banners</h1>
          <p className="mt-2 text-muted">
            Log in or create an account to configure cookie consent banners.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/auth/login"
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="border border-border px-6 py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Cookie className="w-6 h-6 text-primary" />
              Consent Banner Builder
            </h1>
            <p className="mt-1 text-sm text-muted">
              Scan your site, customize your banner, and get the embed code
            </p>
          </div>
        </div>

        {/* Step 1: Scan */}
        <div className="border border-border rounded-2xl p-6 bg-white mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">
              1
            </span>
            Scan Your Website
          </h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
            <button
              onClick={handleScan}
              disabled={scanning || !siteUrl.trim()}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Scan Site
            </button>
          </div>
          {scanError && (
            <p className="mt-3 text-sm text-red-600">{scanError}</p>
          )}
        </div>

        {/* Detected Cookies Table */}
        {cookies.length > 0 && (
          <div className="border border-border rounded-2xl p-6 bg-white mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">
                2
              </span>
              Detected Cookies &amp; Scripts
              <span className="ml-auto text-xs text-muted font-normal">
                {cookies.length} found
              </span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted">Service</th>
                    <th className="pb-3 font-medium text-muted">Cookie Name</th>
                    <th className="pb-3 font-medium text-muted">Category</th>
                    <th className="pb-3 font-medium text-muted">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {cookies.map((cookie, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-3 pr-3 font-medium">{cookie.service}</td>
                      <td className="py-3 pr-3">
                        <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                          {cookie.name}
                        </code>
                      </td>
                      <td className="py-3 pr-3">
                        <select
                          value={cookie.category}
                          onChange={(e) =>
                            updateCategory(
                              i,
                              e.target.value as DetectedCookie["category"]
                            )
                          }
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${CATEGORY_COLORS[cookie.category]}`}
                        >
                          <option value="essential">Essential</option>
                          <option value="analytics">Analytics</option>
                          <option value="marketing">Marketing</option>
                          <option value="functional">Functional</option>
                        </select>
                      </td>
                      <td className="py-3 text-muted text-xs">
                        {cookie.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 3: Customize Banner */}
        <div className="border border-border rounded-2xl p-6 bg-white mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">
              3
            </span>
            Customize Banner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Position
                </label>
                <div className="flex gap-2">
                  {(["bottom", "top"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() =>
                        setConfig((p) => ({ ...p, position: pos }))
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        config.position === pos
                          ? "bg-primary text-white"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) =>
                        setConfig((p) => ({ ...p, primaryColor: e.target.value }))
                      }
                      className="w-8 h-8 rounded cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) =>
                        setConfig((p) => ({ ...p, primaryColor: e.target.value }))
                      }
                      className="flex-1 border border-border rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) =>
                        setConfig((p) => ({ ...p, bgColor: e.target.value }))
                      }
                      className="w-8 h-8 rounded cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={config.bgColor}
                      onChange={(e) =>
                        setConfig((p) => ({ ...p, bgColor: e.target.value }))
                      }
                      className="flex-1 border border-border rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) =>
                        setConfig((p) => ({ ...p, textColor: e.target.value }))
                      }
                      className="w-8 h-8 rounded cursor-pointer border border-border"
                    />
                    <input
                      type="text"
                      value={config.textColor}
                      onChange={(e) =>
                        setConfig((p) => ({ ...p, textColor: e.target.value }))
                      }
                      className="flex-1 border border-border rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Text */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  value={config.headline}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, headline: e.target.value }))
                  }
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Description
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) =>
                    setConfig((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>

              {/* Button Text */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Accept Button
                  </label>
                  <input
                    type="text"
                    value={config.acceptText}
                    onChange={(e) =>
                      setConfig((p) => ({ ...p, acceptText: e.target.value }))
                    }
                    className="w-full border border-border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Reject Button
                  </label>
                  <input
                    type="text"
                    value={config.rejectText}
                    onChange={(e) =>
                      setConfig((p) => ({ ...p, rejectText: e.target.value }))
                    }
                    className="w-full border border-border rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Customize Button
                  </label>
                  <input
                    type="text"
                    value={config.customizeText}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        customizeText: e.target.value,
                      }))
                    }
                    className="w-full border border-border rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() => setConfig({ ...DEFAULT_CONFIG })}
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Reset to defaults
              </button>
            </div>

            {/* Right: Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Live Preview
                </label>
                <button
                  onClick={() => setShowPreview((p) => !p)}
                  className="text-xs text-primary hover:underline"
                >
                  {showPreview ? "Hide" : "Show"}
                </button>
              </div>
              {showPreview && (
                <div className="border border-border rounded-xl overflow-hidden bg-gray-100 relative min-h-[260px]">
                  {/* Mock page */}
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-20 bg-gray-200 rounded w-full mt-3" />
                  </div>
                  {/* Banner preview */}
                  <div
                    className={`absolute left-0 right-0 ${config.position === "top" ? "top-0" : "bottom-0"}`}
                    style={{
                      background: config.bgColor,
                      color: config.textColor,
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      fontSize: "11px",
                      lineHeight: "1.4",
                    }}
                  >
                    <div className="p-3">
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: "12px",
                          marginBottom: "2px",
                        }}
                      >
                        {config.headline}
                      </p>
                      <p style={{ opacity: 0.85, fontSize: "10px" }}>
                        {config.description.length > 120
                          ? config.description.slice(0, 120) + "..."
                          : config.description}
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        <span
                          style={{
                            background: config.primaryColor,
                            color: "#fff",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            fontSize: "10px",
                            fontWeight: 600,
                          }}
                        >
                          {config.acceptText}
                        </span>
                        <span
                          style={{
                            border: "1px solid rgba(255,255,255,0.3)",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            fontSize: "10px",
                            fontWeight: 600,
                          }}
                        >
                          {config.rejectText}
                        </span>
                        <span
                          style={{
                            border: "1px solid rgba(255,255,255,0.2)",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            fontSize: "9px",
                          }}
                        >
                          {config.customizeText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 4: Get Embed Code */}
        <div className="border border-border rounded-2xl p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">
              4
            </span>
            Get Embed Code
          </h2>
          <p className="text-sm text-muted mb-3">
            Add this script tag to your website&apos;s{" "}
            <code className="bg-secondary px-1 rounded">&lt;head&gt;</code> section.
            The banner will appear automatically for visitors who haven&apos;t given consent.
          </p>
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto font-mono">
              {getEmbedCode()}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> To control which scripts require consent, add{" "}
              <code className="bg-blue-100 px-1 rounded text-xs">
                data-consent-category=&quot;analytics&quot;
              </code>{" "}
              to your script tags and change their{" "}
              <code className="bg-blue-100 px-1 rounded text-xs">type</code> to{" "}
              <code className="bg-blue-100 px-1 rounded text-xs">
                text/plain
              </code>{" "}
              with a{" "}
              <code className="bg-blue-100 px-1 rounded text-xs">data-src</code>{" "}
              attribute. The banner will unblock them once consent is given.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
