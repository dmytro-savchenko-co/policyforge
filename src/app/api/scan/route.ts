import { NextRequest, NextResponse } from "next/server";

interface DetectedCookie {
  name: string;
  category: "essential" | "analytics" | "marketing" | "functional";
  service: string;
  description: string;
}

const TRACKER_PATTERNS = [
  // Google Analytics
  {
    pattern: /gtag\s*\(\s*['"]config['"]\s*,\s*['"]G-/i,
    name: "_ga (GA4)",
    category: "analytics",
    service: "Google Analytics 4",
    description: "Tracks user interactions and page views via GA4 measurement.",
  },
  {
    pattern: /google-analytics\.com\/analytics\.js/i,
    name: "_ga (Universal Analytics)",
    category: "analytics",
    service: "Google Analytics",
    description: "Universal Analytics tracking for page views and user behavior.",
  },
  {
    pattern: /googletagmanager\.com\/gtag\/js/i,
    name: "_ga / _gid",
    category: "analytics",
    service: "Google Analytics (gtag.js)",
    description: "Google global site tag for analytics and conversion tracking.",
  },
  {
    pattern: /googletagmanager\.com\/gtm\.js/i,
    name: "_gcl_au",
    category: "marketing",
    service: "Google Tag Manager",
    description: "Manages and deploys marketing and analytics tags.",
  },
  // Facebook Pixel
  {
    pattern: /connect\.facebook\.net\/.*\/fbevents\.js/i,
    name: "_fbp",
    category: "marketing",
    service: "Facebook Pixel",
    description: "Tracks conversions and builds audiences for Facebook advertising.",
  },
  {
    pattern: /fbq\s*\(\s*['"]init['"]/i,
    name: "_fbp / _fbc",
    category: "marketing",
    service: "Facebook Pixel",
    description: "Facebook Pixel initialization for ad conversion tracking.",
  },
  // Hotjar
  {
    pattern: /static\.hotjar\.com/i,
    name: "_hj*",
    category: "analytics",
    service: "Hotjar",
    description: "Records user sessions, heatmaps, and behavior analytics.",
  },
  {
    pattern: /hj\s*\(\s*['"]init['"]/i,
    name: "_hjid / _hjSession",
    category: "analytics",
    service: "Hotjar",
    description: "Hotjar session tracking for UX insights and feedback.",
  },
  // Google Ads
  {
    pattern: /googleadservices\.com\/pagead/i,
    name: "_gcl_aw",
    category: "marketing",
    service: "Google Ads",
    description: "Tracks ad clicks and conversions for Google Ads campaigns.",
  },
  {
    pattern: /gtag\s*\(\s*['"]config['"]\s*,\s*['"]AW-/i,
    name: "_gcl_aw (Conversion)",
    category: "marketing",
    service: "Google Ads",
    description: "Google Ads conversion tracking tag.",
  },
  // Stripe
  {
    pattern: /js\.stripe\.com/i,
    name: "__stripe_mid",
    category: "essential",
    service: "Stripe",
    description: "Stripe payment processing fraud prevention cookie.",
  },
  // Intercom
  {
    pattern: /widget\.intercom\.io/i,
    name: "intercom-id-*",
    category: "functional",
    service: "Intercom",
    description: "Intercom messenger widget for customer support chat.",
  },
  {
    pattern: /intercomSettings/i,
    name: "intercom-session-*",
    category: "functional",
    service: "Intercom",
    description: "Maintains Intercom chat session state.",
  },
  // LinkedIn Insight
  {
    pattern: /snap\.licdn\.com/i,
    name: "li_sugr / bcookie",
    category: "marketing",
    service: "LinkedIn Insight",
    description: "LinkedIn conversion tracking and audience insights.",
  },
  // TikTok Pixel
  {
    pattern: /analytics\.tiktok\.com/i,
    name: "_ttp",
    category: "marketing",
    service: "TikTok Pixel",
    description: "TikTok ad conversion tracking and audience building.",
  },
  // Twitter/X Pixel
  {
    pattern: /static\.ads-twitter\.com/i,
    name: "personalization_id",
    category: "marketing",
    service: "Twitter/X Ads",
    description: "Twitter advertising conversion and event tracking.",
  },
  // Segment
  {
    pattern: /cdn\.segment\.com/i,
    name: "ajs_anonymous_id",
    category: "analytics",
    service: "Segment",
    description: "Segment analytics data pipeline for event collection.",
  },
  // Mixpanel
  {
    pattern: /cdn\.mxpnl\.com|api\.mixpanel\.com/i,
    name: "mp_*",
    category: "analytics",
    service: "Mixpanel",
    description: "Mixpanel product analytics and user event tracking.",
  },
  // Hubspot
  {
    pattern: /js\.hs-scripts\.com|js\.hs-analytics\.net/i,
    name: "__hstc / hubspotutk",
    category: "marketing",
    service: "HubSpot",
    description: "HubSpot marketing automation and visitor tracking.",
  },
  // Drift
  {
    pattern: /js\.driftt\.com/i,
    name: "drift_aid",
    category: "functional",
    service: "Drift",
    description: "Drift live chat and conversational marketing widget.",
  },
  // Zendesk
  {
    pattern: /static\.zdassets\.com/i,
    name: "_zendesk_cookie",
    category: "functional",
    service: "Zendesk",
    description: "Zendesk customer support widget and help center.",
  },
  // Cloudflare
  {
    pattern: /cdnjs\.cloudflare\.com|challenges\.cloudflare\.com/i,
    name: "__cf_bm",
    category: "essential",
    service: "Cloudflare",
    description: "Cloudflare bot management and security protection.",
  },
  // Sentry
  {
    pattern: /browser\.sentry-cdn\.com|sentry\.io/i,
    name: "sentry-sc",
    category: "functional",
    service: "Sentry",
    description: "Sentry error monitoring and application performance tracking.",
  },
  // Microsoft Clarity
  {
    pattern: /clarity\.ms/i,
    name: "_clck / _clsk",
    category: "analytics",
    service: "Microsoft Clarity",
    description: "Session recordings and heatmaps for UX analysis.",
  },
  // Amplitude
  {
    pattern: /cdn\.amplitude\.com/i,
    name: "amp_*",
    category: "analytics",
    service: "Amplitude",
    description: "Amplitude product analytics for user behavior tracking.",
  },
  // Pinterest
  {
    pattern: /pintrk|ct\.pinterest\.com/i,
    name: "_pin_unauth",
    category: "marketing",
    service: "Pinterest Tag",
    description: "Pinterest conversion tracking for ad campaigns.",
  },
  // Snapchat
  {
    pattern: /sc-static\.net\/scevent/i,
    name: "_scid",
    category: "marketing",
    service: "Snapchat Pixel",
    description: "Snapchat ad conversion and event tracking.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    // Validate URL
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch the page
    let html: string;
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; PolicyForge Scanner/1.0; +https://policyforge.com)",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      html = await response.text();
    } catch {
      return NextResponse.json(
        { error: "Could not fetch the website. Check the URL and try again." },
        { status: 422 }
      );
    }

    // Scan for trackers
    const detected: DetectedCookie[] = [];
    const seenServices = new Set<string>();

    for (const tracker of TRACKER_PATTERNS) {
      if (tracker.pattern && tracker.pattern.test(html) && !seenServices.has(tracker.service)) {
        seenServices.add(tracker.service);
        detected.push({
          name: tracker.name,
          category: tracker.category as DetectedCookie["category"],
          service: tracker.service,
          description: tracker.description,
        });
      }
    }

    // Always include essential browser cookies
    detected.unshift({
      name: "session_id / csrf_token",
      category: "essential",
      service: "Website Core",
      description:
        "Essential cookies for site functionality, security, and session management.",
    });

    return NextResponse.json({ cookies: detected });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Failed to scan website" },
      { status: 500 }
    );
  }
}
