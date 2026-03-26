import { NextRequest, NextResponse } from "next/server";
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import type { PolicyFormData } from "@/lib/policy-templates";

const anthropic = new AnthropicBedrock({
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID!,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY!,
  awsRegion: process.env.AWS_REGION || "us-east-1",
});

const POLICY_TYPE_LABELS: Record<string, string> = {
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service",
  "cookie-policy": "Cookie Policy",
  "refund-policy": "Refund Policy",
  "eula": "End-User License Agreement (EULA)",
  "disclaimer": "Disclaimer",
  "acceptable-use": "Acceptable Use Policy",
  "shipping-policy": "Shipping Policy",
  "accessibility": "Accessibility Statement",
};

function buildPrompt(policyType: string, data: PolicyFormData): string {
  const typeLabel = POLICY_TYPE_LABELS[policyType] || "Legal Policy";
  const businessTypeLabels: Record<string, string> = {
    website: "website",
    app: "mobile application",
    saas: "software-as-a-service (SaaS) platform",
    ecommerce: "e-commerce store",
    blog: "blog and content platform",
  };

  const jurisdictionLabels: Record<string, string> = {
    gdpr: "GDPR (European Union General Data Protection Regulation)",
    ccpa: "CCPA (California Consumer Privacy Act)",
    pipeda: "PIPEDA (Personal Information Protection and Electronic Documents Act, Canada)",
    general: "general international privacy standards",
  };

  const serviceDescriptions: Record<string, string> = {
    "google-analytics": "Google Analytics for website traffic analysis and user behavior tracking",
    stripe: "Stripe for secure payment processing and transaction management",
    mailchimp: "Mailchimp for email marketing campaigns and newsletter distribution",
    intercom: "Intercom for customer support messaging and live chat",
    "facebook-pixel": "Meta/Facebook Pixel for advertising conversion tracking and audience building",
    hotjar: "Hotjar for user session recording, heatmaps, and behavior analytics",
    sentry: "Sentry for application error monitoring and crash reporting",
    cloudflare: "Cloudflare for CDN, DDoS protection, and DNS management",
    aws: "Amazon Web Services (AWS) for cloud infrastructure and data storage",
    "google-ads": "Google Ads for pay-per-click advertising campaigns",
  };

  const bizType = businessTypeLabels[data.businessType] || "online business";
  const jurisdictions = data.jurisdictions.map((j) => jurisdictionLabels[j] || j).join(", ");
  const dataTypes = data.dataCollected.length > 0
    ? data.dataCollected.join(", ")
    : "basic website interaction data";
  const services = data.thirdPartyServices.length > 0
    ? data.thirdPartyServices.map((s) => serviceDescriptions[s] || s).join("; ")
    : "no third-party services";
  const cookies = data.cookieTypes.length > 0
    ? data.cookieTypes.join(", ")
    : "essential cookies only";

  return `You are a legal document specialist. Generate a comprehensive, professionally written ${typeLabel} for the following business. The policy must be specifically tailored to this business — not generic boilerplate.

## Business Details
- **Business Name**: ${data.businessName}
- **Website**: ${data.websiteUrl}
- **Business Type**: ${bizType}
- **Contact Email**: ${data.contactEmail}
${data.country ? `- **Country/Jurisdiction**: ${data.country}` : ""}
${data.hasUserAccounts ? "- **User Accounts**: Yes, users can create accounts" : ""}
${data.sellsProducts ? "- **Sells Products/Services**: Yes" : ""}

## Compliance Requirements
Jurisdictions: ${jurisdictions}

## Data Practices
- **Data Collected**: ${dataTypes}
- **Third-Party Services**: ${services}
- **Cookie Types**: ${cookies}
${policyType === "refund-policy" ? `- **Refund Window**: ${data.refundDays} days` : ""}

## Instructions
1. Write a comprehensive, professionally-written ${typeLabel} that covers standard provisions typically included in such documents, tailored to ${data.businessName}'s ${bizType} business.
2. Reference the specific third-party services by name and explain what data they process.
3. Include all required sections for ${jurisdictions} compliance.
4. Use professional language commonly found in legal documents while maintaining readability.
5. Include specific details about ${data.businessName}'s data practices — do NOT write generic placeholder text.
6. Format the output as clean HTML with proper headings (h1, h2, h3), paragraphs, and lists.
7. Start with <h1>${typeLabel} for ${data.businessName}</h1> and include a "Last updated" date of today.
8. Include a Contact Us section at the end with the email ${data.contactEmail}.
9. At the very end, include this notice in a paragraph: "This document was generated using automated tools by PolicyForge and is provided for informational purposes only. It is not legal advice. We recommend having this document reviewed by a qualified attorney."
${data.language && data.language !== "en" ? `9. IMPORTANT: Write the ENTIRE policy in ${data.language === "de" ? "German" : data.language === "fr" ? "French" : data.language === "es" ? "Spanish" : data.language === "pt" ? "Portuguese" : data.language === "it" ? "Italian" : data.language === "nl" ? "Dutch" : data.language === "pl" ? "Polish" : data.language === "sv" ? "Swedish" : data.language === "da" ? "Danish" : data.language === "fi" ? "Finnish" : data.language === "el" ? "Greek" : data.language === "hu" ? "Hungarian" : data.language}. All headings, paragraphs, and legal text must be in this language.` : ""}

Output ONLY the HTML — no markdown fences, no commentary, no preamble.`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: "AI generation is not configured" },
        { status: 503 }
      );
    }

    const { policyType, formData } = await req.json();

    if (!policyType || !POLICY_TYPE_LABELS[policyType]) {
      return NextResponse.json({ error: "Invalid policy type" }, { status: 400 });
    }

    if (!formData?.businessName || !formData?.websiteUrl || !formData?.contactEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = buildPrompt(policyType, formData as PolicyFormData);

    const message = await anthropic.messages.create({
      model: "anthropic.claude-sonnet-4-20250514-v1:0",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Failed to generate policy" }, { status: 500 });
    }

    // Strip any markdown fences if present
    let html = textBlock.text;
    html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "");

    return NextResponse.json({ html });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate policy" },
      { status: 500 }
    );
  }
}
