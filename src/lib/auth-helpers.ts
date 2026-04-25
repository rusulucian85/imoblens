import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type Role =
  | "VISITOR"
  | "BUYER"
  | "BUYER_PRO"
  | "AGENT"
  | "AGENT_PRO"
  | "ADMIN";

const ROLE_GROUPS: Record<string, Role[]> = {
  agent: ["AGENT", "AGENT_PRO", "ADMIN"],
  agentPro: ["AGENT_PRO", "ADMIN"],
  buyerPro: ["BUYER_PRO", "ADMIN"],
  admin: ["ADMIN"],
};

/** Throws via redirect() if not authenticated. Returns the session otherwise. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.bannedAt) redirect("/auth/error?error=AccessDenied");
  return session;
}

/** Throws via redirect() if user is not in the required role group. */
export async function requireRole(group: keyof typeof ROLE_GROUPS) {
  const session = await requireSession();
  const allowed = ROLE_GROUPS[group];
  if (!allowed.includes(session.user.role as Role)) redirect("/");
  return session;
}
