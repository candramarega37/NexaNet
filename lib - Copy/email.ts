export async function sendPasswordResetEmail(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") return { delivered: false as const };
    throw new Error("Email provider is not configured");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [email], subject: "Reset your NexaNet password", text: `Use the link below to create a new password (valid 30 minutes): ${url}` }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Email provider rejected the request");
  return { delivered: true as const };
}
