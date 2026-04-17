"use client";

import { SubscriptionStatus } from "@/types/subscription";

/**
 * TweakCN-OpenAI local stub — upstream fetched /api/subscription (which
 * hit the Polar billing integration via DB). We stripped both. This hook
 * returns a frozen "unlimited pro" state so every editor gate resolves
 * to "allowed."
 */

const LOCAL_UNLIMITED: SubscriptionStatus = {
  isSubscribed: true,
  requestsUsed: 0,
  requestsRemaining: Number.POSITIVE_INFINITY,
};

export const SUBSCRIPTION_STATUS_QUERY_KEY = "subscriptionStatus";

export function useSubscription() {
  return {
    subscriptionStatus: LOCAL_UNLIMITED,
    isPending: false as const,
    isLoading: false as const,
    isError: false as const,
    error: null,
    refetch: async () => LOCAL_UNLIMITED,
  };
}
