import type { TokenPayload } from "@/types";

/** Decodes a JWT's payload without verifying the signature — fine for reading non-sensitive claims client-side. */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json);
    if (typeof parsed.id !== "string" || typeof parsed.roleId !== "string") return null;
    return { id: parsed.id, roleId: parsed.roleId };
  } catch {
    return null;
  }
}
