import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  description:
    "Use after a draft exists. Checks that the lesson has 结论, 步骤, and 易错点, and that every claim is in the research notes.",
});
