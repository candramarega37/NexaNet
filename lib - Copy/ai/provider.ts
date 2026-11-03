import { mockProvider } from "@/lib/ai/mock-provider";
import type { AiProvider } from "@/lib/ai/types";
import { selectAiProvider } from "@/lib/ai-provider.mjs";

const openAiProvider: AiProvider = {
  mode: "openai",
  async respond({ prompt, context }) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
    const instructions = {
      tutor: "You are a computer networking tutor for vocational students. Answer in clear, step-by-step, accurate English. Give practical examples where helpful.",
      "quiz-hint": "You are a computer networking tutor. Give a short hint that helps the student think for themselves. Do not give the answer or answer key directly.",
      troubleshooting: "You help diagnose computer networks. Give safe check steps ordered from basic to advanced, and ask the student to change one thing at a time.",
    }[context];
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-5", instructions, input: prompt, store: false }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`OpenAI request failed (${response.status}).`);
    const data = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
    const answer = data.output_text ?? data.output?.flatMap(item => item.content ?? []).find(item => item.type === "output_text")?.text;
    if (!answer?.trim()) throw new Error("OpenAI returned an empty response.");
    return answer.trim();
  },
};

export function getAiProvider(): AiProvider {
  if (process.env.AI_PROVIDER === "openai") return openAiProvider;
  return selectAiProvider(process.env.AI_PROVIDER, mockProvider) as AiProvider;
}
