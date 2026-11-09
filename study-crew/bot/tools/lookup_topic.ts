import { defineTool } from "@grok/agent-sdk/tools";
import { lookupTopic, topicIds } from "../lib/catalog.js";

export default defineTool({
  description:
    "Read one note from the local study catalog before explaining how agents cooperate. Known ids: subagent, peer, handoff, shared-tools. Do not guess catalog facts.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      topic: {
        type: "string",
        enum: ["subagent", "peer", "handoff", "shared-tools"],
        description: "Catalog id.",
      },
    },
    required: ["topic"],
  },
  effect: "read",
  async execute(input) {
    const topic = typeof input.topic === "string" ? input.topic : "";
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
