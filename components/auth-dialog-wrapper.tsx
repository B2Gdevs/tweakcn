"use client";

/**
 * TweakCN-OpenAI stub — upstream rendered an AuthDialog driven by
 * better-auth + a posthog identify. We stripped the auth stack; this
 * wrapper now renders nothing and no-ops post-login side effects.
 *
 * Kept as a component so existing `<AuthDialogWrapper />` mount points
 * in layouts do not need to be rewired.
 */
export function AuthDialogWrapper() {
  return null;
}
