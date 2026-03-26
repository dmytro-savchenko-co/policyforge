import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  const { policyId } = await params;

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response("// PolicyForge: configuration error", {
      status: 500,
      headers: { "Content-Type": "application/javascript; charset=utf-8" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: policy, error } = await supabase
    .from("generated_policies")
    .select("generated_html, title, business_name, user_id")
    .eq("id", policyId)
    .single();

  if (error || !policy) {
    return new Response("// PolicyForge: policy not found", {
      status: 404,
      headers: { "Content-Type": "application/javascript; charset=utf-8" },
    });
  }

  // Check if user is on business plan (to hide branding)
  let hideBranding = false;
  if (policy.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", policy.user_id)
      .single();
    if (profile?.plan === "business") {
      hideBranding = true;
    }
  }

  const escapedHtml = JSON.stringify(policy.generated_html);
  const escapedTitle = JSON.stringify(policy.title || "Policy");

  const script = `(function(){
  var html = ${escapedHtml};
  var title = ${escapedTitle};
  var brandingHidden = ${hideBranding};

  var style = document.createElement("style");
  style.textContent = \`
    .policyforge-embed { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 24px; line-height: 1.6; color: #1a1a1a; }
    .policyforge-embed h1 { font-size: 24px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 20px; }
    .policyforge-embed h2 { font-size: 18px; font-weight: 600; margin-top: 28px; color: #1e40af; }
    .policyforge-embed h3 { font-size: 15px; font-weight: 600; margin-top: 20px; }
    .policyforge-embed ul { padding-left: 24px; list-style: disc; }
    .policyforge-embed li { margin-bottom: 6px; }
    .policyforge-embed a { color: #2563eb; text-decoration: underline; }
    .policyforge-embed p { margin: 10px 0; }
    .policyforge-footer { text-align: center; padding: 16px 0 8px; font-size: 12px; color: #9ca3af; }
    .policyforge-footer a { color: #6b7280; text-decoration: none; }
    .policyforge-footer a:hover { text-decoration: underline; }
  \`;
  document.head.appendChild(style);

  var target = document.getElementById("policyforge-policy");
  if (!target) {
    target = document.createElement("div");
    target.id = "policyforge-policy";
    document.currentScript.parentNode.insertBefore(target, document.currentScript.nextSibling);
  }

  var wrapper = document.createElement("div");
  wrapper.className = "policyforge-embed";
  wrapper.innerHTML = html;
  target.appendChild(wrapper);

  if (!brandingHidden) {
    var footer = document.createElement("div");
    footer.className = "policyforge-footer";
    footer.innerHTML = 'Powered by <a href="https://policyforge.site" target="_blank" rel="noopener">PolicyForge</a>';
    target.appendChild(footer);
  }
})();`;

  return new Response(script, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
