"use server";

import { SubscriptionCheck } from "@/types/subscription";
import { NextRequest } from "next/server";

/**
 * TweakCN-OpenAI local stub — upstream used drizzle + a Polar billing
 * integration to enforce per-user request quotas. We stripped both.
 * Every check returns "subscribed, unlimited, can proceed" so the editor
 * never blocks on a quota or auth gate.
 */

const UNLIMITED_OK: SubscriptionCheck = {
  isSubscribed: true,
  requestsUsed: 0,
  requestsRemaining: Number.POSITIVE_INFINITY,
  canProceed: true,
};

export async function getMyActiveSubscription(
  _userId: string,
): Promise<{ status: "active" }> {
  return { status: "active" };
}

export async function validateSubscriptionAndUsage(
  _userId: string,
): Promise<SubscriptionCheck> {
  return UNLIMITED_OK;
}

export async function requireSubscriptionOrFreeUsage(
  _req: NextRequest,
): Promise<SubscriptionCheck> {
  return UNLIMITED_OK;
}
