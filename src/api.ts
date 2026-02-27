const API_URL = "https://www.caelith.tech/api/v1/public/copilot/chat";

export interface CopilotResponse {
  reply: string;
  [key: string]: unknown;
}

export async function callCopilot(message: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Caelith API error (${res.status}): ${text || res.statusText}`
    );
  }

  const data = (await res.json()) as CopilotResponse;
  return data.reply ?? JSON.stringify(data, null, 2);
}
