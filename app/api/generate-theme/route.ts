import { THEME_GENERATION_TOOLS } from "@/lib/ai/generate-theme/tools";
import { GENERATE_THEME_SYSTEM } from "@/lib/ai/prompts";
import { baseProviderOptions, myProvider } from "@/lib/ai/providers";
import { handleError } from "@/lib/error-response";
import { AdditionalAIContext, ChatMessage } from "@/types/ai";
import { convertMessagesToModelMessages } from "@/utils/ai/message-converter";
import { createUIMessageStream, createUIMessageStreamResponse, stepCountIs, streamText } from "ai";
import { NextRequest } from "next/server";

/**
 * TweakCN-OpenAI local route — auth, subscription, upstash rate limit,
 * and AI usage recording were all stripped for the local-only build.
 * The endpoint is a straight-through streamText call to the OpenAI
 * provider, no gates, no persistence.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    const modelMessages = await convertMessagesToModelMessages(messages);

    const stream = createUIMessageStream<ChatMessage>({
      execute: ({ writer }) => {
        const context: AdditionalAIContext = { writer };
        const model = myProvider.languageModel("base");

        const result = streamText({
          abortSignal: req.signal,
          model: model,
          providerOptions: baseProviderOptions,
          system: GENERATE_THEME_SYSTEM,
          messages: modelMessages,
          tools: THEME_GENERATION_TOOLS,
          stopWhen: stepCountIs(5),
          onError: (error) => {
            if (error instanceof Error) console.error(error);
          },
          experimental_context: context,
        });

        writer.merge(
          result.toUIMessageStream({
            messageMetadata: ({ part }) => {
              if (part.type === "tool-result" && part.toolName === "generateTheme") {
                return { themeStyles: part.output };
              }
            },
          })
        );
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "ResponseAborted")
    ) {
      return new Response("Request aborted by user", { status: 499 });
    }

    return handleError(error, { route: "/api/generate-theme" });
  }
}
