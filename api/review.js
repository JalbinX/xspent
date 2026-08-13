// Vercel serverless function — POST /api/review
// Keeps your Anthropic API key on the server, never exposed to the browser.
// Set ANTHROPIC_API_KEY in your Vercel project's Environment Variables.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { summary, monthLabel } = req.body || {};
  if (!summary) {
    return res.status(400).json({ error: "Missing expense summary" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Here is a full list of my expenses for ${monthLabel}:\n\n${summary}\n\nGive me an honest, direct breakdown of my spending this month — what I spent the most on, any patterns or habits worth flagging, and one or two practical suggestions. Keep it conversational, not clinical, and under 180 words.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({ text: text || "Couldn't generate a review." });
  } catch (err) {
    return res.status(500).json({ error: "AI review failed", details: String(err) });
  }
}
