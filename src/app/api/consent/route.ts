import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { bannerId, visitorId, consent, country } = body;

    if (!bannerId || !visitorId || !consent) {
      return NextResponse.json(
        { error: "Missing required fields: bannerId, visitorId, consent" },
        { status: 400 }
      );
    }

    if (typeof consent.essential !== "boolean") {
      return NextResponse.json(
        { error: "consent.essential must be a boolean" },
        { status: 400 }
      );
    }

    // TODO: Log to consent_banners table in Supabase once the table is created
    // For now, return success with the consent data echoed back
    const record = {
      id: crypto.randomUUID(),
      bannerId,
      visitorId,
      consent: {
        essential: true, // always true
        analytics: !!consent.analytics,
        marketing: !!consent.marketing,
        functional: !!consent.functional,
      },
      country: country || null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Consent logging error:", error);
    return NextResponse.json(
      { error: "Failed to record consent" },
      { status: 500 }
    );
  }
}
