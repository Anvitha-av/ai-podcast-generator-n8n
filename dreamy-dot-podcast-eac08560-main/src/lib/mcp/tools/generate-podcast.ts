import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const WEBHOOK_URL =
"https://ai-podcast-backend-production.up.railway.app/generate";

export default defineTool({
  name: "generate_podcast",
  title: "Generate podcast",
  description:
    "Generate a podcast episode from a topic. Sends the topic to the configured n8n workflow and returns the URL of the produced audio file.",
  inputSchema: {
    topic: z
      .string()
      .min(1)
      .describe("The podcast topic to generate an episode about."),
  },
  annotations: {
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async ({ topic }) => {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: topic }),
      });
      if (!res.ok) {
        return {
          content: [
            { type: "text", text: `Podcast generation failed: HTTP ${res.status}` },
          ],
          isError: true,
        };
      }
      const data = (await res.json()) as { audioFile?: string };
      if (!data?.audioFile) {
        return {
          content: [{ type: "text", text: "No audioFile returned by workflow." }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Podcast ready for topic "${topic}": ${data.audioFile}`,
          },
        ],
        structuredContent: { audioFile: data.audioFile, topic },
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Podcast generation error: ${(err as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
});
