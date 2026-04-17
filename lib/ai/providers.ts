import "server-only";

import { createOpenAI } from "@ai-sdk/openai";
import { customProvider } from "ai";

/**
 * TweakCN-OpenAI — swaps the upstream Google Gemini provider for OpenAI.
 *
 * Env: OPENAI_API_KEY (operator already has this).
 *
 * Model mapping rationale:
 *   base                 → gpt-4o-mini  (cheap, fast chat)
 *   theme-generation     → gpt-4o       (better structured-tool use for CSS)
 *   prompt-enhancement   → gpt-4o-mini  (light rewrite work)
 *
 * Adjust freely — the Vercel AI SDK abstracts the streaming shape so you
 * can point these at any model the OpenAI provider exposes without
 * touching call sites.
 */

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Provider-options shape is kept for API compatibility with the upstream
 * call sites. OpenAI has different option fields than Gemini; leave this
 * empty so the SDK applies sensible defaults. Add per-call options at the
 * route level if a specific knob (reasoning_effort, response_format) is
 * needed downstream.
 */
export const baseProviderOptions = {};

export const myProvider = customProvider({
  languageModels: {
    base: openai("gpt-4o-mini"),
    "theme-generation": openai("gpt-4o"),
    "prompt-enhancement": openai("gpt-4o-mini"),
  },
});
