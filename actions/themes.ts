"use server";

import { Theme, ThemeStyles } from "@/types/theme";
import { cache } from "react";
import { actionSuccess, type ActionResult } from "@/types/errors";

/**
 * TweakCN-OpenAI local stub — upstream CRUD hit drizzle + Postgres. We
 * stripped both. These server actions now return empty reads and
 * success-looking writes without persisting anything. The editor still
 * works; theme export (copy the CSS block) is how you save.
 *
 * Client-side local persistence (localStorage) lives in the zustand
 * stores already, so in-progress edits survive refresh. What was
 * stripped is multi-user cloud save — not needed for local theme work.
 *
 * Signature notes:
 *   - Readers (`getTheme`, `getThemes`) return raw Theme/Theme[] to
 *     match the call sites in hooks/themes/* and the editor page.
 *   - Mutators (`createTheme`, `updateTheme`, `deleteTheme`) return
 *     ActionResult<T> because the mutation hook branches on
 *     `result.success` / `result.error.code`.
 */

export async function getThemes(): Promise<Theme[]> {
  return [];
}

export const getTheme = cache(async (_themeId: string): Promise<Theme | null> => {
  return null;
});

export async function createTheme(formData: {
  name: string;
  styles: ThemeStyles;
}): Promise<ActionResult<Theme>> {
  // Upstream returned the whole Theme row as `data` — match that shape so
  // `result.data.id`, `result.data.createdAt.toISOString()`, etc. keep working.
  const now = new Date();
  const theme: Theme = {
    id: "local-" + Date.now().toString(36),
    userId: "local-user",
    name: formData.name,
    styles: formData.styles,
    createdAt: now,
    updatedAt: now,
  };
  return actionSuccess(theme);
}

export async function updateTheme(formData: {
  id: string;
  name?: string;
  styles?: ThemeStyles;
}): Promise<Theme> {
  // Consumer (`use-theme-mutations.ts useUpdateTheme`) does NOT unwrap an
  // ActionResult — its onSuccess expects the raw Theme. Match that shape.
  const now = new Date();
  const theme: Theme = {
    id: formData.id,
    userId: "local-user",
    name: formData.name ?? "Local theme",
    styles:
      formData.styles ??
      ({ light: {}, dark: {} } as unknown as ThemeStyles),
    createdAt: now,
    updatedAt: now,
  };
  return theme;
}

export async function deleteTheme(themeId: string): Promise<Theme> {
  // Consumer expects the deleted row (uses `data.name` in a toast).
  const now = new Date();
  return {
    id: themeId,
    userId: "local-user",
    name: "Deleted theme",
    styles: { light: {}, dark: {} } as unknown as ThemeStyles,
    createdAt: now,
    updatedAt: now,
  };
}

// (Upstream re-exports of ErrorCode / actionError removed — a "use server"
// module can only export async functions per Next.js. Callers should
// import those from `@/types/errors` directly.)
