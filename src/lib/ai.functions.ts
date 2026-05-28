import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { getModel } from "./ai-gateway.server";

const run = async (system: string, prompt: string) => {
  const { text } = await generateText({
    model: getModel(),
    system,
    prompt,
  });
  return { text };
};

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      recipient: z.string().min(1),
      tone: z.string().min(1),
      purpose: z.string().min(1),
      context: z.string().optional().default(""),
    }),
  )
  .handler(({ data }) =>
    run(
      "You are a professional email writer. Produce a clear, ready-to-send email. Output ONLY the email with a Subject line on the first line, then a blank line, then the body. No commentary.",
      `Recipient/audience: ${data.recipient}\nTone: ${data.tone}\nPurpose: ${data.purpose}\nAdditional context: ${data.context || "none"}`,
    ),
  );

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(10) }))
  .handler(({ data }) =>
    run(
      `You are an expert meeting analyst. Given raw meeting notes or a transcript, produce a structured summary in markdown with EXACTLY these sections:
## Summary
A 2-3 sentence executive summary.
## Key Points
Bulleted list of the most important discussion points.
## Action Items
Bulleted list. Each item: **Owner** — task — _deadline (or "TBD")_.
## Deadlines
Bulleted list of dated commitments.
## Open Questions
Bulleted list of unresolved items.
Be concise and professional. Use only information present in the notes.`,
      data.notes,
    ),
  );

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(1),
      hoursAvailable: z.number().min(1).max(24).default(8),
    }),
  )
  .handler(({ data }) =>
    run(
      `You are an AI productivity coach. Given a list of tasks for the day and hours available, produce a prioritized schedule in markdown:
## Priority Matrix
Group tasks into **Do First** (urgent+important), **Schedule** (important), **Delegate** (urgent only), **Drop** (neither).
## Suggested Schedule
A time-blocked plan as a table with columns: Time | Task | Why.
## Focus Tip
One actionable productivity tip tailored to this day.`,
      `Hours available: ${data.hoursAvailable}\nTasks:\n${data.tasks}`,
    ),
  );

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ topic: z.string().min(2) }))
  .handler(({ data }) =>
    run(
      `You are a research analyst. Produce a structured briefing in markdown with these sections:
## Overview
## Key Insights
(bulleted)
## Important Considerations
(bulleted, including risks/limitations)
## Suggested Next Steps
(bulleted)
Be factual, concise, and professional. Note when information may be uncertain or time-sensitive.`,
      `Research topic: ${data.topic}`,
    ),
  );