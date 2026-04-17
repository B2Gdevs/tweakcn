"use client";

/**
 * TweakCN-OpenAI local stub — upstream used `better-auth/react` which
 * required a live auth backend. We stripped that stack. This stub always
 * returns a fixed "local" user session so every `authClient.useSession()`
 * call site in components keeps compiling and rendering without auth.
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

export const authClient = {
  useSession(): { data: typeof LOCAL_SESSION; isPending: false } {
    return { data: LOCAL_SESSION, isPending: false };
  },
  async signOut(): Promise<{ ok: true }> {
    return { ok: true };
  },
  async signIn(): Promise<{ ok: true }> {
    return { ok: true };
  },
};
