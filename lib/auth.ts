/**
 * TweakCN-OpenAI local stub — original tweakcn used better-auth + drizzle.
 * We stripped that stack. This stub returns a fixed "local" user so every
 * auth check resolves successfully without a database or OAuth flow.
 */

const LOCAL_USER = {
  id: "local-user",
  email: "local@tweakcn.local",
  name: "Local User",
  image: null,
  emailVerified: true,
};

const LOCAL_SESSION = {
  user: LOCAL_USER,
  session: {
    id: "local-session",
    userId: LOCAL_USER.id,
    token: "local",
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
};

export const auth = {
  api: {
    // Accepts the {headers} arg but ignores it.
    getSession: async (_args?: unknown) => LOCAL_SESSION,
    // Other handlers the original auth layer exposed. Return passthroughs.
    signInSocial: async () => ({ ok: true }),
    signOut: async () => ({ ok: true }),
  },
  // Upstream referenced `auth.handler` on routes we deleted. Re-export a
  // minimal passthrough in case anything stale still imports it.
  handler: async (_req: Request) =>
    new Response("auth disabled in local mode", { status: 404 }),
};

export type Session = typeof LOCAL_SESSION;
