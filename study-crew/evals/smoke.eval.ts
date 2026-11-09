import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "The study crew looks up the catalog and delegates all three roles.",
  async test(t) {
    await t.send(
      "我在学多个智能体怎么合作。请说明子智能体和同级智能体的差别。先查目录 subagent 和 peer。",
    );
    t.succeeded();
    t.calledTool("lookup_topic");
    t.calledSubagent("researcher");
    t.calledSubagent("drafter");
    t.calledSubagent("reviewer");
  },
});
