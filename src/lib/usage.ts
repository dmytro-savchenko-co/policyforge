const STORAGE_KEY = "pf_gen_count";

export const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  business: Infinity,
};

export function getLocalGenerationCount(): number {
  if (typeof window === "undefined") return 0;
  const val = localStorage.getItem(STORAGE_KEY);
  return val ? parseInt(val, 10) || 0 : 0;
}

export function incrementLocalGenerationCount(): void {
  if (typeof window === "undefined") return;
  const current = getLocalGenerationCount();
  localStorage.setItem(STORAGE_KEY, String(current + 1));
}

export function canGenerate(plan: string, count: number): boolean {
  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
  return count < limit;
}
