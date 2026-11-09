import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { lookupTopic, topicIds } from "../lib/catalog.js";

export default defineTool({
  description:
    "Read one note from the local study catalog before explaining how agents cooperate. Known ids: subagent, peer, handoff, shared-tools. Do not guess catalog facts.",
  inputSchema: z.object({
    topic: z
      .enum(["subagent", "peer", "handoff", "shared-tools"])
      .describe("Catalog id."),
  }),
  effect: "read",
  async execute({ topic }) {
    const note = lookupTopic(topic);
    if (!note) {
      return { found: false as const, topic, knownTopics: topicIds };
    }
    return {
      found: true as const,
      id: note.id,
      title: note.title,
      summary: note.summary,
      points: [...note.points],
      pitfall: note.pitfall,
    };
  },
});
