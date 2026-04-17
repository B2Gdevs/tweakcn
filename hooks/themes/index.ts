export { useThemesData, useThemeData, usePrefetchThemes, themeKeys } from "./use-themes-data";
export { useCreateTheme, useUpdateTheme, useDeleteTheme } from "./use-theme-mutations";

// TweakCN-OpenAI stripped the community-themes feature. The hook names
// are still referenced by a few components; re-export no-op stubs so
// those components keep compiling without a backend.
import type { UseQueryResult } from "@tanstack/react-query";

export function useCommunityThemes() {
  return {
    data: { pages: [], pageParams: [] as unknown[] },
    isLoading: false,
    isFetching: false,
    fetchNextPage: async () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
  };
}
export function useCommunityTagCounts(): UseQueryResult<Record<string, number>> {
  return {
    data: {},
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: async () => ({ data: {} }),
  } as unknown as UseQueryResult<Record<string, number>>;
}
// Mutation stubs accept any variables + any options so call sites using
// the tanstack-query mutate(variables, options) shape keep compiling.
type NoopMutate = {
  mutate: (variables?: unknown, options?: unknown) => void;
  mutateAsync: (variables?: unknown, options?: unknown) => Promise<unknown>;
  isPending: false;
};
const NOOP_MUTATE: NoopMutate = {
  mutate: () => {},
  mutateAsync: async () => ({}),
  isPending: false,
};

export function usePublishTheme(): NoopMutate {
  return NOOP_MUTATE;
}
export function useUnpublishTheme(): NoopMutate {
  return NOOP_MUTATE;
}
export function useToggleLike(): NoopMutate {
  return NOOP_MUTATE;
}
export function useUpdateCommunityThemeTags(): NoopMutate {
  return NOOP_MUTATE;
}
export const communityKeys = {
  all: ["community"] as const,
  lists: () => [...communityKeys.all, "list"] as const,
  list: (args: unknown) => [...communityKeys.lists(), args] as const,
};
