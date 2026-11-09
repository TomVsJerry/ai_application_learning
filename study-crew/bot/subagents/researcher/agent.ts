import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  description:
    "Use when a study question needs facts from the local catalog. Calls lookup_topic and returns only those notes.",
});
