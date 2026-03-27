import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: "Service not configured" }, { status: 503 });
    }

    // Get the user's auth token from the request
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || req.cookies.get("sb-access-token")?.value;

    // Create a client with the user's token to identify them
    const userClient = createClient(supabaseUrl, serviceKey);

    // Use admin client to get user from token
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Get current session from cookies
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Delete user's policies first (cascade should handle this, but be explicit)
    await adminClient.from("generated_policies").delete().eq("user_id", user.id);

    // Delete user's profile
    await adminClient.from("profiles").delete().eq("id", user.id);

    // Delete the auth user (requires service role key)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Failed to delete user:", deleteError);
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
