import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getModel } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        try {
          const result = streamText({
            model: getModel(),
            system:
              "You are a helpful AI workplace productivity assistant. Help professionals with emails, meetings, planning, research, and general work tasks. Be concise, professional, and use markdown formatting when helpful.",
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});