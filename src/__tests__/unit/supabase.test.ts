describe("supabase module", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("exports a non-null client when both env vars are set", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    const { supabase } = await import("@/lib/supabase");
    expect(supabase).not.toBeNull();
  });

  it("returns true from isSupabaseConfigured when both env vars are set", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    const { isSupabaseConfigured } = await import("@/lib/supabase");
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("exports null client when URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    const { supabase } = await import("@/lib/supabase");
    expect(supabase).toBeNull();
  });

  it("exports null client when anon key is missing", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const { supabase } = await import("@/lib/supabase");
    expect(supabase).toBeNull();
  });

  it("exports null client when both env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const { supabase } = await import("@/lib/supabase");
    expect(supabase).toBeNull();
  });

  it("returns false from isSupabaseConfigured when both env vars are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const { isSupabaseConfigured } = await import("@/lib/supabase");
    expect(isSupabaseConfigured()).toBe(false);
  });
});
