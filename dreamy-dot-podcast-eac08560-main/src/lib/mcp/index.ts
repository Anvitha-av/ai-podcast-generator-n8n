import { defineMcp } from "@lovable.dev/mcp-js";
import generatePodcastTool from "./tools/generate-podcast";

export default defineMcp({
  name: "podcast-studio-mcp",
  title: "Podcast Studio MCP",
  version: "0.1.0",
  instructions:
    "Tools for Podcast Studio. Use `generate_podcast` with a topic string to produce a podcast episode; the tool returns the audio file URL.",
  tools: [generatePodcastTool],
});
