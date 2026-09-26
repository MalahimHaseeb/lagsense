import OpenAI from "openai";

export const DEFAULT_BASE_URL =
  import.meta.env.VITE_DEFAULT_BASE_URL ?? "https://api.openai.com/v1";

export const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL ?? "gpt-4o-mini";

export interface LagsenseConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function createClient(config: LagsenseConfig) {
  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl,
    dangerouslyAllowBrowser: true,
  });
}

export async function diagnose(config: LagsenseConfig, systemSnapshot: string) {
  const client = createClient(config);

  const completion = await client.chat.completions.create({
    model: config.model,
    messages: [
      {
        role: "system",
        content:
          "You are Lagsense, a system diagnostics assistant. You're given a snapshot of a user's system metrics and logs. Explain what's going on in plain English, no jargon dumps. If something looks wrong, say what it is, why it's likely happening, and one concrete next step. If everything looks normal, say so briefly. Keep it short.",
      },
      {
        role: "user",
        content: systemSnapshot,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "No response from model.";
}